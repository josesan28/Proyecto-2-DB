// src/components/ui/BarChart.jsx
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarChart({ data = [], title = '', color = '#0f766e', unit = '' }) {
  if (!data.length) return null;

  const chartData = data.map(item => ({
    name: item.label.length > 14 ? item.label.slice(0, 13) + '…' : item.label,
    fullLabel: item.label,
    value: item.value
  }));

  const formatValue = (value) => {
    if (value >= 1000) return `${unit}${(value / 1000).toFixed(1)}k`;
    return `${unit}${value}`;
  };

  return (
    <div style={{ width: '100%' }}>
      {title && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>{title}</p>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <ReBarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="name"
            angle={-30}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
            interval={0}
          />
          <YAxis
            tickFormatter={formatValue}
            tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
          />
          <Tooltip
            formatter={(value) => [formatValue(value), '']}
            labelFormatter={(label, payload) => payload[0]?.payload.fullLabel || label}
            contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          />
          <Bar
            dataKey="value"
            fill={color}
            radius={[4, 4, 0, 0]}
            opacity={0.85}
          />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}