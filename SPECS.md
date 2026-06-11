# VehicleAppointment — Project Specification

A **Progressive Web App (PWA)** that allows customers to browse and reserve specific named vehicles (bikes, 4-seaters, 7-seaters) for custom 12-hour windows. Includes a full admin dashboard for fleet and booking management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vite + React 18 + TypeScript |
| **Styling** | TailwindCSS v3 |
| **PWA** | vite-plugin-pwa (Workbox) |
| **Auth** | Firebase Authentication (Google + Facebook) |
| **Backend API** | NestJS (TypeScript) |
| **Database** | PostgreSQL (self-hosted) |
| **ORM** | Prisma |
| **Notifications** | Email (Nodemailer/SendGrid), In-app push (Web Push API), In-app Toast/Bell |

---

## User Roles

| Role | Description |
|---|---|
| **Customer** | Signs in via Google/Facebook. Can browse vehicles, make bookings, view history, cancel own bookings. |
| **Admin** | Full access to manage vehicles, view/manage all bookings, manage users. Accessed via `/admin` routes. |

---

## Core Features

### 1. Authentication (Firebase)

- Google Sign-In
- Facebook Sign-In
- Firebase ID token sent to NestJS backend → verified server-side
- First-time sign-in auto-creates a user record in PostgreSQL
- Role-based access: `CUSTOMER` (default) or `ADMIN` (set manually in DB or via admin panel)

### 2. Vehicle Catalog

Each vehicle is a **named, trackable asset**:

| Field | Example |
|---|---|
| `id` | UUID |
| `name` | "Toyota Vios #1" |
| `category` | `BIKE` / `FOUR_SEATER` / `SEVEN_SEATER` |
| `description` | "Compact sedan, automatic transmission" |
| `imageUrl` | URL to vehicle photo |
| `status` | `AVAILABLE` / `MAINTENANCE` / `RETIRED` |

- Customers browse vehicles grouped by category
- Each vehicle card shows name, photo, category, and real-time availability status
- Clicking a vehicle opens its detail page with a booking calendar

### 3. Booking System

#### Booking Flow (Customer)

1. **Sign in** via Google or Facebook
2. **Browse vehicles** — filter by category (Bike / 4-Seater / 7-Seater)
3. **Select a vehicle** → see its calendar with available/booked dates
4. **Pick a date** on the calendar
5. **Choose a custom 12-hour window** — pick a start time, end time is auto-calculated (+12h)
   - Example: Customer picks `6:00 AM` → window is `6:00 AM – 6:00 PM`
   - Example: Customer picks `2:00 PM` → window is `2:00 PM – 2:00 AM (next day)`
   - Start time selectable in **1-hour increments** (dropdown or time picker)
6. **Confirm booking** → reservation created

#### Booking Rules

- A vehicle can only have **one active booking per time slot** (no overlapping windows)
- Customers can book **up to 7 days in advance** (configurable by admin)
- Maximum **2 active bookings per customer** at any time (configurable)
- No same-day bookings (must book at least 1 day ahead)

#### Booking Statuses

| Status | Description |
|---|---|
| `PENDING` | Just created, awaiting confirmation (if admin approval required) |
| `CONFIRMED` | Booking is active and confirmed |
| `CANCELLED` | Cancelled by customer or admin |
| `COMPLETED` | Booking time has passed |
| `NO_SHOW` | Customer didn't pick up (admin marks) |

### 4. Cancellation Rules

| Who | Rule |
|---|---|
| **Customer** | Can cancel up to **24 hours** before the booking start time |
| **Admin** | Can cancel any booking at any time, with an optional reason |

- Cancelled bookings free up the vehicle's time slot immediately
- Cancellation triggers a notification to the affected party

### 5. Admin Dashboard

Accessible at `/admin` (role-gated):

| Section | Features |
|---|---|
| **Dashboard Home** | Today's bookings, upcoming bookings, quick stats (total bookings, active vehicles, etc.) |
| **Vehicle Management** | CRUD vehicles — add, edit, change status (available/maintenance/retired), upload photos |
| **Booking Management** | View all bookings (filterable by date, vehicle, status). Cancel bookings with reason. Mark as no-show. |
| **User Management** | View registered users, change roles (promote to admin), disable accounts |
| **Settings** | Configure max advance booking days, max active bookings per customer, business hours |

