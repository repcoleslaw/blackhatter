# Blackhatter

A web app for evaluating meeting quality. Design an agenda against preset objectives, check whether the meeting actually covers them, then export a PDF pre-read and a calendar `.ics`.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Firebase Auth, Cloud Firestore, and Storage (Storage is configured for later; v1 uses URL links)

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Paste your Firebase web app keys into `.env`. The app will show a setup screen until those values are present.

The marketing site is a second Vite app in `marketing/`. It shares brand tokens from `shared/brand.css` and links to the product via `VITE_APP_ORIGIN`.

```bash
cd marketing
npm install
cp .env.example .env
cd ..
npm run dev:marketing
```

Locally the app is on port 5173 and marketing is on 5174. Set `VITE_MARKETING_ORIGIN=http://localhost:5174` in the app `.env` so login/signup can link back.

## Firebase setup

1. Create a Firebase project and a web app.
2. Enable **Email/Password** and **Google** sign-in under Authentication.
3. Create a **Cloud Firestore** database.
4. Enable **Storage**.
5. Copy the web config into `.env` (`VITE_FIREBASE_*` keys).
6. Deploy **Firestore and Storage rules together** when you are ready:

```bash
npx firebase login
npx firebase use --add
npx firebase deploy --only firestore:rules,firestore:indexes,storage
```

Storage writes are denied until an upload feature exists. Rules require signed-in owners, a fixed field schema, and `https://` URLs (no `javascript:` / `data:` links). They cannot scan files for malware.

Test rules locally with the emulators (requires Java):

```bash
npm run test:rules
```

**App Check** is the next layer against random clients using the public API key. Enable reCAPTCHA v3 or Enterprise in the Firebase console and enforce it on Firestore and Storage when you are ready. This repo does not initialize App Check yet.

Hosting uses two sites in the same Firebase project: **app** (`dist`) and **www** (`marketing/dist`). Create the second site once, then apply targets if needed:

```bash
npx firebase hosting:sites:create blackhatter-marketing
npx firebase target:apply hosting app blackhatter
npx firebase target:apply hosting www blackhatter-marketing
```

```bash
npm run build
npm run build:marketing
npx firebase deploy --only hosting
```

Set production origins **before** those builds:

| File | Variable | Production value |
|---|---|---|
| `marketing/.env` | `VITE_APP_ORIGIN` | `https://app.theblackhatter.com` |
| `marketing/.env` | `VITE_SITE_ORIGIN` | `https://theblackhatter.com` |
| `.env` | `VITE_MARKETING_ORIGIN` | `https://theblackhatter.com` |

`VITE_SITE_ORIGIN` defaults to `https://theblackhatter.com` if unset, so prerendered canonicals, Open Graph URLs, and the sitemap stay on the public host.

## Custom domains

Canonical marketing URL: **https://theblackhatter.com**. Do not promote `*.web.app`, `www`, or `.ca` once redirects work.

| Host | Hosting site (target) | Role |
|---|---|---|
| `theblackhatter.com` | `blackhatter-marketing` (`www`) | Serve marketing |
| `www.theblackhatter.com` | same | **Redirect** to `theblackhatter.com` |
| `theblackhatter.ca`, `www.theblackhatter.ca` | same | **Redirect** to `theblackhatter.com` (keep the path) |
| `app.theblackhatter.com` | `blackhatter` (`app`) | Serve the product |
| `app.theblackhatter.ca` | same | **Redirect** to `app.theblackhatter.com` |

### Attach domains in Firebase

1. [Firebase Console](https://console.firebase.google.com/) → Hosting → site **blackhatter-marketing** → **Add custom domain**.
2. Add `theblackhatter.com` and choose to **serve** this site.
3. Add `www.theblackhatter.com` and choose **Redirect to another domain** → `theblackhatter.com`.
4. Add `theblackhatter.ca` and `www.theblackhatter.ca` the same way, redirecting to `theblackhatter.com`.
5. Switch to site **blackhatter**. Add `app.theblackhatter.com` (serve) and `app.theblackhatter.ca` (redirect to `app.theblackhatter.com`).

Firebase prints DNS records after each add:

- **Apex** (`.com` / `.ca`): TXT to prove ownership, then A and AAAA to Firebase IPs.
- **Subdomains** (`www`, `app`): CNAME to the host Firebase shows (often `ghs.googlehosted.com`), plus TXT if asked.

### Registrar DNS

Enter those records exactly at the registrar for `theblackhatter.com` and `theblackhatter.ca`. Remove any leftover A/AAAA/CNAME that points somewhere else. Wait until each domain shows **Connected** and HTTPS is provisioned (minutes to 24 hours).

Do not configure the same hostname as both “serve” and “redirect”.

`*.web.app` will still respond. Canonical tags and Search Console point Google at `https://theblackhatter.com`; Hosting cannot 301 the default URL without looping the custom domain.

### Search Console and analytics

1. Add a **Domain** property for `theblackhatter.com` (DNS TXT). This covers apex, `www`, and `app`.
2. Optionally add `theblackhatter.ca` only to confirm the 301s. Do **not** submit a sitemap there.
3. Submit `https://theblackhatter.com/sitemap.xml`. Request indexing for `/` and `/faq`.
4. Optional GA4: set `VITE_GA_MEASUREMENT_ID` in `marketing/.env` and rebuild. Optional HTML-tag verification: set `VITE_GOOGLE_SITE_VERIFICATION`.

## Product (v1)

- Sign in with email/password or Google
- Profile with display name and meeting count
- Create a meeting with title and description
- Agenda builder: preset objectives, sortable duration blocks, optional date and target duration
- Analytics: objective coverage, actual vs target duration, and meeting cost by company (risks and simulate are stubs)
- Export PDF pre-read and `.ics` (title, description, total duration)
