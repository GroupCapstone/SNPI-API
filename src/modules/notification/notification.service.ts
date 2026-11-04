import { Types } from 'mongoose';
import { logger } from '../../config/logger';
import { checkBranchAccess, getAuthorizedBranchFilter } from '../../middleware/branch-access';
import { AuditLogService } from '../audit-log/audit-log.service';
import { StudentModel } from '../student/student.model';
import { PaymentModel } from '../payment/payment.model';
import { SystemSettingModel } from '../system-setting/system-setting.model';
import { ForbiddenError, NotFoundError } from '../../shared/errors/app-error';
import type { AuthUser } from '../../types/auth';
import type { INotification, IParentContactLog } from './notification.model';
import { NotificationRepository } from './notification.repository';
import type {
  CreateParentContactLogDTO,
  NotificationFilters,
  NotificationStatsResponse,
  ParentContactLogFilters,
  SendNotificationDTO,
  TriggerAbsenceAlertDTO,
  TriggerTuitionReminderDTO,
} from './notification.types';

export class NotificationService {
  constructor(private readonly repository: NotificationRepository = new NotificationRepository()) {}

  /**
   * Dispatches message to Telegram Bot API
   */
  public async dispatchTelegramMessage(
    chatId: string,
    messageText: string,
    botTokenOverride?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const token = botTokenOverride || process.env.TELEGRAM_BOT_TOKEN;

    if (process.env.NODE_ENV === 'test') {
      logger.info(
        { chatId, messageLength: messageText.length, mock: true },
        'Telegram message simulated in mock/test mode',
      );
      return { success: true, messageId: `mock-tg-${Date.now()}` };
    }
    if (!token) return { success: false, error: 'Telegram bot token is not configured' };

    try {
      const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;
      const response = await fetch(endpoint, {
        method: 'POST',
        signal: AbortSignal.timeout(10_000),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML',
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        result?: { message_id: number };
        description?: string;
      };

      if (!response.ok || !data.ok || !data.result?.message_id) {
        logger.error({ error: data.description, chatId }, 'Telegram API returned error');
        return { success: false, error: data.description || 'Failed to dispatch Telegram message' };
      }

      return {
        success: true,
        messageId: String(data.result?.message_id ?? Date.now()),
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown Telegram network error';
      logger.error({ err, chatId }, 'Telegram network dispatch failed');
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Dispatches SMS message via Gateway adapter
   */
  public async dispatchSms(
    phoneNumber: string,
    messageText: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (process.env.NODE_ENV === 'test') {
      logger.info(
        { phoneNumber, messageLength: messageText.length, mock: true },
        'SMS message simulated in mock/test mode',
      );
      return { success: true, messageId: `mock-sms-${Date.now()}` };
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;
    if (!accountSid || !authToken || !from) {
      return { success: false, error: 'SMS provider is not configured' };
    }
    if (!/^AC[a-f\d]{32}$/i.test(accountSid)) {
      return { success: false, error: 'SMS account configuration is invalid' };
    }
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          signal: AbortSignal.timeout(10_000),
          headers: {
            Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ To: phoneNumber, From: from, Body: messageText }).toString(),
        },
      );
      const data = (await response.json()) as { sid?: string; status?: string; message?: string };
      if (
        !response.ok ||
        !data.sid ||
        ['failed', 'undelivered', 'canceled'].includes(data.status ?? '')
      ) {
        return { success: false, error: data.message ?? 'SMS provider rejected the message' };
      }
      return { success: true, messageId: data.sid };
    } catch {
      return { success: false, error: 'Unable to reach the SMS provider' };
    }
  }

  /**
   * Resolves default channel from system settings
   */
  private async getSettingValue<T>(key: string, defaultValue: T, schoolId?: string): Promise<T> {
    if (process.env.NODE_ENV === 'test') {
      return defaultValue;
    }
    try {
      const setting = await SystemSettingModel.findOne({ key, schoolId, isDeleted: false }).lean();
      return (setting?.value as T) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Sends a notification through the chosen channel and records delivery status
   */
  public async sendNotification(dto: SendNotificationDTO, user: AuthUser): Promise<INotification> {
    const branchId =
      dto.branchId ||
      (user.branchAccess !== 'all' && Array.isArray(user.branchAccess)
        ? user.branchAccess[0]
        : undefined);

    if (branchId && !checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have permission to send notifications for this branch');
    }

    const schoolId = dto.schoolId || user.schoolId;
    if (schoolId !== user.schoolId)
      throw new ForbiddenError('Notification school does not match your school');
    if (!branchId && user.branchAccess !== 'all')
      throw new ForbiddenError('Branch access is required');

    // Create initial pending notification record
    const notification = await this.repository.createNotification({
      schoolId: new Types.ObjectId(schoolId),
      branchId: branchId ? new Types.ObjectId(branchId) : undefined,
      channel: dto.channel,
      type: dto.type || 'custom',
      recipientType: dto.recipientType || 'guardian',
      recipientId: dto.recipientId,
      recipientName: dto.recipientName,
      recipientPhone: dto.recipientPhone,
      recipientChatId: dto.recipientChatId,
      title: dto.title,
      body: dto.body,
      status: 'pending',
      metadata: dto.metadata,
      createdBy: user.userId,
    });

    let dispatchResult: { success: boolean; messageId?: string; error?: string } = {
      success: false,
    };

    if (dto.channel === 'telegram') {
      const targetChatId =
        dto.recipientChatId ||
        (await this.getSettingValue('TELEGRAM_CHANNEL_ID', '', user.schoolId));
      const escapeHtml = (text: string) =>
        text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      dispatchResult = await this.dispatchTelegramMessage(
        targetChatId,
        `<b>${escapeHtml(dto.title)}</b>\n\n${escapeHtml(dto.body)}`,
      );
    } else if (dto.channel === 'sms') {
      const targetPhone = dto.recipientPhone;
      if (!targetPhone) {
        dispatchResult = {
          success: false,
          error: 'Recipient phone number is missing for SMS dispatch',
        };
      } else {
        dispatchResult = await this.dispatchSms(targetPhone, `${dto.title}: ${dto.body}`);
      }
    } else {
      // In-App channel resolves immediately
      dispatchResult = { success: true };
    }

    const updated = await this.repository.updateNotificationStatus(
      String(notification._id),
      dispatchResult.success ? 'sent' : 'failed',
      dispatchResult.error,
      dispatchResult.success ? new Date() : undefined,
    );

    await AuditLogService.log({
      userId: user.userId,
      schoolId,
      branchId,
      module: 'notification',
      action: 'CREATE',
      entityType: 'Notification',
      entityId: String(notification._id),
      newValue: {
        channel: dto.channel,
        type: dto.type,
        status: dispatchResult.success ? 'sent' : 'failed',
        title: dto.title,
      },
    });

    return updated || notification;
  }

  /**
   * Automated Trigger: 3-Day Consecutive Unexcused Absence Outreach Alert
   */
  public async triggerAbsenceAlert(
    dto: TriggerAbsenceAlertDTO,
    user: AuthUser,
  ): Promise<{ notification: INotification; contactLog: IParentContactLog }> {
    const student = await StudentModel.findById(dto.studentId)
      .populate('branchId', 'branchNameEn branchNameKh')
      .lean();
    if (!student || student.isDeleted) {
      throw new NotFoundError(`Student with ID ${dto.studentId} not found`);
    }

    const studentBranchId =
      typeof student.branchId === 'object' &&
      student.branchId !== null &&
      '_id' in (student.branchId as object)
        ? String((student.branchId as { _id: unknown })._id)
        : String(student.branchId);

    if (
      String(student.schoolId) !== user.schoolId ||
      !checkBranchAccess(user.branchAccess, studentBranchId)
    ) {
      throw new ForbiddenError('You do not have access to this student branch');
    }

    const primaryGuardian = student.guardians?.find((g) => g.isPrimary) || student.guardians?.[0];
    const guardianName = primaryGuardian?.fullName || 'Parent / Guardian';
    const guardianPhone = dto.guardianPhone || primaryGuardian?.phone || student.phone;

    const studentNameKh = student.khmerName || `${student.lastName} ${student.firstName}`;
    const studentNameEn = `${student.firstName} ${student.lastName}`;

    const title = `Absence Alert: ${studentNameEn} (${student.studentId})`;
    const body =
      `សេចក្តីជូនដំណឹងអំពីវត្តមានសិស្ស / Student Attendance Notice:\n\n` +
      `សូមជម្រាបជូនលោក/លោកស្រី ${guardianName} (អាណាព្យាបាលសិស្ស ${studentNameKh})៖\n` +
      `សិស្សបានអវត្តមានឥតច្បាប់ចំនួន ${dto.consecutiveDays} ថ្ងៃជាប់ៗគ្នា។\n` +
      `សូមមេត្តាទំនាក់ទំនងមកកាន់ការិយាល័យរដ្ឋបាលសាលាជាបន្ទាន់។\n\n` +
      `Notice: Student ${studentNameEn} has been absent for ${dto.consecutiveDays} consecutive unexcused days. ` +
      `Please contact the school office to confirm attendance status.`;

    const channel = dto.channel || 'telegram';

    // 1. Dispatch Notification
    const notification = await this.sendNotification(
      {
        schoolId: String(student.schoolId),
        branchId: studentBranchId,
        channel,
        type: 'absence_alert',
        recipientType: 'guardian',
        recipientId: String(student._id),
        recipientName: guardianName,
        recipientPhone: guardianPhone,
        title,
        body,
        metadata: {
          studentId: String(student._id),
          studentCode: student.studentId,
          consecutiveDays: dto.consecutiveDays,
        },
      },
      user,
    );

    // 2. Automatically record in Parent Contact Log
    const contactLog = await this.repository.createContactLog({
      schoolId: new Types.ObjectId(String(student.schoolId)),
      branchId: new Types.ObjectId(studentBranchId),
      studentId: new Types.ObjectId(String(student._id)),
      guardianName,
      guardianPhone,
      contactType: channel === 'sms' ? 'sms' : channel === 'telegram' ? 'telegram' : 'phone_call',
      purpose: 'absence',
      outcome: notification.status === 'sent' ? 'left_message' : 'no_answer',
      notes:
        dto.notes ||
        `Dispatched automated absence alert for ${dto.consecutiveDays} consecutive unexcused absences via ${channel.toUpperCase()}.`,
      contactDate: new Date(),
      staffId: user.userId,
      staffName: user.username,
    });

    return { notification, contactLog };
  }

  public async triggerTuitionReminder(
    dto: TriggerTuitionReminderDTO,
    user: AuthUser,
  ): Promise<{ notification: INotification; contactLog: IParentContactLog }> {
    const payment = await PaymentModel.findOne({
      _id: dto.paymentId,
      schoolId: user.schoolId,
      status: { $ne: 'voided' },
      balanceRemaining: { $gt: 0 },
      isDeleted: false,
    })
      .lean()
      .exec();
    if (!payment) throw new NotFoundError('Outstanding payment account not found');
    const branchId = String(payment.branchId);
    if (!checkBranchAccess(user.branchAccess, branchId)) {
      throw new ForbiddenError('You do not have access to this payment branch');
    }
    const student = await StudentModel.findOne({
      _id: payment.studentId,
      schoolId: user.schoolId,
      isDeleted: false,
    }).lean();
    if (!student) throw new NotFoundError('Payment student not found');
    const guardian = student.guardians?.find((item) => item.isPrimary) ?? student.guardians?.[0];
    const guardianName = guardian?.fullName ?? 'Parent / Guardian';
    const guardianPhone = guardian?.phone ?? student.phone;
    const studentName = student.khmerName || `${student.firstName} ${student.lastName}`.trim();
    const currencyLabel = payment.currency === 'KHR' ? 'KHR' : 'USD';
    const title = `Tuition Payment Reminder: ${student.studentId}`;
    const body =
      `សេចក្តីរំលឹកការបង់ថ្លៃសិក្សា / Tuition Payment Reminder\n\n` +
      `សិស្ស ${studentName} មានសមតុល្យនៅសល់ ${payment.balanceRemaining.toLocaleString()} ${currencyLabel}` +
      `${payment.dueDate ? ` ដែលផុតកំណត់នៅ ${payment.dueDate.toISOString().slice(0, 10)}` : ''}។\n` +
      `Please contact the school cashier if payment has already been completed.`;
    const channel = dto.channel ?? 'telegram';
    const notification = await this.sendNotification(
      {
        schoolId: user.schoolId,
        branchId,
        channel,
        type: 'tuition_reminder',
        recipientType: 'guardian',
        recipientId: String(student._id),
        recipientName: guardianName,
        recipientPhone: guardianPhone,
        title,
        body,
        metadata: {
          paymentId: String(payment._id),
          studentId: String(student._id),
          balanceRemaining: payment.balanceRemaining,
          currency: payment.currency,
        },
      },
      user,
    );
    const contactLog = await this.repository.createContactLog({
      schoolId: new Types.ObjectId(user.schoolId),
      branchId: new Types.ObjectId(branchId),
      studentId: new Types.ObjectId(String(student._id)),
      guardianName,
      guardianPhone,
      contactType: channel === 'sms' ? 'sms' : channel === 'telegram' ? 'telegram' : 'phone_call',
      purpose: 'tuition',
      outcome: notification.status === 'sent' ? 'left_message' : 'no_answer',
      notes:
        dto.notes ?? `Automated tuition reminder for ${payment.balanceRemaining} ${currencyLabel}`,
      contactDate: new Date(),
      staffId: user.userId,
      staffName: user.username,
    });
    return { notification, contactLog };
  }

  /**
   * Verifies Telegram Bot connectivity
   */
  public async testTelegram(
    chatId?: string,
    message?: string,
    schoolId?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const targetChat = chatId || (await this.getSettingValue('TELEGRAM_CHANNEL_ID', '', schoolId));
    const testText =
      message ||
      `<b>SNP-SMS System Test</b>\n` +
        `Telegram Notification Channel is operational.\n` +
        `Timestamp: ${new Date().toISOString()}`;

    return this.dispatchTelegramMessage(targetChat, testText);
  }

  /**
   * Retrieves notification dispatch history
   */
  public async getNotifications(
    filters: NotificationFilters,
    user: AuthUser,
  ): Promise<{ data: INotification[]; total: number; page: number; totalPages: number }> {
    const branchFilter = getAuthorizedBranchFilter(user.branchAccess, filters.branchId);
    return this.repository.findWithFilters(filters, {
      ...branchFilter,
      schoolId: new Types.ObjectId(user.schoolId),
    });
  }

  /**
   * Retrieves notification statistics
   */
  public async getStats(user: AuthUser, branchId?: string): Promise<NotificationStatsResponse> {
    const branchFilter = getAuthorizedBranchFilter(user.branchAccess, branchId);
    return this.repository.getStats(user.schoolId, branchFilter);
  }

  /**
   * Creates manual parent outreach log
   */
  public async createParentContactLog(
    dto: CreateParentContactLogDTO,
    user: AuthUser,
  ): Promise<IParentContactLog> {
    const student = await StudentModel.findById(dto.studentId).lean();
    if (!student || student.isDeleted) {
      throw new NotFoundError(`Student with ID ${dto.studentId} not found`);
    }

    const studentBranchId =
      typeof student.branchId === 'object' &&
      student.branchId !== null &&
      '_id' in (student.branchId as object)
        ? String((student.branchId as { _id: unknown })._id)
        : String(student.branchId);

    if (
      String(student.schoolId) !== user.schoolId ||
      !checkBranchAccess(user.branchAccess, studentBranchId)
    ) {
      throw new ForbiddenError(
        'You do not have access to record contact logs for this student branch',
      );
    }

    const created = await this.repository.createContactLog({
      schoolId: new Types.ObjectId(String(student.schoolId)),
      branchId: new Types.ObjectId(studentBranchId),
      studentId: new Types.ObjectId(dto.studentId),
      guardianName: dto.guardianName,
      guardianPhone: dto.guardianPhone,
      contactType: dto.contactType,
      purpose: dto.purpose,
      outcome: dto.outcome,
      notes: dto.notes,
      contactDate: dto.contactDate ? new Date(dto.contactDate) : new Date(),
      staffId: user.userId,
      staffName: user.username,
    });

    await AuditLogService.log({
      userId: user.userId,
      schoolId: String(student.schoolId),
      branchId: studentBranchId,
      module: 'parent_contact_log',
      action: 'CREATE',
      entityType: 'ParentContactLog',
      entityId: String(created._id),
      newValue: {
        studentId: dto.studentId,
        guardianName: dto.guardianName,
        contactType: dto.contactType,
        purpose: dto.purpose,
        outcome: dto.outcome,
      },
    });

    return created;
  }

  /**
   * Retrieves parent outreach history
   */
  public async getParentContactLogs(
    filters: ParentContactLogFilters,
    user: AuthUser,
  ): Promise<{ data: IParentContactLog[]; total: number; page: number; totalPages: number }> {
    const branchFilter = getAuthorizedBranchFilter(user.branchAccess, filters.branchId);
    return this.repository.findContactLogsWithFilters(filters, {
      ...branchFilter,
      schoolId: new Types.ObjectId(user.schoolId),
    });
  }
}
