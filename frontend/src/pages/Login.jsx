import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const data = await login(username, password);

      console.log("Login Success:", data);

      // Save JWT Token
      localStorage.setItem("token", data.access_token);

      toast.success("Welcome Admin!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      console.error("FULL ERROR:", error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);

        toast.error(
          error.response.data.detail || "Invalid Credentials"
        );
      } else {
        console.log("Message:", error.message);

        toast.error("Unable to connect to server.");
      }

    } finally {
      setLoading(false);
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
            <label className="block mb-1 font-medium">
              Username
            </label>

            <input
              type="text"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type="password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-lg flex items-center justify-center transition"
          >
            {loading ? (
              <ClipLoader size={22} color="#ffffff" />
            ) : (
              "Login"
            )}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;