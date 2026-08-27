# Afjal Electrical and Rewinding Works — Marketing Site + Owner Dashboard

## What the app does
Lead-generation site for a motor rewinding + Class-B electrical contracting business in
Tilda Neora, Raipur (Chhattisgarh). Dark "Modern Industrial Electric" theme.
Public marketing site at `/` + PIN-gated owner dashboard at `/owner`.
Fully bilingual: English / Hindi one-tap toggle.

## Public URL
https://website-pro-37.preview.emergentagent.com

## Auth
- Single shared **owner PIN = `2003`** (env `OWNER_PIN` in backend/.env, `OWNER_SESSION_SECRET` signs the cookie).
- `POST /api/auth/owner-login` sets an httpOnly signed cookie `owner_session` (12h TTL).
- `lib/auth.py::require_owner` is a FastAPI dependency returning 401 when absent/expired.
- No customer accounts — everything else on the public site is anonymous.

## Backend (FastAPI, every route on api_router under /api)
Public:
- `GET  /api/` — business info ping
- `POST /api/leads` — create lead from cost estimator (`LEAD-XXXXXXXX`)
- `POST /api/emergency-dispatch` — SOS ticket (`SOS-1234`, `eta_minutes` from location)
- `GET  /api/jobs`, `GET /api/jobs/{job_id}` — status lookup by Job ID / phone (404 if unknown)
- `POST /api/jobs` — create job (auto-generates 6 stages)
- `GET  /api/reviews`, `POST /api/reviews`
- `GET  /api/stats`
- `GET  /api/settings/media` — owner-managed site imagery (public so the site can render)
- `GET  /api/auth/me`, `POST /api/auth/logout`

Owner-only (401 without cookie):
- `GET  /api/leads`, `GET /api/leads/{id}`
- `GET  /api/emergency-dispatch`, `GET /api/emergency-dispatch/{id}`
- `POST /api/jobs/{job_id}/advance` — marks the next incomplete stage done, recomputes
  `status_percentage` from `STAGE_PERCENTAGES = [15,30,45,65,85,100]` and `current_stage`.
  Returns 400 if the job is already 100% complete.
- `PUT  /api/settings/media`

Models: backend/models/{leads,emergency,jobs,reviews,stats,settings}.py
Routers: backend/routers/{leads,emergency,jobs,reviews,stats,auth,settings}.py
TS mirrors: frontend/src/types/index.ts (hand-written, keep in sync)

## Frontend
Routes (src/App.tsx, wrapped in `I18nProvider`): `/` → pages/Home.tsx, `/owner` → pages/Owner.tsx.

Home sections: Navbar → Hero → TrustMarquee → ServicesBento → CostEstimator →
RoiCalculator → BeforeAfterShowcase → JobTrackerView → ServiceCoverage →
LicensesCompliance → ReviewsSection → Footer, plus EmergencyDispatchModal,
CompanyBrochureModal, FloatingActions.

### i18n (src/lib/i18n.tsx)
- `DICT` holds every user-visible string as `{ en, hi }`; components call `t("key")`.
- `useI18n()` exposes `lang`, `setLang`, `toggle`, `t`. Choice persists in
  `localStorage["afjal_lang"]` and sets `<html lang>`.
- `LanguageToggle` (EN / हिंदी) sits in the desktop top micro-bar and the mobile control row.
- **When adding any new copy, add both `en` and `hi` entries to DICT** — a missing key
  renders the raw key string.

### Owner dashboard (`/owner`)
PIN gate → 4 stat cards → tabs:
1. **Incoming Quotes** — every lead with estimate, call + WhatsApp deep links
2. **Emergency Tickets** — SOS tickets with ETA, call + WhatsApp
3. **Repair Jobs** — progress bar + "Mark Next Stage Complete" button per job
4. **Site Photos** — `PhotoManager`: edit before/after image URLs, captions, and the
   4 gallery items; saving writes via PUT and the public site picks it up immediately.
   `onSuccess` uses `setQueryData` from the mutation response before invalidating so the
   UI can never render a read that races the write.

## Key flows
1. Cost Estimator — equipment → capacity → wire grade → add-ons; live price range.
   Name/phone/location → WhatsApp quote (POST + wa.me) or save-only. <10 digit phone → toast error.
2. ROI Calculator — HP + shift hours + tariff slider → rewind vs buy-new, savings, payback, CO₂ (client-side).
3. Job Tracker — Job ID → stages timeline + Megger readings + technician notes; unknown ID → empty state.
4. Emergency SOS modal — form → ticket ID + ETA screen, also opens WhatsApp.
5. Reviews — TanStack Query list; "Write a Review" dialog POSTs and invalidates `reviews`.
6. Owner advances a job stage → the public tracker immediately shows the new %.

## Seed data (`cd /app/backend && python seed.py` — clears then inserts)
- Jobs: `AE-2024-8901` (85%), `AE-2024-8902` (100%, complete), `AE-2024-8903` (45%)
- 5 reviews, 1 emergency dispatch (`SOS-9812`)
- Site media has code-level defaults (models/settings.py); delete the `site_settings`
  collection to restore the shipped stock imagery.

## Business facts
Proprietor Mohammad Afjal · Est. 2003 · +91 9669718100 · afjaleng@gmail.com ·
Nagar Palika Road, Tilda Neora, Raipur CG 493114 · Class-B Contractor 08/626/B ·
Wireman NR/10464 · GSTIN 22BDBPM9804K2ZH · Gumasta 000107/RPR/5/2021

## Layout / gotchas
- Fonts: Barlow Condensed (headings, Google Fonts link in index.html), IBM Plex Sans
  (body, @fontsource), JetBrains Mono (numbers).
- Headings use `uppercase`, so Playwright `innerText` assertions must be case-insensitive.
- shadcn `DialogContent` hard-codes `sm:max-w-sm`; always pass an `sm:`-prefixed width
  (e.g. `sm:max-w-xl`) plus `overflow-x-hidden [&>*]:min-w-0`, or dialogs clip.
- Navbar switches to the compact/tablet layout below `xl` (Hindi strings are longer);
  don't lower that breakpoint or the brand overlaps the nav links.
- Toaster is `position="bottom-left"` — top-right overlapped the navbar SOS button.
- WhatsApp is a `wa.me` deep link to the real number (no paid API).

## Update — Marketing pack (WhatsApp quote, lead pipeline, reviews wall)
- WhatsApp quote send: estimator's green button saves the lead then opens wa.me/919669718100 with a formatted quote; if the save fails it still opens WhatsApp with a fallback message.
- Lead pipeline: lead.status ∈ new|called|quoted|won|lost. `PATCH /api/leads/{lead_id}/status` (owner-only, Literal-validated → 422 on bad value); `GET /api/leads?status=` filter. Owner dashboard shows status pills per lead, per-stage filter row with counts, and a "Won Value" stat card. Legacy statuses (contacted/in_progress/completed) are normalized client-side in lib/leadStatus.ts.
- Reviews wall: Review gained `photo_url` and `featured`. `PATCH /api/reviews/{id}/feature` and `DELETE /api/reviews/{id}` are owner-only; list sorts featured first. New owner tab "Reviews Wall" (components/OwnerReviews.tsx) publishes reviews with a job photo, pins/unpins, deletes. Public ReviewsSection renders photo cards, a highlight border for featured, and a "With Photos" filter.
- All new strings are in lib/i18n.tsx (en+hi).
