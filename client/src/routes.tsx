import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResumeEditor from "./pages/ResumeEditor";
import ResumeViewer from "./pages/ResumeViewer";
import ThemeSelector from "./pages/ThemeSelector";

import AdminDashboard from "./pages/admin/Dashboard";
import UserList from "./pages/admin/UserList";
import ResumeManager from "./pages/admin/ResumeManager";

import ProtectedRoute from "./components/ProtectedRoute";
import ViewUserResume from "./pages/admin/ViewUserResume";
import UserResumeView from "./pages/admin/UserResumeView";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
        <Route path="resume" element={<ResumeEditor />} />
        <Route path="viewer" element={<ResumeViewer />} />
        <Route path="theme" element={<ThemeSelector />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/users" element={<UserList />} />
        <Route path="admin/resumes" element={<ResumeManager />} />
        <Route path="admin/resumes/:userId" element={<ViewUserResume />} />
        <Route
          path="admin/resumes/:userId/:resumeId"
          element={<UserResumeView />}
        />
      </Route>
    </Route>
  )
);

export default routes;
