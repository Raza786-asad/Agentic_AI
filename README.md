# 🛣️ ROADEX — Agentic AI Road Safety & Infrastructure Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-emerald?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-cyan?style=for-the-badge&logo=react)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express-5.2-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-blue?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Google Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-orange?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)

> **ROADEX** is a state-of-the-art **Agentic AI Road Safety & Infrastructure Platform**. Powered by an 8-Agent Modular Architecture, Neural Computer Vision, GIS Mapping, and an Express + PostgreSQL backend, ROADEX automates the complete lifecycle of road safety issue detection, citizen identity verification, risk priority assessment, authority routing, and real-time municipal resolution proof synchronization.

---

## 🤖 8-Agent Modular Architecture & DAG Pipeline

ROADEX operates on a **Decoupled 8-Agent Orchestration Architecture** where a central Orchestrator Agent coordinates execution across 7 specialized AI agents:

```mermaid
graph TD
    A[Citizen Complaint Payload] --> B[1. ORCHESTRATOR AGENT]
    B --> C[2. COMPLAINT ANALYSIS AGENT]
    B --> D[3. IMAGE / ROAD DETECTION AGENT]
    B --> E[4. LOCATION INTELLIGENCE AGENT]
    B --> F[5. PRIORITY & RISK ASSESSMENT AGENT]
    B --> G[6. CITIZEN VERIFICATION AGENT]
    B --> H[7. AUTHORITY ROUTING AGENT]
    B --> I[8. NOTIFICATION AGENT]
    I --> J[Live Dashboard & Work Order Dispatch]
```

### Specialized Agents & Responsibilities

| Agent Name | Primary Responsibility | Input Payload | Output Payload |
| :--- | :--- | :--- | :--- |
| **1. Orchestrator Agent** | DAG Pipeline Coordinator & Fallback Guard | Raw Complaint Payload | Execution Logs, Step Timings, Pipeline Summary |
| **2. Complaint Analysis Agent** | NLP Issue Classification & Intent Extraction | Text Description, Category | Identified Issue, Confidence (%), Reasoning |
| **3. Image / Road Detection Agent** | Neural Computer Vision Surface Classifier | Image URL / Camera Frame | Defect Label, Bounding Box, Depth & Area ($m^2$) |
| **4. Location Intelligence Agent** | Spatial GIS Geocoding & Jurisdiction Mapper | Lat / Lng, Raw Address | City Zone, Road Classification, Authority Jurisdiction |
| **5. Priority & Risk Agent** | Multi-Factor Urgency Risk Calculation | Severity, Road Type, Waterlogging | Priority (CRITICAL/HIGH/MEDIUM/LOW), Risk Score ($1-100$) |
| **6. Citizen Verification Agent** | JWT Profile Identity & Privacy Guard | Authenticated User Token | Verified Citizen Identity, Masked Contact Details |
| **7. Authority Routing Agent** | Jurisdiction & Repair Crew Matcher | Issue Type, Location Zone | Assigned Authority (e.g. NHAI vs Municipal), Officer |
| **8. Notification Agent** | Multi-Channel Alert Gateway Dispatcher | Ticket Details, Contact | Dispatch Confirmation (In-App, SMS, WhatsApp) |

---

## 🔌 Specialized Agent API Endpoints

```http
POST /api/agents/orchestrate     # Runs full 8-agent pipeline
POST /api/agents/analyze         # Executes Complaint Analysis Agent
POST /api/agents/detect          # Executes Image / Road Detection Agent
POST /api/agents/location        # Executes Location Intelligence Agent
POST /api/agents/priority        # Executes Priority & Risk Assessment Agent
POST /api/agents/verify          # Executes Citizen Verification Agent
POST /api/agents/route           # Executes Authority Routing Agent
POST /api/agents/notify          # Executes Notification Agent
GET  /api/agents/status/:id      # Returns live agent pipeline execution status
```

---

## 🌟 Executive Features & Demo Highlights

1. **🤖 AI Agent Control Center (`/admin/agents`)**: Visual DAG topology dashboard with **Teacher Demo Mode** allowing 1-click execution of the entire 8-agent pipeline.
2. **🧠 Live Reasoning Activity Panel (`AgentActivityPanel.jsx`)**: Embedded into inspect modals displaying real-time step-by-step agent thought logs.
3. **🛰️ Orbital LiDAR 3D City Sweep**: Immersive 3D satellite radar simulation sweeping city grids upon launch.
4. **📞 Voice Verification Gateway**: Built-in speech synthesis dialogue for calling citizens and registered municipal staff.
5. **👷 Registered Staff Work Assignment**: Direct assignment to municipal crews with personal task queues.
6. **⚡ 3-Second Live Data Polling**: Real-time status updates and Before & After photo resolution proofs across all active tabs.

---

## 🛠️ System Architecture & Stack

- **Frontend**: React 19, Vite 6, TailwindCSS 4, Framer Motion, Lucide Icons, Leaflet GIS, Recharts, Web Speech API.
- **Backend**: Express.js 5, Node.js (ES Modules).
- **Database**: PostgreSQL (Neon Serverless DB) with auto SQL migrations.
- **AI Engine**: `@google/generative-ai` SDK, Multi-Agent Orchestrator Pipeline.

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables (.env)
```env
PORT=5000
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/roadguard?sslmode=require
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Run Monorepo Server
```bash
npm run dev
```
- **Vite Frontend**: `http://localhost:3000`
- **Express API Server**: `http://localhost:5000/api`
- **AI Agent Control Center**: `http://localhost:3000/admin/agents`

---

## 🔐 Credentials for Testing & Presentation

| Role | Login URL | Email / ID | Password |
| :--- | :--- | :--- | :--- |
| **Municipal Admin** | `/admin/login` | `admin@roadguard.gov.in` | `admin123` |
| **Municipal Staff** | `/municipal/login` | *Registered Staff Email* | *Staff Password* |
| **Citizen User** | `/login` | *Any Citizen Account* | *Citizen Password* |

---

## 📄 License & Author

Developed for Smart City Road Safety Infrastructure Transformation.
- **Author**: Md. Asad Raza
- **Repository**: [Raza786-asad/Agentic_AI](https://github.com/Raza786-asad/Agentic_AI)
