import React, { useState } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Zap, 
  Droplets, 
  Recycle, 
  Sparkles, 
  Info,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';

export const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification 
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const navigate = useNavigate();

  const filtered = notifications.filter(n => {
    if (activeCategory === 'semua') return true;
    return n.category === activeCategory;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'energi':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'air':
        return <Droplets className="w-4 h-4 text-sky-500" />;
      case 'sampah':
        return <Recycle className="w-4 h-4 text-emerald-600" />;
      case 'poin':
        return <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <span>Sekretariat Daerah Kota Cirebon</span>
            <span>•</span>
            <span>Pusat Informasi & Notifikasi Sistem</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            Notifikasi & Pemberitahuan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Informasi status validasi data energi, setoran sampah, serta pencapaian poin
          </p>
        </div>

        {/* Bulk Action */}
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-emerald-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-all"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Tandai Semua Dibaca</span>
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-[#D9E9F0]">
        {[
          { id: 'semua', label: 'Semua Notifikasi' },
          { id: 'energi', label: 'Energi Listrik' },
          { id: 'air', label: 'Konsumsi Air' },
          { id: 'sampah', label: 'Sampah Terpilah' },
          { id: 'poin', label: 'Eco Points' },
          { id: 'sistem', label: 'Pengumuman Setda' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveCategory(item.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === item.id
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#D9E9F0] shadow-sm">
        {filtered.length === 0 ? (
          <EmptyState
            title="Tidak Ada Notifikasi"
            description="Semua pemberitahuan pada kategori ini sudah dibaca atau belum tersedia."
            icon={Bell}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                className={`py-4 px-3 sm:px-4 rounded-2xl transition-all flex items-start justify-between gap-4 ${
                  !notif.read ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs sm:text-sm ${!notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span>{notif.timestamp}</span>
                      {notif.link && (
                        <button
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            navigate(notif.link!);
                          }}
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                        >
                          Buka Halaman <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => markNotificationAsRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Tandai dibaca"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus notifikasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
