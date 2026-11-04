# SNPI-API: Headless REST API Engine

> Official enterprise backend REST API for the **SNPI School Management System (SMS)**, powered by Express 5, TypeScript, and MongoDB Replica Set (`rs0`).

---

## 1. Architectural Highlights

- **Framework**: Express 5 (native `async/await` error handling).
- **Language**: TypeScript 5 (Node16 / ESM module resolution).
- **Database**: MongoDB Replica Set (`rs0`) with Mongoose ODM & ACID transaction sessions.
- **Validation**: Zod runtime schema whitelisting.
- **Security & Auth**: Dual-stack authentication supporting **Bearer JWT** (RFC 8725 compliant with refresh rotation) and **X-API-Key** service accounts, hardened with Helmet and rate-limiting.
- **Architecture Pattern**: 7-Layer Modular Monolith:
  `route -> controller -> service -> repository -> model -> validation -> types`
- **Domain Organization**: 47 domain modules categorized into **5 Bounded Contexts**:
  1. `identity`: Authentication, user accounts, core roles, RBAC permissions, campus branches.
  2. `academic`: Academic years, terms, programs, departments, classes, subjects, schedules.
  3. `student`: Student profiles, admissions, enrollments, daily attendance, transfers.
  4. `assessment`: Examinations, continuous scoring, term results, report cards.
  5. `finance`: Tuition fee structures, invoices, payment operations, financial reports.

---

## 2. Quick Start

### Prerequisites

- Node.js >= 20.0.0
- MongoDB >= 6.0 (Replica Set `rs0` enabled)

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start development server with live reload (Port 5000)
npm run dev

# 4. Run typecheck & build
npm run typecheck
npm run build

# 5. Start production server
npm start
```

---

## 3. Environment Variables (`.env.example`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/snpi_sms?replicaSet=rs0
JWT_SECRET=your-256-bit-cryptographically-secure-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-256-bit-cryptographically-secure-refresh-key
CORS_ORIGIN=http://localhost:3000,https://portal.snpi.edu.kh
```

---

## 4. Verification & Testing

```bash
# Typecheck verification
npm run typecheck

# Unit & integration tests
npm test
```
