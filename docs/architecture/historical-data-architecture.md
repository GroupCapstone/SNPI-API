# SNP-SMS Historical Data Architecture & Lifecycle Standard

**Document Version:** 1.0.0  
**Classification:** Enterprise Academic Architecture, Data Governance & Scalability  
**Target System:** SNP Integrated Multi-Branch School Management System (SNP-SMS)

---

## 1. Executive Summary & Core Principle

SNP-SMS is designed for decades of continuous multi-branch operations across dozens of academic years, hundreds of programs and terms, and tens of thousands of students.

> **Fundamental Invariant:**  
> **SNP-SMS must never treat the current academic state as the only truth.**  
> Under no circumstances may historical records be deleted or overwritten when a student progresses, repeats, or transfers, or when academic rules (curricula, grading bands, tuition fees) change.

Historical records (attendance, raw scores, term results, promotions, invoices, payments, teacher assignments) must remain permanently reconstructable in their exact historical context.

---

## 2. 5-Tier Data Classification & Architectural Boundaries

```
+----------------------------------------------------------------------------------------------------+
| 1. PERMANENT MASTER                                                                                |
|    - Student (permanent studentId, khmerName, latinName, dob, gender, nationalId)                  |
|    - School, Branch, Program, Level, Subject                                                       |
+----------------------------------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------------------------------+
| 2. TIME-BOUND MASTER                                                                               |
|    - AcademicYear (planned -> active -> closing -> closed -> archived)                             |
|    - AcademicPeriod (draft -> active -> closing -> closed -> archived)                            |
|    - Class (linked to Year, Period, Program, Level)                                                |
|    - TeacherAssignment (effectiveFrom, effectiveTo)                                                |
|    - AcademicRule (versioned grade schemes, assessment schemes, promotion rules)                   |
|    - TuitionFee (scoped by Year, Period, Program, Level)                                           |
+----------------------------------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------------------------------+
| 3. TRANSACTIONAL ACADEMIC & FINANCIAL RECORDS                                                      |
|    - Enrollment (studentId + academic context; statuses: enrolled, active, promoted, transferred)  |
|    - AttendanceSession & AttendanceRecord (daily roll-calls, locked when period closes)            |
|    - Score & ScoreRevision (raw marks, locked on period close; editable via HistoricalCorrection)  |
|    - Payment & Receipt (linked to year, period, and enrollment)                                    |
|    - StudentTransfer (internal & cross-branch audit log)                                           |
+----------------------------------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------------------------------+
| 4. FINALIZED HISTORICAL RECORDS (IMMUTABLE SNAPSHOTS)                                              |
|    - TermResult (frozen totals, average, GPA, subject breakdowns, rule & attendance snapshots)     |
|    - OfficialDocument (report_card, transcript, receipt with contentHash & documentNumber)          |
|    - Promotion (fromEnrollment -> toEnrollment, decision, reason, timestamp)                       |
+----------------------------------------------------------------------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------------------------------+
| 5. DERIVED REPORTING & HISTORICAL QUERIES                                                          |
|    - Multi-year transcripts, student 360 timeline, retention compliance, archive exports           |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Academic Lifecycle State Machine & Write Barriers

### 3.1 Academic Period Lifecycle

```
[ draft ]
    │  (activate)
    ▼
[ active ]
    │  (initiate closing)
    ▼
[ closing ] ──(checklist failed)──► [ active ]
    │
    │  (finalize checklist passed)
    ▼
[ closed ] (READ-ONLY BARRIER ENFORCED)
    │
    ▼
