import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { fmtRp } from '../../utils/format';
import { CHART_COLORS } from '../../utils/constants';

const tooltipStyle = {
  contentStyle: {
    background: '#fff', border: '1px solid #dde3ec',
    borderRadius: 10, fontFamily: 'Sora,sans-serif', fontSize: 12,
  },
};

// Custom legend dengan nama lengkap
const renderLegend = ({ payload }) => (
  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 16px', justifyContent:'center', marginTop:8 }}>
    {payload.map((entry, i) => (
      <div key={i} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.78rem', color:'var(--text2)' }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:entry.color, flexShrink:0 }} />
        <span style={{ fontWeight:500 }}>{entry.value}</span>
        <span style={{ color:'var(--text3)', fontFamily:'var(--mono)', fontSize:'0.72rem' }}>
          {entry.payload?.percent ? `${(entry.payload.percent*100).toFixed(0)}%` : ''}
        </span>
      </div>
    ))}
  </div>
);

export default function PieChartKategori({ data, height = 230 }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <p>Belum ada data pengeluaran</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="45%"
          outerRadius={78}
          dataKey="value"
          label={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={v => [fmtRp(v)]} {...tooltipStyle} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  );
}
