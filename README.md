# NurixSoft — Freelancing Services Platform

**Company:** NurixSoft — Freelance Software Studio
**Package:** `com.sujoydev.app`
**Contact:** supportsujoydev@gmail.com · +91 8927673775

A commercial-grade freelancing platform built for clients: we design and deliver
websites, Android & iOS apps (Play Store / App Store), backends and UI/UX at
budget-friendly prices — with a project request pipeline, ticket tracking,
bug reporting, and a full admin CRM behind it.

---

## Repository Layout (Monorepo)

```
NurixSoft/
├── backend/          Node.js + Express + TypeScript REST API (Socket.IO, FCM, Cloudinary)
├── admin/            React 18 + Vite + TypeScript + MUI admin dashboard
├── mobile/           React Native (TypeScript) Android application
├── deployment/       Docker Compose, Nginx, environment templates, release guides
└── docs/             Architecture, API reference, database schema, Play Store checklist
```

### backend/

```
backend/
├── src/
│   ├── config/            env loader, database, cloudinary, firebase-admin, mailer, constants
│   ├── models/            19 Mongoose models (users, admins, projects, services, blogs,
│   │                      messages, notifications, project_requests, bug_reports,
│   │                      testimonials, reviews, favorites, analytics, audit_logs,
│   │                      settings, sessions, roles, permissions, activity_logs)
│   ├── controllers/       one controller per API module
│   ├── services/          business logic layer (thin controllers, fat services)
│   ├── routes/            versioned routers mounted at /api/v1
│   ├── middleware/        auth (JWT + roles), validation, rate-limit, error, audit, upload
│   ├── validators/        request schemas (express-validator / yup)
│   ├── sockets/           Socket.IO gateway + event handlers
│   ├── jobs/              cron jobs (cleanup, analytics rollup, scheduled notifications)
│   ├── utils/             ApiError, ApiResponse, asyncHandler, logger, pagination, tokens
│   ├── types/             shared TS types & express augmentation
│   ├── app.ts             express app assembly (helmet, cors, compression, morgan)
│   └── server.ts          HTTP + Socket.IO bootstrap, graceful shutdown
├── Dockerfile
├── .env.example
├── tsconfig.json
└── package.json
```

### admin/

```
admin/
├── src/
│   ├── api/               axios client, interceptors (refresh-token), endpoint modules
│   ├── app/               store, router, providers (theme, query, socket)
│   ├── components/        layout (sidebar/topbar), tables, charts, forms, dialogs, common
│   ├── features/          auth, dashboard, users, projects, services, blogs, requests,
│   │                      bugs, messages, testimonials, notifications, analytics,
│   │                      settings, audit-logs
│   ├── hooks/             useAuth, useDebounce, useExport, useSocket, usePermissions
│   ├── theme/             MUI theme (light/dark), design tokens
│   ├── types/             API contracts shared with backend
│   └── utils/             formatters, csv export, validators
├── .env.example
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### mobile/

```
mobile/
├── src/
│   ├── api/               axios instance, token refresh, offline cache layer
│   ├── app/               redux store, slices, listeners
│   ├── components/        common (buttons, cards, inputs), home, projects, blog, forms
│   ├── navigation/        root, auth, main tabs, stacks (React Navigation v7)
│   ├── screens/           Home, Projects, ProjectDetail, Services, Blog, BlogDetail,
│   │                      Contact, HireMe, ProjectRequest, BugReport, Auth,
│   │                      Profile, Favorites, Notifications, RequestTracker, Settings
│   ├── theme/             MD3 tokens, dark mode, typography
│   ├── services/          fcm, google-auth, storage, analytics
│   ├── hooks/             useTheme, useAuth, useOffline, useNotifications
│   ├── utils/             validation schemas (yup), formatters, device info
│   └── assets/            lottie, images, fonts
├── android/               Gradle project, signing config, com.sujoydev.app
├── tsconfig.json
└── package.json
```

---

## Build Roadmap (step-by-step, confirmed per phase)

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | Monorepo structure, docs, roadmap | ✅ |
| 2 | Backend foundation — config, app/server, error handling, logger, utils | ✅ |
| 3 | Core Mongoose models (users, admins, sessions, requests, bugs, audit, counters) | ✅ |
| 4 | Auth module — JWT + refresh rotation, Google Sign-In, RBAC, sessions, seed | ✅ |
| 5 | Content APIs — projects, services, blogs, testimonials, reviews, favorites | pending |
| 6 | Workflow APIs — project requests (tickets), bug reports | ✅ (messages/uploads pending) |
| 7 | Notifications (FCM + Socket.IO), analytics, dashboard APIs, cron jobs | pending |
| 8 | Admin dashboard — scaffold, auth, layout, theme, routing | ✅ |
| 9 | Admin modules — requests + bugs management | ✅ (users/projects/blogs pending) |
| 10 | Admin analytics, notifications manager, settings, audit logs | pending |
| 11 | Mobile scaffold — navigation, redux, theme, API layer, offline queue | ✅ |
| 12 | Mobile public screens — home, projects, services, blog, contact | ✅ |
| 13 | Mobile auth + user features — hire me, requests, bugs, profile, favorites | ✅ |
| 14 | Push notifications (needs Firebase project), deep links, polish | pending |
| 15 | Deployment — Docker, Nginx, env, guides, Play Store release kit | ✅ |

---

## Core Conventions

- **API versioning:** all routes under `/api/v1`.
- **Responses:** uniform `{ success, message, data, meta }` envelope.
- **Errors:** centralized `ApiError` → error middleware → structured JSON + logger.
- **Auth:** short-lived access JWT (15m) + rotating refresh token (30d, httpOnly cookie
  for admin web, secure storage for mobile). Roles: `user`, `admin`, `superadmin`.
- **Soft delete:** `isDeleted` + `deletedAt` on user-facing collections; queries filter by default.
- **Audit:** every admin mutation writes an `audit_logs` entry (actor, action, target, diff, IP).
- **Tickets:** project requests `PRQ-YYYYMM-XXXX`, bug reports `BUG-YYYYMM-XXXX`.
