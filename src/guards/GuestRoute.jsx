// src/guards/GuestRoute.jsx

import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/constants";
import useAuth from "../features/auth/hooks/useAuth";

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children || <Outlet />;
};

export default GuestRoute;
