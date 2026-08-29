import React, { useState } from 'react';
import { Search, Bell, Shield, User, LogOut, ChevronDown, Sparkles, Activity } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import AgentOrchestratorModal from './AgentOrchestratorModal';

export default function Header({ currentUser, onLogout, unreadCount, notifications, onMarkAllRead }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);

  const isAdmin = currentUser?.role === 'admin';
  const isMunicipal = currentUser?.role === 'municipal';
  const location = useLocation();

  if (
    location.pathname !== '/user/dashboard' && 
    location.pathname !== '/admin/dashboard' &&
    location.pathname !== '/municipal/dashboard'
  ) {
    return null;
  }

  return (
    <header className="h-20 glass border-b border-custom-sage/30 px-8 flex items-center justify-between sticky top-0 z-20 relative">
      {/* Top Ambient Gradient Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-custom-taupe via-custom-terra to-custom-taupe opacity-80"></div>

      {isAdmin ? (
        <div>
          <h2 className="text-xl font-extrabold text-custom-taupe tracking-tight">
            Urban Infrastructure Command Center
          </h2>
          <p className="text-xs text-custom-sage font-medium mt-0.5">
            Full operations command & daily citizen complaints review center
          </p>
        </div>
      ) : (
        <div className="relative w-96 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-custom-sage" />
          <input
            type="text"
            placeholder="Search defects, road IDs, locations..."
            className="w-full bg-white/50 border border-custom-sage/30 rounded-xl pl-9 pr-4 py-2 text-xs text-custom-taupe focus:outline-none focus:border-custom-terra font-medium transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-4 ml-auto">
        {/* Search Bar for Admin */}
        {isAdmin && (
          <div className="relative w-64 hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-custom-sage" />
            <input
              type="text"
              placeholder="Search defects, road IDs, locations..."
              className="w-full bg-white/50 border border-custom-sage/30 rounded-xl pl-9 pr-4 py-2 text-xs text-custom-taupe focus:outline-none focus:border-custom-terra font-medium transition-all"
            />
          </div>
        )}

        {/* AI Agent Orchestrator Trigger Button */}
        <button
          type="button"
          onClick={() => setShowAgentModal(true)}
          className="px-3 py-2 rounded-xl bg-custom-terra/10 hover:bg-custom-terra/20 text-custom-terra border border-custom-terra/30 transition-all text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm animate-pulse"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>🤖 AI Agent Studio</span>
        </button>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white/50 border border-custom-sage/30 text-custom-taupe hover:text-custom-terra hover:border-custom-terra/40 transition-all relative cursor-pointer"
          >
            <Bell className="w-4 h-4 text-custom-taupe" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-custom-terra text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(230,98,64,0.5)]">
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

        <AgentOrchestratorModal
          isOpen={showAgentModal}
          onClose={() => setShowAgentModal(false)}
        />

        {/* User Profile & Role Logout */}
        <div className="relative flex items-center gap-3 pl-3 border-l border-custom-sage/30">
          <Link 
            to={isAdmin ? '/admin/settings' : isMunicipal ? '/municipal/settings' : '/user/settings'}
            className="flex items-center gap-3 cursor-pointer group hover:bg-white/40 p-1.5 rounded-xl transition-all"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-lg ring-2 overflow-hidden ${
              isAdmin 
                ? 'bg-custom-terra ring-custom-terra/40 shadow-custom-terra/25 group-hover:ring-custom-terra' 
                : isMunicipal
                  ? 'bg-custom-sage ring-custom-sage/40 shadow-custom-sage/25 group-hover:ring-custom-sage'
                  : 'bg-custom-taupe ring-custom-taupe/40 shadow-custom-taupe/25 group-hover:ring-custom-taupe'
            }`}>
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                isAdmin ? 'AD' : isMunicipal ? 'MO' : 'CU'
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-custom-taupe leading-tight">
                {currentUser?.name || (isAdmin ? 'Md. Asad Raza' : isMunicipal ? 'Municipal Staff' : 'Rahul Sharma')}
              </p>
              <p className="text-[10px] text-custom-sage font-medium">
                {currentUser?.title || (isAdmin ? 'Chief Urban Engineer' : isMunicipal ? 'Municipal Operator' : 'Citizen User')}
              </p>
            </div>
          </Link>

          <button
            onClick={onLogout}
            title="Switch Account / Logout"
            className="p-2 rounded-xl bg-white/50 text-custom-taupe hover:text-custom-terra hover:bg-custom-terra/10 hover:border-custom-terra/40 transition-all border border-custom-sage/30 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Switch Role</span>
          </button>
        </div>
      </div>
    </header>
  );
}
