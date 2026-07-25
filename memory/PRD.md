# Caro — PRD & Build Log

## Original problem statement
Private hire minicab (PHV) rental marketplace for London Uber drivers. Caro is the trusted middleman between drivers (who find & rent vehicles) and rental companies (who list vehicles). Phase-0 validation goal: a professional, trustworthy functional website with fake vehicle listings for market validation, driver registration + applications, operator interest capture for launch, driver & operator guide pages, a mock insurance "quote zone", anonymous operator identities (only shown after approval), and MAXIMUM user-data capture (emails, phones, contact details) for post-launch outreach.

## Architecture
- **Backend**: FastAPI + MongoDB (motor). JWT auth (httpOnly cookie `access_token` + Bearer fallback), roles: driver / operator / admin.
- **Frontend**: React 19 + Tailwind + shadcn/ui + framer-motion + sonner. React Router.
- **Design**: "caro." warm off-white/emerald premium aesthetic (Cabinet Grotesk + Satoshi), mobile-first, AutoTrader/Airbnb trust feel.

## User personas
1. **Driver (London Uber/PHV driver)** — needs to find, compare and apply for a rental car with transparent all-in weekly cost.
2. **Rental company / operator** — wants vetted drivers & operational tooling; registers interest pre-launch.
3. **Caro Ops (admin)** — needs to see & export every captured lead for outreach.

