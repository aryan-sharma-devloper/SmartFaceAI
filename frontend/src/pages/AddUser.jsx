import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import api from "../api/axios";

function AddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("/users", formData);

      toast.success("User Added Successfully");

      setTimeout(() => {
        navigate("/users");
      }, 800);

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail || "Unable to add user."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-2xl p-8">

        <h1 className="text-3xl font-bold text-blue-700 mb-8">
          ➕ Add New User
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
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">
              Full Name
            </label>

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">
              Department
            </label>

            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-4 pt-5">

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg flex items-center justify-center min-w-[170px]"
            >
              {loading ? (
                <ClipLoader
                  size={22}
                  color="#ffffff"
                />
              ) : (
                "Save User"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/users")}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddUser;