/** Receipt balances are historical snapshots. Derive current debt once per billing account. */
interface AccountReceipt {
  _id?: unknown;
  schoolId?: unknown;
  branchId?: unknown;
  studentId?: unknown;
  tuitionFeeId?: unknown;
  academicYearId?: unknown;
  currency?: string;
  billingYear?: number;
  billingMonth?: number;
  dueDate?: Date | string;
  paymentDate?: Date | string;
  amountDue?: number;
  amountPaid?: number;
  discountAmount?: number;
  balanceRemaining?: number;
  status?: string;
  isDeleted?: boolean;
}

const referenceId = (value: unknown) =>
  value && typeof value === 'object' && '_id' in value ? String(value._id) : String(value ?? '');

export const outstandingPaymentAccounts = <T extends AccountReceipt>(receipts: T[]): T[] => {
  const accounts = new Map<string, { receipt: T; due: number; paid: number; discount: number }>();
  for (const receipt of receipts) {
    if (receipt.isDeleted || receipt.status === 'voided') continue;
    const fee = receipt.tuitionFeeId as { billingCycle?: string } | undefined;
    const monthly =
      fee?.billingCycle === 'monthly' || (!fee?.billingCycle && Boolean(receipt.billingMonth));
    const dueDate = new Date(receipt.dueDate ?? receipt.paymentDate ?? 0);
    const period = monthly
      ? `${receipt.billingYear ?? dueDate.getUTCFullYear()}-${receipt.billingMonth ?? dueDate.getUTCMonth() + 1}`
      : 'once';
    const key = [
      receipt.schoolId,
      receipt.branchId,
      receipt.studentId,
      receipt.tuitionFeeId,
      receipt.academicYearId,
    ]
      .map(referenceId)
      .concat(receipt.currency ?? 'USD', period)
      .join(':');
    const account = accounts.get(key) ?? { receipt, due: 0, paid: 0, discount: 0 };
    account.due = Math.max(account.due, Number(receipt.amountDue ?? receipt.balanceRemaining ?? 0));
    account.paid += Number(receipt.amountPaid ?? 0);
    account.discount += Number(receipt.discountAmount ?? 0);
    accounts.set(key, account);
  }
  return [...accounts.values()].flatMap(({ receipt, due, paid, discount }) => {
    const balanceRemaining = Math.max(0, Math.round((due - paid - discount) * 100) / 100);
    return balanceRemaining > 0 ? [{ ...receipt, balanceRemaining }] : [];
  });
};
