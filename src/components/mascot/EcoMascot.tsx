import React from 'react';

interface EcoMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  expression?: 'happy' | 'waving' | 'cheering';
  className?: string;
  showLeaves?: boolean;
}

export const EcoMascot: React.FC<EcoMascotProps> = ({ 
  size = 'md', 
  className = '',
  showLeaves = true 
}) => {
  const sizeMap = {
    sm: 'w-12 h-14',
    md: 'w-20 h-24',
    lg: 'w-28 h-32',
    xl: 'w-40 h-44',
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Floating subtle leaves if enabled */}
      {showLeaves && (
        <>
          <span className="absolute -top-1 -right-2 text-emerald-500 animate-pulse text-xs">🍃</span>
          <span className="absolute bottom-2 -left-3 text-emerald-400 text-xs opacity-70">🌱</span>
        </>
      )}

      {/* SVG Pixel-Art Mascot based on Reference Image */}
      <svg 
        viewBox="0 0 64 64" 
        className={`${sizeMap[size]} drop-shadow-md`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        {/* Shadow */}
        <ellipse cx="32" cy="60" rx="16" ry="3" fill="#D2E3EA" />

        {/* Head Leaf / Sprout (Eco feature) */}
        {/* Stem */}
        <rect x="31" y="4" width="2" height="6" fill="#1B5E20" />
        {/* Left Leaf */}
        <path d="M31 6 C 26 3, 23 8, 31 10 Z" fill="#4CAF50" stroke="#1B5E20" strokeWidth="1" />
        {/* Right Leaf */}
        <path d="M33 6 C 38 3, 41 8, 33 10 Z" fill="#81C784" stroke="#1B5E20" strokeWidth="1" />

        {/* Green Cap / Hair */}
        <rect x="22" y="10" width="20" height="12" rx="4" fill="#2E7D32" />
        <rect x="20" y="14" width="24" height="6" rx="2" fill="#388E3C" />
        <rect x="23" y="11" width="18" height="2" fill="#81C784" />

        {/* Face */}
        <rect x="21" y="17" width="22" height="16" rx="4" fill="#FFE0B2" />
        
        {/* Cheeks / Blush */}
        <rect x="22" y="26" width="3" height="2" fill="#FF8A80" rx="1" />
        <rect x="39" y="26" width="3" height="2" fill="#FF8A80" rx="1" />

        {/* Eyes (Cute Chibi Style) */}
        <rect x="25" y="21" width="3" height="5" rx="1.5" fill="#0F2942" />
        <rect x="26" y="22" width="1" height="2" fill="#FFFFFF" />
        
        <rect x="36" y="21" width="3" height="5" rx="1.5" fill="#0F2942" />
        <rect x="37" y="22" width="1" height="2" fill="#FFFFFF" />

        {/* Friendly Smile */}
        <path d="M30 28 Q32 31 34 28" stroke="#D84315" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Office Uniform (Blue Suit / Overalls matching the image) */}
        {/* White Collar / Inner Shirt */}
        <polygon points="30,33 34,33 32,37" fill="#FFFFFF" />
        <polygon points="31,34 33,34 32,39" fill="#4CAF50" /> {/* Green tie */}

        {/* Blue Jacket */}
        <rect x="22" y="33" width="20" height="15" rx="3" fill="#1976D2" />
        {/* Lapels */}
        <path d="M22 33 L29 38 L29 48 L22 46 Z" fill="#1565C0" />
        <path d="M42 33 L35 38 L35 48 L42 46 Z" fill="#1565C0" />

        {/* Eco Badge / Pin on chest */}
        <circle cx="26" cy="38" r="2" fill="#4CAF50" />
        <circle cx="26" cy="38" r="1" fill="#FFFFFF" />

        {/* Arms */}
        {/* Left Arm waving / happy */}
        <rect x="17" y="34" width="5" height="10" rx="2" fill="#1976D2" transform="rotate(-15 17 34)" />
        <circle cx="17" cy="44" r="2.5" fill="#FFE0B2" />

        {/* Right Arm cheering up */}
        <rect x="42" y="32" width="5" height="10" rx="2" fill="#1976D2" transform="rotate(15 42 32)" />
        <circle cx="47" cy="42" r="2.5" fill="#FFE0B2" />

        {/* Trousers / Legs */}
        <rect x="24" y="47" width="6" height="8" rx="1" fill="#0D47A1" />
        <rect x="34" y="47" width="6" height="8" rx="1" fill="#0D47A1" />

        {/* Shoes */}
        <rect x="23" y="54" width="7" height="4" rx="2" fill="#37474F" />
        <rect x="34" y="54" width="7" height="4" rx="2" fill="#37474F" />
      </svg>
    </div>
  );
};

export const CirebonCrest: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => {
  return (
    <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Official Cirebon Coat of Arms emblem approximation */}
      <svg viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
        <path d="M20 2 C 34 2, 38 12, 38 24 C 38 36, 20 44, 20 44 C 20 44, 2 36, 2 24 C 2 12, 6 2, 20 2 Z" fill="#FFC107" stroke="#333" strokeWidth="1.5" />
        <path d="M20 5 C 32 5, 35 14, 35 24 C 35 34, 20 41, 20 41 C 20 41, 5 34, 5 24 C 5 14, 8 5, 20 5 Z" fill="#1976D2" />
        {/* Golden gate / shrimp emblem */}
        <path d="M12 28 C 12 18, 28 18, 28 28 Z" fill="#FFD54F" stroke="#E65100" strokeWidth="0.8" />
        <rect x="18" y="24" width="4" height="12" fill="#FFFFFF" />
        <circle cx="20" cy="15" r="4" fill="#E53935" />
        <path d="M15 32 Q20 36 25 32" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
};
