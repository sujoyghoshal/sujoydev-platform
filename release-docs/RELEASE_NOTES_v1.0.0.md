# NurixSoft — Release Notes

<p align="center"><b>Company:</b> NurixSoft &nbsp;·&nbsp; <b>Product:</b> NurixSoft — Freelancing Services Platform &nbsp;·&nbsp; <b>Package:</b> com.sujoydev.app</p>

---

# 🚀 v1.0.0 — "Initial Release"

| | |
|---|---|
| **Release date** | Saturday, 5 July 2026 |
| **Release window** | 12:32 IST (first release commit) → 13:19 IST (Google Sign-In verified) |
| **Release tag** | `v1.0.0` |
| **Platforms** | Android (React Native 0.86) · Web Admin (React 19 + Vite 8) · API (Node.js + Express 4) |
| **Database** | MongoDB (Mongoose 8) — local dev / Atlas ready |
| **Status** | ✅ Released — internal / pre-Play-Store build |

## 📌 Summary

First production-grade release of the NurixSoft freelancing platform monorepo. This release ships a **working end-to-end client pipeline**:

> User signs in with Google → submits a **Project Request** or **Bug Report** → receives a ticket number (`PRQ-YYYYMM-XXXX` / `BUG-YYYYMM-XXXX`) → tracks the status in the app → admin triages it in the web dashboard.

## ✨ New Features

### Mobile App (Android, `com.sujoydev.app`)
- **12 screens live:** Home (agency hero, services, stats, featured projects), Projects + Project Detail, Services, Blog + Blog Detail, Contact, Login, Profile, Favorites, Project Request, Bug Report, My Requests (ticket tracker).
- **Real Google Sign-In** with backend ID-token exchange — verified on emulator (commit `25e641a`).
- Browse-without-login model — auth required only for requests, bugs, profile, favorites.
- Material Design theming, reusable card components, ticket tracking service.

### Backend API (`/api/v1`)
- **12 live endpoints** across Auth, Project Requests, Bug Reports + system health.
- **Auth:** Google token exchange, admin email/password login, refresh-token rotation, logout/session revoke, role-based authorization (`user` / `admin` / `superadmin`), login rate limiting.
- **Ticketing:** atomic monthly counters generate `PRQ-YYYYMM-XXXX` and `BUG-YYYYMM-XXXX`; public ticket tracking endpoint.
- **7 Mongoose models:** User, Admin, Session, ProjectRequest, BugReport, AuditLog, Counter.
- Uniform `{ success, message, data, meta }` response envelope, centralized `ApiError` handling, structured logging, async handler wrapper.

### Admin Dashboard (web)
- Secure JWT admin login.
- **Dashboard KPIs:** Total Requests · Pending Review · Completed · Open Bugs.
- **Requests management:** list, filter, status/progress updates.
- **Bugs management:** list, priority view, status updates.
- MUI 9 responsive layout with sidebar navigation and theme system.

### Deployment & Docs
- Backend `Dockerfile`, `docker-compose.yml`, Nginx reverse-proxy config.
- `.env.example` templates for backend and admin.
- Docs shipped: Architecture, Deployment guide, Google Auth setup, Play Store checklist, Privacy Policy, Terms & Conditions.

## 🕐 Release Timeline (2026-07-05)

| Time (IST) | Commit | Change |
|---|---|---|
| 12:32 | `a7d3029` | 🎉 Initial release: NurixSoft freelancing platform v1.0.0 |
| 12:44 | `cb3f9b2` | ✨ Add brand assets |
| 12:44 | `6f68d4a` | 🧹 Remove Demo folder (assets moved to docs/ and mobile assets) |
| 12:54 | `0b9cf7a` | ✨ Wire real Google Sign-In with backend token exchange |
| 13:19 | `25e641a` | ✅ Configure Google OAuth Web client ID — Sign-In verified on emulator |

## ⚠️ Known Limitations

- Portfolio content (projects, services, blogs) is **static** in the mobile app (`mobile/src/data/portfolio.ts`) — content APIs land in v1.1.0.
- No push notifications yet (blocked on Firebase project setup).
- No analytics charts / dashboards beyond KPI counters.
- File/screenshot uploads not yet supported on requests and bug reports.
- Favorites are stored locally on the device (no server sync).
- No CI/CD pipeline; Play Store submission pending.

## 🔒 Security

- Short-lived access JWT (15 min) + rotating refresh tokens (30 days).
- Bcrypt-hashed admin passwords; sessions stored server-side and revocable.
- Helmet secure headers, CORS, compression, rate limiting on auth endpoints.
- Role-based authorization on all admin endpoints.
- Audit-log model in place for admin mutation trails.

## 🗺 What's Next

| Release | Target | Scope |
|---|---|---|
| **v1.1.0** | ~19 Jul 2026 | Content APIs (projects/services/blogs/testimonials/reviews/favorites), Cloudinary uploads, admin content management, mobile switches to live data |
| **v1.2.0** | ~2 Aug 2026 | FCM push + Socket.IO realtime, analytics + charts, messages, settings, audit-log viewer, cron jobs, email |
| **v1.3.0** | ~16 Aug 2026 | Mobile settings/dark-mode/offline queue, deep links, admin 2FA + exports, CI/CD, **signed AAB → Google Play Store** |

*Target dates are proposals based on the v1.0.0 velocity — adjust in the Excel tracker (`⏳ Pending Backlog` sheet).*

---

**Developer:** NurixSoft — Freelance Software Studio · supportsujoydev@gmail.com · +91 8927673775
