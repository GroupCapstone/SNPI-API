import { describe, expect, it } from 'vitest';
import { outstandingPaymentAccounts } from '../src/modules/payment/payment-account';

const receipt = {
  schoolId: 'school',
  branchId: 'branch',
  studentId: { _id: 'student' },
  tuitionFeeId: { _id: 'fee', billingCycle: 'monthly' },
  academicYearId: 'year',
  currency: 'USD',
  billingYear: 2026,
  billingMonth: 9,
  amountDue: 100,
  amountPaid: 40,
  discountAmount: 0,
  balanceRemaining: 60,
  status: 'partial',
};

describe('current payment account balances', () => {
  it('removes historical partial receipts after the account is paid', () => {
    expect(
      outstandingPaymentAccounts([
        receipt,
        { ...receipt, amountPaid: 60, balanceRemaining: 0, status: 'paid' },
      ]),
    ).toEqual([]);
  });
  it('counts an unpaid invoice and multiple receipts as one account', () => {
    const result = outstandingPaymentAccounts([
      { ...receipt, amountPaid: 0, balanceRemaining: 100, status: 'pending' },
      receipt,
      { ...receipt, amountPaid: 20, balanceRemaining: 40 },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]?.balanceRemaining).toBe(40);
  });
  it('reopens the outstanding amount when a receipt is voided', () => {
    expect(
      outstandingPaymentAccounts([receipt, { ...receipt, amountPaid: 60, status: 'voided' }])[0]
        ?.balanceRemaining,
    ).toBe(60);
  });
  it('keeps billing months, branches, and currencies separate', () => {
    expect(
      outstandingPaymentAccounts([
        receipt,
        { ...receipt, billingMonth: 10 },
        { ...receipt, branchId: 'other' },
        { ...receipt, currency: 'KHR' },
      ]),
    ).toHaveLength(4);
  });
  it('includes discounts once and rounds fractional currency balances', () => {
    expect(
      outstandingPaymentAccounts([
        { ...receipt, amountDue: 0.3, amountPaid: 0.1, discountAmount: 0.1 },
      ])[0]?.balanceRemaining,
    ).toBe(0.1);
  });
});
