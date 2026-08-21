# 🛣️ RoadGuard AI - Autonomous Urban Infrastructure Platform

**RoadGuard AI** is a modern Smart City Operations Command Center and GIS infrastructure monitoring platform. It uses computer vision telemetry to detect road defects (potholes, cracks, waterlogging, manhole subsidence), map hazards using GIS, calculate priority dispatch scores, auto-merge citizen duplicate complaints, and manage contractor work orders.

---

## 🌟 Key Modules & Features

1. **📊 Urban Infrastructure Command Center**: Real-time KPI metrics, Leaflet GIS overlay map, and ranked priority maintenance queue.
2. **📷 AI Road Defect Analyzer**: Drag-and-drop image upload, simulated neural segmentation with bounding box overlays, area/depth metrics, and work order creation.
3. **🗺️ Full GIS Command Map**: Geospatial dark-theme OpenStreetMap view with severity filtering layer toggles.
4. **📢 Citizen Complaints & AI Deduplication**: Image similarity matching (e.g. 93% match detection) and 1-click complaint merging.
5. **🌊 Waterlogging Intelligence**: Hydro-infrastructure telemetry, Recharts precipitation correlation graphs, and AI drainage insights.
6. **🛠️ Maintenance Dispatch Kanban**: Work order workflow board (Pending, Assigned, In Progress, Completed).
7. **📈 Performance Analytics**: Defect distribution donut charts, severity bar charts, 6-month trend lines, and resolution SLA metrics.

---

## 🛠️ Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to:
```text
http://localhost:3000
```
