# NurixSoft — Deployment Guide

## 1. MongoDB Atlas (database)

1. Create a free cluster at https://cloud.mongodb.com (M0 is fine to start).
2. Database Access → add a user with password auth (readWrite on `nurixsoft`).
3. Network Access → allow your server IP (or `0.0.0.0/0` temporarily during setup).
4. Copy the connection string into `backend/.env` as `MONGODB_URI` (database name `nurixsoft`).

## 2. Backend API

### Option A — Render / Railway (fastest, free tier)

1. Push the repo to GitHub.
2. New Web Service → root directory `backend` → build `npm ci && npm run build` → start `node dist/server.js`.
3. Add every variable from `backend/.env.example` in the dashboard's environment settings.
4. Note the public URL (e.g. `https://nurixsoft-api.onrender.com`) — health check: `GET /api/v1/health`.

### Option B — VPS with Docker

```bash
# on the server
git clone <repo> && cd NurixSoft
cp backend/.env.example backend/.env   # fill real values
cd deployment
docker compose up -d --build
```

TLS: issue a certificate with certbot for `api.nurixsoft.app`, mounted via the
`certbot-certs` volume (see `deployment/nginx/nurixsoft.conf`). Until TLS is set
up you can expose the API container port directly for testing.

## 3. Point the mobile app at the API

Edit `mobile/src/config/constants.ts`:

```ts
export const API_BASE_URL = 'https://<your-api-domain>/api/v1';
```

(`http://10.0.2.2:5000/api/v1` reaches a locally running backend from the
Android **emulator**; a real device needs your machine's LAN IP or the deployed URL.)

Rebuild the app after changing it.

## 4. Admin dashboard → Vercel

1. Import the repo in Vercel → root directory `admin` → framework Vite.
2. Env var `VITE_API_BASE_URL=https://<your-api-domain>/api/v1`.
3. Add the Vercel domain to `CORS_ORIGINS` in the backend env and redeploy the API.

## 5. First admin account

Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` in the backend env, then run the seed
script once (`npm run seed`) or insert via mongosh — the password is bcrypt-hashed
by the model automatically when created through the seed.

## 6. Android release

See `docs/PLAYSTORE.md` for the full Play Console walkthrough.

```bash
cd mobile/android && ./gradlew bundleRelease
# → app/build/outputs/bundle/release/app-release.aab
```

## Environment variable checklist

| Variable | Where | Notes |
|---|---|---|
| MONGODB_URI | backend | Atlas SRV string |
| JWT_ACCESS_SECRET / JWT_REFRESH_SECRET | backend | `openssl rand -hex 64` each |
| GOOGLE_WEB_CLIENT_ID | backend + mobile | same Web client ID in both |
| CLOUDINARY_* | backend | image uploads |
| SMTP_* | backend | Gmail app password works |
| CORS_ORIGINS | backend | admin dashboard URL(s) |
| VITE_API_BASE_URL | admin | deployed API base |
