# MediPlain – AI-Powered Medical Test & Medicine Explainer

A full-stack web app that helps patients understand medical tests, prescriptions, and
medicines in plain language, with support for English, Telugu, and Hindi.

This is a real, runnable full-stack build — not a mockup. Run it locally with the
steps below.

## What's genuinely working

- **Auth**: signup, login, logout, forgot/reset password, email-verification flow, JWT sessions, bcrypt password hashing, profile update
- **Navigation**: fixed responsive navbar (Home, Upload, Search Medicine, Search Test, AI Assistant, language selector, Login/Sign Up buttons) with a mobile hamburger menu
- **Search**: medical test & medicine search with real fuzzy/typo correction (Levenshtein distance) over a seeded dataset (8 tests, 8 medicines) with full detail fields, rendered through reusable `TestCard`/`MedicineCard` components
- **Multi-language**: full UI + content in English, Telugu, Hindi, switchable anytime and saved to your profile
- **OCR upload workflow**: image preview, real upload-progress bar (XHR progress events), OCR confidence score with a visual bar, detected tests and detected medicines shown as separate sections, raw extracted text, low-confidence warning, and PDF export of results. **Handwriting is now supported**: if `ANTHROPIC_API_KEY` is set, uploads are read by Claude's vision model instead of Tesseract, which handles handwriting far better since it isn't limited to recognizing trained fonts. Tesseract remains the automatic fallback if no key is set or the API call fails, so the feature never hard-breaks.
- **AI chatbot**: available both as a floating widget (any page) and a full dedicated `/ai-assistant` page with suggested prompts — both share one `ChatPanel` component. Calls the real Anthropic API if you add a key; otherwise falls back to rule-based answers from the seed data
- **Voice search**: real browser Web Speech API, via one shared `VoiceInput` component used on both search pages and the chat
- **Dashboard**: recent searches, bookmarks, upload history, language preference — all persisted per user
- **Dark/light mode, bookmarking** — real, working features, with a fade-in animation layer applied across cards and page transitions

## Component structure (frontend)

```
src/
  components/
    Navbar.jsx          fixed nav bar + mobile menu + auth buttons + language switcher
    LanguageSwitcher.jsx
    VoiceInput.jsx       reusable search bar + mic button (search pages, chat)
    MedicineCard.jsx     reusable detailed medicine card
    TestCard.jsx         reusable detailed test card
    ProgressBar.jsx      reusable progress bar (upload %, OCR confidence)
    ChatPanel.jsx        shared chat UI/logic (floating widget + full page)
    AIChatWidget.jsx      thin floating wrapper around ChatPanel
    ProtectedRoute.jsx
  pages/
    Home.jsx, Login.jsx, Signup.jsx, ForgotPassword.jsx,
    SearchTest.jsx, SearchMedicine.jsx, Upload.jsx,
    AIAssistant.jsx, Dashboard.jsx
  context/
    AuthContext.jsx, LangContext.jsx
```

## What's intentionally stubbed (and why)

The original spec asked for things that need paid/enterprise infrastructure that
can't be wired up generically:

- **Handwriting OCR**: now genuinely works if you set `ANTHROPIC_API_KEY` — uploads are read by Claude's vision model directly (see `backend/routes/ocr.js`), which reads handwriting the same way tools like Lovable/GPT-based OCR apps do: by sending the image to a vision-capable AI instead of a traditional OCR engine. Without a key, the app falls back to Tesseract, which is genuinely limited to printed text — that's a hard limitation of OCR engines like Tesseract/TrOCR, not a bug, which is why the app now tells you which method it used and warns you when confidence is low.
- **MongoDB / Cloudinary / Firebase**: swapped for a local JSON file database (`lowdb`) and local disk storage for uploads, so the whole thing runs with zero external accounts. The data layer in `backend/db.js` mirrors a Mongo collection shape, so swapping in real MongoDB later is a small, contained change.
- **Real email sending** (verification / password reset emails): no SMTP/SendGrid key is configured, so those endpoints return the link directly in the API response instead of emailing it. Wiring up an email provider is a ~20 line change in `backend/routes/auth.js`.
- **Google Translate API**: UI strings and seed content are pre-translated by hand instead, since that's actually more reliable than a live translation call for a fixed set of medical content.

## Project structure

```
mediplain/
  backend/     Node.js + Express API, lowdb JSON database, OCR, auth, AI routes
  frontend/    React + Vite + Tailwind CSS single-page app
```

## Running it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Optional: paste an Anthropic API key into .env to power the real AI chatbot
npm run dev
```

The API runs on `http://localhost:4000`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` — the dev server proxies `/api` calls to the backend automatically.

## Notes for using this as a portfolio project

- The seed dataset (`backend/data/seed.js`) has 8 tests and 8 medicines fully filled out (English + Telugu + Hindi) — enough to demo every feature end-to-end. Adding more is just adding more objects to that array.
- `backend/utils/fuzzy.js` implements Levenshtein-distance fuzzy matching from scratch (no library) — worth highlighting in interviews since it directly matches the "AI-based error correction" requirement in the original spec.
- The AI chatbot degrades gracefully with no API key, which is a good thing to point out: the app doesn't hard-fail if a paid dependency isn't configured.
