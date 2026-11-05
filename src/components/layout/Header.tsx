import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  ChevronDown, 
  LogOut, 
  User, 
  Sparkles,
  Check,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CirebonCrest } from '../mascot/EcoMascot';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    notifications, 
    unreadNotificationCount, 
    logout, 
    markNotificationAsRead,
    markAllNotificationsAsRead 
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Current formatted date in Indonesian
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('listrik') || q.includes('air') || q.includes('energi')) {
      navigate('/energi');
    } else if (q.includes('sampah') || q.includes('organik') || q.includes('daur')) {
      navigate('/sampah');
    } else if (q.includes('poin') || q.includes('tips') || q.includes('tantangan')) {
      navigate('/eco-points');
    } else if (q.includes('laporan') || q.includes('analisis') || q.includes('kpi')) {
      navigate('/laporan');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D9E9F0] px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Mobile Logo / Brand Display */}
        <div className="flex items-center gap-2 lg:hidden">
          <CirebonCrest className="w-8 h-8" />
          <div>
            <div className="flex items-center gap-1 font-bold text-emerald-800 text-sm tracking-tight">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              GREENOFFICE
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Setda Kota Cirebon</p>
          </div>
        </div>

        {/* Global Search Bar matching reference image */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari data, gedung, atau laporan..."
              className="w-full bg-[#F1F8F9] hover:bg-[#E8F3F6] focus:bg-white text-xs sm:text-sm text-slate-800 pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
            />
          </div>
        </form>

        {/* Right Section: Date, Notifications, User Menu & Demo Role Switcher */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          
          {/* Current Date Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{formattedDate}</span>
          </div>

          {/* Notification Bell with Badge & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">Notifikasi</span>
                    {unreadNotificationCount > 0 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {unreadNotificationCount} Baru
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Tandai semua dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 5).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => {
                        markNotificationAsRead(item.id);
                        if (item.link) navigate(item.link);
                        setShowNotifMenu(false);
                      }}
                      className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                        !item.read ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                        !item.read ? 'bg-emerald-500' : 'bg-transparent'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${!item.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{item.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 px-4 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      navigate('/notifikasi');
                      setShowNotifMenu(false);
                    }}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold py-1 inline-flex items-center gap-1"
                  >
                    Buka Pusat Notifikasi Lengkap <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 focus:outline-none"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 font-medium capitalize">
                  {currentUser.role === 'admin' ? 'Admin Lingkungan' : currentUser.role === 'pimpinan' ? 'Pimpinan' : 'Pegawai'}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] bg-emerald-50 px-2.5 py-1.5 rounded-lg text-emerald-800 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> {currentUser.ecoPoints} pts
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-medium">
                      {currentUser.level}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/profil');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Profil & Pengaturan
                  </button>
                  {currentUser.role === 'pegawai' && (
                    <button
                      onClick={() => {
                        navigate('/eco-points');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" /> Eco Points & Tantangan
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Keluar (Logout)
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
