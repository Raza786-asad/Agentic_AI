import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

// Import existing and new pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserDashboardPage from './pages/UserDashboardPage';

import DashboardPage from './pages/DashboardPage';
import RoadAnalysisPage from './pages/RoadAnalysisPage';
import GisMapPage from './pages/GisMapPage';
import ComplaintsPage from './pages/ComplaintsPage';
import WaterloggingPage from './pages/WaterloggingPage';
import MaintenancePage from './pages/MaintenancePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';

import ProtectedRoute from './components/ProtectedRoute';

import { INITIAL_DEFECTS, INITIAL_COMPLAINTS, INITIAL_WORK_ORDERS } from './data/mockData';

// API helper — reads token from localStorage
const apiCall = (path, options = {}) => {
  const token = localStorage.getItem('roadnex_token');
  return fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [defects, setDefects] = useState(INITIAL_DEFECTS);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [workOrders, setWorkOrders] = useState(INITIAL_WORK_ORDERS);
  const [dataLoaded, setDataLoaded] = useState(false);
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

  // Session verification on mount
  useEffect(() => {
    const token = localStorage.getItem('roadnex_token');
    if (token) {
      fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCurrentUser(data.user);
        } else {
          localStorage.removeItem('roadnex_token');
          localStorage.removeItem('roadnex_user');
          setCurrentUser(null);
        }
      })
      .catch(err => {
        console.error('Session verify error:', err);
        localStorage.removeItem('roadnex_token');
        localStorage.removeItem('roadnex_user');
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Load persisted data from PostgreSQL once authenticated
  useEffect(() => {
    if (!currentUser || dataLoaded) return;

    const token = localStorage.getItem('roadnex_token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    Promise.allSettled([
      fetch('/api/reports',     { headers }).then(r => r.json()),
      fetch('/api/complaints',  { headers }).then(r => r.json()),
      fetch('/api/work-orders', { headers }).then(r => r.json()),
    ]).then(([repRes, cmpRes, woRes]) => {
      if (repRes.status === 'fulfilled' && repRes.value.success && repRes.value.reports.length > 0) {
        // Merge API reports into defects list (map to existing defect shape)
        const apiDefects = repRes.value.reports.map(r => ({
          id:           r.id,
          location:     r.location,
          type:         r.defectType,
          severity:     r.severity,
          confidence:   r.confidence,
          area:         r.area,
          depth:        r.depth,
          complaints:   1,
          waterlogging: r.waterlogging !== 'N/A',
          priorityScore: r.priorityScore,
          lat:          r.lat,
          lng:          r.lng,
          reportedDate: r.createdAt,
          status:       r.status,
          imageUrl:     r.imageUrl,
          citizenName:  r.citizenName,
          isMyUpload:   r.userId === currentUser.id,
        }));
        setDefects(prev => {
          const ids = new Set(apiDefects.map(d => d.id));
          return [...apiDefects, ...prev.filter(d => !ids.has(d.id))];
        });
      }

      if (cmpRes.status === 'fulfilled' && cmpRes.value.success && cmpRes.value.complaints.length > 0) {
        const apiComplaints = cmpRes.value.complaints.map(c => ({
          id:             c.id,
          citizenName:    c.citizenName,
          description:    c.description,
          location:       c.location,
          image:          c.image || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60',
          date:           c.date,
          status:         c.status,
          aiSimilarity:   c.aiSimilarity,
          matchedDefectId: c.matchedDefectId,
          isMyUpload:     c.userId === currentUser.id,
        }));
        setComplaints(prev => {
          const ids = new Set(apiComplaints.map(c => c.id));
          return [...apiComplaints, ...prev.filter(c => !ids.has(c.id))];
        });
      }

      if (woRes.status === 'fulfilled' && woRes.value.success && woRes.value.workOrders.length > 0) {
        const apiWorkOrders = woRes.value.workOrders.map(w => ({
          id:               w.id,
          defectId:         w.defectId,
          defectType:       w.defectType,
          location:         w.location,
          lat:              w.lat,
          lng:              w.lng,
          severity:         w.severity,
          priority:         w.priority,
          priorityScore:    w.priorityScore,
          status:           w.status,
          contractor:       w.contractor,
          targetCompletion: w.targetCompletion || '7 days',
          estimatedCost:    w.estimatedCost,
        }));
        setWorkOrders(prev => {
          const ids = new Set(apiWorkOrders.map(w => w.id));
          return [...apiWorkOrders, ...prev.filter(w => !ids.has(w.id))];
        });
      }

      setDataLoaded(true);
    }).catch(err => console.warn('[App] Failed to load DB data:', err));
  }, [currentUser, dataLoaded]);

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogin = (user, token) => {
    localStorage.setItem('roadnex_token', token);
    localStorage.setItem('roadnex_user', JSON.stringify(user));
    setCurrentUser(user);
    triggerToast(`Welcome ${user.name}! Logged in as ${user.role === 'admin' ? 'Municipal Admin' : 'Citizen User'}.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('roadnex_token');
    localStorage.removeItem('roadnex_user');
    setCurrentUser(null);
    triggerToast('Logged out cleanly. Session closed.');
    navigate('/');
  };

  const handleUpdateStatus = (defectId, newStatus) => {
    setDefects((prev) =>
      prev.map((d) => (d.id === defectId ? { ...d, status: newStatus } : d))
    );
    setWorkOrders((prev) =>
      prev.map((w) => (w.defectId === defectId ? { ...w, status: newStatus } : w))
    );
  };

  const handleMergeComplaint = async (complaintId, matchedDefectId) => {
    // Optimistic update
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId ? { ...c, status: `Merged into ${matchedDefectId}` } : c
      )
    );
    // Persist to PostgreSQL
    try {
      const token = localStorage.getItem('roadnex_token');
      await fetch(`/api/complaints/${complaintId}/merge`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ matchedDefectId }),
      });
    } catch (err) {
      console.warn('[App] Failed to persist merge to DB:', err);
    }
  };

  const handleAddWorkOrder = async (newOrder) => {
    // Optimistic local update
    setWorkOrders((prev) => [newOrder, ...prev]);

    const newComplaint = {
      id: 'C-' + Math.floor(2000 + Math.random() * 1000),
      citizenName: currentUser?.name || 'Citizen',
      location: newOrder.location,
      image: newOrder.imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&auto=format&fit=crop&q=60',
      date: new Date().toLocaleString(),
      description: `Reported ${newOrder.type} at ${newOrder.location}. Severity: ${newOrder.severity}.`,
      aiSimilarity: 0,
      matchedDefectId: newOrder.id,
      status: 'Reported',
      isMyUpload: true
    };
    setComplaints((prev) => [newComplaint, ...prev]);

    const newDefect = {
      id: newOrder.id,
      location: newOrder.location,
      type: newOrder.type,
      severity: newOrder.severity,
      confidence: newOrder.confidence || 96,
      area: newOrder.area || '2.4 m²',
      depth: newOrder.depth || '12 cm',
      complaints: 1,
      waterlogging: true,
      priorityScore: newOrder.priorityScore || 92,
      lat: newOrder.lat,
      lng: newOrder.lng,
      reportedDate: newOrder.date,
      status: newOrder.status,
      imageUrl: newOrder.imageUrl,
      isMyUpload: true,
    };
    setDefects((prev) => [newDefect, ...prev]);

    // Persist to PostgreSQL
    try {
      const token = localStorage.getItem('roadnex_token');
      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

      // 1. Save report
      const repRes = await fetch('/api/reports', {
        method: 'POST', headers,
        body: JSON.stringify({
          defectType:    newOrder.type,
          severity:      newOrder.severity,
          confidence:    newOrder.confidence || 96,
          priorityScore: newOrder.priorityScore || 92,
          area:          newOrder.area || '2.4 m²',
          depth:         newOrder.depth || '12 cm',
          waterlogging:  'Detected',
          location:      newOrder.location,
          lat:           newOrder.lat,
          lng:           newOrder.lng,
          imageUrl:      newOrder.imageUrl || null,
          aiAssessment:  newOrder.assessment || null,
          isPothole:     true,
        })
      }).then(r => r.json());

      const savedReportId = repRes.success ? repRes.report.id : null;

      // 2. Save work order
      await fetch('/api/work-orders', {
        method: 'POST', headers,
        body: JSON.stringify({
          reportId:      savedReportId,
          defectId:      newOrder.id,
          defectType:    newOrder.type,
          location:      newOrder.location,
          lat:           newOrder.lat,
          lng:           newOrder.lng,
          severity:      newOrder.severity,
          priority:      'High',
          priorityScore: newOrder.priorityScore || 92,
          contractor:    'Unassigned',
          estimatedCost: '₹0',
        })
      });
    } catch (err) {
      console.warn('[App] Failed to persist work order to DB:', err);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  // 1. Loader screen when session checking is active
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <p className="text-xs text-slate-400 font-mono tracking-wider animate-pulse">INITIALIZING ROADNEX...</p>
      </div>
    );
  }

  // Determine if active route is public
  const isPublicRoute = ['/', '/login', '/register', '/forgot-password', '/admin/login'].includes(location.pathname);

  // 2. Render public layout (no sidebar/header)
  if (isPublicRoute) {
    return (
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={
            currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace /> : <LoginPage onLogin={handleLogin} />
          } />
          <Route path="/register" element={
            currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace /> : <RegisterPage onLogin={handleLogin} />
          } />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/admin/login" element={
            currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace /> : <AdminLoginPage onLogin={handleLogin} />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      </>
    );
  }

  // 3. Render private authenticated layout (with Sidebar and Header)
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />

      {/* Main content grid */}
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
            {/* Protected Citizen Routes */}
            <Route path="/user/dashboard" element={
              <ProtectedRoute allowedRole="user" currentUser={currentUser} loading={loading}>
                <UserDashboardPage complaints={complaints} currentUser={currentUser} onTriggerToast={triggerToast} />
              </ProtectedRoute>
            } />
            <Route path="/user/report" element={
              <ProtectedRoute allowedRole="user" currentUser={currentUser} loading={loading}>
                <RoadAnalysisPage onTriggerToast={triggerToast} onAddWorkOrder={handleAddWorkOrder} />
              </ProtectedRoute>
            } />
            <Route path="/user/my-reports" element={
              <ProtectedRoute allowedRole="user" currentUser={currentUser} loading={loading}>
                <ComplaintsPage complaints={complaints} onMergeComplaint={handleMergeComplaint} onTriggerToast={triggerToast} currentUser={currentUser} />
              </ProtectedRoute>
            } />
            <Route path="/user/map" element={
              <ProtectedRoute allowedRole="user" currentUser={currentUser} loading={loading}>
                <GisMapPage defects={defects} onUpdateStatus={handleUpdateStatus} onTriggerToast={triggerToast} />
              </ProtectedRoute>
            } />
            <Route path="/user/settings" element={
              <ProtectedRoute allowedRole="user" currentUser={currentUser} loading={loading}>
                <SettingsPage onTriggerToast={triggerToast} />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRole="admin" currentUser={currentUser} loading={loading}>
                <DashboardPage defects={defects} onUpdateStatus={handleUpdateStatus} onTriggerToast={triggerToast} />
              </ProtectedRoute>
            } />
            <Route path="/admin/reports" element={
              <ProtectedRoute allowedRole="admin" currentUser={currentUser} loading={loading}>
                <ComplaintsPage complaints={complaints} onMergeComplaint={handleMergeComplaint} onTriggerToast={triggerToast} currentUser={currentUser} />
              </ProtectedRoute>
            } />
            <Route path="/admin/map" element={
              <ProtectedRoute allowedRole="admin" currentUser={currentUser} loading={loading}>
                <GisMapPage defects={defects} onUpdateStatus={handleUpdateStatus} onTriggerToast={triggerToast} />
              </ProtectedRoute>
            } />
            <Route path="/admin/work-orders" element={
              <ProtectedRoute allowedRole="admin" currentUser={currentUser} loading={loading}>
                <MaintenancePage workOrders={workOrders} defects={defects} onUpdateStatus={handleUpdateStatus} onTriggerToast={triggerToast} />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute allowedRole="admin" currentUser={currentUser} loading={loading}>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute allowedRole="admin" currentUser={currentUser} loading={loading}>
                <SettingsPage onTriggerToast={triggerToast} />
              </ProtectedRoute>
            } />

            {/* Catch-all Auth Redirect */}
            <Route path="*" element={
              currentUser ? (
                <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />
              ) : (
                <Navigate to="/" replace />
              )
            } />
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
  );
}
