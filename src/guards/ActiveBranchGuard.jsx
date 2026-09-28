import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import useBranch from "@/features/branch/hooks/useBranch";
import PremiumAppLoader from "@/layouts/app/components/loader/PremiumAppLoader";
import { AnimatePresence } from "framer-motion";

export const ActiveBranchGuard = ({ children }) => {
  const location = useLocation();
  const { currentBranch, isLoading } = useBranch();

  if (isLoading) {
    return (
      <AnimatePresence mode="wait">
        <PremiumAppLoader key="loader" message="Verifying branch access..." />
      </AnimatePresence>
    );
  }

  if (!currentBranch) {
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        replace
        state={{ from: location, unauthorizedContext: "branch" }}
      />
    );
  }

  return children || <Outlet />;
};

export default ActiveBranchGuard;
