# Afjal Electrical and Rewinding Works — Marketing Site Spec

## What the app does
Single-page marketing/lead-gen site for a motor rewinding + Class-B electrical contracting
business in Tilda Neora, Raipur (Chhattisgarh). Dark "Modern Industrial Electric" theme.
No auth, no login — fully public site.

## Public URL
https://website-pro-37.preview.emergentagent.com

## Backend (FastAPI, all routes on api_router under /api)
- `GET  /api/` — business info ping
- `POST /api/leads` — create lead from cost estimator (returns `id` like `LEAD-XXXXXXXX`)
- `GET  /api/leads` — list leads
- `GET  /api/leads/{id}`
- `POST /api/emergency-dispatch` — SOS ticket (returns `id` like `SOS-1234`, `eta_minutes` computed from location)
- `GET  /api/emergency-dispatch`, `GET /api/emergency-dispatch/{id}`
- `GET  /api/jobs/{job_id}` — job status lookup by Job ID / phone (404 if not found)
- `GET  /api/jobs`, `POST /api/jobs`
- `GET  /api/reviews`, `POST /api/reviews`
- `GET  /api/stats` — workshop stats

Models: backend/models/{leads,emergency,jobs,reviews,stats}.py
Routers: backend/routers/{leads,emergency,jobs,reviews,stats}.py
TS mirrors: frontend/src/types/index.ts

## Frontend sections (single page `/`, frontend/src/pages/Home.tsx)
Navbar → Hero → TrustMarquee → ServicesBento → CostEstimator → RoiCalculator →
BeforeAfterShowcase → JobTrackerView → ServiceCoverage → LicensesCompliance →
ReviewsSection → Footer, plus EmergencyDispatchModal, CompanyBrochureModal, FloatingActions.

## Key flows
1. **Cost Estimator** (`#estimator`): pick equipment type → capacity → wire grade → add-ons;
   live price range recalculates. Enter name/phone/location → "Send to WhatsApp & Get Official
   Quote" (POSTs /api/leads then opens wa.me) or "Save Quote & Register Workshop Slot"
   (POST only). Phone < 10 digits shows a toast error.
2. **ROI Calculator** (`#roi-calculator`): HP + shift hours + tariff slider → rewind vs buy-new
   comparison, savings, payback, CO2. Client-side only.
3. **Job Tracker** (`#tracker`): enter Job ID → GET /api/jobs/{id} → stages timeline, Megger
   test readings table, technician notes. Unknown ID → "No Active Job Found" empty state.
4. **Emergency SOS modal**: form → POST /api/emergency-dispatch → ticket ID + ETA screen,
   also opens WhatsApp.
5. **Reviews** (`#reviews`): TanStack Query list from /api/reviews; "Write a Review" dialog
   POSTs and invalidates the `reviews` query key.

## Seed data (backend/seed.py — idempotent, clears then inserts)
- Job IDs: `AE-2024-8901` (85%, 50 HP motor), `AE-2024-8902` (100%, 25 HP submersible),
  `AE-2024-8903` (45%, 100 HP slip-ring)
- 5 reviews, 1 emergency dispatch (`SOS-9812`)

## Business facts used across the site
Proprietor Mohammad Afjal · Est. 2003 · Phone +91 9669718100 · afjaleng@gmail.com ·
Nagar Palika Road, Tilda Neora, Raipur CG 493114 · Class-B Contractor 08/626/B ·
Wireman NR/10464 · GSTIN 22BDBPM9804K2ZH · Gumasta 000107/RPR/5/2021

## Notes
- Fonts: Barlow Condensed (headings, via Google Fonts link in index.html), IBM Plex Sans
  (body, @fontsource), JetBrains Mono (numbers, @fontsource).
- WhatsApp deep links go to wa.me/919669718100 — real number, opens a new tab (no API).
