import {
  FaHome,
  FaUsers,
  FaCamera,
  FaClipboardList,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  const menu = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      title: "Users",
      icon: <FaUsers />,
      path: "/users",
    },
    {
      title: "Add User",
      icon: <FaUserPlus />,
      path: "/add-user",
    },
    {
      title: "Verify Face",
      icon: <FaCamera />,
      path: "/verify",
    },
    {
      title: "Logs",
      icon: <FaClipboardList />,
      path: "/logs",
    },
    {
  title: "Attendance",
  path: "/attendance",
  icon: "🗓️",
},
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex flex-col">

      {/* Logo */}

      <div className="p-8 border-b border-slate-700">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg">
            AI
          </div>

          <div>

            <h1 className="text-2xl font-bold">
              Smart Face AI
            </h1>

            <p className="text-sm text-gray-300">
              Admin Panel
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 mt-6 px-4">

        {menu.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-xl mb-3 transition-all duration-300 ${
                isActive
                  ? "bg-blue-600 shadow-lg"
                  : "hover:bg-slate-700"
              }`
            }
          >

            <span className="text-xl">
              {item.icon}
            </span>

            <span className="text-lg">
              {item.title}
            </span>

          </NavLink>

        ))}

      </nav>

      {/* Admin */}

      <div className="border-t border-slate-700 p-6">

        <div className="flex items-center gap-4 mb-5">

          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
            A
          </div>

          <div>

            <p className="font-semibold">
              Administrator
            </p>

            <p className="text-sm text-gray-400">
              Smart Face AI
            </p>

          </div>

        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 rounded-xl py-3 transition"
        >
          <FaSignOutAlt />

          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;