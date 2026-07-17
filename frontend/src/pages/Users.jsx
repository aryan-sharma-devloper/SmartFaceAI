import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
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

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Unable to delete user.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-blue-700">
          Manage Users
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800"
        >
          Dashboard
        </button>

      </div>

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

            {users.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-500"
                >
                  No users found.
                </td>
              </tr>

            ) : (

              users.map((user) => (

                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{user.employee_id}</td>
                  <td className="p-4">{user.full_name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.department}</td>
                  <td className="p-4">{user.phone}</td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() => navigate(`/enroll/${user.id}`)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded mr-2"
                    >
                      Enroll Face
                    </button>

                    <button
                      onClick={() => alert("Edit page coming next")}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
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
  );
}

export default Users;