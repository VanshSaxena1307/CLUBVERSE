# Architecture & Technical Design Document

**Project:** College Club Event Management Web Application  
**Theme:** Mint Breeze (Clean, Light, Modern Academic Aesthetic)  
**Timeline:** 28 September 2026 – 30 September 2026 (Recruitment Task Deadline)  
**Document Status:** Locked Architecture Specification  

---

## 1. Project Overview

The College Club Event Management platform is a responsive, dual-interface full-stack web application designed for campus student clubs. It serves two distinct personas:

1. **Club Members & College Students (Public Users):** Discover club initiatives, explore upcoming and featured events, search/filter offerings, and register for events quickly without requiring account creation.
2. **Club Administrators (Organizers/Executive Board):** Access a secure, password-protected administrative back-office to create, update, and delete events, as well as review, search, and filter student registrations in real-time.

The architecture emphasizes rapid development speed, simplicity, rock-solid maintainability, and clean separation of concerns to ensure complete, bug-free delivery within the strict 48-hour development window.

---

## 2. Goals

- **Rapid Time-to-Delivery:** Built using high-productivity tools (Vite, React, Express, Supabase PostgreSQL) to finish and test before September 30, 2026.
- **Frictionless Student Registration:** Low-barrier event signups requiring only essential contact details without login walls.
- **Reliable Admin Event Lifecycle:** Straightforward CRUD capabilities for event schedules, venues, and descriptions.
- **Consistent Mint Breeze Aesthetics:** A light, soft-mint visual system with clear typography, accessible contrast, and zero visual clutter.
- **Responsive by Default:** Full usability across mobile devices, tablets, laptops, and wide desktops.
- **Robust Error & State Handling:** Explicit visual feedback for loading, empty datasets, network errors, and form validation.

---

## 3. Non-Goals

The following items are strictly out of scope for this recruitment submission:
- **No Student Authentication:** No student accounts, password resets, email verification, or OTP flows.
- **No Complex RBAC:** Single admin credential/role model; no granular permissions or multi-club hierarchies.
- **No Payment Gateway:** All events are treated as free campus activities.
- **No Automated Email/SMS Dispatchers:** No transactional email microservices or SMS triggers.
- **No WebSockets or Real-Time Push:** Data updates rely on standard HTTP request-response and query refetching.
- **No Microservices or Message Brokers:** Monolithic Node/Express backend.
- **No File Upload Infrastructure (S3/Cloudinary):** Image URLs are supplied as static links or direct CDN strings.
- **No Complex Global State Stores:** No Redux or MobX; standard React context and hook-based local state are sufficient.
- **No Cyberpunk / Neon / Heavy Dark Mode:** Dark heavy or neon styling is prohibited; the design remains anchored in the Mint Breeze aesthetic.

---

## 4. High-Level Architecture

The system follows a classic 3-tier web architecture:

```
+-------------------------------------------------------------------+
|                        Client Browser                             |
|  - Desktop / Tablet / Mobile Viewports                            |
|  - Mint Breeze Design System (Tailwind CSS)                       |
+---------------------------------+---------------------------------+
                                  |
                                  | HTTPS / JSON
                                  v
+---------------------------------+---------------------------------+
|               Frontend Application (Vite + React)                 |
|  - React Router DOM (Public & Protected Routes)                   |
|  - Modular Feature Pages & Reusable UI Components                 |
|  - Centralized API Service Layer (Axios / Fetch)                  |
|  - Auth State via Context + LocalStorage Token                     |
+---------------------------------+---------------------------------+
                                  |
                                  | REST API Calls (/api/*)
                                  | Bearer JWT (Admin Only)
                                  v
+---------------------------------+---------------------------------+
|                 Backend API Server (Node.js + Express)            |
|  - JSON Body Parsing & CORS Configuration                         |
|  - Clean Route -> Controller -> Service Flow                      |
|  - Lightweight JWT Authentication Middleware                      |
|  - Request Validation & Centralized Error Handler                 |
+---------------------------------+---------------------------------+
                                  |
                                  | Connection Pooling / Supabase JS
                                  v
+---------------------------------+---------------------------------+
|             Database Layer (Supabase PostgreSQL)                 |
|  - Relational Schemas: events, registrations, admins              |
|  - Foreign Key Constraints & Data Integrity                       |
|  - Indexed Queries (category, date, event_id)                     |
+-------------------------------------------------------------------+
```

