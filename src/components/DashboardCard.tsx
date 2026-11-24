import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'teal' | 'amber' | 'emerald' | 'navy';
  badge?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'teal',
  badge,
}) => {
  const variantStyles = {
    teal: {
      bg: 'bg-teal-50/60',
      border: 'border-teal-200/80',
      iconBg: 'bg-teal-500 text-white',
      accent: 'text-teal-900',
    },
    blue: {
      bg: 'bg-blue-50/60',
      border: 'border-blue-200/80',
      iconBg: 'bg-blue-600 text-white',
      accent: 'text-blue-900',
    },
    amber: {
      bg: 'bg-amber-50/60',
      border: 'border-amber-200/80',
      iconBg: 'bg-amber-500 text-white',
      accent: 'text-amber-900',
    },
    emerald: {
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-600 text-white',
      accent: 'text-emerald-900',
    },
    navy: {
      bg: 'bg-navy-50/70',
      border: 'border-navy-200/80',
      iconBg: 'bg-navy-800 text-white',
      accent: 'text-navy-950',
    },
  }[variant];

  return (
    <div
      className={`rounded-2xl p-5 border ${variantStyles.border} ${variantStyles.bg} shadow-subtle transition-all duration-200 flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">{title}</span>
        <div className={`p-2.5 rounded-xl shadow-xs ${variantStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <span className={`text-3xl font-extrabold tracking-tight ${variantStyles.accent}`}>
          {value}
        </span>
        {badge && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 text-slate-700 border border-slate-200/60">
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
};
