import React, { useState } from 'react';
import { Search, Bell, Shield, User, LogOut, ChevronDown } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

export default function Header({ currentUser, onLogout, unreadCount, notifications, onMarkAllRead }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="h-20 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          Urban Infrastructure Command Center
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold uppercase tracking-wider flex items-center gap-1 ${
            isAdmin
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {isAdmin ? <Shield className="w-3 h-3 text-cyan-400" /> : <User className="w-3 h-3 text-emerald-400" />}
            {isAdmin ? 'Municipal Admin' : 'Citizen User'}
          </span>
        </h2>
        <p className="text-xs text-slate-400 font-normal mt-0.5">
          {isAdmin 
            ? 'Full operations command & daily citizen complaints review center'
            : 'Capture road potholes, view real-time status & submit complaints'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search defects, road IDs, locations..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAllRead={onMarkAllRead}
            />
          )}
        </div>

        {/* User Profile & Role Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md ${
            isAdmin 
              ? 'bg-gradient-to-tr from-cyan-500 to-blue-600' 
              : 'bg-gradient-to-tr from-emerald-500 to-teal-600'
          }`}>
            {isAdmin ? 'AD' : 'CU'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-200 leading-tight">
              {currentUser?.name || (isAdmin ? 'Cmdr. A. Mehta' : 'Rahul Sharma')}
            </p>
            <p className="text-[10px] text-slate-400">
              {currentUser?.title || (isAdmin ? 'Chief Urban Engineer' : 'Citizen Portal')}
            </p>
          </div>

          <button
            onClick={onLogout}
            title="Switch Account / Logout"
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-slate-800 flex items-center gap-1 text-[11px] font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Switch Role</span>
          </button>
        </div>
      </div>
    </header>
  );
}
