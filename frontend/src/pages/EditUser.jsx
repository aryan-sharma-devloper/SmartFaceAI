import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import api from "../api/axios";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
    phone: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData(response.data);

    } catch (error) {
      console.error(error);

      toast.error("Unable to load user.");

      setTimeout(() => {
        navigate("/users");
      }, 1000);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await api.put(`/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User Updated Successfully");

      setTimeout(() => {
        navigate("/users");
      }, 800);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to update user."
      );

    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          ✏️ Edit User
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="font-semibold">
              Employee ID
            </label>

            <input
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold">
              Full Name
            </label>

            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold">
              Email
            </label>

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold">
              Department
            </label>

            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold">
              Phone
            </label>

            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 pt-4">

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg flex justify-center items-center min-w-[170px]"
            >
              {loading ? (
                <ClipLoader
                  size={22}
                  color="#ffffff"
                />
              ) : (
                "Update User"
              )}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => navigate("/users")}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditUser;