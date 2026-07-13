/**
 * Sloupcový graf příjmy vs. výdaje po měsících (Recharts knihovna).
 * data = pole { month, income, expense } - připravené v AnalyzaHistorieSlide.
 */
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function MonthlyBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.7)' }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip />
        {/* Dva Bar prvky = dva sloupce vedle sebe pro každý měsíc */}
        <Bar dataKey="income" fill="#ffffff" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="#C2569B" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyBarChart;