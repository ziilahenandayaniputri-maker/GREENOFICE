import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Flame, 
  History, 
  Leaf, 
  Target, 
  TrendingUp, 
  ChevronRight,
  Gift,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { EcoMascot } from '../components/mascot/EcoMascot';
import { getTodayDateKey } from '../utils/period';

export const EcoPointsPage: React.FC = () => {
  const { 
    currentUser, 
    challenges, 
    tips, 
    transactions, 
    completeChallenge, 
    completeDailyTip 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tips' | 'poin' | 'riwayat'>('tips');

  const isMaxLevel = currentUser.ecoPoints >= 3000;
  const nextMilestone = currentUser.ecoPoints >= 2000 ? 3000
    : currentUser.ecoPoints >= 1500 ? 2000 : 1500;
  const progressPercent = isMaxLevel ? 100
    : Math.min(100, Math.round((currentUser.ecoPoints / nextMilestone) * 100));
  const pointsToday = transactions
    .filter(transaction => transaction.date === getTodayDateKey())
    .reduce((sum, transaction) => sum + transaction.points, 0);

  const handleClaimChallenge = (id: string) => {
    const success = completeChallenge(id);
    if (success) {
      // Fire confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleClaimTip = (id: string) => {
    const success = completeDailyTip(id);
    if (success) {
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.7 }
      });
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
            <span>Apresiasi Budaya Ramah Lingkungan</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" />
            Eco Tips & Poin Penghargaan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kumpulkan poin melalui kebiasaan hemat energi dan pemilahan sampah di kantor
          </p>
        </div>
      </div>

      {/* Tabs matching Reference Image (Tips Harian, Poin, Riwayat) */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-[#D9E9F0] w-fit">
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tips'
              ? 'bg-[#2E7D32] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tips Harian
        </button>
        <button
          onClick={() => setActiveTab('poin')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'poin'
              ? 'bg-[#2E7D32] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tantangan Hijau ({challenges.filter(c => !c.completed).length})
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'riwayat'
              ? 'bg-[#2E7D32] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Riwayat Poin ({transactions.length})
        </button>
      </div>

      {/* User Eco Points Card matching Reference Image */}
      <div className="bg-gradient-to-r from-emerald-500 via-[#2E7D32] to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        
        {/* Background decorative circles & sparkles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-emerald-400/20 blur-lg pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
              <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-200 fill-emerald-200" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-widest block">
                Eco Points Anda
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black tracking-tight">
                  {currentUser.ecoPoints.toLocaleString('id-ID')}
                </span>
                <span className="text-sm sm:text-base font-bold text-emerald-100">pts</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                <Award className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Level: {currentUser.level}</span>
              </div>
            </div>
          </div>

          {/* Progress toward next level */}
          <div className="w-full sm:max-w-xs bg-black/15 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-emerald-100">{isMaxLevel ? 'Level Tertinggi' : 'Menuju Level Berikutnya'}</span>
              <span className="text-white">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-amber-400 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[11px] text-emerald-100 mt-2 font-medium">
              <span>Sekarang: {currentUser.ecoPoints}</span>
              <span>{isMaxLevel ? 'Maksimum' : `Target: ${nextMilestone} pts`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Daily Tips List (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Tips Ramah Lingkungan Hari Ini</h3>

            <div className="space-y-3">
              {tips.map((tip) => (
                <div 
                  key={tip.id}
                  className="bg-white rounded-2xl p-5 border border-[#D9E9F0] shadow-sm hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {tip.category}
                        </span>
                        <span className="text-xs font-bold text-amber-600">
                          +{tip.pointsReward} Pts
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {tip.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaimTip(tip.id)}
                    disabled={tip.completedToday}
                    className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      tip.completedToday
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{tip.completedToday ? 'Selesai' : 'Tandai Selesai'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mascot Encouragement Card */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl p-6 border border-[#D9E9F0] shadow-sm text-center flex flex-col items-center">
              <EcoMascot size="lg" />
              <h4 className="text-base font-bold text-slate-900 mt-4">
                "Hebat Sekali, {currentUser.name}!"
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Setiap tindakan hemat listrik dan pemilahan sampah di meja kerjamu menjaga Kota Cirebon tetap asri dan sejuk.
              </p>
              
              <div className="w-full mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3 text-left">
                <div className="p-3 rounded-xl bg-emerald-50">
                  <span className="text-[10px] text-emerald-800 font-semibold block">Tantangan Berjalan</span>
                  <span className="text-lg font-black text-emerald-900">
                    {challenges.filter(c => !c.completed).length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50">
                  <span className="text-[10px] text-amber-800 font-semibold block">Poin Hari Ini</span>
                  <span className="text-lg font-black text-amber-900">+{pointsToday}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tantangan Hijau Tab */}
      {activeTab === 'poin' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Tantangan Berkelanjutan Setda Kota Cirebon
            </h3>
            <span className="text-xs text-slate-500">
              Selesaikan aksi nyata dan klaim poin apresiasi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((ch) => (
              <div
                key={ch.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  ch.completed ? 'border-emerald-200 bg-emerald-50/20' : 'border-[#D9E9F0] shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {ch.category}
                    </span>
                    <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 fill-amber-500 text-amber-500" />
                      +{ch.points} pts
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {ch.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {ch.completed ? `Selesai (${ch.completedDate})` : `Sisa waktu: ${ch.deadlineDays} hari`}
                  </span>

                  <button
                    onClick={() => handleClaimChallenge(ch.id)}
                    disabled={ch.completed}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      ch.completed
                        ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                        : 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-sm'
                    }`}
                  >
                    {ch.completed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Sudah Diklaim</span>
                      </>
                    ) : (
                      <>
                        <Target className="w-3.5 h-3.5" />
                        <span>Klaim Selesai</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Riwayat Poin Tab */}
      {activeTab === 'riwayat' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D9E9F0] shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Riwayat Transaksi Eco Points
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Kategori</th>
                  <th className="py-3 px-3">Deskripsi Aktivitas</th>
                  <th className="py-3 px-3 text-right">Poin Diperoleh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {tx.description}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-700 text-sm">
                      +{tx.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
