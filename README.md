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

## Firebase setup

1. Create a Firebase project and a web app.
2. Enable **Email/Password** and **Google** sign-in under Authentication.
3. Create a **Cloud Firestore** database.
4. Enable **Storage**.
5. Copy the web config into `.env` (`VITE_FIREBASE_*` keys).
6. Deploy security rules when you are ready:

```bash
npx firebase login
npx firebase use --add
npx firebase deploy --only firestore:rules,firestore:indexes,storage
```

Hosting is configured in `firebase.json` to serve the Vite `dist` folder as an SPA.

```bash
npm run build
npx firebase deploy --only hosting
```

## Product (v1)

- Sign in with email/password or Google
- Profile with display name and meeting count
- Create a meeting with title and description
- Agenda builder: preset objectives, sortable duration blocks, optional date and target duration
- Analytics: objective coverage and actual vs target duration (cost, risks, and simulate are stubs)
- Export PDF pre-read and `.ics` (title, description, total duration)
