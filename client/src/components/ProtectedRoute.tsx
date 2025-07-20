import { Navigate, Outlet } from "react-router";

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
