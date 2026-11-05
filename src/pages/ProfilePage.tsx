import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Building, 
  Mail, 
  Award, 
  RotateCcw, 
  Database, 
  Key, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CirebonCrest } from '../components/mascot/EcoMascot';

export const ProfilePage: React.FC = () => {
  const { currentUser, resetAllDemoData } = useApp();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mereset seluruh data demo ke kondisi awal?')) {
      resetAllDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <span>Sekretariat Daerah Kota Cirebon</span>
            <span>•</span>
            <span>Pengaturan Akun & Hak Akses</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            Profil & Manajemen Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Informasi identitas aparatur, peran pengguna, dan konfigurasi sistem GREENOFFICE
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9E9F0] shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md"
          />

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentUser.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 w-fit mx-auto sm:mx-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentUser.role === 'admin' ? 'Admin Lingkungan' : currentUser.role === 'pimpinan' ? 'Pimpinan' : 'Pegawai'}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 font-medium">{currentUser.roleTitle}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Building className="w-4 h-4 text-slate-400" />
                <span>{currentUser.department}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Award className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{currentUser.ecoPoints.toLocaleString('id-ID')} Eco Points</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Level: {currentUser.level}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Permissions */}
      <div className="bg-white rounded-3xl p-6 border border-[#D9E9F0] shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-2">
          Hak Akses Peran Anda
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Fitur yang tersedia berdasarkan akun yang sedang masuk.
        </p>

        <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50">
          <h4 className="text-sm font-bold text-slate-900 mb-2">
            {currentUser.role === 'admin'
              ? 'Admin Lingkungan'
              : currentUser.role === 'pimpinan' ? 'Pimpinan' : 'Pegawai'}
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {currentUser.role === 'admin'
              ? 'Mengelola dan memvalidasi pencatatan energi dan sampah serta melihat laporan analitik.'
              : currentUser.role === 'pimpinan'
                ? 'Memantau ringkasan dan KPI serta mengesahkan laporan keberlanjutan.'
                : 'Mencatat pemakaian energi dan sampah, melihat riwayat, serta mengumpulkan Eco Points.'}
          </p>
        </div>
      </div>

      {/* Backend & Supabase Architecture Status */}
      <div className="bg-white rounded-3xl p-6 border border-[#D9E9F0] shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Penyimpanan Data & Status Integrasi
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Aplikasi saat ini menyimpan data demo di <strong>Local Storage browser</strong>. Integrasi Supabase belum aktif; pengaturan URL dan kunci saja belum menghubungkan aplikasi ke database.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                Variabel lingkungan jika integrasi Supabase diimplementasikan:
              </p>
              <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
                <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
                <p>VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance & Reset Demo */}
      {currentUser.role === 'admin' && (
      <div className="bg-white rounded-3xl p-6 border border-[#D9E9F0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Reset Data Demo</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Kembalikan seluruh data energi, sampah, poin, dan notifikasi ke data bawaan awal.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold rounded-xl border border-slate-200 transition-all shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Semua Data Demo</span>
        </button>
      </div>
      )}

      {currentUser.role === 'admin' && resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Data demo berhasil direset ke kondisi awal.</span>
        </div>
      )}

    </div>
  );
};
