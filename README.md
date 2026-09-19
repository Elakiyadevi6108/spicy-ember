# Spice & Ember 🔥

> **Spice & Ember** is a complete, modern, production-ready premium restaurant platform featuring a real-time table reservation engine, digital menu, customer portal, interactive admin dashboard with visual floor plan table manager, gallery lightbox, events manager, and full Express REST backend.

---

## 🌟 Key Features

### 1. Navigation & Brand Aesthetic
- **Luxury Theme**: Charcoal Obsidian `#0e0c0d` background, warm gold `#d4af37` and amber `#e6a15c` accents, subtle glassmorphism, clean serif typography.
- **Sticky Navbar**: Compact scroll animation, responsive mobile drawer, direct CTA "Book a Table", admin portal shortcut.

### 2. Visually Stunning Landing Page & Sections
- **Hero Section**: High-resolution food/dining photography, bold typography, entrance animations, and live info bar (Opening hours: 12:00 PM - 11:00 PM, Location: Coimbatore, Direct phone).
- **Our Story**: Brand narrative with interactive metrics (`10+ Years`, `50+ Signature Dishes`, `25K+ Happy Guests`).
- **Chef Section**: Executive Chef Vikram Roy profile, culinary philosophy, and signature tandoori dish details.
- **Events Section**: Curated weekly events (Weekend Live Music, Family Dinner Night, Chef's Tasting, Private Dining) with instant booking triggers.
- **Gallery Lightbox**: Categorized masonry layout with full-screen lightbox viewer.
- **Contact & Venue**: Address in Coimbatore, TN, phone, email, opening hours, validated contact form, and Google Maps embed frame.

### 3. Digital Menu System
- **Categories**: Starters, Soups, Main Course, Indian Specials, Continental, Desserts, Beverages.
- **Features**: Category tab filters, search bar ("Search dishes..."), Veg/Non-Veg indicators, Popular badges, currency formatting in INR (₹).

### 4. Real-time Table Reservation System
- **Booking Inputs**: Date picker (disallows past dates), Time slot picker (12:00 PM – 9:30 PM), Party size picker (1–20 guests), Seating preference (Indoor, Outdoor, Window, Private Dining), Name, Email, Phone, Special requests.
- **Real-time Availability Engine**: Live check against table capacity and existing bookings with status badges (*Available*, *Limited Availability*, *Fully Booked*).
- **Confirmation Flow**: Unique Reservation ID generator (e.g. `SE-94821`), details display, and downloadable `.ics` calendar invite link.

### 5. Interactive Admin Dashboard
- **Demo Credentials**:
  - **Email**: `admin@spiceandember.com`
  - **Password**: `admin123`
- **Dashboard Overview Cards**: Today's Reservations, Upcoming Bookings, Table Occupancy Rate, Total Guests.
- **Reservation Management**: Filter by status, date, time slot, search bar; inline status updates (Confirmed, Completed, Cancelled, No Show).
- **Visual Floor Plan Manager**: Manage table numbers, seating capacities, locations, and real-time statuses (*Available*, *Reserved*, *Occupied*, *Maintenance*). Add, edit, or delete tables dynamically.

### 6. Customer Portal ("My Reservations")
- **Customer Account**: View Upcoming, Past, and Cancelled bookings.
- **Self-Service**: Cancel bookings with modal confirmation.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons, React Router DOM, Vite
- **Backend**: Node.js, Express, REST API, SQLite (`better-sqlite3`/`sqlite3`) with zero-config out-of-the-box local database, PostgreSQL ready
- **Database Schema**: `tables`, `reservations`, `users`, `menu_items`, `events`

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Installation

Install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 2. Running Locally

#### Start the Backend API Server:
```bash
cd backend
npm run dev
```
*The backend server will run at http://localhost:5000 and automatically initialize `spice_and_ember.db` with default seed data.*

#### Start the Frontend Client:
```bash
cd client
npm run dev
```
*The React frontend will run at http://localhost:3000.*

---

## 📡 REST API Endpoints

### Availability & Reservations
- `GET /api/availability?date=YYYY-MM-DD&time=19:30&guests=4` — Check live table availability
- `POST /api/reservations` — Create new reservation with table auto-allocation
- `GET /api/reservations` — Query reservations (supports `email`, `date`, `status`, `search`)
- `GET /api/reservations/:id` — Get reservation by ID
- `PUT /api/reservations/:id` — Update reservation status or details
- `DELETE /api/reservations/:id` — Cancel reservation

### Tables Management
- `GET /api/tables` — Fetch all tables with current occupancy status
- `POST /api/tables` — Add a new table
- `PUT /api/tables/:id` — Update table capacity/location/status
- `DELETE /api/tables/:id` — Remove table

### Public Data & Auth
- `GET /api/menu` — Query menu items (filters: `category`, `search`, `veg`)
- `GET /api/events` — Query dining events
- `POST /api/auth/login` — User/Admin login
- `POST /api/auth/register` — User registration
- `POST /api/contact` — Process contact form message
- `POST /api/newsletter` — Process newsletter subscription

---

## 💾 Database Schema (PostgreSQL / SQLite)

```sql
CREATE TABLE tables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  table_number INTEGER UNIQUE NOT NULL,
  capacity INTEGER NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available'
);

CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reservation_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests INTEGER NOT NULL,
  seating_preference TEXT NOT NULL,
  special_request TEXT,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  table_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (table_id) REFERENCES tables(id)
);
```

---

## 📜 License & Copyright

© 2026 Spice & Ember. All rights reserved.
