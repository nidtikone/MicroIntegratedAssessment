import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import type { NumberFieldAnalytics } from '../../types';

export default function NumberStatCard({ field }: { field: NumberFieldAnalytics }) {
  const hasData = field.average !== null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
      <div className="flex items-center justify-between">
        <p className="truncate text-sm font-medium text-slate-500" title={field.label}>
          {field.label}
        </p>
        <Hash size={15} className="text-slate-300" />
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {hasData ? (
          <>
            {field.average}
            <span className="ml-1.5 text-base font-medium text-slate-400">avg</span>
          </>
        ) : (
          <span className="text-slate-300">—</span>
        )}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        {hasData ? (
          <>
            Min {field.min} · Max {field.max} · {field.count}{' '}
            {field.count === 1 ? 'response' : 'responses'}
          </>
        ) : (
          'No numeric answers yet'
        )}
      </p>
    </motion.div>
  );
}
