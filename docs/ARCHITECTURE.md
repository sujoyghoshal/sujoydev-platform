# NurixSoft — System Architecture

## 1. High-Level Topology

```
┌─────────────────────┐        ┌─────────────────────┐
│  Android App        │        │  Admin Dashboard    │
│  React Native (TS)  │        │  React + Vite + MUI │
│  com.sujoydev.app   │        │  (Vercel)           │
└─────────┬───────────┘        └─────────┬───────────┘
          │ HTTPS + WSS                  │ HTTPS + WSS
          ▼                              ▼
┌─────────────────────────────────────────────────────┐
│  Nginx (TLS termination, gzip, rate shielding)      │
└─────────────────────────┬───────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────┐
│  Node.js + Express + TypeScript (Docker)            │
│  REST /api/v1 · Socket.IO · Cron Jobs               │
│  JWT + Refresh rotation · RBAC · Audit logging      │
└──────┬──────────────┬──────────────┬────────────────┘
       ▼              ▼              ▼
 MongoDB Atlas    Cloudinary     Firebase (FCM)
 (replica set,    (images,       + Google OAuth
  transactions)    attachments)   + Nodemailer SMTP
```

## 2. Backend Layering

`route → validator → middleware(auth/rbac/rate-limit) → controller → service → model`

- **Controllers** never touch Mongoose directly; they translate HTTP ⇄ service calls.
- **Services** own business logic, transactions, and cross-model orchestration.
- **Models** own schema, indexes, soft-delete filtering, and instance/static helpers.
- **Middleware** is composable: `authenticate`, `authorize('admin')`, `validate(schema)`,
  `audit('project.update')`, `upload.single('image')`.

## 3. Authentication Flow

1. **Mobile:** Google Sign-In → ID token → `POST /auth/google` → verify with Google →
   upsert user → issue access JWT (15m) + refresh token (30d, rotated, stored hashed
   in `sessions` with device fingerprint).
2. **Admin:** email + password (bcrypt, cost 12) → optional TOTP hook (2FA-ready) →
   access JWT + refresh in `httpOnly; Secure; SameSite=Strict` cookie.
3. **Refresh rotation:** every refresh invalidates the old token (reuse detection
   revokes the whole session family).
4. **RBAC:** roles + granular permissions collections; `authorize()` middleware checks
   role, `can()` checks permission keys (e.g. `blogs:publish`).

## 4. Real-Time & Notifications

- **Socket.IO** namespaces: `/admin` (dashboard live counters, new-request alerts),
  `/user` (request status changes, message replies). JWT handshake auth.
- **FCM** for push: device tokens stored per user with platform + app version;
  topics for broadcast announcements; scheduled sends via cron queue.

## 5. Data Design Highlights

- 19 collections (see README). Key indexes: text indexes on projects/blogs/services
  for search; compound `{ status, createdAt }` on requests/bugs; TTL on expired sessions.
- **Aggregation pipelines** power the admin dashboard (monthly growth, revenue,
  device/country splits) and are pre-rolled nightly into `analytics` for cheap reads.
- **Transactions** wrap multi-document mutations (e.g. approve request → update
  request + create notification + write audit log).
- **Soft delete** everywhere user-facing; hard delete restricted to superadmin + audit.

## 6. Security Checklist (enforced in code)

helmet (CSP, HSTS) · CORS allowlist · express-rate-limit (tiered: auth 10/15m,
API 300/15m) · express-mongo-sanitize · XSS input sanitization · CSRF token for
admin cookie flows · bcrypt · JWT alg pinning (HS256) · payload size limits ·
Multer MIME/extension allowlist + Cloudinary re-encode · secrets via env only ·
audit logs on all privileged mutations.

## 7. Performance

Pagination (cursor for feeds, offset for admin tables) · lean() reads ·
selective projections · Redis-ready cache interface (in-memory LRU fallback) ·
compression · FastImage + Cloudinary transforms (`f_auto,q_auto,w_`) ·
RN Reanimated on UI thread · admin code-splitting per feature route.

## 8. Deployment

- **Backend:** multi-stage Dockerfile (node:20-alpine), docker-compose with Nginx;
  targets VPS / Render / Railway. Health endpoint `/api/v1/health`.
- **Admin:** Vercel (SPA rewrite, env-injected API base).
- **Database:** MongoDB Atlas M0+ with daily backups.
- **Mobile:** signed AAB via Gradle release config, Play Console rollout —
  full checklist in `docs/PLAYSTORE.md` (Phase 15).
