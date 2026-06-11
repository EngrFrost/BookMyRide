# VehicleAppointment — Implementation Plan (Frontend-First)

Companion to [SPECS.md](./SPECS.md). Strategy: **build the entire frontend with static/mock data first** (Phases 0–3), then build the backend (Phases 4–5), then wire them together (Phase 6) and polish (Phase 7).

Design reference: Stitch project **VehicleAppointment** (`4096618961977056422`) — HTML exports live in `.stitch/screens/`.

**Design note (decided):** The **golden-amber "Z Rentals" direction** is the chosen palette — matching SPECS.md §UI/UX (golden amber `#E8942D` CTAs, electric blue `#1E90FF` info accents, deep black `#0A0A14` surfaces) and the `*-zrentals` / `home-b` / `signin-premium` Stitch screens. Layout, typography (Plus Jakarta Sans), glassmorphism, and pill shapes follow the Stitch design system; the blue "Aura Drive" `*-a` screen variants are kept only as layout references.

**Mock-data approach:** All data flows through a `services/api.ts` interface from day one. Phases 0–3 back it with an in-memory mock implementation (`services/mockApi.ts` + `mocks/*.ts` fixtures, simulated latency, persisted to `localStorage` so interactions feel real). Phase 6 swaps the implementation for real HTTP calls — pages and components don't change.

## Status

| Phase | Status |
|---|---|
| 0 — Client Scaffolding & Design System | ✅ **Complete** (2026-06-11) |
| 1 — Static Pages: Public & Auth | ✅ **Complete** (2026-06-11) |
| 2 — Booking UX | ✅ **Complete** (2026-06-11) |
| 3 — Admin Dashboard UI | ✅ **Complete** (2026-06-11) |
| 4 — Backend Foundation | 🔜 Next |
| 5 — Backend Domain APIs | ⬜ Not started |
| 6 — Wire Frontend to Backend | ⬜ Not started |
| 7 — Notifications, PWA & Polish | ⬜ Not started |

