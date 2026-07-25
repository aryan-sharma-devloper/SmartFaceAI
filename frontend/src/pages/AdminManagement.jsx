import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import toast from "react-hot-toast";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  async function loadAdmins() {
    try {
      const res = await api.get("/admin");
      setAdmins(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load admins");
    }
  }

  async function deleteAdmin(id) {
    if (!window.confirm("Delete this admin?")) return;

    try {
      await api.delete(`/admin/${id}`);

      toast.success("Admin deleted");

      loadAdmins();
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Delete failed"
      );
    }
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  const filteredAdmins = admins.filter((admin) =>
    `${admin.username} ${admin.full_name} ${admin.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold text-blue-700">
              Admin Management
            </h1>

            <p className="text-gray-500 mt-2">
              Manage system administrators
            </p>

          </div>

          <button
            onClick={loadAdmins}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Refresh
          </button>

        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-blue-600 text-white rounded-xl p-6">

            <p>Total Admins</p>

            <h1 className="text-5xl font-bold mt-2">
              {admins.length}
            </h1>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">

          <input
            type="text"
            placeholder="Search Admin..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border rounded-lg p-3 w-full mb-6"
          />

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-4">ID</th>

                <th>Username</th>

                <th>Name</th>

                <th>Email</th>

                <th>Role</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>
                              {filteredAdmins.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500"
                  >
                    No admins found.
                  </td>

                </tr>

              ) : (

                filteredAdmins.map((admin) => (

                  <tr
                    key={admin.id}
                    className="border-b hover:bg-blue-50"
                  >

                    <td className="text-center py-4">
                      {admin.id}
                    </td>

                    <td className="text-center">
                      {admin.username}
                    </td>

                    <td className="text-center font-semibold">
                      {admin.full_name}
                    </td>

                    <td className="text-center">
                      {admin.email}
                    </td>

                    <td className="text-center">
                      {admin.role}
                    </td>

                    <td className="text-center">

                      <button
                        onClick={() => deleteAdmin(admin.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>

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

export default AdminManagement;
          
            