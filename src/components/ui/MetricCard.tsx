import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  isPositiveGood?: boolean;
  isIncrease?: boolean | null; // true = up, false = down, null = neutral
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  footerNote?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  change,
  isPositiveGood = true,
  isIncrease = null,
  icon: Icon,
  iconBgColor = 'bg-emerald-50',
  iconColor = 'text-emerald-600',
  footerNote,
  onClick
}) => {
  // Determine if trend indicator is colored green (good) or red/slate (bad)
  const isGood = isIncrease === null ? true : (isPositiveGood ? isIncrease : !isIncrease);

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-[#D9E9F0] shadow-sm hover:shadow-card transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-emerald-300' : ''
      }`}
    >
      {/* Top row: Icon and title */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-[#5A7184]">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Metric Value */}
      <div className="my-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#0F2942] tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs sm:text-sm font-semibold text-slate-500">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Bottom row: Percentage change or footer */}
      {(change || footerNote) && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          {change ? (
            <div className="flex items-center gap-1 font-semibold">
              {isIncrease === true && (
                <span className={`flex items-center gap-0.5 ${isGood ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  {change}
                </span>
              )}
              {isIncrease === false && (
                <span className={`flex items-center gap-0.5 ${isGood ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <TrendingDown className="w-3.5 h-3.5" />
                  {change}
                </span>
              )}
              {isIncrease === null && (
                <span className="text-emerald-700 flex items-center gap-0.5">
                  <Minus className="w-3 h-3" />
                  {change}
                </span>
              )}
              {footerNote && <span className="text-slate-400 font-normal ml-1">{footerNote}</span>}
            </div>
          ) : (
            <span className="text-slate-500 font-medium">{footerNote}</span>
          )}
        </div>
      )}
    </div>
  );
};
