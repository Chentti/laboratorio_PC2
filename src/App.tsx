import { Navigate, Route, Routes } from "react-router-dom";
import { Protected } from "./componentes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ActivityDetail from "./pages/ActivityDetail";
import MyEnrollments from "./pages/MyEnrollments";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/activities/:id" element={<Protected><ActivityDetail /></Protected>} />
      <Route path="/my-enrollments" element={<Protected><MyEnrollments /></Protected>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
