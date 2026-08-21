import React, { useState } from 'react';
import { Search, Bell, Shield, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

export default function Header({ currentUser, onLogout, unreadCount, notifications, onMarkAllRead }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="h-20 bg-[#070b14]/80 backdrop-blur-2xl border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Top Metallic Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          Urban Infrastructure Command Center
          <span className={`text-[11px] px-3 py-0.5 rounded-full border font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
            isAdmin
              ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {isAdmin ? <Shield className="w-3.5 h-3.5 text-cyan-400" /> : <Sparkles className="w-3.5 h-3.5 text-emerald-400" />}
            {isAdmin ? 'Municipal Admin' : 'Citizen Portal'}
          </span>
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {isAdmin 
            ? 'Full operations command & daily citizen complaints review center'
            : 'Capture road potholes, view real-time status & submit complaints'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            placeholder="Search defects, road IDs, locations..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-medium transition-all"
          />
        </div>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all relative cursor-pointer"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse shadow-[0_0_10px_#f43f5e]">
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
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-lg ring-2 ${
            isAdmin 
              ? 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 ring-cyan-400/40' 
              : 'bg-gradient-to-tr from-emerald-500 via-teal-600 to-cyan-600 ring-emerald-400/40'
          }`}>
            {isAdmin ? 'AD' : 'CU'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-extrabold text-slate-100 leading-tight">
              {currentUser?.name || (isAdmin ? 'Cmdr. A. Mehta' : 'Rahul Sharma')}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {currentUser?.title || (isAdmin ? 'Chief Urban Engineer' : 'Citizen User')}
            </p>
          </div>

          <button
            onClick={onLogout}
            title="Switch Account / Logout"
            className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all border border-slate-800 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Switch Role</span>
          </button>
        </div>
      </div>
    </header>
  );
}
