import { useState, useEffect } from "react";
import { updateUser } from "../services/userService";
import toast from "react-hot-toast";
function EditUserModal({ user, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        employee_id: user.employee_id,
        full_name: user.full_name,
        email: user.email,
        department: user.department,
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUser(user.id, formData);

      toast.success("User Updated Successfully");

      onUpdated();

      onClose();
    } catch (error) {
      console.error(error);

     toast.error("Unable to update user.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white w-[500px] rounded-xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-6">
          Edit User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="Employee ID"
            className="w-full border p-3 rounded"
          />

          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border p-3 rounded"
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-3 rounded"
          />

          <input
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full border p-3 rounded"
          />

          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border p-3 rounded"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-5 py-2 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Update
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditUserModal;