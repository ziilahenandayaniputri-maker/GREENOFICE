import React from 'react';
import { EcoMascot } from './EcoMascot';

export const CityIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-end overflow-hidden ${className}`}>
      {/* Sky subtle gradient with sun and soft clouds */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-emerald-50/50 to-emerald-100/80 -z-10" />

      {/* Floating leaves background animation */}
      <div className="absolute top-12 left-10 text-emerald-400 opacity-60 text-xl animate-bounce">🍃</div>
      <div className="absolute top-24 right-14 text-emerald-500 opacity-50 text-2xl">🌱</div>
      <div className="absolute top-48 left-1/4 text-emerald-300 opacity-40 text-lg">🌿</div>

      {/* Skyline Silhouettes */}
      <svg className="w-full h-44 text-sky-200/70" viewBox="0 0 500 150" fill="currentColor" preserveAspectRatio="none">
        <rect x="20" y="50" width="30" height="100" opacity="0.6"/>
        <rect x="60" y="30" width="40" height="120" opacity="0.7"/>
        <rect x="110" y="70" width="35" height="80" opacity="0.5"/>
        <rect x="160" y="20" width="45" height="130" opacity="0.8"/>
        <rect x="220" y="60" width="40" height="90" opacity="0.6"/>
        <rect x="280" y="40" width="50" height="110" opacity="0.7"/>
        <rect x="340" y="15" width="40" height="135" opacity="0.8"/>
        <rect x="390" y="55" width="45" height="95" opacity="0.6"/>
        <rect x="445" y="35" width="40" height="115" opacity="0.7"/>
      </svg>

      {/* Balai Kota Cirebon landmark illustration */}
      <div className="relative w-full max-w-md mx-auto z-10 flex flex-col items-center">
        <svg viewBox="0 0 360 160" className="w-full h-auto drop-shadow-md">
          {/* Main Hall */}
          <rect x="60" y="70" width="240" height="70" fill="#E2EFF3" stroke="#8CA0B3" strokeWidth="2" />
          {/* Balcony / Pillars */}
          <rect x="80" y="90" width="200" height="50" fill="#F8FAFC" stroke="#8CA0B3" strokeWidth="1.5" />
          <line x1="110" y1="90" x2="110" y2="140" stroke="#8CA0B3" strokeWidth="3" />
          <line x1="140" y1="90" x2="140" y2="140" stroke="#8CA0B3" strokeWidth="3" />
          <line x1="170" y1="90" x2="170" y2="140" stroke="#8CA0B3" strokeWidth="3" />
          <line x1="200" y1="90" x2="200" y2="140" stroke="#8CA0B3" strokeWidth="3" />
          <line x1="230" y1="90" x2="230" y2="140" stroke="#8CA0B3" strokeWidth="3" />
          <line x1="260" y1="90" x2="260" y2="140" stroke="#8CA0B3" strokeWidth="3" />
          
          {/* Main Arch Door */}
          <path d="M170 140 L170 110 Q185 98 200 110 L200 140 Z" fill="#2E7D32" />
          <circle cx="185" cy="118" r="4" fill="#FFC107" />

          {/* Clock Tower / Landmark of Kota Cirebon */}
          <rect x="160" y="20" width="50" height="55" fill="#E2EFF3" stroke="#8CA0B3" strokeWidth="2" />
          <polygon points="160,20 185,2 210,20" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5" />
          {/* Clock */}
          <circle cx="185" cy="40" r="12" fill="#FFFFFF" stroke="#8CA0B3" strokeWidth="1.5" />
          <line x1="185" y1="40" x2="185" y2="33" stroke="#0F2942" strokeWidth="1.5" />
          <line x1="185" y1="40" x2="191" y2="40" stroke="#0F2942" strokeWidth="1.5" />

          {/* Windows */}
          <rect x="85" y="75" width="16" height="12" rx="2" fill="#81D4FA" />
          <rect x="120" y="75" width="16" height="12" rx="2" fill="#81D4FA" />
          <rect x="235" y="75" width="16" height="12" rx="2" fill="#81D4FA" />
          <rect x="270" y="75" width="16" height="12" rx="2" fill="#81D4FA" />
        </svg>

        {/* Green bushes & lawn */}
        <div className="w-full flex items-center justify-between -mt-6 z-20 px-4">
          <div className="flex -space-x-3">
            <span className="w-12 h-10 bg-emerald-500 rounded-t-full inline-block shadow-sm"></span>
            <span className="w-16 h-12 bg-emerald-600 rounded-t-full inline-block"></span>
            <span className="w-10 h-8 bg-emerald-400 rounded-t-full inline-block"></span>
          </div>

          <div className="flex -space-x-3">
            <span className="w-14 h-11 bg-emerald-500 rounded-t-full inline-block"></span>
            <span className="w-18 h-14 bg-emerald-700 rounded-t-full inline-block shadow-sm"></span>
            <span className="w-12 h-9 bg-emerald-400 rounded-t-full inline-block"></span>
          </div>
        </div>

        {/* Ground */}
        <div className="w-full h-8 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 rounded-t-xl" />
      </div>

      {/* Mascot at the bottom left with friendly speech bubble */}
      <div className="relative z-30 mb-4 flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-elevated border border-emerald-100 max-w-sm mx-auto">
        <EcoMascot size="sm" showLeaves={false} />
        <div>
          <p className="text-xs font-semibold text-emerald-900 leading-tight">
            "Bersama jaga lingkungan mulai dari kantor kita!"
          </p>
          <p className="text-[10px] text-slate-500">Mascot Hijau Setda Kota Cirebon</p>
        </div>
      </div>
    </div>
  );
};