[ archived ] (COLD STORAGE READY)
```

### 3.2 Period Closing Checklist (Fail-Safe Gate)

Before transitioning from `closing` to `closed`, `AcademicPeriodService.getClosingChecklist()` validates:

1. **Attendance Completion:** Every active class schedule within the period date range has recorded attendance sessions.
2. **Score Entry Completeness:** Every published assessment has marks entered for all enrolled students.
3. **Term Result Finalization:** 100% of student enrollments have calculated, approved, and completed `TermResult` records.
4. **No Pending Correction Requests:** All historical correction requests for the period are resolved (`applied` or `rejected`).

### 3.3 Central Write Barrier (`assertAcademicContextWritable`)

Once an `AcademicPeriod` is `closed` (or its parent `AcademicYear` is `closed`/`archived`), the central write barrier strictly blocks mutations:

- No new `Score` entries or direct updates.
- No new `AttendanceRecord` changes.
- No new enrollments into the closed period.
- Attempted mutations return **HTTP 409 Conflict** with an informative error message.

---

## 4. Governed Historical Correction Workflow

When an error in a closed period must be corrected (e.g., incorrect exam score discovered after finalization):

> **Rule:** Never reopen an entire academic year or period to fix one student record.

Instead, execute the record-level **Historical Correction Workflow**:

1. **Correction Request:** Staff submits `POST /api/v1/historical-corrections` specifying `entityType` (`score`, `term_result`, `attendance`), `entityId`, detailed justification `reason`, and `proposedValue`.
2. **Administrative Review:** Academic director reviews via `POST /api/v1/historical-corrections/:id/review`. If approved, generates a single-use cryptographically secure `unlockToken` valid for 60 minutes.
3. **Guarded Application:** The correction is applied via `POST /api/v1/historical-corrections/:id/apply`.
4. **Audit & Revision:**
   - A `ScoreRevision` is created referencing `correctionRequestId`.
   - The correction token is consumed immediately, returning the record to read-only status.
   - Comprehensive audit log is emitted (`AuditLogService.log`).

---

## 5. Data Retention & Archival Policy Matrix

| Tier       | Category                       | Collections                                                           | Retention Period                 | Archival Strategy                                                         |
| ---------- | ------------------------------ | --------------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------- |
| **Tier 1** | Permanent Master               | `students`, `schools`, `branches`, `programs`, `levels`, `subjects`   | **Permanent (Indefinite)**       | Hot storage in operational cluster; soft-delete protection only.          |
| **Tier 2** | Finalized Academic Credentials | `termresults`, `promotions`, `officialdocuments`                      | **Permanent (Indefinite)**       | Hot storage for active years; cold compressed read replica for years > 5. |
| **Tier 3** | Financial Ledger & Receipts    | `payments`, `tuitionfees`                                             | **10 Years** (Fiscal Compliance) | Retained online for 10 fiscal years; annual compressed snapshot archive.  |
| **Tier 4** | Daily Operational Transactions | `attendancesessions`, `attendancerecords`, `scores`, `scorerevisions` | **5 Years** online               | Compressed partition after 5 years; available via secondary restore.      |
| **Tier 5** | Operational & Security Audit   | `auditlogs`                                                           | **3 Years**                      | Rotated quarterly; immutable append-only storage.                         |

---

## 6. MongoDB Indexing & Long-Term Scalability Roadmap

### 6.1 Standard Compound Index Patterns

To guarantee sub-10ms query times even with millions of documents:

- **Time-Bound Entities:** `{ branchId: 1, academicYearId: 1, academicPeriodId: 1, isDeleted: 1 }`
- **Student History:** `{ studentId: 1, academicYearId: 1, status: 1 }`
- **Financial Receipts:** `{ branchId: 1, academicYearId: 1, academicPeriodId: 1, studentId: 1, isDeleted: 1 }`
- **Audit Logs:** `{ schoolId: 1, branchId: 1, module: 1, createdAt: -1 }`

### 6.2 Sharding & Partitioning Strategy (Year 3+)

When dataset exceeds 500GB or 50 million documents:

- **Shard Key:** `{ branchId: 1, academicYearId: 1 }` (Hashed or Ranged).
- **Benefits:**
  - Branch isolation: Queries scoped to a single branch route directly to that branch's shard.
  - Natural time-decay: Historical academic years occupy older shards that can be backed up and compacted independently.

---

## 7. Disaster Recovery & Restore-Testing Verification Standard

A backup that has never been tested for restoration is not considered a valid backup.

### Verification Criteria:

1. **Document Invariant:** Record counts across all 28 collections must match source snapshot.
2. **Foreign Key Integrity:** 0 dangling references (e.g. `student.branchId` must point to valid branch).
3. **Sequence Counter Parity:** Sequence collections (`STU`, `ENR`, `TRF`, `PAY`, `HC`) must equal or exceed highest allocated code.
4. **Ledger Invariant:** Sum of `amountPaid` + `balanceRemaining` must equal `amountDue - discountAmount` for all non-voided receipts.
