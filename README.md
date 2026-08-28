# 🛣️ RoadNex (formerly RoadGuard AI) - Autonomous Urban Infrastructure Platform

**RoadNex** is a modern Smart City Operations Command Center and GIS infrastructure monitoring platform. Powered by an Express.js backend and PostgreSQL database, it uses neural vision telemetry to detect road defects (potholes, cracks, waterlogging), map hazards using GIS, calculate priority dispatch scores, auto-merge duplicate complaints, and dispatch work orders.

---

## 🌟 Key Modules & Features

1. **🛰️ Orbital Lidar Scan Splash Screen**: A highly unique, immersive 3D satellite radar simulation that sweeps the city grid, zooms to isolate structural anomalies, dispatches automated drone repair sweeps, and validates structural integrity before entering the application.
2. **📊 Urban Infrastructure Command Center**: Real-time KPI metrics, dynamic territory drilldowns (State, District, City), and a Leaflet GIS overlay map showing active reports.
3. **📷 Google Maps & Neural Vision Classifier**: Upload or capture live photos using the device camera (`getUserMedia` API) to detect defects, reverse-geocode exact addresses via OpenStreetMap (OSM) Nominatim, and lock precise GPS pins directly onto Google Maps.
4. **📢 Citizen Complaints & AI Deduplication**: Automated duplicate detection with similarity matching (e.g. 96% match threshold) and 1-click complaint merging.
5. **🛠️ Maintenance Dispatch Kanban**: Work order workflow board (Pending, Assigned, In Progress, Completed) featuring complete user-uploaded defect photo previews in the details view.
6. **🌊 Waterlogging Intelligence**: Hydro-infrastructure telemetry, Recharts precipitation correlation graphs, and AI drainage insights.
7. **📈 Performance Analytics**: Defect distribution, severity breakdowns, 6-month trend lines, and resolution SLA metrics.

---

## 🛠️ Stack & Architecture
- **Frontend**: Vite + React, TailwindCSS, Leaflet GIS Maps, Lucide icons, Recharts.
- **Backend**: Express.js REST API with Token-based Session Verification.
- **Database**: PostgreSQL (Neon Serverless) with SQL Migrations.

---

## 🛠️ Quick Start Guide

### Step 1: Install Dependencies
In the root directory, install both client and server dependencies:
```bash
npm install
cd server && npm install && cd ..
```

### Step 2: Set Environment Variables
Configure your database connection and JWT secret in a `.env` file in the `server` directory (see `server/.env.example`).

### Step 3: Run Database Migrations
```bash
npm run migrate
```

### Step 4: Run the Project
Start both the Vite frontend and Express server concurrently:
```bash
# Run backend server
npm run start

# Run frontend development server
npm run dev
```

### Step 5: Open in Browser
Navigate to:
- Frontend: `http://localhost:3000`
- API Server: `http://localhost:5000`
