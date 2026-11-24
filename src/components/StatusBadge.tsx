import React from 'react';
import { ItemStatus } from '../types';
import { CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: ItemStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  const config = {
    Open: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: AlertCircle,
      label: 'Open Report',
    },
    Pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
      label: 'Under Verification',
    },
    Returned: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      label: 'Returned to Owner',
    },
    Claimed: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Sparkles,
      label: 'Claimed',
    },
  }[status] || {
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: AlertCircle,
    label: status,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs ${config.bg} ${sizeClasses[size]}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};
