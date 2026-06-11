# VehicleAppointment

A Progressive Web App (PWA) for browsing and reserving named vehicles (bikes, 4-seaters, 7-seaters) in custom 12-hour windows, with a full admin dashboard.

- Spec: [SPECS.md](./SPECS.md)
- Plan: [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) (frontend-first, mock data → real backend)
- Design reference: Stitch exports in `.stitch/screens/`

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vite + React 18 + TypeScript, TailwindCSS v3, Zustand, Framer Motion, vite-plugin-pwa |
| Backend (later phases) | NestJS, Prisma, PostgreSQL, Firebase Auth |

## Getting started

```bash
cd client
npm install
npm run dev
```

The app currently runs entirely on mock data (no backend required). See the plan for phase status.
