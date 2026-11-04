# MongoDB Security Hardening & Defense Guide

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Standard**: [MongoDB Enterprise Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
> **Target**: MongoDB Replica Set (`rs0`) with Express 5 / Mongoose API

---

## 1. MongoDB Hardening Pillars

Securing MongoDB requires defense-in-depth across 6 layers:

```text
Layer 1: Network Isolation        ──> Bind to 127.0.0.1 or internal VPC; firewall port 27017
Layer 2: Transport Encryption     ──> TLS 1.3 mandatory for all client-to-cluster & inter-node traffic
Layer 3: Authentication & Keyfile ──> SCRAM-SHA-256 with cryptographically generated keyfile
Layer 4: Least-Privilege RBAC     ──> Application user restricted to readWrite on snp_sms db
Layer 5: Encryption at Rest       ──> WiredTiger AES-256-CBC disk encryption
Layer 6: NoSQL Injection Defense  ──> Mongoose strictQuery and Zod primitive whitelisting
```

---

## 2. Replica Set Authentication & Keyfile Configuration

Every node in the MongoDB replica set (`rs0`) must communicate using an internal security keyfile:

### 1. Generating a Keyfile
```bash
# Generate 1024 bytes of cryptographically secure random data
openssl rand -base64 756 > /etc/mongodb/mongo-keyfile
chmod 400 /etc/mongodb/mongo-keyfile
chown mongodb:mongodb /etc/mongodb/mongo-keyfile
```

### 2. Replica Set Configuration (`mongod.conf`)
```yaml
net:
  port: 27017
  bindIp: 127.0.0.1,10.0.1.15   # Internal private IP only; NEVER 0.0.0.0
  tls:
    mode: requireTLS
    certificateKeyFile: /etc/ssl/mongodb.pem
    CAFile: /etc/ssl/ca.pem

security:
  authorization: enabled         # Enforces RBAC authentication
  keyFile: /etc/mongodb/mongo-keyfile

replication:
  replSetName: rs0
```

---

## 3. Least-Privilege Database RBAC

**Rule**: Never configure the application connection string with the `root` or `userAdminAnyDatabase` superuser account.

### Database User Creation Script:
```javascript
// Connect to admin database as root
use admin;

// 1. Application User (Read/Write on application database ONLY)
db.createUser({
  user: "snp_sms_app_user",
  pwd: "<SECURE_DATABASE_CREDENTIAL>",
  roles: [
    { role: "readWrite", db: "snp_sms" }
  ]
});

// 2. Read-Only Reporting User (For analytics / backups)
db.createUser({
  user: "snp_sms_readonly_user",
  pwd: "<SECURE_READONLY_CREDENTIAL>",
  roles: [
    { role: "read", db: "snp_sms" }
  ]
});
```

---

## 4. NoSQL Injection Defenses in Mongoose & Express

### Threat Scenario
An attacker submits JSON containing query operators to bypass authentication:
```json
{
  "username": { "$ne": null },
  "password": { "$ne": null }
}
```
If passed directly to `db.users.findOne(req.body)`, MongoDB evaluates `$ne: null` as true, returning the first user in the database without checking the password.

### Defense Rules:
1. **Enable Strict Query**:
   ```typescript
   import mongoose from 'mongoose';
   
   // Rejects fields and operators not defined in the Mongoose schema
   mongoose.set('strictQuery', true);
   ```

2. **Zod Primitive Validation**:
   Validate all route inputs using primitive Zod string schemas. Zod rejects objects when strings are expected, neutralizing operator injection before reaching Mongoose:
   ```typescript
   export const loginValidationSchema = z.object({
     email: z.string().email(),
     password: z.string().min(1).max(128),
   }).strict(); // If an object `{ "$ne": null }` is supplied, Zod rejects with 422
   ```

3. **Disallow Server-Side JavaScript Execution**:
   Ensure `$where` and `mapReduce` are disabled by running MongoDB without JavaScript execution:
   ```yaml
   security:
     javascriptEnabled: false
   ```

---

## 5. Connection String & Driver Security Hardening

In [`apps/backend/src/config/database.ts`](file:///Users/Apple16/Desktop/SNP-SMS/apps/backend/src/config/database.ts), configure production connection options:

```typescript
export const mongoOptions: mongoose.ConnectOptions = {
  // Enforce TLS 1.3
  tls: process.env.NODE_ENV === 'production',
  tlsAllowInvalidCertificates: false,
  
  // Connection Pool Guardrails (prevents memory leaks and socket starvation)
  maxPoolSize: 50,
  minPoolSize: 10,
  maxIdleTimeMS: 30000,
  
  // Fail-fast timeout configuration
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  
  // Replica Set Write Concern (W: majority ensures ACID durability)
  w: 'majority',
  journal: true,
};
```
