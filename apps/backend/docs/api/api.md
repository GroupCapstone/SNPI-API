# SNP-SMS API Documentation

## Base URL

`/api/v1`

---

## 1. Organization — Schools

### `GET /api/v1/schools`

Retrieve all top-level school organization profiles.

- **Permission:** `school.view.all_branches`
- **Query Parameters:** `search`, `status`, `page`, `limit`

### `POST /api/v1/schools`

Create a new school organization profile.

- **Permission:** `school.create.all_branches`
- **Request Body:**

```json
{
  "code": "SNP",
  "nameEn": "SNP International School",
  "nameKh": "សាលាអន្តរជាតិ អេសអិនភី",
  "email": "info@snp.edu.kh",
  "phone": "+855 23 888 999",
  "address": "Phnom Penh, Cambodia",
  "website": "https://snp.edu.kh",
  "status": "active"
}
```

### `PATCH /api/v1/schools/:id`

Update an existing school organization profile.

- **Permission:** `school.edit.all_branches`

### `DELETE /api/v1/schools/:id`

Soft-delete / deactivate a school profile (verifies no active branches exist).

- **Permission:** `school.delete.all_branches`

---

## 2. Organization — Branches

### `GET /api/v1/branches`

Retrieve campus branches list with multi-branch access filtering.

- **Permission:** `branch.view.own_branch` | `branch.view.all_branches`
- **Query Parameters:** `schoolId`, `search`, `status`, `page`, `limit`

### `POST /api/v1/branches`

Register a new campus branch.

- **Permission:** `branch.create.all_branches`
- **Validation Rules:** Validates `schoolId` exists, `branchCode` unique within school.
- **Request Body:**

```json
{
  "schoolId": "507f1f77bcf86cd799439001",
  "branchCode": "MB-01",
  "branchNameEn": "Main Branch (Phnom Penh)",
  "branchNameKh": "សាខាធំ (រាជធានីភ្នំពេញ)",
  "phone": "+855 23 888 101",
  "email": "main@snp.edu.kh",
  "address": "Street 271, Phnom Penh",
  "status": "active"
}
```

### `PATCH /api/v1/branches/:id`

Modify campus location, contact info, and status.

- **Permission:** `branch.edit.own_branch` | `branch.edit.all_branches`

### `DELETE /api/v1/branches/:id`

Close/deactivate branch (protected against active classes/departments).

- **Permission:** `branch.delete.all_branches`

---

## 3. Organization — Departments

### `GET /api/v1/departments`

List operational departments across branches.

- **Permission:** `department.view.own_branch` | `department.view.all_branches`
- **Query Parameters:** `schoolId`, `branchId`, `search`, `status`, `page`, `limit`

### `POST /api/v1/departments`

Create a functional department within a branch.

- **Permission:** `department.create.own_branch` | `department.create.all_branches`
- **Validation Rules:**
  1. `branchId` must belong to the selected `schoolId`.
  2. `code` must be unique within the `branchId`.
- **Request Body:**

```json
{
  "schoolId": "507f1f77bcf86cd799439001",
  "branchId": "507f1f77bcf86cd799439002",
  "code": "ACA",
  "nameEn": "Academic Department",
  "nameKh": "ដេប៉ាតឺម៉ង់សិក្សាធិការ",
  "description": "Curriculum management and faculty supervision",
  "status": "active"
}
```

### `PATCH /api/v1/departments/:id`

Update department information and scope.

- **Permission:** `department.edit.own_branch` | `department.edit.all_branches`

### `DELETE /api/v1/departments/:id`

Deactivate department (protected if active positions exist).

- **Permission:** `department.delete.own_branch` | `department.delete.all_branches`

---

## 4. Organization — Positions

### `GET /api/v1/positions`

List staffing job roles and positions.

- **Permission:** `position.view.own_branch` | `position.view.all_branches`
- **Query Parameters:** `schoolId`, `branchId`, `departmentId`, `search`, `status`, `page`, `limit`

### `POST /api/v1/positions`

Add a job position to a department.

- **Permission:** `position.create.own_branch` | `position.create.all_branches`
- **Validation Rules:**
  1. `branchId` must belong to `schoolId`.
  2. `departmentId` must belong to `branchId`.
  3. `code` unique within `departmentId`.
- **Request Body:**

```json
{
  "schoolId": "507f1f77bcf86cd799439001",
  "branchId": "507f1f77bcf86cd799439002",
  "departmentId": "507f1f77bcf86cd799439003",
  "code": "TCH-ENG",
  "nameEn": "English Language Teacher",
  "nameKh": "គ្រូបង្រៀនភាសាអង់គ្លេស",
  "description": "Instructs GEP and CEP classes",
  "status": "active"
}
```

### `PATCH /api/v1/positions/:id`

Modify position details and role classification.

- **Permission:** `position.edit.own_branch` | `position.edit.all_branches`

### `DELETE /api/v1/positions/:id`

Deactivate job position.

- **Permission:** `position.delete.own_branch` | `position.delete.all_branches`
