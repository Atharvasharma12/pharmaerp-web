import React from "react";
import { Navigate } from "react-router-dom";
import { AppNoPermission } from "@/components";

const toArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const hasRequiredRole = ({
  userRoles = [],
  roles = [],
  requireAll = false,
}) => {
  if (!roles.length) return true;

  if (requireAll) {
    return roles.every((role) => userRoles.includes(role));
  }

  return roles.some((role) => userRoles.includes(role));
};

const RoleGuard = ({
  children,

  user,
  roles,

  requireAll = false,

  redirectTo,
  fallback,

  showFallback = true,
  noPermissionTitle = "Access denied",
  noPermissionDescription = "You don’t have the required role to view this page.",

  loading = false,
  loadingFallback = null,
}) => {
  if (loading) {
    return loadingFallback;
  }

  const userRoles = toArray(user?.role || user?.roles);

  const allowed = hasRequiredRole({
    userRoles,
    roles: toArray(roles),
    requireAll,
  });

  if (allowed) {
    return children;
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  if (fallback) {
    return fallback;
  }

  if (showFallback) {
    return (
      <AppNoPermission
        title={noPermissionTitle}
        description={noPermissionDescription}
      />
    );
  }

  return null;
};

export default RoleGuard;