## Implemented (2026-06 / iteration 7 — tablet responsiveness + legibility)
- Fixed tablet layouts: driver/operator LOGIN left panels now visible + centered (were hidden/awkward); driver/operator REGISTRATION interactive widgets (take-home / earnings estimator) centered on tablet.
- Driver dashboard tablet grid fixed: was cramped 4-column (md:grid-cols-4), now stacks full-width below lg.
- Text-over-image legibility: added text-shadow to /driver-guide and /portal hero headings; vehicle-card borough labels already glass-pilled.
- Removed the rental cost calculator page + all links (header, footer, why-caro, driver portal); added catch-all route redirecting unknown URLs to home.
- Vehicle gallery rebuilt: functional main image + prev/next + thumbnail filmstrip (previously the main image never changed and the mosaic was irregular).
- "How it works" (/driver-guide) now alternates dark-green (#0E1A14) and light bands.
- Verified via testing agent (iteration 7): all tablet fixes pass, no issues.

## Implemented (2026-06 / iteration 6 — go-live plumbing: auth recovery, email scaffold, demand capture)
- Rebuilt driver & operator LOGIN pages on the cinematic canvas to match registration; added "Forgot password?" links.
- Password reset flow: POST /auth/forgot-password (no user enumeration) + /auth/reset-password (1h single-use token, TTL-indexed, bcrypt). Frontend /forgot-password + /reset-password pages. Verified e2e + 7 pytest cases.
- Email scaffold (backend/emailer.py, Emergent Resend): welcome email per role on signup (editable per-role document links), founder alert on every signup/interest/car-request. DEFENSIVE: no-ops silently until EMERGENT_EMAIL_KEY is provisioned; all copy/links/sender/reply-to/alert address are .env-editable (EMAIL_FROM_NAME, CONTACT_EMAIL, ALERT_EMAIL, DRIVER_DOC_URL, OPERATOR_DOC_URL, PUBLIC_BASE_URL).
- Demand capture: moved "request a car" off the search page into its own /request-a-car page (behind a button) — captures type/budget/notes, tracked as city_requests + leads for sharing with rental companies. Added budget field to CityInterestIn.
- Footer: removed "Dashboard preview"; earlier added driver/operator logins + launch-updates email capture.
- Tests: 54/54 backend, full frontend E2E green.

### Admin analytics access
URL /admin — admin@caro.co.uk / CaroAdmin2026! (see test_credentials.md).

### TODO before emails go live (needs user)
- Provision EMERGENT_EMAIL_KEY (platform) — until then emails are skipped by design.
- Register caro.uk domain, then set real CONTACT_EMAIL, ALERT_EMAIL, DRIVER_DOC_URL, OPERATOR_DOC_URL in backend/.env.
- Prepare the two welcome documents (driver + operator) and drop their URLs into the *_DOC_URL vars.

## Implemented (2026-06 / iteration 5 — cinematic registration rebuild + dashboards)
- Rebuilt driver & operator registration on a cinematic dark-emerald "canvas": layered ambient glow + grain, oversized editorial headlines, glass estimator modules, floating form cards, micro-interactions.
- Driver take-home widget: full-time only, higher realistic London minicab figures (e.g. hybrid £750/wk take-home from £1,220 fares); car-type selector drives an animated figure.
- Operator registration now CREATES AN ACCOUNT (password added) so operators can log in — verified /operator-login works with credentials created at signup. Added an email-follow-up promise (earnings/onboarding/verification) and a live vehicle-tracking mention.
- Rebuilt DRIVER dashboard as a bento grid with a strong empty state (real applications/documents/saved data). Rebuilt OPERATOR dashboard as a Fleet Command Center led by a LIVE VEHICLE-LOCATION TRACKING map (pins + live list) plus overview/fleet/applications/financials/compliance.
- Fixed text-over-image legibility: vehicle-card borough label is now a glass pill; strengthened operator-login quote scrim.
- Applied code-review fixes: removed hardcoded secrets in tests (read ADMIN_* from backend/.env), fixed array-index React keys, silenced hook-dep warnings, `is`→`==` in tests. AnimatedNumber now forwards data-testid.
- Backend: /api/admin/analytics returns a 14-day `trend`; new investor-ready Admin dashboard with a recharts growth chart. Tests: 47/47 pass.

## Implemented (2026-06 / iteration 4 — conversion polish + go-live pass)
- Removed the "Verified against TfL & Companies House" footer badge (per user request).
- Redesigned driver Register and operator Interest left rails: enticing headlines, 5-star testimonial (driver), per-car earnings teaser (operator), trust bullets, social proof counts.
- Rewrote CTA/hero copy across guides with conversion-led language ("Turn idle cars into steady, vetted income", "Your next car is minutes away").
- Operator earnings brochure (OperatorGuide) reworked into a two-column brochure with a lead "up to £14,586/yr" figure.
- DriverGuide "Ready when you are" CTA now uses a thematic driver photo.
- Mobile fixes: global overflow-x hidden; Home how-it-works image collage stagger only on sm+.
- Cleared the SearchResults useEffect eslint warning.
- Verified end-to-end data capture live: driver signup, operator interest, city-interest, analytics (page views/searches) all writing to DB and reflected in /api/admin/summary (leads 47, drivers 21, interests 10, city_requests 4, page_views 86).

## Implemented (2026-06 / iteration 2 — professional redesign pass)
- Fixed transparent dropdowns (restored shadcn CSS tokens); homepage min–max budget range slider.
- Homepage: Spotlight featured car + Browse-by-collection tiles + immersive layout.
- Header: Turo-style account dropdown (sign up/login as driver, login/register as operator, Why Caro, Calculator, Help, Legal).
- Immersive scroll-storytelling DriverGuide & OperatorGuide (replaced accordions) with imagery + motion.
- Vehicle detail: Airbnb-style photo mosaic, real OpenStreetMap map per borough, 360°/tour badges, feature chips.
- Apply flow restyled with live order-summary sidebar.
- Driver + Operator dashboards upgraded with recharts charts.
- New pages: Why Caro, Help/FAQ, Legal, Cost Calculator, Saved cars.
- Tested: 100% backend (28/28, no regression) + 100% frontend flows.

## Implemented (2026-06 / iteration 1)
- Marketplace homepage: hero + search (borough/type/fuel/budget), filter chips, sort, 12 seeded listings, stats, how-it-works, operator CTA.
- Vehicle detail: photo gallery, full spec, anonymised operator (code only), live cost breakdown panel (rent + mock Quotezone insurance + breakdown = total), sticky mobile panel, reviews.
- Driver auth (register/login/logout/me) + driver portal (demo current rental + real applications list + payments + verification).
- Multi-step apply flow (Personal → Licence → Insurance → Review) → stores application + lead.
- Operator interest / waitlist form → stores interest + lead.
- Driver guide + Operator guide pages (accordion journeys).
- Operator dashboard demo (overview/fleet/applications/financials/compliance).
- Mock insurance quote engine (/api/quote).
- Admin dashboard (/admin): summary KPIs, per-collection tables (leads/applications/interests/users/events), CSV export.
- Data capture: every registration, application, interest, listing view, search & card click logged.
- Tested: 100% backend (28/28 pytest), 100% frontend e2e flows.

## Backlog
- **P1**: Resend confirmation emails on application/interest; saved-cars page; operator real listing-creation flow; vehicle handover photo screens.
- **P1**: Real Quotezone API + Stripe Connect payments (Phase 1 per PRD).
- **P2**: Brute-force lockout on login, forgot/reset password, admin pagination, split server.py into routers.
- **P2**: Reviews system, promoted listings, analytics charts, PCN management (Phase 2).

## Next tasks
- Gather user feedback on the live validation site; wire Resend emails; add saved-cars view.

## Credentials
See /app/memory/test_credentials.md (admin: admin@caro.co.uk / CaroAdmin2026!).
