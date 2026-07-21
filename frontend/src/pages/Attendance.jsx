import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";

function Attendance() {
  const [attendance, setAttendance] = useState([]);

  const [stats, setStats] = useState({
    total_users: 0,
    present_today: 0,
    checked_out: 0,
    total_today: 0,
  });

  async function loadAttendance() {
    try {
      const res = await api.get("/attendance");
      setAttendance(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadStats() {
    try {
      const res = await api.get("/attendance/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadAttendance();
    loadStats();

    const interval = setInterval(() => {
      loadAttendance();
      loadStats();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8 overflow-x-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700">
            Attendance Management
          </h1>

          <p className="text-gray-500 mt-2">
            View employee attendance records
          </p>
        </div>

        {/* Dashboard Cards */}

        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-lg">Employees</h2>
            <h1 className="text-5xl font-bold mt-2">
              {stats.total_users}
            </h1>
          </div>

          <div className="bg-green-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-lg">Present Today</h2>
            <h1 className="text-5xl font-bold mt-2">
              {stats.present_today}
            </h1>
          </div>

          <div className="bg-yellow-500 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-lg">Checked Out</h2>
            <h1 className="text-5xl font-bold mt-2">
              {stats.checked_out}
            </h1>
          </div>

          <div className="bg-purple-600 rounded-xl p-6 text-white shadow-lg">
            <h2 className="text-lg">Attendance Today</h2>
            <h1 className="text-5xl font-bold mt-2">
              {stats.total_today}
            </h1>
          </div>

        </div>

        {/* Attendance Table */}

        <div className="bg-white rounded-2xl shadow-xl p-6">

          <div className="overflow-x-auto">

            <table className="min-w-[1400px] w-full">

              <thead className="bg-blue-600 text-white">

                <tr>

                  <th className="p-4">ID</th>

                  <th>Employee ID</th>

                  <th>Employee Name</th>

                  <th>Department</th>

                  <th>Email</th>

                  <th>Phone</th>

                  <th>Date</th>

                  <th>Check In</th>

                  <th>Check Out</th>

                  <th>Working Hours</th>

                  <th>Status</th>

                  <th>Camera</th>

                </tr>

              </thead>

              <tbody>

                {attendance.length === 0 ? (

                  <tr>

                    <td
                      colSpan="12"
                      className="text-center py-10 text-gray-500"
                    >
                      No attendance records found.
                    </td>

                  </tr>

                ) : (

                  attendance.map((item) => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-blue-50 transition"
                    >

                      <td className="text-center py-4">
                        {item.id}
                      </td>

                      <td className="text-center">
                        {item.employee_id}
                      </td>

                      <td className="text-center font-semibold">
                        {item.full_name}
                      </td>

                      <td className="text-center">
                        {item.department}
                      </td>

                      <td className="text-center">
                        {item.email}
                      </td>

                      <td className="text-center">
                        {item.phone}
                      </td>

                      <td className="text-center">
                        {item.date}
                      </td>

                      <td className="text-center">
                        {item.check_in}
                      </td>

                      <td className="text-center">
                        {item.check_out || "-"}
                      </td>

                      <td className="text-center">
                        {item.working_hours || "-"}
                      </td>

                      <td className="text-center">

                        <span
                          className={`px-3 py-1 rounded-full font-semibold ${
                            item.status === "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                      <td className="text-center">
                        {item.camera_name}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Attendance;