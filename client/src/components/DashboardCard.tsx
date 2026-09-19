import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  color?: 'gold' | 'emerald' | 'amber' | 'blue';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'gold'
}) => {
  const colorStyles = {
    gold: 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-[#d4af37]/30 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-[#a39e9b] font-semibold">{title}</span>
        <div className={`p-3 rounded-xl border ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <h3 className="font-serif text-3xl font-bold text-[#f8f5f0]">{value}</h3>
        {subtitle && <p className="text-xs text-[#a39e9b] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
