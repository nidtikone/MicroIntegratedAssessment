/** Palette for chart series, cycled by index. */
export const CHART_COLORS = [
  '#6366f1', // indigo (brand)
  '#22c55e', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#ef4444', // red
  '#14b8a6', // teal
];

export const colorAt = (i: number) => CHART_COLORS[i % CHART_COLORS.length];
