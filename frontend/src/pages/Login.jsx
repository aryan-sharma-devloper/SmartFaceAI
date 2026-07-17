import { useState } from "react";
import { login } from "../services/authService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = await login(username, password);

    console.log("Login Success:", data);

    // Save JWT token
    localStorage.setItem("token", data.access_token);

    // Show success
    window.location.href = "/dashboard";

  } catch (error) {
    console.error("FULL ERROR:", error);

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Response:", error.response.data);
    } else {
      console.log("Message:", error.message);
    }

    alert("Login Failed");
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Smart Face AI
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Admin Login
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="block mb-1">
              Username
            </label>

            <input
              type="text"
              className="w-full border rounded-lg p-3"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">
              Password
            </label>

            <input
              type="password"
              className="w-full border rounded-lg p-3"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;