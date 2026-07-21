import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

function VerificationLogs() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let result = [...logs];

    if (search !== "") {
      const text = search.toLowerCase();

      result = result.filter(
        (log) =>
          log.employee_id?.toLowerCase().includes(text) ||
          log.full_name?.toLowerCase().includes(text) ||
          log.status?.toLowerCase().includes(text)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (log) => log.status === statusFilter
      );
    }

    setFilteredLogs(result);
    setCurrentPage(1);

  }, [logs, search, statusFilter]);

  async function fetchLogs() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(response.data);
      setFilteredLogs(response.data);

    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }

  async function downloadExcel() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/export/logs/excel",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = "verification_logs.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      toast.success("Excel Downloaded");

    } catch (error) {
      console.error(error);
      toast.error("Unable to download Excel");
    }
  }

  async function downloadPDF() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        "/export/logs/pdf",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = "verification_logs.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      toast.success("PDF Downloaded");

    } catch (error) {
      console.error(error);
      toast.error("Unable to download PDF");
    }
  }

  // ------------------------
  // Statistics
  // ------------------------

  const verifiedCount = logs.filter(
    (l) => l.status === "verified"
  ).length;

  const failedCount = logs.length - verifiedCount;

  const averageConfidence =
    logs.length > 0
      ? (
          logs.reduce(
            (sum, log) =>
              sum + (log.confidence || 0),
            0
          ) / logs.length
        ).toFixed(2)
      : 0;

  // ------------------------
  // Pagination
  // ------------------------

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;

  const currentLogs = filteredLogs.slice(
    indexOfFirstLog,
    indexOfLastLog
  );

  const totalPages = Math.ceil(
    filteredLogs.length / logsPerPage
  );
 return (
  <div className="flex bg-slate-100 min-h-screen">

    <Sidebar />

    <main className="flex-1 lg:ml-72 p-8">

      {/* ================= Header ================= */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Verification Logs
          </h1>

          <p className="text-gray-500 mt-2">
            Smart Face AI Verification History
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={downloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg"
          >
            📥 Excel
          </button>

          <button
            onClick={downloadPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl shadow-lg"
          >
            📄 PDF
          </button>

          <button
            onClick={fetchLogs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg"
          >
            🔄 Refresh
          </button>

        </div>

      </div>

      {/* ================= Statistics ================= */}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <p className="text-gray-500">
            Total Logs
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {logs.length}
          </h2>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <p className="text-gray-500">
            Verified
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {verifiedCount}
          </h2>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <p className="text-gray-500">
            Failed
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-2">
            {failedCount}
          </h2>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <p className="text-gray-500">
            Avg Confidence
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {averageConfidence}%
          </h2>

        </div>

      </section>

      {/* ================= Search ================= */}

      <section className="bg-white rounded-3xl shadow-lg p-6 mt-8">

        <div className="grid md:grid-cols-2 gap-5">

          <input
            type="text"
            placeholder="🔍 Search by Employee ID, Name or Status..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e)=>setStatusFilter(e.target.value)}
            className="border rounded-xl p-3"
          >

            <option value="all">
              All Status
            </option>

            <option value="verified">
              Verified
            </option>

            <option value="failed">
              Failed
            </option>

          </select>

        </div>

      </section>

      {/* ================= Table ================= */}

      <section className="bg-white rounded-3xl shadow-xl overflow-hidden mt-8">

        <table className="w-full">

          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">

            <tr>

              <th className="p-5 text-left">
                Employee
              </th>

              <th className="p-5 text-left">
                Status
              </th>

              <th className="p-5 text-left">
                Confidence
              </th>

              <th className="p-5 text-left">
                Date & Time
              </th>

            </tr>

          </thead>

          <tbody>
           

  {currentLogs.length === 0 ? (

    <tr>

      <td colSpan="4">

        <div className="py-20 text-center">

          <div className="text-7xl">
            📄
          </div>

          <h2 className="text-2xl font-bold mt-5 text-gray-700">
            No Verification Logs Found
          </h2>

          <p className="text-gray-500 mt-3">
            Verification history will appear here.
          </p>

        </div>

      </td>

    </tr>

  ) : (

    currentLogs.map((log) => (

      <tr
        key={log.id}
        className="border-b hover:bg-blue-50 transition duration-300"
      >

        {/* Employee */}

        <td className="p-5">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">

              {log.full_name?.charAt(0).toUpperCase()}

            </div>

            <div>

              <p className="font-semibold text-slate-800">

                {log.full_name}

              </p>

              <p className="text-sm text-gray-500">

                {log.employee_id}

              </p>

            </div>

          </div>

        </td>

        {/* Status */}

        <td className="p-5">

          {log.status === "verified" ? (

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

              🟢 Verified

            </span>

          ) : (

            <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">

              🔴 Failed

            </span>

          )}

        </td>

        {/* Confidence */}

        <td className="p-5">

          <div>

            <p className="font-semibold">

              {Number(log.confidence || 0).toFixed(2)}%

            </p>

            <div className="w-40 bg-gray-200 rounded-full h-2 mt-2">

              <div
                className={`h-2 rounded-full ${
                  log.status === "verified"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(
                    Number(log.confidence || 0),
                    100
                  )}%`,
                }}
              ></div>

            </div>

          </div>

        </td>

        {/* Date */}

        <td className="p-5 text-gray-600">

          {new Date(log.created_at).toLocaleString()}

        </td>

      </tr>

    ))

  )}

</tbody>

</table>

</section>
{/* Pagination */}

<div className="flex justify-between items-center mt-8">

  <p className="text-gray-500">

    Showing {currentLogs.length} of {filteredLogs.length} logs

  </p>

  <div className="flex items-center gap-4">

    <button
      disabled={currentPage === 1}
      onClick={() =>
        setCurrentPage(currentPage - 1)
      }
      className="bg-gray-700 text-white px-5 py-2 rounded-lg disabled:opacity-40"
    >
      ◀ Previous
    </button>

    <span className="font-semibold">

      Page {currentPage} of {totalPages || 1}

    </span>

    <button
      disabled={
        currentPage === totalPages ||
        totalPages === 0
      }
      onClick={() =>
        setCurrentPage(currentPage + 1)
      }
      className="bg-blue-600 text-white px-5 py-2 rounded-lg disabled:opacity-40"
    >
      Next ▶
    </button>

  </div>

</div>
<footer className="mt-16 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 shadow-2xl">

  <div className="flex flex-col lg:flex-row justify-between items-center">

    <div>

      <h2 className="text-2xl font-bold">

        Smart Face Identity Verification System

      </h2>

      <p className="text-gray-300 mt-2">

        AI Powered Face Recognition Dashboard

      </p>

    </div>

    <div className="mt-6 lg:mt-0 text-right">

      <h3 className="font-semibold">

        Version 1.0

      </h3>

      <p className="text-gray-400">

        React • FastAPI • PostgreSQL • ArcFace

      </p>

      <p className="text-gray-500 mt-2">

        © 2026 All Rights Reserved

      </p>

    </div>

  </div>

</footer>

</main>

</div>
);
}

export default VerificationLogs;