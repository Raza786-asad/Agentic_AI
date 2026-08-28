import React, { useState, useEffect, useRef } from 'react';
import { Settings, User, Sun, Moon, Save, Shield, Bell, Lock, ToggleLeft, ToggleRight, Camera, Upload, Trash2, ImagePlus, CheckCircle2 } from 'lucide-react';

export default function SettingsPage({ currentUser, onUpdateProfile, onTriggerToast }) {
  const isAdmin = currentUser?.role === 'admin';
  const isMunicipal = currentUser?.role === 'municipal';
  const fileInputRef = useRef(null);

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('roadnex_theme') || 'light');

  // Profile photo states
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // New settings states
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    criticalAlerts: true
  });
  const [sysPreferences, setSysPreferences] = useState({
    refreshInterval: '30s',
    gpsPrecision: true
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Load existing user details
  useEffect(() => {
    if (currentUser) {
      setEditForm({
        name: currentUser.name || (isAdmin ? 'Md. Asad Raza' : 'Rahul Sharma'),
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
      // Load existing avatar
      if (currentUser.avatarUrl) {
        setPhotoPreview(currentUser.avatarUrl);
      } else {
        setPhotoPreview(null);
      }
    }
  }, [currentUser, isAdmin]);

  // Handle Theme Customization
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('roadnex_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (onTriggerToast) {
      onTriggerToast(`App interface updated to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme!`);
    }
  };

  // ─── Profile Photo Handlers ───────────────────────────────────────────────
  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, WebP, or GIF).');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB.');
      return false;
    }
    return true;
  };

  const handlePhotoUpload = async (file) => {
    if (!file || !validateFile(file)) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);

    setIsUploadingPhoto(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      const token = localStorage.getItem('roadnex_token');
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch('/api/auth/profile-photo', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });

      const data = await res.json();
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (data.success) {
        setPhotoPreview(data.avatarUrl);
        // Update the currentUser with the new avatarUrl
        if (onUpdateProfile) {
          onUpdateProfile({ ...currentUser, avatarUrl: data.avatarUrl });
        }
        setTimeout(() => {
          setIsUploadingPhoto(false);
          setUploadProgress(0);
          if (onTriggerToast) onTriggerToast('Profile photo updated successfully!');
        }, 500);
      } else {
        setIsUploadingPhoto(false);
        setUploadProgress(0);
        alert(data.error || 'Failed to upload photo.');
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error(error);
      setIsUploadingPhoto(false);
      setUploadProgress(0);
      alert('Error uploading profile photo.');
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const token = localStorage.getItem('roadnex_token');
      const res = await fetch('/api/auth/profile-photo', {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      const data = await res.json();
      if (data.success) {
        setPhotoPreview(null);
        if (onUpdateProfile) {
          onUpdateProfile({ ...currentUser, avatarUrl: null });
        }
        if (onTriggerToast) onTriggerToast('Profile photo removed.');
      }
    } catch (error) {
      console.error(error);
      alert('Error removing profile photo.');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoUpload(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePhotoUpload(file);
  };

  // ─── Profile Save ─────────────────────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('roadnex_token');
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        if (onUpdateProfile) onUpdateProfile(data.user);
        if (onTriggerToast) onTriggerToast('Your profile changes have been saved!');
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Save System & Notification Preferences
  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem('roadnex_notifications', JSON.stringify(notifications));
    localStorage.setItem('roadnex_sys_preferences', JSON.stringify(sysPreferences));
    if (onTriggerToast) {
      onTriggerToast('System preferences and alert zones updated successfully!');
    }
  };

  // Save Password Change
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New password and confirm password fields do not match.');
      return;
    }
    setIsUpdatingPassword(true);
    // Simulate API delay
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      if (onTriggerToast) {
        onTriggerToast('Your account security credentials have been updated!');
      }
    }, 1000);
  };

  // Get initials for fallback avatar
  const userInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-custom-taupe tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-custom-terra" /> Account & System Settings
        </h1>
        <p className="text-xs text-custom-sage font-medium mt-1">
          Manage your personal details, configure telemetry preferences, customize visual themes, and set account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PROFILE SECTION (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-custom-sage/30 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <User className="w-5 h-5 text-custom-terra" />
            <h3 className="text-sm font-bold text-custom-taupe uppercase tracking-wider">
              Personal Profile Details
            </h3>
          </div>

          {/* ═══ PROFILE PHOTO SECTION ═══ */}
          <div className="mb-8 p-5 rounded-2xl border-2 border-dashed transition-all duration-300"
            style={{
              borderColor: isDragging ? '#e66240' : 'rgba(162,161,139,0.3)',
              background: isDragging ? 'rgba(230,98,64,0.05)' : 'rgba(249,246,239,0.4)',
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative group">
                <div 
                  className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg ring-4 ring-white transition-all duration-300 group-hover:ring-custom-terra/30 cursor-pointer"
                  style={{
                    background: photoPreview 
                      ? 'transparent' 
                      : 'linear-gradient(135deg, #e66240, #e66240aa)',
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-extrabold text-2xl tracking-wider">{userInitials}</span>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Upload progress ring */}
                {isUploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[104px] h-[104px] rounded-2xl border-4 border-custom-terra animate-pulse" />
                  </div>
                )}

                {/* Success badge */}
                {uploadProgress === 100 && (
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-bold text-custom-taupe mb-1">Profile Photo</p>
                <p className="text-[10px] text-custom-sage font-medium mb-3 leading-relaxed">
                  Upload a profile picture. Max 5MB — JPEG, PNG, WebP, or GIF accepted.<br/>
                  Drag & drop an image here, or use the buttons below.
                </p>

                {/* Upload Progress Bar */}
                {isUploadingPhoto && (
                  <div className="mb-3 w-full max-w-xs">
                    <div className="h-1.5 bg-custom-sage/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-custom-terra to-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-custom-sage font-medium mt-1">
                      {uploadProgress < 100 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload complete!'}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {/* Upload / Change Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #e66240, #d45530)',
                      color: 'white',
                    }}
                  >
                    {photoPreview ? (
                      <><ImagePlus className="w-3.5 h-3.5" /> Change Photo</>
                    ) : (
                      <><Upload className="w-3.5 h-3.5" /> Upload Photo</>
                    )}
                  </button>

                  {/* Remove Button (only show if photo exists) */}
                  {photoPreview && !isUploadingPhoto && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-500 text-[11px] font-bold hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* ═══ PROFILE FORM ═══ */}
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-custom-sage mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-custom-cream border border-custom-sage/30 rounded-xl px-4 py-2.5 text-xs text-custom-taupe placeholder-slate-500 focus:outline-none focus:border-custom-terra font-medium"
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-custom-sage mb-1 block">Email Address (Read Only)</label>
                <input 
                  type="text" 
                  value={currentUser?.email || (isAdmin ? 'admin@roadguard.org' : 'citizen@roadguard.org')} 
                  disabled
                  className="w-full bg-custom-cream/20 border border-custom-sage/20 rounded-xl px-4 py-2.5 text-xs text-custom-sage cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-custom-sage mb-1 block">Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full bg-custom-cream border border-custom-sage/30 rounded-xl px-4 py-2.5 text-xs text-custom-taupe placeholder-slate-500 focus:outline-none focus:border-custom-terra font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-custom-sage mb-1 block">Address</label>
                <input 
                  type="text" 
                  value={editForm.address} 
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full bg-custom-cream border border-custom-sage/30 rounded-xl px-4 py-2.5 text-xs text-custom-taupe placeholder-slate-500 focus:outline-none focus:border-custom-terra font-medium"
                  placeholder="e.g. Sector 18, Noida, UP"
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-custom-taupe text-white text-xs font-bold hover:bg-custom-taupe/90 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>

        {/* VISUAL THEME SECTION (Span 4) */}
        <div className="lg:col-span-4 bg-white border border-custom-sage/30 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2.5 mb-6">
            <Sun className="w-5 h-5 text-custom-terra" />
            <h3 className="text-sm font-bold text-custom-taupe uppercase tracking-wider">
              Visual Interface Theme
            </h3>
          </div>

          <p className="text-[11px] text-custom-sage font-medium mb-4">
            Select your preferred display theme. Toggle between dark and light appearance modes.
          </p>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {/* Light Theme Option Card */}
            <div 
              onClick={() => handleThemeChange('light')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                theme === 'light' 
                  ? 'border-custom-terra bg-custom-cream/20 shadow-sm' 
                  : 'border-custom-sage/20 bg-custom-cream/5 hover:border-custom-sage/40'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${theme === 'light' ? 'bg-amber-100 text-amber-500' : 'bg-slate-100 text-slate-400'}`}>
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-custom-taupe">Light Mode</p>
                <p className="text-[10px] text-custom-sage font-medium">Standard default look</p>
              </div>
            </div>

            {/* Dark Theme Option Card */}
            <div 
              onClick={() => handleThemeChange('dark')}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                theme === 'dark' 
                  ? 'border-custom-terra bg-custom-cream/20 shadow-sm' 
                  : 'border-custom-sage/20 bg-custom-cream/5 hover:border-custom-sage/40'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-indigo-100 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
                <Moon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-custom-taupe">Dark Mode</p>
                <p className="text-[10px] text-custom-sage font-medium">Premium sleek dark look</p>
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS & PREFERENCES SECTION (Span 6) */}
        <div className="lg:col-span-6 bg-white border border-custom-sage/30 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Bell className="w-5 h-5 text-custom-terra" />
            <h3 className="text-sm font-bold text-custom-taupe uppercase tracking-wider">
              Alerts & System Preferences
            </h3>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-5">
            {/* Toggles */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-custom-taupe block">Email Resolve Reports</span>
                  <span className="text-[10px] text-custom-sage font-medium">Receive email notifications when defects in your sector are resolved</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setNotifications({ ...notifications, emailAlerts: !notifications.emailAlerts })}
                  className="text-custom-terra hover:scale-105 transition-transform"
                >
                  {notifications.emailAlerts ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-custom-sage" />}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-custom-sage/20 pt-3">
                <div>
                  <span className="font-semibold text-custom-taupe block">SMS Dispatch Status Alerts</span>
                  <span className="text-[10px] text-custom-sage font-medium">Get SMS alerts when municipal teams dispatch to your reported issues</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setNotifications({ ...notifications, smsAlerts: !notifications.smsAlerts })}
                  className="text-custom-terra hover:scale-105 transition-transform"
                >
                  {notifications.smsAlerts ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-custom-sage" />}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-custom-sage/20 pt-3">
                <div>
                  <span className="font-semibold text-custom-taupe block">High precision GPS Geolocation</span>
                  <span className="text-[10px] text-custom-sage font-medium">Allow persistent location polling for high-precision distance calculations</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setSysPreferences({ ...sysPreferences, gpsPrecision: !sysPreferences.gpsPrecision })}
                  className="text-custom-terra hover:scale-105 transition-transform"
                >
                  {sysPreferences.gpsPrecision ? <ToggleRight className="w-9 h-9" /> : <ToggleLeft className="w-9 h-9 text-custom-sage" />}
                </button>
              </div>
            </div>

            {/* Dropdown Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-custom-sage/20 pt-4">
              <div>
                <label className="text-[10px] font-semibold text-custom-sage uppercase tracking-wider mb-1 block">Telemetry Refresh rate</label>
                <select 
                  value={sysPreferences.refreshInterval}
                  onChange={e => setSysPreferences({ ...sysPreferences, refreshInterval: e.target.value })}
                  className="w-full bg-custom-cream border border-custom-sage/30 rounded-xl px-3 py-2 text-xs text-custom-taupe focus:outline-none focus:border-custom-terra"
                >
                  <option value="15s">15 Seconds (Real-time)</option>
                  <option value="30s">30 Seconds (Default)</option>
                  <option value="1m">1 Minute (Balanced)</option>
                  <option value="5m">5 Minutes (Battery Save)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-custom-taupe text-white text-xs font-bold hover:bg-custom-taupe/90 transition-all shadow-md flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" /> Save Preferences
              </button>
            </div>
          </form>
        </div>

        {/* SECURITY & PASSWORD SECTION (Span 6) */}
        <div className="lg:col-span-6 bg-white border border-custom-sage/30 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Lock className="w-5 h-5 text-custom-terra" />
            <h3 className="text-sm font-bold text-custom-taupe uppercase tracking-wider">
              Account Password & Security
            </h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-custom-sage mb-1 block">Current Password</label>
              <input 
                type="password" 
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full bg-custom-cream border border-custom-sage/30 rounded-xl px-4 py-2 text-xs text-custom-taupe placeholder-slate-500 focus:outline-none focus:border-custom-terra"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-custom-sage mb-1 block">New Password</label>
              <input 
                type="password" 
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full bg-custom-cream border border-custom-sage/30 rounded-xl px-4 py-2 text-xs text-custom-taupe placeholder-slate-500 focus:outline-none focus:border-custom-terra"
                placeholder="Minimum 8 characters"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-custom-sage mb-1 block">Confirm New Password</label>
              <input 
                type="password" 
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full bg-custom-cream border border-custom-sage/30 rounded-xl px-4 py-2 text-xs text-custom-taupe placeholder-slate-500 focus:outline-none focus:border-custom-terra"
                placeholder="Confirm password"
                required
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isUpdatingPassword}
                className="px-5 py-2.5 rounded-xl bg-custom-taupe text-white text-xs font-bold hover:bg-custom-taupe/90 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                <Shield className="w-3.5 h-3.5" />
                {isUpdatingPassword ? 'Updating...' : 'Update Password Credentials'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

