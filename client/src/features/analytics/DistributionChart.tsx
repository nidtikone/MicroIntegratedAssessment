import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { SelectFieldAnalytics } from '../../types';
import { colorAt } from './chartColors';

/** Renders a select field's option distribution: pie for single-select, bar for multiselect. */
export default function DistributionChart({ field }: { field: SelectFieldAnalytics }) {
  const isMulti = field.type === 'multiselect';
  const hasData = field.distribution.some((d) => d.count > 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-800">{field.label}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {isMulti ? 'multi-select' : 'select'}
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-400">
        {field.mostSelected ? (
          <>
            Most selected: <span className="font-medium text-slate-600">{field.mostSelected}</span>
          </>
        ) : (
          'No selections yet'
        )}
      </p>

      <div className="h-64">
        {!hasData ? (
          <div className="grid h-full place-items-center text-sm text-slate-400">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {isMulti ? (
              <BarChart
                data={field.distribution}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 4, bottom: 4 }}
              >
                <CartesianGrid horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis
                  type="category"
                  dataKey="option"
                  width={90}
                  tick={{ fontSize: 12, fill: '#475569' }}
                />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {field.distribution.map((_, i) => (
                    <Cell key={i} fill={colorAt(i)} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={field.distribution.filter((d) => d.count > 0)}
                  dataKey="count"
                  nameKey="option"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {field.distribution
                    .filter((d) => d.count > 0)
                    .map((_, i) => (
                      <Cell key={i} fill={colorAt(i)} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(v) => <span className="text-slate-600">{v}</span>}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
