# NurixSoft — Complete Project Documentation (A → Z)

**Company:** NurixSoft · **Version:** 1.0.0 · **Doc date:** 2026-07-05
**Developer:** NurixSoft — Full Stack Developer · supportsujoydev@gmail.com · +91 8927673775
**Package:** `com.sujoydev.app`

---

## Table of Contents

1. [What is NurixSoft](#1-what-is-NurixSoft)
2. [Technology Stack](#2-technology-stack)
3. [Monorepo Layout](#3-monorepo-layout)
4. [System Architecture](#4-system-architecture)
5. [Backend API](#5-backend-api)
6. [Database Design](#6-database-design)
7. [Admin Dashboard](#7-admin-dashboard)
8. [Mobile App](#8-mobile-app)
9. [Authentication & Security](#9-authentication--security)
10. [Ticketing System](#10-ticketing-system)
11. [Conventions & Standards](#11-conventions--standards)
12. [Deployment](#12-deployment)
13. [Implemented vs Pending — Full Status](#13-implemented-vs-pending--full-status)
14. [Roadmap](#14-roadmap)
15. [How to Run Locally](#15-how-to-run-locally)

---

## 1. What is NurixSoft

NurixSoft is a **commercial-grade portfolio + freelancing platform** with three applications sharing one backend:

- **Android app** — public portfolio (projects, services, blogs, contact) plus authenticated client features: hire-me / project requests, bug reporting, ticket tracking, favorites, profile.
- **Admin dashboard (web)** — a CRM for the freelancer: triage project requests and bug tickets, manage content, view analytics.
- **REST API** — Node.js backend with MongoDB, JWT auth, RBAC, and a ticketing engine.

Business goal: showcase NurixSoft's work and convert visitors into clients, then manage those clients through a request → triage → delivery pipeline (Fiverr/Upwork-style feature scope, single-freelancer focus).

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Mobile | React Native **0.86** · React 19 · TypeScript · Redux Toolkit · React Navigation · Axios · Google Sign-In |
| Admin | React **19** · Vite **8** · TypeScript · Material UI **9** · Redux Toolkit · Axios |
| Backend | Node.js · Express **4.21** · TypeScript · JWT · Bcrypt · Helmet · CORS · Compression · Rate limiter |
| Database | MongoDB · Mongoose **8.9** · indexes · atomic counters · soft delete |
| DevOps | Docker · docker-compose · Nginx · MongoDB Atlas (target) · Play Store kit |
| Planned | Socket.IO · Firebase Cloud Messaging · Cloudinary + Multer · Nodemailer · node-cron |

## 3. Monorepo Layout

```
NurixSoft/
├── backend/          Node.js + Express + TypeScript REST API
│   ├── src/
│   │   ├── config/         env.ts, database.ts
│   │   ├── models/         User, Admin, Session, ProjectRequest, BugReport, AuditLog, Counter
│   │   ├── controllers/    auth, request, bug
│   │   ├── services/       token.service.ts
│   │   ├── routes/         index.ts (+health), auth.routes, request.routes, bug.routes
│   │   ├── middleware/     auth (JWT + roles), error, rateLimiter
│   │   ├── utils/          ApiError, ApiResponse, asyncHandler, logger
│   │   ├── app.ts          express assembly (helmet, cors, compression, morgan)
│   │   └── server.ts       HTTP bootstrap, graceful shutdown
│   ├── scripts/dev-db.js   local dev database helper
│   ├── Dockerfile
│   └── .env.example
├── admin/            React 19 + Vite + TypeScript + MUI dashboard
│   └── src/
│       ├── api/client.ts        axios + interceptors
│       ├── layouts/DashboardLayout.tsx
│       ├── pages/               LoginPage, DashboardPage, RequestsPage, BugsPage
│       ├── store.ts · theme.ts · types.ts
├── mobile/           React Native Android app (com.sujoydev.app)
│   └── src/
│       ├── api/client.ts
│       ├── app/                 redux store
│       ├── components/          ProjectCard, BlogCard, ServiceCard, SectionHeader, EmptyState
│       ├── navigation/          RootNavigator + types
│       ├── screens/             13 screens (see §8)
│       ├── services/            googleAuth.ts, tickets.ts
│       ├── data/portfolio.ts    static content (until content APIs ship)
│       ├── theme/ · types/ · config/ · assets/
│       ├── android/             Gradle project, signing config
├── deployment/       docker-compose.yml · nginx/nurixsoft.conf
└── docs/             ARCHITECTURE, DEPLOYMENT, GOOGLE_AUTH, PLAYSTORE, PRIVACY_POLICY, TERMS
```

## 4. System Architecture

High-level: two clients (mobile app, admin SPA) call one versioned REST API behind Nginx; the API talks to MongoDB. Planned additions: Socket.IO channel, FCM push, Cloudinary media, SMTP email.

See **[diagrams/01-system-architecture.md](diagrams/01-system-architecture.md)** for the full Mermaid diagram, plus:

- **[diagrams/02-er-diagram.md](diagrams/02-er-diagram.md)** — entity-relationship diagram (implemented + planned collections)
- **[diagrams/03-auth-flow.md](diagrams/03-auth-flow.md)** — Google Sign-In & JWT refresh sequence
- **[diagrams/04-ticket-lifecycle.md](diagrams/04-ticket-lifecycle.md)** — project-request / bug ticket state machine
- **[diagrams/05-folder-structure.md](diagrams/05-folder-structure.md)** — annotated folder tree

## 5. Backend API

Base URL: `http://<host>/api/v1` — all responses use the envelope:

```json
{ "success": true, "message": "…", "data": { }, "meta": { } }
```

### Implemented endpoints (v1.0.0)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | Uptime, DB state, environment |
| POST | `/auth/google` | Public (rate-limited) | Google ID-token → JWT access + refresh |
| POST | `/auth/admin/login` | Public (rate-limited) | Admin email/password login |
| POST | `/auth/refresh` | Refresh token | Rotate refresh token |
| POST | `/auth/logout` | Optional | Revoke session |
| POST | `/requests` | Optional | Create project request → `PRQ-YYYYMM-XXXX` |
| GET | `/requests/track/:ticket` | Public | Track a request by ticket number |
| GET | `/requests` | Admin | List/filter all requests |
| PATCH | `/requests/:id` | Admin | Update status / progress |
| POST | `/bugs` | Optional | Submit bug → `BUG-YYYYMM-XXXX` |
| GET | `/bugs` | Admin | List/filter bug reports |
| PATCH | `/bugs/:id` | Admin | Update bug status / priority |

### Planned modules (stubs commented in `routes/index.ts`)

`/projects` · `/services` · `/blogs` · `/admin/*` (user mgmt, settings, audit) · `/testimonials` · `/reviews` · `/favorites` · `/messages` · `/notifications` · `/analytics` · `/upload` · `/search`

### Error handling

`ApiError` (status + code + message) → central `error.middleware` → structured JSON + logger entry. All async controllers wrapped in `asyncHandler`.

## 6. Database Design

**Implemented (7 collections):**

| Collection | Purpose | Highlights |
|---|---|---|
| `users` | Google-authenticated end users | email, googleId, role, avatar, soft delete |
| `admins` | Admin/superadmin accounts | bcrypt hash, role |
| `sessions` | Refresh-token sessions | token hash, device, expiry — enables rotation & revoke |
| `project_requests` | Client project tickets | ticket no., type, budget, timeline, priority, status |
| `bug_reports` | Bug tickets | ticket no., priority, device/OS/app-version info |
| `audit_logs` | Admin mutation trail | actor, action, target, diff, IP |
| `counters` | Atomic ticket sequences | per-month sequence for PRQ/BUG numbers |

**Planned (12):** `projects`, `services`, `blogs`, `messages`, `notifications`, `testimonials`, `reviews`, `favorites`, `analytics`, `settings`, `roles`/`permissions`, `activity_logs`.

Conventions: soft delete (`isDeleted` + `deletedAt`) on user-facing collections; every admin mutation writes an audit-log entry. Full ERD in [diagrams/02-er-diagram.md](diagrams/02-er-diagram.md).

## 7. Admin Dashboard

**Implemented pages (4):**

| Page | What it does |
|---|---|
| `LoginPage` | Admin JWT login with error handling |
| `DashboardPage` | KPI cards: **Total Requests · Pending Review · Completed · Open Bugs** |
| `RequestsPage` | Project-request table, status chips, status/progress updates |
| `BugsPage` | Bug list with priority and status management |

Shared: `DashboardLayout` (sidebar + topbar), MUI theme, Redux store, axios client with auth interceptor.

**Pending:** user management, project/service/blog CMS pages, testimonials moderation, messages inbox, notification manager, analytics charts, settings, audit-log viewer, dark-mode toggle, CSV export/print, 2FA.

## 8. Mobile App

**Implemented screens (13):** Home, Projects, ProjectDetail, Services, Blog, BlogDetail, Contact, Login, Profile, Favorites, ProjectRequest, BugReport, MyRequests.

- **Public browsing** without login; auth gate only on requests/bugs/profile/favorites.
- **Google Sign-In** end-to-end (native Google auth → `/auth/google` token exchange) — verified on emulator.
- **Ticket tracking:** MyRequests screen resolves ticket status via the public track endpoint.
- Content is currently served from `src/data/portfolio.ts` (static) — swaps to live APIs in v1.1.0.

**Pending:** push notifications (FCM), notifications inbox, Settings screen, offline cache/queue, deep links, dark-mode toggle, server-synced favorites, change-password / delete-account.

## 9. Authentication & Security

- **Users:** Google Sign-In → backend verifies ID token → issues access JWT (15 min) + refresh token (30 days, rotated on every refresh, stored as a Session).
- **Admins:** email/password (bcrypt) → same JWT pair; cookies (httpOnly) for web.
- **RBAC:** `user` / `admin` / `superadmin` enforced by `authorize()` middleware.
- **Hardening:** Helmet headers, CORS allowlist, compression, auth-endpoint rate limiting, centralized error responses (no stack leaks), env-based secrets, audit-log model.
- **Planned:** 2FA for admin, input-sanitization pass, CSRF tokens for admin web, encrypted secret management.

## 10. Ticketing System

Every project request and bug report gets a human-readable ticket:

```
PRQ-202607-0001   (project request, July 2026, sequence 1)
BUG-202607-0001   (bug report)
```

The `counters` collection issues sequences atomically (findOneAndUpdate with $inc), keyed per type + month, so numbers never collide even under concurrent submissions. Tickets are trackable publicly (no login) via `GET /requests/track/:ticket`.

## 11. Conventions & Standards

- API versioning under `/api/v1`; uniform response envelope.
- Thin controllers / fat services pattern (token.service established; more services as modules grow).
- TypeScript strict across all three apps; shared type contracts.
- Soft delete + default query filtering.
- Conventional, descriptive commit messages; monorepo single history.

## 12. Deployment

| Component | Target | Artifacts |
|---|---|---|
| Backend | Docker on VPS / Render / Railway | `backend/Dockerfile`, `deployment/docker-compose.yml` |
| Reverse proxy | Nginx (TLS termination, proxy to API) | `deployment/nginx/nurixsoft.conf` |
| Database | MongoDB Atlas | connection via `MONGODB_URI` env |
| Admin | Vercel (static Vite build) | `admin/dist` |
| Android | Google Play Store | `docs/PLAYSTORE.md` checklist, signing config in `mobile/android`, Privacy Policy + Terms ready |

Run order: configure `.env` from `.env.example` → `docker compose up` (API + Mongo) → Nginx in front → deploy admin build → build signed AAB for Play.

## 13. Implemented vs Pending — Full Status

> Full colour-coded detail lives in the Excel tracker: **NurixSoft_Project_Tracker_v1.0.0.xlsx** (8 sheets).

| Area | Done | Pending | ~% |
|---|---|---|---|
| Backend API | Auth, Requests, Bugs, health — 12 endpoints, 7 models | Content, messages, notifications, analytics, upload, settings, search — 12 models | ~30% |
| Admin dashboard | Login, KPI dashboard, Requests, Bugs | 10 modules (users, CMS, analytics, settings, audit…) | ~30% |
| Mobile app | 13 screens, Google auth, ticketing | Push, settings, offline, deep links | ~75% |
| DevOps & docs | Docker, Nginx, 6 docs, Play kit | CI/CD, Play submission | ~90% |
| **Overall roadmap** | **10 of 15 phases (2 partial)** | **5 phases** | **~67%** |

## 14. Roadmap

| Version | Target date | Scope |
|---|---|---|
| ✅ v1.0.0 | 2026-07-05 (shipped) | Foundation, auth, ticketing pipeline, admin triage, 13 mobile screens, deploy kit |
| 🔜 v1.1.0 | ~2026-07-19 | Content APIs + Cloudinary uploads + admin CMS + mobile live data |
| 🔜 v1.2.0 | ~2026-08-02 | FCM + Socket.IO, analytics & charts, messages, settings, audit viewer, cron, email |
| 🔜 v1.3.0 | ~2026-08-16 | Mobile polish (settings, dark mode, offline, deep links), admin 2FA/exports, CI/CD, **Play Store release** |

## 15. How to Run Locally

```bash
# Backend
cd NurixSoft/backend
cp .env.example .env        # fill MONGODB_URI, JWT secrets, GOOGLE_CLIENT_ID
npm install
npm run dev                 # API on http://localhost:5000/api/v1/health

# Admin
cd NurixSoft/admin
cp .env.example .env        # VITE_API_URL
npm install
npm run dev                 # http://localhost:5173

# Mobile (Android)
cd NurixSoft/mobile
npm install
npx react-native run-android
```

---

*Document generated 2026-07-05 for NurixSoft v1.0.0. Companion files: `RELEASE_NOTES_v1.0.0.md`, `NurixSoft_Project_Tracker_v1.0.0.xlsx`, `diagrams/`.*
