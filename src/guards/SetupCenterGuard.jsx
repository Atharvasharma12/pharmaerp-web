// src/guards/SetupCenterGuard.jsx

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useSetupStatus } from "@/features/setup/hooks/useSetupStatus";

/**
 * SetupCenterGuard
 *
 * Protects operational application routes (Dashboard, Inventory, POS Sales,
 * Billing, Purchases, Finance, Reports, Marketplace, etc.).
 *
 * If the workspace setup is not 100% complete (both Company and Branch are required),
 * it intercepts the direct URL navigation and redirects the user directly to the Setup Center (/setup-center).
 */
export const SetupCenterGuard = ({ children }) => {
  const location = useLocation();
  const { isSetupComplete, isLoading, setupStatus, workspaceId } =
    useSetupStatus();

  // If workspace is present and status is actively loading its initial payload
  if (isLoading && !setupStatus && workspaceId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-2.5">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs font-semibold text-text-muted">
            Checking workspace setup status...
          </span>
        </div>
      </div>
    );
  }

  // If setup is incomplete, redirect to the Setup Center
  if (!isSetupComplete) {
    return (
      <Navigate
        to={ROUTES.SETUP_CENTER}
        replace
        state={{ from: location, redirectedFromGuard: true }}
      />
    );
  }

  return children || <Outlet />;
};

/**
 * CompanyRequiredGuard
 *
 * Guards Branch routes (/branches, /branches/create, etc.).
 * If the user has not created a Company yet (Step 1 incomplete), they cannot access or create branches.
 * Redirects directly to the Setup Center.
 */
export const CompanyRequiredGuard = ({ children }) => {
  const location = useLocation();
  const { companyCompleted, isLoading, setupStatus, workspaceId } =
    useSetupStatus();

  if (isLoading && !setupStatus && workspaceId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-2.5">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs font-semibold text-text-muted">
            Verifying company prerequisite...
          </span>
        </div>
      </div>
    );
  }

  // If Company is NOT created yet, redirect to Setup Center
  if (!companyCompleted) {
    return (
      <Navigate
        to={ROUTES.SETUP_CENTER}
        replace
        state={{ from: location, prerequisiteMissing: "company" }}
      />
    );
  }

  return children || <Outlet />;
};

export default SetupCenterGuard;
