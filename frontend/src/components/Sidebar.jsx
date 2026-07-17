import {
  FaHome,
  FaUsers,
  FaCamera,
  FaCheckCircle,
  FaClipboardList,
  FaCog,
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      name: "Manage Users",
      icon: <FaUsers />,
      path: "/users",
    },
    {
      name: "Enroll Face",
      icon: <FaCamera />,
      path: "/enroll",
    },
    {
      name: "Verify Face",
      icon: <FaCheckCircle />,
      path: "/verify",
    },
    {
      name: "Verification Logs",
      icon: <FaClipboardList />,
      path: "/logs",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  return (
    <div className="w-72 min-h-screen bg-slate-900 text-white">

      <div className="text-center py-8 border-b border-slate-700">

        <h1 className="text-3xl font-bold">
          Smart Face AI
        </h1>

        <p className="text-gray-400 mt-2">
          Admin Panel
        </p>

      </div>

      <div className="mt-8">

        {menu.map((item) => (

          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-8 py-4 text-left hover:bg-blue-600 transition ${
              location.pathname === item.path
                ? "bg-blue-600"
                : ""
            }`}
          >

            <span className="text-xl">
              {item.icon}
            </span>

            <span className="text-lg">
              {item.name}
            </span>

          </button>

        ))}

      </div>

    </div>
  );
}

export default Sidebar;