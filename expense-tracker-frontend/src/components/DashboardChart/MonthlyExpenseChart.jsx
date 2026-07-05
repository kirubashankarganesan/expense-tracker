import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function MonthlyExpenseChart({ data = [], loading = false }) {
  if (loading) {
    return <div className="chart-empty">Loading monthly trend...</div>;
  }

  if (!data.length) {
    return <div className="chart-empty">No monthly expenses to show yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          stroke="#e5e7eb"
          strokeDasharray="4 4"
          vertical={false}
        />

        <XAxis dataKey="month" tickLine={false} />

        <YAxis tickLine={false} width={72} />

        <Tooltip
          cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
          formatter={(value) =>
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(value)
          }
        />

        <Bar dataKey="amount" fill="#2563eb" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyExpenseChart;