---

## 5. Application Modules

### 5.1 Public / User Module
- Delivers the club landing experience: club introduction, hero section, key highlights, and featured events showcase.
- Provides navigation between Home, Events Listing, and Event Details.

### 5.2 Event Module
- Manages reading, filtering, displaying, and mutating event entities.
- Public actions: View active/upcoming events, view single event details, search and filter.
- Admin actions: Create new events, edit event details, mark as featured, delete events.

### 5.3 Registration Module
- Handles student sign-up requests for individual events.
- Captures participant name, student email, college/year, and phone number.
- Links registrations relationally to active events.
- Provides administrators with exportable/reviewable lists of attendees.

### 5.4 Admin Module
- Houses the authenticated back-office workspace.
- Displays summary metrics (total events, upcoming events, total registrations).
- Lists events with quick action toggles (Edit, Delete, View Attendees).
- Houses registration search, event-specific registration filtering, and attendee tables.

### 5.5 Authentication Module
- Scoped exclusively to administrators.
- Authenticates email and hashed password via a single login endpoint.
- Issues a compact signed JSON Web Token (JWT) retained in the client's secure browser storage for subsequent administrative operations.

---

## 6. Frontend Structure

A flat, practical folder structure optimized for developer productivity:

```
src/
├── assets/                  # SVG icons, club logos, static illustrations
├── components/
│   ├── common/              # Shared UI: Button, Input, Modal, Badge, Spinner
│   ├── layout/              # Navbar, Footer, AdminSidebar, PageContainer
│   ├── events/              # EventCard, EventGrid, EventFilterBar, FeaturedEventCard
│   └── admin/               # RegistrationTable, EventFormModal, StatCard
├── context/
│   └── AuthContext.jsx      # Admin auth state, token sync, login/logout handlers
├── hooks/
│   ├── useEvents.js         # Fetching, searching, and mutating event data
│   └── useRegistrations.js  # Registration operations and admin attendee views
├── pages/
│   ├── public/
│   │   ├── HomePage.jsx             # Club intro, hero, featured & upcoming preview
│   │   ├── EventsPage.jsx           # Full event catalog with search and filters
│   │   ├── EventDetailPage.jsx      # In-depth event information & schedule
│   │   └── EventRegisterPage.jsx    # Clean registration form with instant validation
│   └── admin/
│       ├── AdminLoginPage.jsx       # Minimalist login card
│       ├── AdminDashboardPage.jsx   # Overview statistics & quick actions
│       ├── AdminEventsPage.jsx      # Event list with Create / Edit / Delete modals
│       └── AdminRegistrationsPage.jsx # Full attendee directory with search & filters
├── services/
│   ├── api.js               # Central Axios instance with JWT interceptor
│   ├── eventService.js      # Event API endpoints
│   ├── registrationService.js # Registration endpoints
│   └── authService.js       # Admin authentication calls
├── utils/
│   ├── formatDate.js        # Date/time string formatters for display
│   └── validators.js        # Regex validation for phone, email, and required inputs
├── App.jsx                  # Route definitions & Context Providers
├── main.jsx                 # Entry point
└── index.css                # Tailwind CSS directives & Mint Breeze utility classes
```

---

## 7. Backend Structure

A modular Express codebase that avoids heavy abstractions while keeping logic well-isolated:

```
server/
├── src/
│   ├── config/
│   │   ├── env.js           # Validated environment variable exports
│   │   └── supabase.js      # Supabase client instantiation
│   ├── controllers/
│   │   ├── authController.js         # Admin login verification
│   │   ├── eventController.js        # CRUD logic for club events
│   │   └── registrationController.js # Signup logic and attendee retrieval
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification header guard
│   │   ├── errorMiddleware.js        # Global error-handling pipeline
│   │   └── validationMiddleware.js   # Request body sanity checks
│   ├── routes/
│   │   ├── authRoutes.js             # /api/auth/*
│   │   ├── eventRoutes.js            # /api/events/*
│   │   ├── registrationRoutes.js     # /api/registrations/*
│   │   └── index.js                  # Master router aggregator
│   └── app.js                        # Express app configuration & middleware pipeline
├── index.js                          # Server listener entry point
└── package.json
```

---

## 8. Page / Route Architecture

### Public Routes

| Path | Purpose |
| :--- | :--- |
| `/` | Landing page introducing the college club, mission statement, featured spotlight event, and upcoming events teaser. |
| `/events` | Searchable, filterable catalog of all upcoming and past club events. |
| `/events/:id` | Dedicated event page showing venue, detailed description, schedule, and direct "Register Now" CTA. |
| `/events/:id/register` | Lightweight registration form capturing student details for the specific event. |

### Admin Routes (Protected)

| Path | Purpose |
| :--- | :--- |
| `/admin/login` | Public gateway for club leadership to authenticate via email and password. |
| `/admin` | Main executive overview showing club KPIs (active events, total signups) and recent activity. |
| `/admin/events` | Table/list view of all events with actions to Add, Edit, Delete, or toggle Featured status. |
| `/admin/events/new` | Event creation screen/modal with input fields for title, date, venue, category, and banner URL. |
| `/admin/events/:id/edit` | Event modification screen/modal prefilled with existing event data. |
| `/admin/registrations` | Comprehensive attendee management screen with search, event dropdown filters, and registration count summaries. |

---

## 9. Database Architecture

The persistence model utilizes Supabase PostgreSQL with three straightforward relational tables.

### 9.1 Schema Definitions

#### Table: `events`
Represents club activities, workshops, competitions, and seminars.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Unique event identifier |
| `title` | `VARCHAR(255)` | `NOT NULL` | Display name of the event |
| `description`| `TEXT` | `NOT NULL` | Full description and agenda |
| `category` | `VARCHAR(50)` | `NOT NULL` | Category tag (e.g., Workshop, Tech Talk, Hackathon, Cultural) |
| `date` | `DATE` | `NOT NULL` | Scheduled date of the event |
| `time` | `VARCHAR(50)` | `NOT NULL` | Start and end time string (e.g., "14:00 - 16:30") |
| `venue` | `VARCHAR(255)` | `NOT NULL` | Campus venue, hall number, or virtual meeting URL |
| `image_url` | `TEXT` | `NULLABLE` | Unsplash or hosted image banner URL |
| `is_featured` | `BOOLEAN` | `DEFAULT FALSE` | Highlighted on home page hero |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record modification timestamp |

#### Table: `registrations`
Represents individual student RSVPs.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Unique registration ID |
| `event_id` | `UUID` | `NOT NULL, REFERENCES events(id) ON DELETE CASCADE` | Associated event |
| `name` | `VARCHAR(150)`| `NOT NULL` | Student full name |
| `email` | `VARCHAR(255)`| `NOT NULL` | Student institutional/personal email |
| `college` | `VARCHAR(255)`| `NOT NULL` | College name or department |
| `year` | `VARCHAR(30)` | `NOT NULL` | Year of study (e.g., "1st Year", "2nd Year", "Final Year") |
| `phone` | `VARCHAR(20)` | `NOT NULL` | Contact mobile number |
| `registered_at`| `TIMESTAMPTZ` | `DEFAULT NOW()` | Submission timestamp |

#### Table: `admins`
Stores club executive credentials for back-office access.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Admin identifier |
| `email` | `VARCHAR(255)`| `NOT NULL, UNIQUE` | Admin login email |
| `password_hash`| `VARCHAR(255)`| `NOT NULL` | Salted bcrypt password hash |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Account creation timestamp |

