import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    faces: 0,
    verified_today: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(response.data);
    } catch (error) {
      console.error("Dashboard Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Smart Face AI
        </h1>

        <button
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>

      </div>

      {/* Main */}
      <div className="p-10">

        <h2 className="text-3xl font-bold">
          Welcome Admin 👋
        </h2>

        <p className="mt-2 text-gray-600">
          Smart Face Identity Verification System
        </p>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-700">
              👥 Users
            </h3>

            <p className="text-5xl font-bold text-blue-600 mt-5">
              {stats.users}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-700">
              😊 Face Embeddings
            </h3>

            <p className="text-5xl font-bold text-green-600 mt-5">
              {stats.faces}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-700">
              ✅ Verified Today
            </h3>

            <p className="text-5xl font-bold text-purple-600 mt-5">
              {stats.verified_today}
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-4 flex-wrap">

          <button
            onClick={() => navigate("/users")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            👥 Manage Users
          </button>

          <button
            onClick={() => navigate("/add-user")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            ➕ Add User
          </button>

          <button
            onClick={() => navigate("/verify")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            ✅ Verify Face
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;