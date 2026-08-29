# 🛣️ ROADNEX (RoadGuard AI) — Autonomous Smart City Infrastructure & Defect Resolution Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-emerald?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-cyan?style=for-the-badge&logo=react)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express-5.2-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-blue?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Google Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-orange?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> **ROADNEX** (formerly RoadGuard AI) is a state-of-the-art **Autonomous Urban Infrastructure Monitoring & Defect Resolution Platform**. Powered by Neural Computer Vision, GIS Mapping, and an Express + PostgreSQL backend, ROADNEX automates the lifecycle of road damage detection (potholes, cracks, waterlogging), citizen complaint deduplication, voice-assisted verification, and real-time municipal staff work order dispatching.

---

## 🌟 Executive Features & Platform Highlights

### 1. 🛰️ Orbital LiDAR 3D City Sweep & Telemetry Splash
- Immersive 3D orbital satellite radar simulation sweeping city grids.
- Identifies structural anomalies, dispatches autonomous drone inspection sweeps, and verifies grid integrity upon launch.

### 2. 🤖 Gemini AI & Neural Vision Classification
- Instant photographic defect classifier detecting **Potholes**, **Cracks**, **Rutting**, and **Waterlogging**.
- Calculates confidence percentages, defect severity (High/Medium/Low), priority scores (1-100), estimated repair area ($m^2$), and depth ($cm$).
- Dual-engine fallback integrating Google Generative AI (Gemini 3.5 Flash) for image analysis.

### 3. 👥 Multi-Role Portal Architecture

| Portal Role | Description | Key Functions |
| :--- | :--- | :--- |
| **🏛️ Municipal Admin** | Central Command Center | Case deduplication, priority scoring, work order dispatch, staff calling, analytics |
| **👷 Municipal Staff** | Field Operations Portal | Assigned tickets queue, GPS location lock, post-repair photo proof, 1-click completion |
| **👤 Citizen User** | Public Reporting Portal | Camera capture/file upload, live GPS geocoding via OpenStreetMap, case status tracking |

### 4. 📞 Voice Verification & Dialing Gateway
- Built-in Voice Calling Simulation featuring live audio synthesis (`SpeechSynthesis API`), real-time dialogue subtitles, and system `tel:` protocol triggers.
- **Dual Calling Support**: Admin can call citizens directly to verify reports OR call registered municipal staff members directly from the inspect modal.

### 5. 👷 Registered Municipal Staff Assignment & Dispatch
- Querying registered municipal staff members (`role = 'municipal'`) from PostgreSQL.
- Admin dropdown selector allows assigning work orders directly to specific staff (e.g. *Vikram Singh*, *Rajesh Sharma*, *Anjali Verma*).
- Dispatched tickets instantly appear in the assigned staff member's personal dashboard queue.

### 6. ⚡ Real-Time Live Data Polling & Synchronization
- **3-Second Live Polling Engine**: Status updates and repair proofs sync live across all active Admin, Staff, and Citizen browser sessions without needing manual page refreshes.
- **Before & After Resolution Proof**: Side-by-side photographic comparison showing the original defect photo next to the live repaired road photo uploaded by municipal staff.

### 7. 📲 Automated WhatsApp Integration
- Automated WhatsApp welcome message trigger upon new user/citizen registration.

---

## 🛠️ System Architecture & Stack

```mermaid
graph TD
    A[Citizen / Admin / Staff Frontend - React 19 + Vite] -->|REST API Requests| B[Express.js API Gateway]
    B -->|User Auth & Roles| C[PostgreSQL - Neon Serverless DB]
    B -->|Defect Image Analysis| D[Google Gemini 3.5 Vision API]
    B -->|File Storage| E[Local Uploads / Multer Engine]
    B -->|Geocoding| F[OpenStreetMap Nominatim / Google Maps]
    C -->|3s Live Polling Sync| A
```

- **Frontend**: React 19, Vite 6, TailwindCSS 4, Framer Motion, Lucide Icons, Leaflet GIS Maps, Recharts, Web Speech API.
- **Backend**: Express.js 5, Node.js (ES Modules).
- **Database**: PostgreSQL (Neon Serverless Engine) with automatic SQL schema migrations.
- **AI & Integrations**: `@google/generative-ai` SDK, Firebase Admin SDK, Jimp Image Processing.

---

## 📁 Repository Structure

```
Agentic_AI/
├── server/                      # Express REST API Backend
│   ├── config/                  # PostgreSQL Connection Pool & SSL Setup
│   ├── routes/                  # API Routes
│   │   ├── api.js               # Central API Router & Agent Engine
│   │   ├── auth.js              # Auth, JWT, Google OAuth & Staff Queries
│   │   ├── complaints.js        # Citizen Complaints & Deduplication
│   │   ├── reports.js           # Road Defect Reports & GIS Feeds
│   │   ├── workorders.js        # Work Order Dispatch & Repair Verification
│   │   └── upload.js            # Image Upload Handler
│   ├── services/                # PostgreSQL CRUD & User Persistence
│   └── index.js                 # Server Entry Point & DB Schema Auto-Migrator
├── src/                         # Vite + React Frontend
│   ├── components/              # Reusable UI Components (Sidebar, Navbar, Map, Splash)
│   ├── pages/                   # Application Views
│   │   ├── ComplaintsPage.jsx   # Admin Command Center & Citizen Case Tracker
│   │   ├── MunicipalDashboardPage.jsx # Staff Field Dispatch & Repair Proof
│   │   ├── DashboardPage.jsx    # Analytics & City Monitoring
│   │   ├── GisMapPage.jsx       # Interactive GIS Heatmap
│   │   ├── RoadAnalysisPage.jsx # AI Camera Scanner & Image Uploader
│   │   ├── UserDashboardPage.jsx # Citizen Portal Overview
│   │   └── LandingPage.jsx      # Marketing & Feature Showcase
│   ├── App.jsx                  # Main Router & 3s Live Polling Engine
│   └── index.css                # Glassmorphism & Modern Design Tokens
└── package.json                 # Monorepo Dependencies & Development Scripts
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **PostgreSQL**: Neon DB connection string (or local PostgreSQL server)

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/Raza786-asad/Agentic_AI.git
cd Agentic_AI

# Install all root dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root or `server/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/roadguard?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
ADMIN_ID=admin@roadguard.gov.in
ADMIN_PASSWORD=admin123
```

### 3. Run Development Server

Start both the backend API server and Vite frontend concurrently with a single command:

```bash
npm run dev
```

The application will start on:
- **Vite Frontend**: `http://localhost:3000`
- **Express API Server**: `http://localhost:5000/api`

---

## 🔐 Default Credentials for Testing

| Portal | Login URL | Email / ID | Password |
| :--- | :--- | :--- | :--- |
| **Municipal Admin** | `/admin/login` | `admin@roadguard.gov.in` | `admin123` |
| **Municipal Staff** | `/municipal/login` | *Registered Staff Email* | *Staff Password* |
| **Citizen Portal** | `/login` | *Any Citizen Account* | *Citizen Password* |

---

## 📄 License & Author

Developed with ❤️ for Smart City Infrastructure Transformation.
- **Author**: Md. Asad Raza
- **Repository**: [Raza786-asad/Agentic_AI](https://github.com/Raza786-asad/Agentic_AI)
