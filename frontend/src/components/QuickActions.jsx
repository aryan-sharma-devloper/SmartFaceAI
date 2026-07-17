import { useNavigate } from "react-router-dom";

function QuickActions() {

  const navigate = useNavigate();

  return (

    <div className="grid md:grid-cols-3 gap-6 mt-10">

      <button
        onClick={() => navigate("/users")}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-xl font-bold"
      >
        👥 Manage Users
      </button>

      <button
        onClick={() => navigate("/enroll")}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-6 text-xl font-bold"
      >
        📸 Enroll Face
      </button>

      <button
        onClick={() => navigate("/verify")}
        className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 text-xl font-bold"
      >
        ✅ Verify Face
      </button>

    </div>

  );
}

export default QuickActions;