### 9.2 Relational Integrity
```
+--------------------+               +--------------------+
|       events       | 1           * |   registrations    |
|--------------------|---------------|--------------------|
| id (PK)            |<--------------| event_id (FK)      |
| title              |               | id (PK)            |
| ...                |               | name, email, etc.  |
+--------------------+               +--------------------+
```
- **One-to-Many Relationship:** One `event` has zero or many `registrations`.
- **Cascade on Delete:** If an admin deletes an event, associated registration records are automatically purged via `ON DELETE CASCADE`.

---

## 10. API Architecture

All endpoints follow RESTful conventions, prefixed with `/api`.

### 10.1 Authentication Endpoints

#### `POST /api/auth/login`
- **Purpose:** Authenticate club administrators.
- **Auth Required:** None (Public).
- **Request Body:** `{ "email": "admin@club.edu", "password": "securepassword" }`
- **Response Responsibility:** Validates credentials against `admins` table using `bcrypt`. Returns HTTP 200 with `{ "token": "JWT_STRING", "admin": { "id", "email" } }` on success, or HTTP 401 on invalid credentials.

### 10.2 Event Endpoints

#### `GET /api/events`
- **Purpose:** Retrieve all events for public listing and admin views.
- **Auth Required:** None (Public).
- **Response Responsibility:** Returns HTTP 200 with an array of events sorted by `date ASC`. Supports optional query params `?category=...&featured=true`.

#### `GET /api/events/:id`
- **Purpose:** Retrieve full details for a specific event.
- **Auth Required:** None (Public).
- **Response Responsibility:** Returns HTTP 200 with the single event object, or HTTP 404 if not found.

#### `POST /api/events`
- **Purpose:** Create a new club event.
- **Auth Required:** Yes (`Bearer <token>`).
- **Request Body:** `{ "title", "description", "category", "date", "time", "venue", "image_url", "is_featured" }`
- **Response Responsibility:** Validates mandatory fields; inserts into `events` table; returns HTTP 201 with the newly created event record.

#### `PUT /api/events/:id`
- **Purpose:** Update an existing event's details.
- **Auth Required:** Yes (`Bearer <token>`).
- **Request Body:** Partial or complete event fields.
- **Response Responsibility:** Updates the record; sets `updated_at = NOW()`; returns HTTP 200 with the updated event object.

#### `DELETE /api/events/:id`
- **Purpose:** Remove an event and associated registrations.
- **Auth Required:** Yes (`Bearer <token>`).
- **Response Responsibility:** Executes deletion in Supabase; returns HTTP 200 with `{ "message": "Event deleted successfully" }`.

### 10.3 Registration Endpoints

#### `POST /api/events/:id/register`
- **Purpose:** Submit student registration for a given event.
- **Auth Required:** None (Public).
- **Request Body:** `{ "name", "email", "college", "year", "phone" }`
- **Response Responsibility:** Verifies target event exists; validates input fields (valid email, phone format); inserts record into `registrations`; returns HTTP 201 with `{ "success": true, "registrationId": "..." }`.

#### `GET /api/registrations`
- **Purpose:** View all registrations across all events or filter by event ID.
- **Auth Required:** Yes (`Bearer <token>`).
- **Query Params:** Optional `?eventId=UUID`.
- **Response Responsibility:** Returns HTTP 200 with array of registration records, joined with event title for readable tabular display.

#### `GET /api/registrations/:id`
- **Purpose:** View detail of a single registration record.
- **Auth Required:** Yes (`Bearer <token>`).
- **Response Responsibility:** Returns HTTP 200 with the registration object or HTTP 404.

---

## 11. Authentication Design

Simplicity is prioritized to maintain rock-solid reliability within the tight deadline.

