import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoadAnalysisPage from './pages/RoadAnalysisPage';
import GisMapPage from './pages/GisMapPage';
import ComplaintsPage from './pages/ComplaintsPage';
import WaterloggingPage from './pages/WaterloggingPage';
import MaintenancePage from './pages/MaintenancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

import { INITIAL_DEFECTS, INITIAL_COMPLAINTS, INITIAL_WORK_ORDERS } from './data/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Cmdr. A. Mehta',
    title: 'Chief Urban Engineer',
    email: 'admin@roadguard.gov.in',
    role: 'admin' // 'admin' or 'user'
  });

  const [defects, setDefects] = useState(INITIAL_DEFECTS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Critical Pothole Flagged',
      message: 'RD-1050 on Cyber City Phase 2 flagged with 98% AI confidence.',
      time: '10 min ago',
      type: 'critical'
    },
    {
      id: 2,
      title: 'Complaint Auto-Merged',
      message: 'Citizen report C-2041 merged into RD-1042 (93% similarity).',
      time: '25 min ago',
      type: 'info'
    },
    {
      id: 3,
      title: 'Work Order Completed',
      message: 'WO-1072 marked completed by City Municipal Team B.',
      time: '1 hour ago',
      type: 'success'
    }
  ]);

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    triggerToast(`Welcome ${user.name}! Logged in as ${user.role === 'admin' ? 'Municipal Admin' : 'Citizen User'}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast('Logged out cleanly. Please select a portal to sign in.');
  };

  const handleUpdateStatus = (defectId, newStatus) => {
    setDefects((prev) =>
      prev.map((d) => (d.id === defectId ? { ...d, status: newStatus } : d))
    );
    setWorkOrders((prev) =>
      prev.map((w) => (w.defectId === defectId ? { ...w, status: newStatus } : w))
    );
  };

  const handleMergeComplaint = (complaintId, matchedDefectId) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? { ...c, status: `Merged into ${matchedDefectId}` }
          : c
      )
    );
  };

  const handleAddWorkOrder = (newOrder) => {
    setWorkOrders((prev) => [newOrder, ...prev]);
    setDefects((prev) => [
      {
        id: newOrder.id,
        location: newOrder.location,
        type: newOrder.type,
        severity: newOrder.severity,
        confidence: 96,
        area: '2.4 m²',
        depth: '12 cm',
        complaints: 1,
        waterlogging: true,
        priorityScore: 92,
        lat: newOrder.lat,
        lng: newOrder.lng,
        reportedDate: newOrder.date,
        status: newOrder.status
      },
      ...prev
    ]);
  };

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  // If not logged in, render Login Page
  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      </>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
        {/* Sidebar */}
        <Sidebar currentUser={currentUser} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            currentUser={currentUser}
            onLogout={handleLogout}
            unreadCount={notifications.length}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
          />

          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardPage
                    defects={defects}
                    onUpdateStatus={handleUpdateStatus}
                    onTriggerToast={triggerToast}
                  />
                }
              />
              <Route
                path="/analysis"
                element={
                  <RoadAnalysisPage
                    onTriggerToast={triggerToast}
                    onAddWorkOrder={handleAddWorkOrder}
                  />
                }
              />
              <Route
                path="/gis-map"
                element={
                  <GisMapPage
                    defects={defects}
                    onUpdateStatus={handleUpdateStatus}
                    onTriggerToast={triggerToast}
                  />
                }
              />
              <Route
                path="/complaints"
                element={
                  <ComplaintsPage
                    complaints={complaints}
                    onMergeComplaint={handleMergeComplaint}
                    onTriggerToast={triggerToast}
                    currentUser={currentUser}
                  />
                }
              />
              <Route path="/waterlogging" element={<WaterloggingPage />} />
              <Route
                path="/maintenance"
                element={
                  <MaintenancePage
                    workOrders={workOrders}
                    onUpdateStatus={handleUpdateStatus}
                    onTriggerToast={triggerToast}
                  />
                }
              />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route
                path="/settings"
                element={<SettingsPage onTriggerToast={triggerToast} />}
              />
              <Route
                path="*"
                element={
                  <DashboardPage
                    defects={defects}
                    onUpdateStatus={handleUpdateStatus}
                    onTriggerToast={triggerToast}
                  />
                }
              />
            </Routes>
          </main>
        </div>

        {/* Global Toast Alerts */}
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      </div>
    </Router>
  );
}
