import React from "react";
import { Navigate } from "react-router-dom";
import { AppNoPermission } from "@/components";

const toArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const hasRequiredPermission = ({
  userPermissions = [],
  permissions = [],
  requireAll = false,
}) => {
  if (!permissions.length) return true;

  if (requireAll) {
    return permissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }

  return permissions.some((permission) => userPermissions.includes(permission));
};

const PermissionGuard = ({
  children,

  user,
  permissions,

  requireAll = false,

  redirectTo,
  fallback,

  showFallback = true,

  noPermissionTitle = "Permission denied",
  noPermissionDescription = "You don’t have permission to access this resource.",

  loading = false,
  loadingFallback = null,
}) => {
  if (loading) {
    return loadingFallback;
  }

  const userPermissions = toArray(user?.permissions);

  const allowed = hasRequiredPermission({
    userPermissions,
    permissions: toArray(permissions),
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

export default PermissionGuard;