```
+----------------+          +-------------------+          +--------------------+
|  Admin Client  |          |    Express API    |          |  Supabase Postgres |
+-------+--------+          +---------+---------+          +---------+----------+
        |                             |                              |
        | 1. POST /api/auth/login     |                              |
        |    { email, password }      |                              |
        |---------------------------->| 2. Fetch admin by email      |
        |                             |----------------------------->|
        |                             |                              |
        |                             | 3. Compare hash (bcrypt)     |
        |                             |    Sign JWT (userId, email)  |
        | 4. HTTP 200 + { token }     |                              |
        |<----------------------------|                              |
        |                             |                              |
        | 5. Store token in           |                              |
        |    localStorage             |                              |
        |                             |                              |
        | 6. GET /api/registrations   |                              |
        |    Header: Bearer <token>   |                              |
        |---------------------------->| 7. Verify JWT                |
        |                             |    Extract admin session     |
        |                             |----------------------------->| Fetch data
```

- **Credential Validation:** Only verified against the pre-seeded admin record.
- **Token Mechanism:** Signs standard JSON Web Token (`jsonwebtoken` package) with 24-hour expiration.
- **Client Auth State:** Stored in `localStorage` under `clubverse_admin_token` and synchronized across app tabs via `AuthContext`.
- **Protected Route Guards:** React Router `<ProtectedRoute>` checks for token existence; redirects unauthenticated visitors to `/admin/login`.
- **Logout:** Purges token from `localStorage`, sets context auth state to `null`, and redirects to `/admin/login`.
- **No Complex Session Infrastructure:** No Redis, no refresh-token rotation, and no OAuth integrations are needed or implemented.

---

## 12. Event Flow

```
+-------------------+
|    Club Admin     |
+---------+---------+
          |
          | 1. Fills form (title, category, date, venue, banner)
          v
+-------------------+
|  POST /api/events |
+---------+---------+
          |
          | 2. Stored in Supabase
          v
+-------------------+
| Public Events View|
+---------+---------+
          |
          | 3. Student browses /events, searches "Workshop"
          | 4. Student clicks on event card -> /events/:id
          | 5. Student clicks "Register" -> /events/:id/register
          v
+-------------------+
| Registration Form |
+---------+---------+
          |
          | 6. Enters Name, Email, College/Year, Phone
          v
+-------------------+
| POST /api/events/ |
|   :id/register    |
+---------+---------+
          |
          | 7. Inserted into registrations table
          v
+-------------------+
| Confirmation Card | -> Instant success feedback with registration ID
+-------------------+
          |
          v
+-------------------+
|  Admin Dashboard  | -> Real-time count increments; attendee listed under Registrations
+-------------------+
```

---

## 13. Admin Flow

```
+---------------------------------------------------------------+
|                       Admin Login                             |
|  - Input admin credentials at /admin/login                    |
+-------------------------------+-------------------------------+
                                |
                                v
+---------------------------------------------------------------+
|                      Admin Dashboard                          |
|  - Metric Cards: Total Events, Upcoming Events, Total RSVPs   |
|  - Quick Navigation: "Manage Events" & "View Registrations"   |
+---------------+-------------------------------+---------------+
                |                               |
                v                               v
+-------------------------------+   +-------------------------------+
|         Event Manager         |   |      Registration Viewer      |
| - List events in clean table  |   | - Unified attendee table      |
| - Actions:                    |   | - Filter by Event dropdown    |
|   * [+ Add Event] modal       |   | - Real-time Search by student |
|   * [Edit] prefilled form     |   |   name, email, or college     |
|   * [Delete] with confirm     |   | - Total attendee count badge  |
|   * [View Attendees] shortcut |   +-------------------------------+
+-------------------------------+
```

---

## 14. Search & Filter Architecture

To deliver immediate UI responsiveness and eliminate unnecessary backend complexity, filtering is separated by data volume and privacy:

