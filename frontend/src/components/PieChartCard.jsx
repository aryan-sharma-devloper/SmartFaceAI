import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function PieChartCard({
  verified,
  failed,
}) {
  const data = [
    {
      name: "Verified",
      value: verified,
    },
    {
      name: "Failed",
      value: failed,
    },
  ];

  const COLORS = [
    "#22c55e",
    "#ef4444",
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-[350px]">

      <h2 className="text-2xl font-bold mb-5">
        Verification Ratio
      </h2>

      <ResponsiveContainer width="100%" height="90%">

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
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
  );
}

export default PieChartCard;