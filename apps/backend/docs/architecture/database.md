# SNP-SMS Database Schema & Indexes — Organization & Academic Core

## Collections & Compound Indexes

### 1. `schools`

- Fields: `_id`, `code`, `nameKh`, `nameEn`, `logo`, `phone`, `email`, `address`, `website`, `status` (`active` | `inactive`), `isDeleted`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Indexes:
  - `{ code: 1, isDeleted: 1 }` (unique query target)

### 2. `branches`

- Fields: `_id`, `schoolId` (ref `schools`), `branchCode`, `branchNameKh`, `branchNameEn`, `address`, `phone`, `email`, `managerId`, `openingDate`, `status` (`active` | `inactive` | `closed`), `isDeleted`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Indexes:
  - `{ schoolId: 1, branchCode: 1, isDeleted: 1 }` (unique per school)

### 3. `departments`

- Fields: `_id`, `schoolId` (ref `schools`), `branchId` (ref `branches`), `code`, `nameKh`, `nameEn`, `description`, `managerId`, `status` (`active` | `inactive`), `isDeleted`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Indexes:
  - `{ branchId: 1, code: 1, isDeleted: 1 }` (unique per branch)
  - `{ schoolId: 1, branchId: 1 }`

### 4. `positions`

- Fields: `_id`, `schoolId` (ref `schools`), `branchId` (ref `branches`), `departmentId` (ref `departments`), `code`, `nameKh`, `nameEn`, `description`, `status` (`active` | `inactive`), `isDeleted`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Indexes:
  - `{ departmentId: 1, code: 1, isDeleted: 1 }` (unique per department)
  - `{ branchId: 1, departmentId: 1 }`

### 5. `programs`

- Fields: `_id`, `schoolId`, `branchId` (optional), `code`, `nameKh`, `nameEn`, `description`, `status`, `isDeleted`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Indexes:
  - `{ code: 1, isDeleted: 1 }`
  - `{ branchId: 1, status: 1 }`

### 6. `levels`

- Fields: `_id`, `schoolId`, `branchId`, `programId` (ref `programs`), `code`, `name`, `description`, `sequence`, `status`, `isDeleted`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Indexes:
  - `{ programId: 1, sequence: 1 }`
  - `{ programId: 1, code: 1, isDeleted: 1 }`

### 7. `classes`

- Fields: `_id`, `schoolId`, `branchId` (ref `branches`), `academicYearId` (ref `academicYears`), `programId` (ref `programs`), `levelId` (ref `levels`), `classroomId` (ref `classrooms`), `classCode`, `className`, `capacity`, `startDate`, `endDate`, `status`, `isDeleted`, `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Indexes:
  - `{ branchId: 1, academicYearId: 1, classCode: 1, isDeleted: 1 }` (unique)

### 8. `auditLogs`

- Fields: `_id`, `userId`, `schoolId`, `branchId`, `module`, `action`, `entityType`, `entityId`, `oldValue`, `newValue`, `ipAddress`, `userAgent`, `timestamp`
- Indexes:
  - `{ module: 1, action: 1 }`
  - `{ entityType: 1, entityId: 1 }`
  - `{ timestamp: -1 }`