### 14.1 Public Events Search & Filtering (Client-Side)
- **Data Size:** Campus clubs typically operate 10 to 50 active events per semester.
- **Approach:** The public frontend fetches all active events on page load (`GET /api/events`).
- **Processing:** Search by title/description and filtering by category (e.g., Tech, Workshop, Social) are executed directly in browser memory via React's `useMemo`.
- **Advantage:** Zero latency during keystrokes, instantaneous UI updates, and zero additional backend query load.

### 14.2 Admin Registrations Search & Filtering (Hybrid Client-Side on Event Scope)
- **Approach:**
  - Filtering by **Event** is executed via API query `GET /api/registrations?eventId=...` or by fetching full records and filtering locally.
  - Search by **Student Name, Email, or College** is executed in the frontend using debounced input matching against the loaded records.
- **Advantage:** Keeps the Express controller extremely clean without building dynamic SQL builder logic or complex query parsing.

---

## 15. Responsive Design Strategy

The UI implements a mobile-first responsive layout utilizing Tailwind CSS, adhering strictly to the **Mint Breeze** palette (Emerald/Mint `#10b981`, `#059669`, `#ecfdf5`, neutral slates `#f8fafc`, `#334155`).

```
Breakpoints:
- Mobile:   < 640px  (sm)
- Tablet:   640px - 1024px (md)
- Desktop:  > 1024px (lg, xl)
```

### Component Responsive Behaviors

| Component | Mobile (< 640px) | Tablet (640px - 1024px) | Desktop (> 1024px) |
| :--- | :--- | :--- | :--- |
| **Navigation** | Sticky top bar with mint hamburger drawer | Compact horizontal links | Full horizontal nav with active mint indicator and Admin CTA |
| **Hero Section** | Single column: stacked headline, badges, and primary CTA | Balanced 2-column layout | 2-column hero with soft mint radial blur & featured card spotlight |
| **Event Cards** | 1 column, full-width card with top image | 2-column grid | 3-column grid with subtle lift-on-hover effect |
| **Registration Form** | Single column vertical form, full-width buttons | Centered card (max-w-lg) | Centered card with clean spacing & side-by-side Name/Phone inputs |
| **Admin Sidebar** | Hidden; accessible via top menu drawer | Icon-only collapsed strip | Permanent 64px/240px clean mint-accented sidebar |
| **Admin Data Tables** | **Horizontal card stack** (card per record) with key badges to avoid ugly table squishing | Horizontally scrollable responsive table with sticky headers | Full-width data grid with direct row action buttons |
| **Metric Cards** | 1 column stack (3 full-width cards) | 2 column grid | 3 column horizontal summary strip |

---

## 16. Error & Loading States

Explicit visual states will be provided for all asynchronous user interactions:

- **Loading Events:** Displays a 3-card skeleton loader with soft mint shimmering pulse rather than an empty screen.
- **Empty Events List:** Friendly illustration or icon with message: *"No events scheduled under this category. Check back soon!"* plus a "Clear Filters" button.
- **Event Not Found (404):** Direct redirect or informative card: *"This event does not exist or has concluded,"* with a button linking back to `/events`.
- **Registration Form Validation Error:** Inline input highlights (red border `#ef4444`, small text below field) for invalid email format, empty required fields, or invalid phone numbers.
- **Registration Submission Failure:** Toast / alert banner: *"Unable to complete registration. Please check your internet connection and try again."*
- **Registration Success State:** Replaces form with an animated checkmark, Mint Breeze confirmation badge, and summary of the registered event details.
- **Admin Login Failure:** Red alert box: *"Invalid admin email or password."* Prevents submission lockouts and clears the password input.
- **API Server Down / Network Failure:** Clean dismissible banner: *"Cannot connect to the club server. Please refresh in a moment."*
- **Empty Registrations List:** Informative prompt: *"No students have registered for this event yet."*

---

## 17. Security Basics

Only practical, high-impact security measures suitable for a fast recruitment project:

1. **Password Hashing:** Admin passwords are NEVER stored in plaintext. Seeded and verified using `bcryptjs` with salt rounds = 10.
2. **Environment Variable Protection:** Database connection strings, Supabase service keys, and JWT signing secrets reside solely in `.env` and are never committed to version control.
3. **Protected Admin Mutation Endpoints:** All `POST`, `PUT`, `DELETE` operations on events and `GET` requests on attendee registrations pass through `authMiddleware` (validates HTTP `Authorization: Bearer <token>`).
4. **Input Sanitization & Validation:** Express validation middleware ensures:
   - Event titles and descriptions are stripped of leading/trailing junk.
   - Registration emails conform to valid email structure (`name@domain.ext`).
   - Phone numbers contain standard phone characters (digits, +, -).
5. **CORS Restriction:** Express configures `cors({ origin: FRONTEND_URL })` to prevent unauthorized cross-origin requests.
6. **No Leaked Stack Traces:** Production error handling middleware returns clean `{ "error": "Internal server error" }` without exposing backend directory paths or SQL queries.

---

## 18. Environment Variables

### Frontend (`.env`)
```bash
# URL pointing to the deployed Express backend
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend (`server/.env`)
```bash
# Server Port
PORT=5000

# Client origin for CORS
CLIENT_URL=http://localhost:5173

# Supabase PostgreSQL Connection Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT Secret for Admin Session Signing
JWT_SECRET=super_secret_clubverse_jwt_key_2026
JWT_EXPIRES_IN=24h
```

*(Note: No real secrets are committed. Placeholder template only.)*

---

## 19. Deployment Architecture

A low-friction, zero-cost deployment pipeline:

```
+---------------------------+       +---------------------------+       +---------------------------+
|    Frontend (React/Vite)  |       |    Backend (Node/Express) |       |   Database (PostgreSQL)   |
|         on Vercel         | ----> |   on Render / Railway     | ----> |       on Supabase         |
|  - Continuous deployment  |       |  - Auto-deploy from repo  |       |  - Cloud-hosted Postgres  |
|  - Single-page rewrite    |       |  - Environment env vars   |       |  - Automated backups      |
|    (vercel.json)          |       |  - Health check at /      |       |  - SSL connections        |
+---------------------------+       +---------------------------+       +---------------------------+
```

1. **Database:** Supabase PostgreSQL instance created via dashboard; SQL tables created with the schema defined in Section 9.
2. **Backend API:** Hosted on Render or Railway Web Service pointing to `server/index.js` with environment variables configured.
3. **Frontend Client:** Deployed to Vercel with a `vercel.json` rewrite rule to support React Router deep-linking:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 20. Development Priorities

Given the September 30 deadline, development is segmented strictly by priority:

### P0 — Must Have (Core Functionality Required for Evaluation)
- [x] Home page with Mint Breeze theme styling and club introduction.
- [x] Public Events page with dynamic event cards and category badge tags.
- [x] Client-side search by event title and filter by category.
- [x] Individual Event details view (`/events/:id`).
- [x] Event Registration form with input validation and instant feedback.
- [x] Admin Login page with JWT authentication.
- [x] Admin Event CRUD (Create, Edit, Delete events).
- [x] Admin Registrations list with attendee search and filter.
- [x] Mobile-responsive navigation and card layouts.

### P1 — Nice to Have (Add Once Core is Confirmed Working)
- [ ] Featured event banner spotlight on home page.
- [ ] Direct image URL preview on event cards.
- [ ] Metric counters on Admin Dashboard (Total Events, Total Registrations).
- [ ] Small, purposeful Framer Motion fade-ins and button hover transitions.
- [ ] CSV export button for attendee lists in the admin panel.

### P2 — Skip Unless Everything Else Is Complete
- [ ] Dark mode toggle (system preference fallback is fine, but Mint Breeze light theme is primary).
- [ ] Advanced visual statistics/charts on the dashboard.
- [ ] Multi-admin account creation or password update settings.
- [ ] Social share links for individual events.

---

## 21. Definition of Done

The project is complete and ready for final submission when the following checklist is 100% verified:

- [ ] **Public Browsing:** A visitor can load the home page, understand the club's purpose, and navigate smoothly to `/events`.
- [ ] **Search & Filter:** A visitor can type in the search bar to find an event by name and click category pills to filter the list.
- [ ] **Event Registration:** A student can open any event, fill in Name, Email, College/Year, and Phone, submit the form, and receive immediate visual confirmation.
- [ ] **Database Persistence:** The submitted registration immediately appears in the Supabase `registrations` table associated with the correct `event_id`.
- [ ] **Admin Authentication:** The club admin can log in with valid credentials, receive an auth token, and get redirected to `/admin`.
- [ ] **Protected Routes:** Accessing `/admin/*` without an active token redirects directly to `/admin/login`.
- [ ] **Event Management:** Admin can create a new event, edit existing event details, and delete an event (with cascading deletion of registrations).
- [ ] **Attendee Directory:** Admin can review all registrations, select an event from a dropdown to isolate attendees, and search attendees by name or email.
- [ ] **Responsive Integrity:** All screens render cleanly across mobile (375px), tablet (768px), and desktop (1280px) viewports with zero horizontal overflow bugs.
- [ ] **Mint Breeze Visual Compliance:** Soft mint accents, clean typography, rounded corners, subtle shadows, and crisp white/light cards are consistent throughout.
- [ ] **No Over-Engineering:** No unneeded libraries, microservices, or complex state frameworks exist in the repository.

---

## Recommended Build Order

To guarantee complete delivery before the September 30 deadline, follow this chronological execution roadmap:

### Phase 1: Database & Backend Foundation (Day 1 — Morning)
1. Initialize the Supabase project; create `events`, `registrations`, and `admins` tables. Seed one admin record (with a pre-hashed bcrypt password) and 3 sample events.
2. Initialize the Express server in `server/`; configure CORS, JSON parsing, and Supabase client.
3. Implement `authController.js` and `POST /api/auth/login`.
4. Implement `eventController.js` (GET, POST, PUT, DELETE) and `authMiddleware.js`.
5. Implement `registrationController.js` (POST to register, GET to list).
6. Verify all endpoints via Thunder Client, Postman, or curl.

### Phase 2: Frontend Foundation & Public Pages (Day 1 — Afternoon / Evening)
1. Initialize Vite React app with Tailwind CSS; configure Mint Breeze colors and typography in `tailwind.config.js` and `index.css`.
2. Configure React Router with Navbar, Footer, and page scaffolding.
3. Build `HomePage.jsx`: Club introduction, featured event spotlight, and upcoming events preview.
4. Build `EventsPage.jsx`: Event cards grid, search input, and category filter bar.
5. Build `EventDetailPage.jsx` and `EventRegisterPage.jsx` with input validation and submission feedback.
6. Connect frontend services to the Express API; verify end-to-end event browsing and registration.

### Phase 3: Admin Back-Office (Day 2 — Morning / Afternoon)
1. Create `AuthContext.jsx` and `<ProtectedRoute>` route wrapper.
2. Build `AdminLoginPage.jsx` and connect to `POST /api/auth/login`.
3. Build `AdminDashboardPage.jsx` with metric cards and fast-action shortcuts.
4. Build `AdminEventsPage.jsx` with Event Table, Create Event Modal, Edit Modal, and Delete confirmation.
5. Build `AdminRegistrationsPage.jsx` with attendee table, event filter dropdown, and search input.

### Phase 4: Polish, Responsiveness & Deployment (Day 2 — Evening / Day 3)
1. Audit mobile viewports (adjust mobile navbar drawer, replace squished tables with responsive card lists on mobile).
2. Add empty states, skeleton loaders, and error boundary toasts.
3. Deploy backend to Render/Railway; configure environment variables.
4. Deploy frontend to Vercel; configure `vercel.json` rewrites and `VITE_API_BASE_URL`.
5. Perform final sanity check against the **Definition of Done** checklist before submission.
