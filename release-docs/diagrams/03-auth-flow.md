# SujoyDev — Authentication Flows (v1.0.0)

## Google Sign-In (Mobile) — implemented & verified 2026-07-05 13:19

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant M as 📱 Mobile App
    participant G as Google OAuth
    participant A as API /api/v1/auth
    participant DB as MongoDB

    U->>M: Tap "Sign in with Google"
    M->>G: Native Google Sign-In (Web client ID)
    G-->>M: ID token
    M->>A: POST /auth/google { idToken }
    A->>G: Verify ID token signature & audience
    G-->>A: Token payload (email, name, picture, sub)
    A->>DB: Upsert user (googleId, email)
    A->>DB: Create Session (refresh-token hash, device, 30d expiry)
    A-->>M: { accessToken (15m), refreshToken (30d), user }
    M->>M: Store tokens securely
    U->>M: Use Hire Me / Requests / Bugs / Profile
```

## Token Refresh & Rotation — implemented

```mermaid
sequenceDiagram
    autonumber
    participant C as Client (mobile / admin)
    participant A as API
    participant DB as MongoDB (sessions)

    C->>A: Request with expired access JWT
    A-->>C: 401 Unauthorized
    C->>A: POST /auth/refresh { refreshToken }
    A->>DB: Find session by token hash, check expiry
    alt Valid session
        A->>DB: Rotate — invalidate old hash, store new one
        A-->>C: New access JWT + new refresh token
        C->>A: Retry original request ✅
    else Invalid / expired / reused
        A->>DB: Revoke session
        A-->>C: 401 → force re-login
    end
```

## Admin Login (Web) — implemented

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    participant W as 🖥 Admin Dashboard
    participant A as API
    participant DB as MongoDB

    AD->>W: Email + password
    W->>A: POST /auth/admin/login (rate-limited)
    A->>DB: Find admin, bcrypt.compare
    alt Valid credentials
        A->>DB: Create session
        A-->>W: Access JWT + refresh (httpOnly cookie)
        W->>W: Redirect → Dashboard (KPIs, Requests, Bugs)
    else Invalid
        A-->>W: 401 ApiError (no user enumeration)
    end
    Note over W,A: Every admin API call: Authorization Bearer JWT<br/>authorize('admin','superadmin') middleware
```

## Access Model

| Action | Login required? |
|---|---|
| Browse home / projects / services / blogs / contact | ❌ No |
| Track ticket by number | ❌ No |
| Submit project request / bug report | Optional (linked to account if logged in) |
| Profile, favorites, my requests | ✅ User |
| Requests/bugs triage, dashboard | ✅ Admin / Superadmin |
