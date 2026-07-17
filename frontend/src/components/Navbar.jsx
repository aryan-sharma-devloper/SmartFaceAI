import { useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  return (

    <div className="bg-white shadow flex justify-between items-center px-8 py-5">

      <div>

        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Smart Face Identity Verification System
        </p>

      </div>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
      >
        Logout
      </button>

    </div>

  );
}

export default Navbar;