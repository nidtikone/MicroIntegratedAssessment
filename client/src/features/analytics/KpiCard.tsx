import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  accent?: boolean;
}

export default function KpiCard({ label, value, sub, icon, accent = false }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-5 ${accent ? 'bg-brand-600 text-white' : ''}`}
    >
      <div className="flex items-center justify-between">
        <p className={`text-sm font-medium ${accent ? 'text-brand-100' : 'text-slate-500'}`}>{label}</p>
        {icon && <span className={accent ? 'text-brand-200' : 'text-slate-300'}>{icon}</span>}
      </div>
      <p className={`mt-2 text-3xl font-bold tracking-tight ${accent ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </p>
      {sub && <p className={`mt-1 text-xs ${accent ? 'text-brand-100' : 'text-slate-400'}`}>{sub}</p>}
    </motion.div>
  );
}
