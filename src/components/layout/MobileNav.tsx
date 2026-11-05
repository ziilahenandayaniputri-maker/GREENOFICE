import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Zap, Recycle, BarChart3, User, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { currentUser } = useApp();
  const allItems = [
    { to: '/', label: 'Beranda', icon: LayoutDashboard, roles: ['pegawai', 'admin', 'pimpinan'] },
    { to: '/energi', label: 'Energi', icon: Zap, roles: ['pegawai', 'admin'] },
    { to: '/sampah', label: 'Sampah', icon: Recycle, roles: ['pegawai', 'admin'] },
    { to: '/laporan', label: 'Laporan', icon: BarChart3, roles: ['admin', 'pimpinan'] },
    { to: '/eco-points', label: 'Eco Poin', icon: Sparkles, roles: ['pegawai'] },
    { to: '/profil', label: 'Profil', icon: User, roles: ['pegawai', 'admin', 'pimpinan'] },
  ];
  const items = allItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D9E9F0] px-2 py-1.5 shadow-elevated">
      <div className="grid max-w-md mx-auto" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#2E7D32] font-bold'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50' : ''}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#2E7D32]' : 'text-slate-400'}`} />
                  </div>
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
