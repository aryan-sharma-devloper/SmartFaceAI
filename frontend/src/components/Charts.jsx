import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#ef4444",
  "#f59e0b",
];

function Charts({
  weekly = [],
  monthly = [],
  pie = {},
}) {
  const pieData = [
    {
      name: "Verified",
      value: pie.verified || 0,
    },
    {
      name: "Failed",
      value: pie.failed || 0,
    },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">

      {/* Weekly Bar Chart */}

      <div className="bg-white rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-6 text-slate-700">
          Weekly Verification
        </h2>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <BarChart data={weekly}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="verified"
              fill="#2563eb"
              radius={[8, 8, 0, 0]}
              animationDuration={1200}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* Pie Chart */}

      <div className="bg-white rounded-2xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-6 text-slate-700">
          Verification Ratio
        </h2>

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              animationDuration={1200}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* Monthly Trend */}

      <div className="bg-white rounded-2xl shadow-xl p-6 lg:col-span-2">

        <h2 className="text-2xl font-bold mb-6 text-slate-700">
          Monthly Verification Trend
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <LineChart data={monthly}>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="verified"
              stroke="#22c55e"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
              animationDuration={1500}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default Charts;