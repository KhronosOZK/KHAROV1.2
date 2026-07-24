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
