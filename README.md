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

Set production `VITE_APP_ORIGIN` in `marketing/.env` (and `VITE_MARKETING_ORIGIN` in the app `.env`) to the live origins before those builds. Custom domains (`app.` / `www.`) can be attached to each Hosting site later.

## Product (v1)

- Sign in with email/password or Google
- Profile with display name and meeting count
- Create a meeting with title and description
- Agenda builder: preset objectives, sortable duration blocks, optional date and target duration
- Analytics: objective coverage, actual vs target duration, and meeting cost by company (risks and simulate are stubs)
- Export PDF pre-read and `.ics` (title, description, total duration)
