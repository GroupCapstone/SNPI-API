import { createHash } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReportService } from '../src/modules/report/report.service';

vi.mock('../src/modules/audit-log/audit-log.service', () => ({
  AuditLogService: class {
    public static log = vi.fn().mockResolvedValue(undefined);
  },
}));

describe('Certificate Cryptographic Ledger Verification', () => {
  let service: ReportService;
  let mockRepository: Record<string, ReturnType<typeof vi.fn>>;

  const samplePayload = {
    student: { id: 'STU-001', name: 'Sokha Chan' },
    academic: { program: 'General English Program', level: 'Level 12' },
    completionDate: '2026-06-30',
    summary: { gpa: '3.92', honors: 'Summa Cum Laude' },
    school: { nameEn: 'SNP International School' },
  };

  const validHash = createHash('sha256').update(JSON.stringify(samplePayload)).digest('hex');

  beforeEach(() => {
    service = new ReportService();
    mockRepository = {
      findActiveByDocumentNumber: vi.fn(),
    };
    (service as unknown as { repository: typeof mockRepository }).repository = mockRepository;
  });

  it('verifies a valid certificate and returns cryptographic ledger proof without Fabric credentials for public access', async () => {
    mockRepository.findActiveByDocumentNumber.mockResolvedValue({
      documentNumber: 'CRT-2026-0001',
      generatedAt: new Date(),
      contentHash: validHash,
      payload: samplePayload,
    });

    const result = await service.verifyCertificate('CRT-2026-0001', false);

    expect(result.valid).toBe(true);
    expect(result.documentNumber).toBe('CRT-2026-0001');
    expect(result.contentHash).toBe(validHash);

    const ledger = result.ledger as Record<string, unknown>;
    expect(ledger).toBeDefined();
    expect(ledger.status).toBe('COMMITTED_TAMPER_PROOF');
    expect(ledger.network).toBe('SNP-SMS-FABRIC-LEDGER-V1');
    expect(ledger.hashAlgorithm).toBe('SHA-256');

    // Public callers MUST NOT receive Fabric credentials
    expect(result.fabricCredentials).toBeUndefined();
  });

  it('provides Fabric transaction credentials when requested by an authorized internal service', async () => {
    mockRepository.findActiveByDocumentNumber.mockResolvedValue({
      documentNumber: 'CRT-2026-0001',
      generatedAt: new Date(),
      contentHash: validHash,
      payload: samplePayload,
    });

    const result = await service.verifyCertificate('CRT-2026-0001', true);

    expect(result.valid).toBe(true);
    expect(result.fabricCredentials).toBeDefined();
    const creds = result.fabricCredentials as Record<string, unknown>;
    expect(creds.mspId).toBe('SNPInternationalMSP');
    expect(creds.signingIdentity).toBe('cert-authority-signer-01');
  });

  it('detects tampering when payload hash differs from ledger contentHash', async () => {
    mockRepository.findActiveByDocumentNumber.mockResolvedValue({
      documentNumber: 'CRT-2026-0001',
      generatedAt: new Date(),
      contentHash: 'tampered-or-altered-hash-value',
      payload: samplePayload, // produces validHash, which does not match contentHash
    });

    const result = await service.verifyCertificate('CRT-2026-0001', false);

    expect(result.valid).toBe(false);
    const ledger = result.ledger as Record<string, unknown>;
    expect(ledger.status).toBe('TAMPER_DETECTED');
  });

  it('throws NotFoundError if certificate code does not exist', async () => {
    mockRepository.findActiveByDocumentNumber.mockResolvedValue(null);

    await expect(service.verifyCertificate('NON-EXISTENT')).rejects.toThrow(
      'Certificate not found or no longer valid',
    );
  });
});
