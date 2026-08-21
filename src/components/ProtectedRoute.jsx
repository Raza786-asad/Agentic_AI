import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole, currentUser, loading }) {
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
        <p className="text-xs text-slate-400 font-mono tracking-wider animate-pulse">VERIFYING ROADNEX SESSION...</p>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login based on required role
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/login'} replace />;
  }

  if (currentUser.role !== allowedRole) {
    // Role mismatch: redirect to their respective dashboard
    return <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }

  return children;
}
