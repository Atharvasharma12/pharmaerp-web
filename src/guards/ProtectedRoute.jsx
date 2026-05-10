// src/guards/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";

import { ROUTES } from "@/constants";
import useAuth from "@/features/auth/hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
