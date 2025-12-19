import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import MagicLink from "./pages/MagicLink";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import TasksPage from "./pages/TasksPage";
import AttendancePage from "./pages/AttendancePage";
import ProjectsPage from "./pages/ProjectsPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* WITHOUT SIDEBAR */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/magic-link" element={<MagicLink />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* WITH SIDEBAR */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/users" element={<UsersPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/projects" element={<ProjectsPage/>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
