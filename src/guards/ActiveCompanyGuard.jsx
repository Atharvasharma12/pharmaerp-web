import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import useCompany from "@/features/company/hooks/useCompany";
import { usePermission } from "@/hooks";
import PremiumAppLoader from "@/layouts/app/components/loader/PremiumAppLoader";
import { AnimatePresence } from "framer-motion";

export const ActiveCompanyGuard = ({ children }) => {
  const location = useLocation();
  const { currentCompany, isLoading } = useCompany();
  const { isOwner } = usePermission();

  if (isOwner) {
    return children || <Outlet />;
  }

  if (isLoading) {
    return (
      <AnimatePresence mode="wait">
        <PremiumAppLoader key="loader" message="Verifying company access..." />
      </AnimatePresence>
    );
  }

  if (!currentCompany) {
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        replace
        state={{ from: location, unauthorizedContext: "company" }}
      />
    );
  }

  return children || <Outlet />;
};

export default ActiveCompanyGuard;
