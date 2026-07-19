import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Settings() {
  const [password, setPassword] = useState("");

  const save = () => {
    toast("Settings module will be connected later.");
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 ml-72 p-10">

        <h1 className="text-4xl font-bold text-slate-800">
          Settings
        </h1>

        <div className="bg-white rounded-xl shadow-lg mt-8 p-8">

          <h2 className="text-2xl font-bold mb-6">
            Change Password
          </h2>

          <input
            type="password"
            placeholder="New Password"
            className="border rounded-lg p-3 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={save}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;