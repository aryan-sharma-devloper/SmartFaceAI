import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

function WeeklyChart({ data }) {

    return (

        <div className="bg-white rounded-xl shadow-lg p-6 h-[380px]">

            <h2 className="text-2xl font-bold mb-6">
                Weekly Verifications
            </h2>

            <ResponsiveContainer width="100%" height="90%">

                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="verified"
                        fill="#2563eb"
                        radius={[8,8,0,0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default WeeklyChart;