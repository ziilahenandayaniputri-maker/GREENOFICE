import React from 'react';
import { LucideIcon, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = FolderOpen,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-dashed border-[#D9E9F0]">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-5">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