First commit pushed to [github.com/EngrFrost/BookMyRide](https://github.com/EngrFrost/BookMyRide).

---

## Phase 0 — Client Scaffolding & Design System ✅

> Goal: Vite app running with the design theme fully tokenized.

### Tasks

- [x] Initialize git repo, `.gitignore`, `README.md`
- [x] Scaffold `client/` — Vite + React 18 + TypeScript
- [x] TailwindCSS v3 configured with the Z Rentals tokens:
  - colors (deep-black surface scale, primary amber `#e8942d`, secondary electric blue `#1e90ff`, functional success/warning/danger)
  - typography scale (headline-xl → label-sm, Plus Jakarta Sans via `@fontsource-variable`)
  - radii (`sm` 0.5rem → `full`), gradient/glow/ambient shadows, glass utilities (`.glass`, `.glass-elevated`)
- [x] Base UI kit in `components/ui/` matching the design system:
  - `Button` (gradient primary w/ glow hover, secondary, ghost, outline, danger), `GlassCard`, `Badge` (status tone maps), `Input`, `Select`, `Modal`, `Toast` (zustand store + `toast.*` helpers), `Skeleton`, `Avatar`, `Tabs` (animated indicator)
- [x] React Router v6, Zustand, Framer Motion installed and wired
- [x] `vite-plugin-pwa` stub (manifest, theme color `#0a0a14`; final icons in Phase 7)
- [x] TypeScript domain types in `types/` mirroring the SPECS Prisma schema (User, Vehicle, Booking, AppSettings, enums)
- [x] `services/api.ts` interface + full `services/mockApi.ts`, `mocks/` fixtures folder

### Exit criteria — met

- ✅ `/styleguide` dev route renders the full UI kit on the dark glass theme
- ✅ `npm run dev` + `npm run build` clean

---

## Phase 1 — Static Pages: Public & Auth (mock data) ✅

> Goal: all customer-facing pages pixel-faithful to the Stitch screens, fed by fixtures.

### Tasks

- [x] App shell: Navbar (logo, links, avatar menu w/ admin link + sign-out) + Footer; mobile hamburger nav
- [x] **Home** from `.stitch/screens/home-b.html` — hero, category cards, "How it works", CTA strip
- [x] **Sign In** from `.stitch/screens/signin-premium.html` — animated ambient background, Google/Facebook buttons (mock: Google → customer fixture, Facebook → admin fixture, persisted in localStorage)
- [x] **Our Fleet** from `.stitch/screens/fleet-b.html` — vehicle grid, category filter tabs (synced to `?category=` URL param), search, availability/status badges, maintenance/retired overlays
- [x] **Vehicle Detail** from `.stitch/screens/vehicle-detail-zrentals.html` — hero image w/ gradient overlay, badges, full booking panel (Phase 2)
- [x] Mock fixtures: 8 vehicles across all categories incl. `MAINTENANCE`/`RETIRED`, 4 mock users (customer + admin + extras)
- [x] Mock auth store: signed-out/customer/admin states, `RequireAuth`/`RequireAdmin` guards working against mock role
- [x] `/my-bookings` route behind auth guard (booking list in Phase 2); `/admin` stub (Phase 3)

### Exit criteria — met

- ✅ Full click-through: Home → Fleet → filter/search → Vehicle Detail; mock sign-in/out toggles navbar state
- ✅ Responsive on mobile/tablet/desktop; verified in browser + production build passes

---

## Phase 2 — Booking UX (mock data, fully interactive) ✅

> Goal: the complete booking experience working against the mock store — rules and all.

### Tasks

- [x] **Availability calendar** (`components/booking/AvailabilityCalendar.tsx`) — month navigation, free/partial/full/disabled day states from mock bookings + `AppSettings` (24h lead, 7-day advance)
- [x] **Time slot picker** (`components/booking/TimeSlotPicker.tsx`) — hourly start times, overlap filtering, +12h window preview with next-day indicator
- [x] **Booking panel** (`components/booking/BookingPanel.tsx`) — wires calendar + picker on Vehicle Detail; sign-in gate; confirm flow
- [x] **Booking confirmation modal** (`components/booking/BookingConfirmationModal.tsx`) — summary → confirm → toast → redirect to My Bookings
- [x] **My Bookings** (`pages/MyBookings.tsx`) — filter tabs (All / Upcoming / Completed / Cancelled), `BookingCard` grid, cancel modal with optional reason, rebook link for cancelled
- [x] **Date utilities** (`utils/dates.ts`) — overlap checks, slot generation, formatting shared with mock API rules
- [x] Implement booking rules **in the mock API** — *done in Phase 0*:
  - no overlapping windows (real datetime-interval check, incl. cross-midnight)
  - max 7 days advance, max 2 active bookings, min 24h lead time
  - cancel allowed only >24h before start (admin bypasses, with reason)
- [x] Friendly validation errors surfaced as toasts (create/cancel failures from mock API)
- [x] Mock bookings persist to localStorage — *done in Phase 0* (`window.__resetMockState()` dev helper)

### Exit criteria — met

- ✅ End-to-end mock booking: pick vehicle → date → window → confirm → appears in My Bookings → cancel frees the slot
- ✅ Rule violations blocked with clear toast messaging (overlap, lead time, max active, cancellation window)

---

## Phase 3 — Admin Dashboard UI (mock data) ✅

> Goal: full `/admin` area working against the mock store.

### Tasks

- [x] Admin layout (`components/admin/AdminLayout.tsx`) — sidebar nav, mobile drawer, header, separate from public `Layout`; nested routes under `/admin`
- [x] **Dashboard Home** (`pages/admin/Dashboard.tsx`) — stat cards, today's bookings table, 7-day bar chart via `getAdminStats()`
- [x] **Vehicle Management** (`pages/admin/ManageVehicles.tsx`) — data table, create/edit modal, delete, image URL field
- [x] **Booking Management** (`pages/admin/ManageBookings.tsx`) — filter by status/vehicle/date, admin cancel with reason, mark `NO_SHOW`
- [x] **User Management** (`pages/admin/ManageUsers.tsx`) — promote/demote role, enable/disable (self-guarded)
- [x] **Settings** (`pages/admin/Settings.tsx`) — booking rules form; changes persist to mock store and affect validation immediately

### Exit criteria — met

- ✅ Full admin ops loop on mock data: add vehicle → customer books it → admin cancels with reason → customer sees cancellation
- ✅ **Frontend demo complete** — entire app click-through-able with zero backend

---

## Phase 4 — Backend Foundation (NestJS + Prisma + Auth)

> Goal: real server with schema, auth, and user management.

### Tasks

- [ ] `docker-compose.yml` with PostgreSQL 16 (volume, healthcheck)
- [ ] Scaffold `server/` — NestJS; config module, global validation pipe, CORS
- [ ] Prisma schema from SPECS.md, first migration, `seed.ts` (vehicles matching the mock fixtures, admin user)
- [ ] Firebase Admin SDK + `FirebaseAuthGuard` (verify ID tokens), `@CurrentUser()`, `RolesGuard`
- [ ] Users module: upsert-on-first-login by `firebaseUid`, `GET /api/users/me`, admin role/status endpoints
- [ ] `.env.example` for both apps

### Exit criteria

- `GET /api/health` OK; token-authenticated `GET /api/users/me` auto-creates the user row

---

## Phase 5 — Backend Domain APIs

> Goal: every endpoint the frontend mock implements, for real.

### Tasks

- [ ] **Vehicles**: `GET /api/vehicles` (category/status filters), `GET /:id`; admin `POST/PATCH/DELETE`; photo upload (multipart → local disk or S3-compatible, served statically)
- [ ] **Bookings**:
  - `POST /api/bookings` — transaction + unique constraint; validations identical to the mock rules (overlap incl. cross-midnight, advance window, active-booking cap, lead time, vehicle `AVAILABLE`)
  - `GET /api/bookings/me`, `GET /api/vehicles/:id/availability?from&to`
  - `PATCH /api/bookings/:id/cancel` (customer 24h rule; admin anytime with reason), mark `NO_SHOW`
  - admin list with date/vehicle/status filters; stats aggregation endpoint
- [ ] **Settings**: `GET/PATCH /api/settings` (admin), defaults seeded
- [ ] Cron (`@nestjs/schedule`): auto-mark `COMPLETED` past `endTime`
- [ ] Unit tests for booking validation logic (overlap matrix, rules)

### Exit criteria

- All endpoints exercised via REST client; double-booking race prevented; validation tests green

---

## Phase 6 — Wire Frontend to Backend

> Goal: swap mock for real with minimal component changes.

### Tasks

- [ ] Real Firebase client auth (Google + Facebook popup) replacing mock sign-in; token interceptor on API client
- [ ] Implement `services/httpApi.ts` fulfilling the same `api.ts` interface; flip the provider (env flag `VITE_USE_MOCK` for fallback/demo mode)
- [ ] Replace localStorage persistence with server state; add loading skeletons / error states where latency now matters
- [ ] Align seed data with mock fixtures so the UI looks identical post-switch
- [ ] End-to-end pass of every flow from Phases 1–3 against the real stack; fix contract drift

### Exit criteria

- Full happy path on real data: sign in with Google → browse → book → see in My Bookings → admin cancels → customer sees it
- Mock mode still works via env flag (useful for demos/tests)

---

## Phase 7 — Notifications, PWA & Polish

> Goal: production-ready.

### Tasks

**Notifications**
- [ ] Notifications module (channel abstraction); `Notification` Prisma model
- [ ] Email (Nodemailer/SendGrid): confirmation, cancellation, 24h-before reminder (cron)
- [ ] Web Push: VAPID keys, subscribe endpoint, service worker push handler, sensible permission prompt timing
- [ ] In-app bell: unread count, dropdown, mark-as-read; toasts on live events

**PWA & polish**
- [ ] Workbox runtime caching (API network-first, assets cache-first), offline fallback, custom install prompt, final icons
- [ ] Framer Motion page transitions + micro-animations (button glow, card hovers) per design system
- [ ] Accessibility audit (ARIA, focus, keyboard nav, contrast on glass surfaces)
- [ ] Security pass: rate limiting, helmet, input validation review
- [ ] Deployment (target TBD): Dockerfiles, production compose or platform config, CI (lint + build + test)

### Exit criteria

- Booking create/cancel fires email + push + bell
- Lighthouse: installable PWA, performance ≥ 90 on key pages

---

## Order & Dependencies

```
            FRONTEND (static/mock)                    BACKEND                 INTEGRATION
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6 ──► Phase 7
   │                                                │
   └── .stitch/screens/*.html (visual reference)    └── can start in parallel with Phases 2–3
```

- After **Phase 3** you have a complete, demoable app with zero infrastructure.
- Phases 4–5 can run in parallel with 2–3 if desired (the `api.ts` interface is the contract).

---

## Decisions Locked In (from SPECS Open Questions)

| Question | Decision |
|---|---|
| Auto-confirm vs admin approval | **Auto-confirm** (`CONFIRMED` on create); admin can cancel |
| Cross-midnight overlap | **Real datetime-interval overlap check**, not calendar-date |
| Vehicle photos | Mock/seed placeholders; admin upload arrives in Phase 5 |
| Deployment target | **TBD** — decide before Phase 7 |
