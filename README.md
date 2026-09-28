# CLUBVERSE

CLUBVERSE is a college club event management web platform designed to streamline campus activity discovery and participation. Students can explore upcoming campus events, filter by category, register without requiring accounts, and access digital entry tickets, while club organizers manage event listings and attendee rosters through an authenticated admin portal.

**Live Deployment:** [https://clubverse-three.vercel.app](https://clubverse-three.vercel.app)

---

## Features

### Student / Public Experience
- **Home Showcase:** Hero overview, quick category pills, featured campus highlights, and event discovery statistics.
- **Events Catalog:** Real-time list of all upcoming campus events with live attendee counts and category tags.
- **Search & Filtering:** Keyword search across titles and descriptions paired with category-based filtering (Technical, Cultural, Sports, Workshop, Seminar, Hackathon).
- **Event Details:** Dedicated event page displaying schedule, time, venue, full description, and quick registration trigger.
- **Seamless Registration:** Streamlined RSVP form collecting student details (Name, Email, College/Department, Year of Study, Phone) without requiring account creation.
- **Immediate Confirmation:** Post-registration success screen providing registration ID and direct links to view tickets or browse more events.
- **My Registrations:** Email-based lookup portal allowing students to retrieve all events they have registered for across sessions.
- **Digital Event Tickets:** Formatted digital entry ticket with attendee and schedule details, confirmed status badge, and browser print support (`window.print()`).
- **Responsive Design:** Consistent Mint Breeze aesthetic optimized across mobile, tablet, and desktop screens.

### Admin Portal
- **Secure Authentication:** Admin login verified against bcrypt-hashed credentials with JWT session management.
- **Admin Dashboard:** High-level metrics tracking total events, upcoming activities, and total student registrations.
- **Event Management (CRUD):** Interface to create new club events, update schedules and venues, and delete outdated entries.
- **Attendee Directory:** Filterable attendee lists per event, displaying student names, departments, contact numbers, and registration timestamps.
- **Protected Routing:** Client-side route guard (`ProtectedRoute`) redirecting unauthenticated requests to `/admin/login`.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 8, React Router v7 (`react-router-dom`), Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React icons |
| **Backend** | Node.js (ES Modules), Express 4, CORS middleware |
| **Database** | PostgreSQL hosted on Supabase, `@supabase/supabase-js` |
| **Authentication & Security** | JSON Web Tokens (`jsonwebtoken`), Bcrypt password hashing (`bcryptjs`), Bearer token middleware |
| **Hosting & Deployment** | Frontend on Vercel, Backend on Render, Database on Supabase |
| **Tooling & Quality** | ESLint 10, Vite build pipeline |

---

## Architecture

```
Student / Admin Browser
         │
         ▼
Vercel React Frontend (SPA)
         │  HTTPS REST API calls (configured via VITE_API_URL)
         ▼
Render Express Backend (REST API)
         │  PostgreSQL queries via Supabase Client
         ▼
Supabase PostgreSQL Database
```

- **Frontend:** React Single Page Application hosted on Vercel. Handles client-side navigation through React Router and communicates with the backend via a centralized fetch wrapper (`apiRequest`).
- **Backend:** Express REST API deployed as a web service on Render. Manages request validation, authentication, CORS policies, and business logic.
- **Database:** Supabase-managed PostgreSQL instance storing events, attendee registrations, and admin user credentials.
- **Security Boundary:** Frontend code contains no database credentials or private keys. The backend communicates with Supabase using server-only environment variables.

---

## Database

The database consists of three relational tables defined in `server/src/db/schema.sql`:

| Table | Description | Key Columns |
|---|---|---|
| `events` | Stores campus club activities, workshops, competitions, and seminars. | `id` (UUID PK), `title`, `description`, `category`, `date`, `time`, `venue`, `image_url`, `is_featured`, `created_at` |
| `registrations` | Captures student RSVPs associated with specific events. | `id` (UUID PK), `event_id` (FK &rarr; `events.id` ON DELETE CASCADE), `name`, `email`, `college`, `year`, `phone`, `registered_at` |
| `admins` | Stores club executive credentials for back-office access. | `id` (UUID PK), `email` (UNIQUE), `password_hash`, `created_at` |

### Key Relationships
- **`events` &rarr; `registrations` (1:N):** Each registration references a valid event via foreign key (`event_id`). If an event is deleted by an administrator, associated registrations are removed via `ON DELETE CASCADE`.
- **Indexing:** Dedicated B-tree indices on `events(date)`, `events(category)`, `events(is_featured)`, `registrations(event_id)`, and `registrations(email)` optimize query performance.

---

## Project Structure

```
CLUBVERSE/
├── client/                      # Vite + React Frontend
│   ├── public/                  # Static assets and icons (favicon.svg, icons.svg)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # LoadingState, EmptyState, ErrorState, ProtectedRoute
│   │   │   ├── events/          # EventCard, FeaturedEventCard, EventFilterBar
│   │   │   └── layout/          # Navbar, Footer, AdminLayout
│   │   ├── context/             # AuthContext, useAuth hook
│   │   ├── pages/
│   │   │   ├── admin/           # AdminLogin, Dashboard, Events, EventForm, Registrations
│   │   │   └── public/          # Home, Events, EventDetail, EventRegister, MyRegistrations, EventTicket
│   │   ├── services/            # api.js, eventService, registrationService, authService, adminService
│   │   ├── App.jsx              # Application router and public layout wrapper
│   │   ├── index.css            # Tailwind CSS v4 entry point
│   │   └── main.jsx             # React DOM root entry
│   ├── .env.example             # Frontend environment documentation
│   ├── package.json             # Frontend dependencies and build scripts
│   ├── vercel.json              # Vercel SPA rewrite configuration
│   └── vite.config.js           # Vite and Tailwind plugin configuration
├── server/                      # Express REST API Backend
│   ├── src/
│   │   ├── config/              # env.js, supabase.js
│   │   ├── controllers/         # authController, eventController, registrationController
│   │   ├── db/                  # schema.sql (table definitions and seed data)
│   │   ├── middleware/          # authMiddleware, errorMiddleware
│   │   ├── routes/              # index, authRoutes, eventRoutes, registrationRoutes
│   │   ├── services/            # authService, eventService, registrationService
│   │   └── app.js               # Express application setup and CORS rules
│   ├── .env.example             # Backend environment documentation
│   ├── index.js                 # Server entry point
│   └── package.json             # Backend dependencies and run scripts
├── architecture.md              # Technical architecture reference
└── README.md                    # Project documentation
```

---

## Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- A Supabase project with `server/src/db/schema.sql` applied

### 1. Clone the Repository
```bash
git clone https://github.com/VanshSaxena1307/CLUBVERSE.git
cd CLUBVERSE
```

### 2. Backend Setup
Open a terminal in the `server/` directory:
```bash
cd server
npm install
```

Create a local environment file:
```bash
cp .env.example .env
```
Update `server/.env` with your Supabase credentials (see [Environment Variables](#environment-variables)).

Start the backend server:
```bash
npm run dev
```
The backend starts at `http://localhost:5000`. Verify with `http://localhost:5000/api/health`.

### 3. Frontend Setup
Open a second terminal in the `client/` directory:
```bash
cd client
npm install
```

Create a local environment file:
```bash
cp .env.example .env
```
Ensure `VITE_API_URL` is set to `http://localhost:5000/api`.

Start the frontend development server:
```bash
npm run dev
```
The frontend starts at `http://localhost:5173`. Open this URL in your browser.

---

## Environment Variables

### Frontend Variables (`client/.env`)
These variables are prefixed with `VITE_` and are bundled into client-side code at build time. Never place secrets here.

| Variable | Description | Example (Local) | Example (Production) |
|---|---|---|---|
| `VITE_API_URL` | Base endpoint URL for the backend API | `http://localhost:5000/api` | `https://<render-service-name>.onrender.com/api` |

### Backend Variables (`server/.env`)
These variables remain strictly on the server and are never exposed to the browser.

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Local server port | `5000` |
| `CLIENT_URL` | Allowed CORS origin(s), comma-separated | `http://localhost:5173` (local) / `https://clubverse-three.vercel.app` (production) |
| `SUPABASE_URL` | Supabase project API URL | `https://your-project.supabase.co` |
| `SUPABASE_SECRET_KEY` | Supabase service role key (or `SUPABASE_SERVICE_ROLE_KEY`) | `your-supabase-service-role-key` |
| `JWT_SECRET` | Secret key used to sign admin session tokens | `your_secure_jwt_secret_key` |
| `JWT_EXPIRES_IN` | Token validity duration | `24h` |

---

## Deployment

The project is structured for independent frontend and backend hosting:

1. **Frontend (Vercel):**
   - Deployed at: [https://clubverse-three.vercel.app](https://clubverse-three.vercel.app)
   - Configuration file: `client/vercel.json` provides an SPA rewrite rule (`"source": "/(.*)", "destination": "/index.html"`) ensuring direct visits to routes like `/events` and `/my-registrations` load the application without 404 errors.
   - Connected to backend via the `VITE_API_URL` environment variable configured in Vercel project settings.

2. **Backend (Render):**
   - Deployed as a Node Web Service running `node index.js`.
   - CORS is configured in `server/src/app.js` to accept requests from `https://clubverse-three.vercel.app` and local dev environments.

3. **Database (Supabase):**
   - Managed PostgreSQL instance hosting the schema and seed records from `server/src/db/schema.sql`.

---

## Demo Admin Access

For evaluation and testing purposes, default credentials are seeded in `server/src/db/schema.sql`:

- **Admin Login URL:** `/admin/login`
- **Email:** `admin@clubverse.edu`
- **Password:** `Admin@ClubVerse2026`

> **Note:** These are demonstration credentials seeded for review and recruitment evaluation. Passwords in `schema.sql` are securely stored as salted bcrypt hashes.

---

## API Overview

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/health` | Service health check | Public |
| `GET` | `/api/events` | List all events (supports `search`, `category`, and `featured` query params) | Public |
| `GET` | `/api/events/:id` | Fetch detailed information for a single event | Public |
| `POST` | `/api/events/:id/register` | Register student for an event (convenience route) | Public |
| `POST` | `/api/registrations` | Submit a student RSVP registration | Public |
| `GET` | `/api/registrations/by-email` | Lookup registrations and event info by student email | Public |
| `GET` | `/api/registrations/:id/ticket` | Retrieve single registration ticket details | Public |
| `POST` | `/api/auth/login` | Authenticate admin credentials and return JWT | Public |
| `POST` | `/api/events` | Create a new club event | Admin (JWT required) |
| `PUT` | `/api/events/:id` | Update an existing event | Admin (JWT required) |
| `DELETE` | `/api/events/:id` | Delete an event and cascading registrations | Admin (JWT required) |
| `GET` | `/api/registrations` | Fetch all event registrations (optional `eventId` filter) | Admin (JWT required) |
| `GET` | `/api/registrations/:id` | Inspect a single registration record | Admin (JWT required) |

---

## User Flow

### Student Flow
```
Browse Events (/events)
      │
      ▼
Filter / Search Events (by category or title keyword)
      │
      ▼
Open Event Details (/events/:id)
      │
      ▼
Submit Registration Form (/events/:id/register)
      │
      ▼
Registration Confirmed Screen
      │
      ├───────────────────────────────┐
      ▼                               ▼
View Digital Ticket              My Registrations Portal
(/my-registrations/:id/ticket)   (/my-registrations?email=...)
      │                               │
      ▼                               ▼
Print Ticket (window.print())    Re-access all confirmed tickets
```

### Admin Flow
```
Admin Login (/admin/login)
      │  (Validate bcrypt hash & issue JWT)
      ▼
Admin Dashboard (/admin)
      │
      ├───────────────────────────────┐
      ▼                               ▼
Manage Events (/admin/events)    View Registrations (/admin/registrations)
- Create new event               - Filter attendees by event
- Edit event details             - Review student contact information
- Delete event listings          - Track signup timestamps
```

---

## Production Notes

- **SPA Rewrites:** `client/vercel.json` ensures that direct browser navigations and page refreshes on subroutes (e.g., `/events`, `/admin/login`, `/my-registrations`) route cleanly to `index.html`.
- **CORS Allowlist:** `server/src/app.js` permits requests from `https://clubverse-three.vercel.app`, preview domains, and local development origins (`http://localhost:5173`, `http://localhost:5174`).
- **Endpoint Normalization:** The client API service (`client/src/services/api.js`) automatically strips trailing slashes and ensures the `/api` route prefix is applied regardless of how `VITE_API_URL` is formatted.
- **Relational Integrity:** Foreign keys enforce strict relational integrity with automatic cascade deletions on linked registrations.

---

## Screenshots

> Screenshots can be captured directly from the live deployment at [https://clubverse-three.vercel.app](https://clubverse-three.vercel.app). Visual documentation may be added to this section in future updates.

---

## Future Improvements

1. **Automated Email Notifications:** Dispatch email confirmations with calendar invite files (`.ics`) upon successful event registration.
2. **QR Code Attendance Validation:** Add scannable QR verification codes to digital tickets for event check-in tracking.
3. **Attendee CSV Export:** Enable one-click CSV export of attendee rosters directly from the admin registrations page.
4. **Capacity Limits & Waitlisting:** Allow club admins to define maximum seat capacities with automated waitlisting.

---

## Author

**Vansh Saxena**  
GitHub: [@VanshSaxena1307](https://github.com/VanshSaxena1307)  
Repository: [CLUBVERSE](https://github.com/VanshSaxena1307/CLUBVERSE)

---

## License

This project was developed for a college club recruitment assignment. All rights reserved.