### 6. Notifications

| Channel | Use Case |
|---|---|
| **Email** (SendGrid/Nodemailer) | Booking confirmation, cancellation alerts, reminders (24h before) |
| **In-app Push** (Web Push API via PWA) | Real-time booking status updates, reminders |
| **In-app Toast/Bell** | Live notifications within the app (new booking, cancellation, etc.) |

---

## Data Model (Prisma Schema)

```prisma
model User {
  id            String    @id @default(uuid())
  firebaseUid   String    @unique
  email         String    @unique
  displayName   String
  photoUrl      String?
  role          Role      @default(CUSTOMER)
  isActive      Boolean   @default(true)
  bookings      Booking[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  CUSTOMER
  ADMIN
}

model Vehicle {
  id          String          @id @default(uuid())
  name        String          @unique
  category    VehicleCategory
  description String?
  imageUrl    String?
  status      VehicleStatus   @default(AVAILABLE)
  bookings    Booking[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

enum VehicleCategory {
  BIKE
  FOUR_SEATER
  SEVEN_SEATER
}

enum VehicleStatus {
  AVAILABLE
  MAINTENANCE
  RETIRED
}

model Booking {
  id                 String        @id @default(uuid())
  userId             String
  vehicleId          String
  bookingDate        DateTime      // The calendar date of the booking
  startTime          DateTime      // Exact start datetime
  endTime            DateTime      // Exact end datetime (startTime + 12h)
  status             BookingStatus @default(CONFIRMED)
  cancellationReason String?
  cancelledBy        String?       // 'CUSTOMER' or 'ADMIN'
  user               User          @relation(fields: [userId], references: [id])
  vehicle            Vehicle       @relation(fields: [vehicleId], references: [id])
  createdAt          DateTime      @default(now())
  updatedAt          DateTime      @updatedAt

  @@unique([vehicleId, startTime]) // Prevent double-booking
}

enum BookingStatus {
  CONFIRMED
  CANCELLED
  COMPLETED
  NO_SHOW
}

model AppSettings {
  id                       String @id @default("default")
  maxAdvanceBookingDays    Int    @default(7)
  maxActiveBookingsPerUser Int    @default(2)
  minHoursBeforeBooking    Int    @default(24)
  cancellationWindowHours  Int    @default(24)
}
```

---

## Project Structure

```
VehicleAppointment/
├── client/                         # Vite + React PWA
│   ├── public/
│   │   ├── icons/                  # PWA icons
│   │   └── manifest.webmanifest
│   ├── src/
│   │   ├── assets/                 # Images, fonts
│   │   ├── components/             # Reusable UI components
│   │   │   ├── ui/                 # Buttons, Cards, Modals, etc.
│   │   │   ├── layout/            # Navbar, Sidebar, Footer
│   │   │   ├── booking/           # Calendar, TimeSlotPicker, BookingCard
│   │   │   └── vehicle/           # VehicleCard, VehicleGrid
│   │   ├── pages/                  # Route-level pages
│   │   │   ├── Home.tsx
│   │   │   ├── Vehicles.tsx
│   │   │   ├── VehicleDetail.tsx
│   │   │   ├── MyBookings.tsx
│   │   │   ├── Login.tsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.tsx
│   │   │       ├── ManageVehicles.tsx
│   │   │       ├── ManageBookings.tsx
│   │   │       ├── ManageUsers.tsx
│   │   │       └── Settings.tsx
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API client, Firebase config
│   │   ├── store/                  # State management (Zustand)
│   │   ├── types/                  # TypeScript interfaces
│   │   ├── utils/                  # Helpers, date formatting
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css               # Tailwind directives
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── server/                         # NestJS Backend
│   ├── src/
│   │   ├── auth/                   # Firebase auth guard, strategy
│   │   ├── users/                  # User module (CRUD, roles)
│   │   ├── vehicles/               # Vehicle module (CRUD, availability)
│   │   ├── bookings/               # Booking module (create, cancel, list)
│   │   ├── notifications/          # Email, push notification services
│   │   ├── settings/               # App settings module
│   │   ├── prisma/                 # Prisma service, module
│   │   ├── common/                 # Guards, decorators, filters, pipes
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts                 # Seed data (sample vehicles, admin user)
│   ├── tsconfig.json
│   └── package.json
│
├── .env                            # Environment variables
├── docker-compose.yml              # PostgreSQL + optional containers
├── SPECS.md                        # This file
└── README.md
```

---

## UI / UX Design Direction

### Theme (Inspired by Z Car and Motor Rentals)

- **Dark mode primary** with glassmorphism accents
- Color palette inspired by Z Car and Motor Rentals branding:
  - **Golden Amber** (`#E8942D`) — primary CTAs, headlines, branding accents
  - **Electric Blue** (`#1E90FF`) — informational elements, navigation highlights, category badges
  - **Crimson Red** (`#D32F2F`) — alerts, cancellation states, emphasis accents
  - **Deep Black** (`#0A0A14`) — backgrounds, surfaces
- Clean, card-based layouts with warm golden-tinted borders and subtle glassmorphism
- Smooth micro-animations on hover, page transitions (Framer Motion)
- Premium automotive aesthetic — bold, sleek, and professional

### Key Pages

| Page | Description |
|---|---|
| **Landing / Home** | Hero section with call-to-action, vehicle category cards, "How it works" steps |
| **Login** | Centered card with Google + Facebook sign-in buttons, animated background |
| **Vehicles** | Grid of vehicle cards with category filter tabs, search, availability badges |
| **Vehicle Detail** | Vehicle hero image, specs, interactive calendar showing availability, time picker |
| **My Bookings** | List/card view of customer's bookings with status badges, cancel button |
| **Admin Dashboard** | Sidebar nav, stats cards, charts, data tables with sorting/filtering |

---

## Implementation Phases

### Phase 1 — Foundation & Auth
- Scaffold both `client/` and `server/` projects
- Configure TailwindCSS v3, PWA plugin, React Router
- Set up Firebase config, auth context/provider
- Build Login page with Google/Facebook sign-in
- Initialize NestJS with Prisma + PostgreSQL
- Implement Firebase auth guard (verify ID tokens)
- Create User module (auto-create user on first sign-in)

### Phase 2 — Vehicle Catalog
- Vehicle CRUD API (GET list/detail, POST/PUT/DELETE for admin)
- Vehicle grid page with category filter tabs
- Vehicle detail page with photo, description, availability calendar

### Phase 3 — Booking System
- Booking API (create with overlap validation, list, cancel)
- Interactive calendar component with availability
- Time slot picker (start time dropdown, auto-calculate 12h end)
- Booking confirmation modal
- My Bookings page with status management
- Cron job to auto-mark completed bookings

### Phase 4 — Admin Dashboard
- Dashboard with stats and charts
- Vehicle management (add/edit/retire, upload photos)
- Booking management (view all, filter, cancel, mark no-show)
- User management (view, promote/demote, disable)
- Settings page (configure booking rules)

### Phase 5 — Notifications & Polish
- Email notifications (confirmation, cancellation, reminders)
- Web Push notifications via PWA service worker
- In-app notification bell with unread count
- Framer Motion page transitions and micro-animations
- Responsive design audit (mobile, tablet, desktop)
- PWA optimization (offline caching, install prompt)
- Accessibility audit (ARIA labels, keyboard navigation)

---

## Open Questions

- **Auto-confirm vs. Admin approval**: Should bookings be automatically confirmed when a customer submits, or should an admin review and approve each booking? Recommendation: **auto-confirm** for a smoother UX, with admin ability to cancel if needed.

- **Booking overlap rule**: When a customer picks a 12-hour window that spans midnight (e.g., 2PM–2AM), should that block the vehicle for both calendar dates? Recommendation: **yes** — the system should check actual datetime overlap, not just calendar dates.

- **Vehicle photos**: Do you have vehicle photos to use, or should we generate placeholder images? We can also add an image upload feature for admins.

- **Deployment target**: Where do you plan to deploy this? (Vercel, Railway, VPS, Docker on your own server?) This will influence how we set up the Docker/CI config.
