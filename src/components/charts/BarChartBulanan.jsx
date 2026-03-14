import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fmtRp } from '../../utils/format';

const tooltipStyle = {
  contentStyle: { background:'#fff', border:'1px solid #dde3ec', borderRadius:10, fontFamily:'Sora,sans-serif', fontSize:12 },
  labelStyle: { color:'#1a202c' },
};

export default function BarChartBulanan({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top:4, right:4, left:-16, bottom:0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="label" tick={{ fill:'#718096', fontSize:11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill:'#718096', fontSize:10 }} axisLine={false} tickLine={false}
          tickFormatter={v => `${(v/1_000_000).toFixed(1)}jt`} />
        <Tooltip formatter={v => [fmtRp(v)]} {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize:11, color:'#4a5568', paddingTop:8 }} />
        <Bar dataKey="pemasukan"   name="Pemasukan"   fill="#059669" radius={[4,4,0,0]} maxBarSize={32} />
        <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#dc2626" radius={[4,4,0,0]} maxBarSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
