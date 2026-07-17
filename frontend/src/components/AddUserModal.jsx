import { useState } from "react";
import api from "../api/axios";

function AddUserModal({ closeModal, refreshUsers }) {
  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/users", formData);

      alert("User Added Successfully!");

      refreshUsers();

      closeModal();

    } catch (err) {
      console.error(err);
      alert("Unable to add user.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-xl shadow-xl w-[500px] p-8">

        <h2 className="text-2xl font-bold mb-6">
          Add New User
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            name="employee_id"
            placeholder="Employee ID"
            className="border p-3 rounded w-full"
            onChange={handleChange}
          />

          <input
            name="full_name"
            placeholder="Full Name"
            className="border p-3 rounded w-full"
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            className="border p-3 rounded w-full"
            onChange={handleChange}
          />

          <input
            name="department"
            placeholder="Department"
            className="border p-3 rounded w-full"
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            className="border p-3 rounded w-full"
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-5 py-2 rounded"
            >
              Cancel
            </button>

            <button
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddUserModal;