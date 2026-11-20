# 🌸 BRB Decors — Ceremonial Plate & Stage Decoration Platform
> *“BRB, we’re arranging something beautiful.”*

A modern full-stack web application designed for a family-owned ceremonial decoration business in Tamil Nadu, India. The studio creates handcrafted decorative plates (*thaalams* / trays), fruit & dry fruit mandalas, floral rings with deity figurines, and stage backdrops for weddings, coming-of-age ceremonies (*Manjal Neerattu Vizha*), baby showers (*Valaikappu*), and housewarmings (*Grihapravesam*).

---

## 🎨 Design Direction: “The Plate Is The Page”

In South Indian ceremonial culture, a **thaalam** is not just a tray; it is an offering of abundance, sacred geometry, auspicious colors, and familial warmth.

### Ceremonial Palette (Strict 2-accent rule per section)
- **Canvas Cream:** `#FBF6EC` (Unbleached silk & raw ivory plate surface)
- **Banana-Leaf Green:** `#2F5D3A` (Primary accent: fresh *vazhaielai*, growth, hospitality)
- **Deep Leaf:** `#214229` (High contrast headers & borders)
- **Turmeric / Marigold:** `#E9A62B` (Ceremonial highlight: *chevvanthi* & *virali manjal*)
- **Kumkum Red:** `#A8232F` (Sacred focus: reserved strictly for key actions & alerts)
- **Deep Aubergine:** `#2B1A2E` (Primary text: softer than pitch-black)
- **Sandalwood Tint:** `#E8DAC8` (Tray rims, thread dividers, and subtle outlines)

### Typography
- **Display Serif:** Cormorant Garamond
- **Body Sans:** DM Sans / Inter
- **Tamil Pairings:** Noto Serif Tamil & Noto Sans Tamil (natural spoken Tamil, never literal translations)
- **Handwritten Accent:** Caveat (subtle decorator annotations, max once per section)

---

## 🌟 Signature Features & Widgets

1. **“The First Arrangement” Intro Animation:**
   - SVG gold plate draws itself -> banana leaves fan out -> marigold & rose petals bloom -> fruits settle with a gentle bounce -> plate glides into top-left to become the logo. Skippable, stored per session.
2. **Scroll Storytelling Hero:**
   - Pinned 3D ceremonial plate rotating and morphing arrangements across Puberty, Wedding, and Baby Shower milestones as the user scrolls.
3. **Interactive Plate Planner (Booking Stepper):**
   - 6-step flow replacing boring forms: *Basics -> Occasion -> Service Model (Full-Service vs DIY) -> Plates Count & Types -> Custom Notes & Moodboard -> Review & Quote*.
   - Live canvas preview updates as choices are made, with stacked plates counter, budget estimator, and grand petal shower on confirmation.
4. **Availability Calendar (Filled vs. Empty Plates):**
   - Calendar date picker where booked dates look like filled green plates, available dates look like empty brass plates, and golden rings indicate auspicious **Subha Muhurtham** days.
5. **Before/After Transformation Slider:**
   - Interactive golden flower handle allows users to slide between an empty raw brass tray and the finished ceremonial fruit mandala.
6. **Shop the Look & Trusted Local Stores:**
   - Curated DIY tools, brass trays, and toppers with transparent affiliate disclosures.
   - Vetted local vendor directory across Chennai, Madurai, Coimbatore with *"Say BRB Decors at the counter for 10-15% off"*.
7. **Bilingual Toggle (English & தமிழ்):**
   - Complete toggle for international clients and local elders alike.
8. **Interactive Custom Cursor:**
   - Desktop flower bud cursor that blooms on clickables, turns into a betel leaf on text, and disables automatically on touch screens.
9. **Easter Egg:**
   - Double-click or long-press the header plate logo to trigger a 360° spin and celebratory petal shower.

---

## 🛠️ Tech Stack & Architecture

```
Plate_decor/
├── frontend/             # Next.js 16 (App Router) + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/          # App router pages (/, /gallery, /plan, /shop, /packages, /about, /contact, /admin)
│   │   ├── components/   # Motion, primitives, layout, and home sections
│   │   ├── services/     # Typed API client for FastAPI backend
│   │   ├── config/       # Business constants & feature flags
│   │   ├── context/      # Bilingual language provider (EN / TA)
│   │   └── data/         # Mock data fallbacks for offline resilience
│   └── Dockerfile
├── backend/              # Python FastAPI REST API
│   ├── app/
│   │   ├── routers/      # auth, bookings, gallery, products, stores, availability, payments, uploads, seed
│   │   ├── models/       # SQLAlchemy 2.0 entities
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/     # Notification (Email/WhatsApp), Storage, Razorpay
│   │   └── database.py   # PostgreSQL engine with SQLite dev fallback
│   ├── tests/            # Pytest test suite (100% passing)
│   ├── alembic/          # Database migrations
│   └── Dockerfile
├── docker-compose.yml    # Multi-container setup (Postgres + FastAPI + Next.js)
└── .github/workflows/    # CI Pipeline (Pytest + Next.js build)
```

---

## 🔐 Administrative Portal (`/admin`)

The private admin dashboard provides full ceremonial order and content management:

- **Login Route:** `/admin/login`
- **Default Admin Email:** `admin@brbdecors.com`
- **Default Password:** `AdminDecors@2026`

### Admin Capabilities:
1. **Bookings Pipeline (Kanban):** Filter by status (`New`, `Quoted`, `Confirmed`, `Completed`, `Cancelled`), view client inspirations and phone with instant WhatsApp chat launcher, and submit formal quotes.
2. **Gallery & Interactive Hotspot Editor:** Upload photos and click anywhere on the plate image to place glowing affiliate hotspot pins.
3. **Affiliate Products & Partner Stores:** Manage DIY items and local store courtesy discounts.
4. **Availability & Auspicious Dates:** Blackout dates or set auspicious Muhurtham flags on the client date picker.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+
- Docker & Docker Compose (optional, for containerized run)

### Method 1: Using Docker Compose (Full Stack)
```bash
# Build and spin up PostgreSQL, FastAPI Backend, and Next.js Frontend
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

---

### Method 2: Manual Local Development

#### 1. Start the FastAPI Backend
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at `http://127.0.0.1:8000/docs`.

#### 2. Start the Next.js Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Running Automated Tests

### Backend Unit Tests (Pytest)
```bash
cd backend
python -m pytest -v
```
Runs 8 comprehensive tests verifying:
- Admin JWT authentication & access control
- Customer booking creation & input validation
- Pipeline status transitions & formal quoting
- Gallery filtering & affiliate hotspot placements
- Availability calendar calculation & date blocking

### Frontend Build Validation
```bash
cd frontend
npm run build
```
Validates TypeScript compilation, static prerendering of all 12 routes, and Tailwind styling.

---

## ☁️ Deployment Guide (Azure)

### Option A: Azure Container Apps (Recommended)
1. Push images to Azure Container Registry (ACR):
   ```bash
   az acr build --registry <your-registry> --image brbdecors-backend:latest ./backend
   az acr build --registry <your-registry> --image brbdecors-frontend:latest ./frontend
   ```
2. Provision Azure Database for PostgreSQL Flexible Server.
3. Deploy Container Apps pointing to ACR images with environment variables from `.env.example`.

### Option B: Azure App Service (Linux Web App)
- Configure Docker Compose deployment on Azure App Service using the included `docker-compose.yml`.

---

## 📄 License & Attribution
Handcrafted with devotion for **BRB Decors**, Tamil Nadu, India.
*Arranged with love, plate by plate.*
