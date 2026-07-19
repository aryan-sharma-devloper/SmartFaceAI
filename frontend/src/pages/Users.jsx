import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const text = search.toLowerCase();

    const result = users.filter((user) => {
      return (
        user.employee_id.toLowerCase().includes(text) ||
        user.full_name.toLowerCase().includes(text) ||
        user.email.toLowerCase().includes(text) ||
        user.department.toLowerCase().includes(text) ||
        (user.phone || "").toLowerCase().includes(text)
      );
    });

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [search, users]);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User Deleted Successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete user.");
    }
  }

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          Manage Users
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/add-user")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
          >
            ➕ Add User
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg shadow"
          >
            Dashboard
          </button>

        </div>

      </div>

      {/* Search */}
      <div className="mb-6">

        <input
          type="text"
          placeholder="🔍 Search by Name, Employee ID, Email, Department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>
              <th className="p-4 text-left">Employee ID</th>
              <th className="p-4 text-left">Full Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-center">Actions</th>
            </tr>

          </thead>

          <tbody>

            {currentUsers.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-500"
                >
                  No users found.
                </td>
              </tr>

            ) : (

              currentUsers.map((user) => (

                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-4">{user.employee_id}</td>

                  <td className="p-4 font-medium">
                    {user.full_name}
                  </td>

                  <td className="p-4">{user.email}</td>

                  <td className="p-4">{user.department}</td>

                  <td className="p-4">
                    {user.phone || "-"}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => navigate(`/enroll/${user.id}`)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded mr-2"
                    >
                      📷 Enroll Face
                    </button>

                    <button
                      onClick={() => navigate(`/edit-user/${user.id}`)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded mr-2"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                    >
                      🗑 Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center mt-6">

        <p className="text-gray-600">
          Showing {currentUsers.length} of {filteredUsers.length} users
        </p>

        <div className="flex items-center gap-3">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
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
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next ▶
          </button>

        </div>

      </div>

    </div>
  );
}

export default Users;