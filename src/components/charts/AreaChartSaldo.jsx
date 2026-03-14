import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fmtRp } from '../../utils/format';

const tooltipStyle = {
  contentStyle: { background:'#fff', border:'1px solid #dde3ec', borderRadius:10, fontFamily:'Sora,sans-serif', fontSize:12 },
  labelStyle: { color:'#1a202c' },
};

export default function AreaChartSaldo({ data, height = 200 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top:4, right:4, left:-16, bottom:0 }}>
        <defs>
          <linearGradient id="saldoGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#059669" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="label" tick={{ fill:'#718096', fontSize:11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill:'#718096', fontSize:10 }} axisLine={false} tickLine={false}
          tickFormatter={v => `${(v/1_000_000).toFixed(1)}jt`} />
        <Tooltip formatter={v => [fmtRp(v), 'Saldo']} {...tooltipStyle} />
        <Area type="monotone" dataKey="saldo" name="Saldo"
          stroke="#059669" strokeWidth={2} fill="url(#saldoGrad)"
          dot={{ fill:'#059669', strokeWidth:2, r:3 }} activeDot={{ r:5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
