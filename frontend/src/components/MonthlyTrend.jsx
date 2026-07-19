import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function MonthlyTrend({
  data,
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-[350px]">

      <h2 className="text-2xl font-bold mb-5">
        Monthly Verification Trend
      </h2>

      <ResponsiveContainer width="100%" height="90%">

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="verified"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default MonthlyTrend;