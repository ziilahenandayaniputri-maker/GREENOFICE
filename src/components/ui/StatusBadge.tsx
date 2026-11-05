import React from 'react';
import { RecordStatus } from '../../types';

interface StatusBadgeProps {
  status: RecordStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Menunggu':
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200/70';
      break;
    case 'Disetujui':
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200/70';
      break;
    case 'Ditolak':
      badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200/70';
      break;
    case 'Terpilah':
      badgeStyle = 'bg-sky-50 text-sky-800 border-sky-200/70';
      break;
    case 'Didaur Ulang':
      badgeStyle = 'bg-teal-50 text-teal-800 border-teal-200/70';
      break;
    default:
      badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 fill-current bg-current opacity-80" />
      {status}
    </span>
  );
};
