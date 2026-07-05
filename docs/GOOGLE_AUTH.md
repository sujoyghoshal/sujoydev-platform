# Google Sign-In Setup — SujoyDev

The code is fully wired: the app opens the native Google account picker, receives an
ID token, and exchanges it at `POST /api/v1/auth/google` for a SujoyDev JWT
(the backend verifies the token with Google and upserts the user in MongoDB).

The only missing piece is a Google Cloud OAuth client, which must be created
under **your** Google account. It's free and takes ~5 minutes.

---

## Your app's fingerprints (already extracted — copy from here)

| Keystore | Used for | SHA-1 |
|---|---|---|
| Debug | Emulator & dev builds | `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` |
| Upload | Release / Play Store builds | `7E:22:46:00:1F:7F:DE:3F:D9:2B:CD:1D:60:49:9A:CD:23:61:CA:C3` |

Package name: `com.sujoydev.app`

---

## Steps (Google Cloud Console)

1. Go to https://console.cloud.google.com → project dropdown → **New Project** → name it `SujoyDev` → Create.
2. **APIs & Services → OAuth consent screen**:
   - User type: **External** → Create.
   - App name `SujoyDev`, support email `sujoyghshal.s@gmail.com`, developer email same → Save.
   - Scopes: none needed beyond the defaults (email, profile). Save through to the end.
   - Under *Audience / Publishing status*, add yourself as a **test user** (until you publish the consent screen).
3. **APIs & Services → Credentials → + Create credentials → OAuth client ID**, three times:

   **a) Android client (debug):**
   - Application type: **Android**
   - Package name: `com.sujoydev.app`
   - SHA-1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

   **b) Android client (release):**
   - Application type: **Android**
   - Package name: `com.sujoydev.app`
   - SHA-1: `7E:22:46:00:1F:7F:DE:3F:D9:2B:CD:1D:60:49:9A:CD:23:61:CA:C3`

   **c) Web client:**
   - Application type: **Web application**, name `SujoyDev Backend`
   - No redirect URIs needed.
   - **Copy this client's ID** — it looks like `1234567890-abc123.apps.googleusercontent.com`. This is the only value that goes into code.

4. Paste the **Web client ID** in two places:
   - `mobile/src/config/constants.ts` → `GOOGLE_WEB_CLIENT_ID = '...'`
   - `backend/.env` → `GOOGLE_WEB_CLIENT_ID=...`

5. Rebuild the app (`npx react-native run-android` or reload Metro) and tap
   **Continue with Google** — the native account picker should appear.

## Later (Play Store)

When you enroll in **Play App Signing**, Google re-signs the production app with
its own key. After your first upload, go to Play Console → *Test and release →
Setup → App signing*, copy the **App signing key SHA-1**, and add it as one more
Android OAuth client (same package name). Otherwise Google Sign-In works in
internal testing but fails for the public production build.

## Troubleshooting

- **DEVELOPER_ERROR (code 10):** the SHA-1 + package combination doesn't match any
  Android OAuth client — re-check step 3a/3b, and make sure you pasted the *Web*
  client ID (not an Android one) into the code.
- **Sign-in works but backend returns 401:** `GOOGLE_WEB_CLIENT_ID` in
  `backend/.env` doesn't match the one in the app.
