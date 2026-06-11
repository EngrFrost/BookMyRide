# VehicleAppointment

A Progressive Web App (PWA) for browsing and reserving named vehicles (bikes, 4-seaters, 7-seaters) in custom 12-hour windows, with a full admin dashboard.

- Spec: [SPECS.md](./SPECS.md)
- Plan: [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) (frontend-first, mock data → real backend)
- Design reference: Stitch exports in `.stitch/screens/`

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vite + React 18 + TypeScript, TailwindCSS v3, Zustand, Framer Motion, vite-plugin-pwa |
| Backend | NestJS, Prisma, PostgreSQL, Firebase Auth |

## Getting started

### Frontend (mock demo — live at https://bookmyride.crabdance.com)

```bash
cd client
npm install
npm run dev
```

### Backend (Phase 4+)

```bash
# From repo root — start Postgres on port 5434
docker compose up -d

cd server
cp .env.example .env   # add Firebase service account fields
npm install
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev
```

API base: `http://localhost:3000/api`

| Endpoint | Auth |
|----------|------|
| `GET /health` | — |
| `GET /settings` | — |
| `GET /vehicles` | — |
| `POST /bookings` | Firebase token |
| `GET /admin/stats` | Admin |

Production uses the real API (`VITE_USE_MOCK=false`). Local dev can use mock (`VITE_USE_MOCK=true`) or wire to the backend via `client/.env.development.local`.

**CI:** GitHub Actions runs client lint/build and server lint/build/test on every push to `main`.

Handy while demoing:

- **Mock sign-in**: "Continue with Google" signs in a customer; "Continue with Facebook" signs in an admin (access `/admin`).
- **Reset demo data**: run `window.__resetMockState()` in the browser console.

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for full phase status.
