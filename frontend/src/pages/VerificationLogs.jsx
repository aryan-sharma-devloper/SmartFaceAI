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

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const text = search.toLowerCase();

    setFilteredLogs(
      logs.filter(
        (log) =>
          log.employee_id.toLowerCase().includes(text) ||
          log.full_name.toLowerCase().includes(text) ||
          log.status.toLowerCase().includes(text)
      )
    );
  }, [search, logs]);

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
  const downloadExcel = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/export/logs/excel", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      "verification_logs.xlsx"
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Excel Downloaded");

  } catch (error) {
    console.error(error);
    toast.error("Unable to download Excel");
  }
};

const downloadPDF = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/export/logs/pdf", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      "verification_logs.pdf"
    );

    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("PDF Downloaded");

  } catch (error) {
    console.error(error);
    toast.error("Unable to download PDF");
  }
};
  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 ml-72 p-10">

        <div className="flex justify-between items-center mb-8">

  <h1 className="text-4xl font-bold text-slate-800">
    Verification Logs
  </h1>

  <div className="flex gap-3">

    <button
      onClick={downloadExcel}
      className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
    >
      📥 Export Excel
    </button>

    <button
      onClick={downloadPDF}
      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
    >
      📄 Export PDF
    </button>

    <button
      onClick={fetchLogs}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
    >
      🔄 Refresh
    </button>

  </div>

</div>

        <input
          type="text"
          placeholder="Search Employee..."
          className="w-full mb-6 p-3 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-4 text-left">
                  Employee ID
                </th>

                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Confidence
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredLogs.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center p-8 text-gray-500"
                  >
                    No verification logs found.
                  </td>

                </tr>

              ) : (

                filteredLogs.map((log) => (

                  <tr
                    key={log.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4">
                      {log.employee_id}
                    </td>

                    <td className="p-4">
                      {log.full_name}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          log.status === "verified"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {log.status}
                      </span>

                    </td>

                    <td className="p-4">
                      {log.confidence?.toFixed(2)}%
                    </td>

                    <td className="p-4">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default VerificationLogs;