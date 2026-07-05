import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#0f766e", "#2563eb", "#d97706", "#e11d48", "#7c3aed"];

function DashboardChart({ data = [], loading = false }) {
  if (loading) {
    return <div className="chart-empty">Loading category chart...</div>;
  }

  if (!data.length) {
    return <div className="chart-empty">No category spending yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          innerRadius={66}
          nameKey="category"
          outerRadius={112}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip
          formatter={(value) =>
            new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(value)
          }
        />

        <Legend iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DashboardChart;
