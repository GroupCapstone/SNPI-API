import { afterEach, describe, expect, it, vi } from 'vitest';
import { NotificationService } from '../src/modules/notification/notification.service';

describe('notification provider delivery boundaries', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('does not simulate Telegram success without a token in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('TELEGRAM_BOT_TOKEN', '');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(
      await new NotificationService().dispatchTelegramMessage('test', 'message'),
    ).toMatchObject({ success: false });
    expect(fetch).not.toHaveBeenCalled();
  });
  it('does not simulate SMS success without configuration in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('TWILIO_ACCOUNT_SID', '');
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    expect(await new NotificationService().dispatchSms('+85512345678', 'message')).toMatchObject({
      success: false,
    });
    expect(fetch).not.toHaveBeenCalled();
  });
  it('records provider acceptance only after a successful SMS response', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('TWILIO_ACCOUNT_SID', `AC${'1'.repeat(32)}`);
    vi.stubEnv('TWILIO_AUTH_TOKEN', 'test-token');
    vi.stubEnv('TWILIO_FROM_NUMBER', '+15005550006');
    const fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ sid: 'SM-test', status: 'queued' }) });
    vi.stubGlobal('fetch', fetch);
    expect(await new NotificationService().dispatchSms('+85512345678', 'School & parent')).toEqual({
      success: true,
      messageId: 'SM-test',
    });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('api.twilio.com'),
      expect.objectContaining({
        method: 'POST',
        body: 'To=%2B85512345678&From=%2B15005550006&Body=School+%26+parent',
        signal: expect.any(AbortSignal),
      }),
    );
    fetch.mockResolvedValue({ ok: false, json: async () => ({ message: 'Invalid destination' }) });
    expect(await new NotificationService().dispatchSms('invalid', 'message')).toEqual({
      success: false,
      error: 'Invalid destination',
    });
  });
  it('handles Telegram rejection and network failures without claiming delivery', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('TELEGRAM_BOT_TOKEN', 'test-token');
    const fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, description: 'Chat not found' }),
    });
    vi.stubGlobal('fetch', fetch);
    expect(
      await new NotificationService().dispatchTelegramMessage('test', 'message'),
    ).toMatchObject({ success: false });
    fetch.mockRejectedValue(new Error('Timeout'));
    expect(
      await new NotificationService().dispatchTelegramMessage('test', 'message'),
    ).toMatchObject({ success: false });
  });
});
