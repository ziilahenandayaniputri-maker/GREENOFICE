import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Zap, 
  Recycle, 
  BarChart3, 
  Sparkles, 
  Bell, 
  LogOut,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CirebonCrest } from '../mascot/EcoMascot';

export const Sidebar: React.FC = () => {
  const { currentUser, unreadNotificationCount, logout } = useApp();
  const navigate = useNavigate();

  const allNavItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['pegawai', 'admin', 'pimpinan'] },
    { to: '/energi', label: 'Pemantauan Energi', icon: Zap, roles: ['pegawai', 'admin'] },
    { to: '/sampah', label: 'Pengelolaan Sampah', icon: Recycle, roles: ['pegawai', 'admin'] },
    { to: '/laporan', label: 'Laporan & Analitik', icon: BarChart3, roles: ['admin', 'pimpinan'] },
    { to: '/eco-points', label: 'Eco Tips & Poin', icon: Sparkles, roles: ['pegawai'] },
    { 
      to: '/notifikasi', 
      label: 'Notifikasi', 
      icon: Bell, 
      roles: ['pegawai', 'admin', 'pimpinan'],
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : null 
    },
  ];
  const navItems = allNavItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#D9E9F0] h-screen sticky top-0 shrink-0 select-none">
      
      {/* Brand Header matching Reference Image */}
      <div className="p-5 pb-4 border-b border-slate-100 flex items-center gap-3">
        <CirebonCrest className="w-10 h-10" />
        <div>
          <div className="flex items-center gap-1.5 font-extrabold text-[#2E7D32] text-lg tracking-tight">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            GREENOFFICE
          </div>
          <p className="text-[11px] text-[#5A7184] font-medium leading-none">
            Sekretariat Daerah Kota Cirebon
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Utama
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#E1F5FE] text-[#0277BD] shadow-sm'
                    : 'text-[#5A7184] hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0288D1]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#2E7D32] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Persistent User Profile Card & Sign Out matching bottom left of reference */}
      <div className="p-3 border-t border-slate-100">
        <div 
          onClick={() => navigate('/profil')}
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F8F9] cursor-pointer transition-colors border border-slate-200/60"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                <UserCheck className="w-2.5 h-2.5 text-emerald-600" />
                {currentUser.role === 'admin' ? 'Admin Lingkungan' : currentUser.role === 'pimpinan' ? 'Pimpinan' : 'Pegawai'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </div>

    </aside>
  );
};
