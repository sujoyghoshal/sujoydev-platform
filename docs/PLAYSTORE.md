# NurixSoft — Google Play Store Release Guide

Package: `com.sujoydev.app` · Developer: NurixSoft

Follow these phases in order. Items marked ⚙️ are already automated in this repo.

---

## Phase A — One-time setup

1. **Play Console account** — https://play.google.com/console → pay the one-time **$25 USD** registration fee (personal account) using a Google account. Identity verification can take 1–2 days.
2. **Upload keystore** ⚙️ — generated at `mobile/android/app/upload-key.keystore` with credentials in `mobile/android/keystore.properties` (both are git-ignored).
   **BACK BOTH FILES UP NOW** — Google Drive + a second location. Losing the upload key without Play App Signing enrolled means losing the app listing.
3. **Play App Signing** — when creating the app in Play Console, accept Play App Signing (default). Google holds the final signing key; your keystore is only the *upload* key and can be reset via support if lost.

## Phase B — Build the release

```bash
cd mobile/android
./gradlew bundleRelease        # produces the signed AAB
# Output: mobile/android/app/build/outputs/bundle/release/app-release.aab
```

Test the release build on the emulator/device before uploading:

```bash
./gradlew installRelease
```

Every subsequent upload must increment `versionCode` (and usually `versionName`) in `mobile/android/app/build.gradle`.

## Phase C — Create the app in Play Console

Create app → fill:

| Field | Value |
|---|---|
| App name | NurixSoft — Portfolio & Hire |
| Default language | English (India) — en-IN |
| App or game | App |
| Free or paid | Free |
| Category | Business (or Productivity) |
| Contact email | supportsujoydev@gmail.com |

## Phase D — Store listing assets

Required (create in Figma/Canva; sizes are mandatory):

- **App icon:** 512 × 512 PNG (32-bit, ≤ 1 MB)
- **Feature graphic:** 1024 × 500 PNG/JPG
- **Phone screenshots:** minimum 2, recommended 4–8, 16:9 or 9:16, each side 320–3840 px. Capture from the emulator: `adb exec-out screencap -p > shot1.png`
- **Short description** (≤ 80 chars):
  `Hire NurixSoft — Android apps, websites & backends. Portfolio + requests.`
- **Full description** (≤ 4000 chars): describe portfolio browsing, services with pricing, project requests with ticket tracking, bug reporting, blog, dark mode.

## Phase E — Policy declarations (App content section)

All of these must be completed before release:

1. **Privacy policy URL** — host `docs/PRIVACY_POLICY.md` publicly (e.g. `https://nurixsoft.vercel.app/privacy`) and paste the URL.
2. **Data safety form** — declare truthfully for this app:
   - Collects: **Name, Email** (only when the user signs in with Google) — purpose: account management; not shared with third parties; user can request deletion.
   - Project request form data (name, email, phone) — purpose: app functionality (contacting you back).
   - Data encrypted in transit: **Yes**. Deletion mechanism: **Yes** (email request).
3. **Ads** — No.
4. **Target audience** — 18+ (avoids Families policy requirements).
5. **App access** — provide a note that all features work via "Continue as Guest" (so reviewers aren't blocked by Google Sign-In).
6. **Content rating questionnaire** — utility/productivity, no violence etc. → rated Everyone.
7. **Government apps / financial features** — No.

## Phase F — Release

1. **Internal testing first** (recommended): Testing → Internal testing → create release → upload `app-release.aab` → add your own email as tester → verify install from the Play link.
2. **Production**: Production → create release → upload the same AAB → release notes → **Save → Review → Start rollout**.
3. First review typically takes **1–7 days**. New personal accounts may additionally require **12 testers for 14 days** in closed testing before production access — plan for this.

## Phase G — After launch

- Monitor **Android vitals** (crashes/ANRs) in Play Console.
- Reply to reviews from Play Console.
- Ship updates by bumping `versionCode`, rebuilding the AAB, and creating a new release.

---

## Release checklist (print me)

- [ ] Keystore + keystore.properties backed up in 2 locations
- [ ] versionCode incremented
- [ ] `./gradlew bundleRelease` succeeds, AAB < 200 MB
- [ ] Release build manually tested (not just debug)
- [ ] Privacy policy live at public URL
- [ ] Data safety form matches actual data collection
- [ ] Screenshots + 512px icon + feature graphic uploaded
- [ ] Content rating questionnaire completed
- [ ] App access notes mention guest mode
- [ ] Internal testing pass done before production rollout
