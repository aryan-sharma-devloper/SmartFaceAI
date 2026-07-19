import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import VerifyFace from "./pages/VerifyFace";
import AddUser from "./pages/AddUser";
import ProtectedRoute from "./components/ProtectedRoute";
import EditUser from "./pages/EditUser";
import EnrollFace from "./pages/EnrollFace";
import VerificationLogs from "./pages/VerificationLogs";
import Settings from "./pages/Settings";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Face Verification */}
        <Route
          path="/verify"
          element={
            <ProtectedRoute>
              <VerifyFace />
            </ProtectedRoute>
          }
        />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/edit-user/:id" element={<EditUser />} />
        <Route path="/enroll/:id" element={<EnrollFace />} />
        <Route
  path="/verification-logs"
  element={<VerificationLogs />}
/>
<Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;