import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function DepartmentChart({ data }) {

  return (

    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">

        📊 Top Departments

      </h2>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="department" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#3b82f6"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}

export default DepartmentChart;