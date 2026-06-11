import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

interface ChartProps {
  data: { threads: number; time: number }[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

export default function Chart({ data }: ChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        <p>Данные для графика появятся после запуска эксперимента</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: `${d.threads} ${d.threads === 1 ? 'поток' : d.threads < 5 ? 'потока' : 'потоков'}`,
    time: parseFloat(d.time.toFixed(2)),
    threads: d.threads,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 13, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            label={{
              value: 'Время (мс)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 13, fill: '#6b7280' },
            }}
          />
          <Tooltip
            contentStyle={{
              background: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
            }}
            formatter={(value: unknown) => [`${value} мс`, 'Время']}
          />
          <Bar dataKey="time" radius={[8, 8, 0, 0]} maxBarSize={80}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList
              dataKey="time"
              position="top"
              formatter={(v: unknown) => `${v} мс`}
              style={{ fontSize: 12, fill: '#6b7280', fontWeight: 500 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
