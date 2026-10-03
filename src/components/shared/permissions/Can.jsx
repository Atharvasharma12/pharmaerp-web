import React from "react";
import { AppNoPermission } from "@/components";

const toArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const checkMatch = ({ userValues = [], requiredValues = [], mode = "any" }) => {
  if (!requiredValues.length) return true;

  if (mode === "all") {
    return requiredValues.every((item) => userValues.includes(item));
  }

  return requiredValues.some((item) => userValues.includes(item));
};

const Can = ({
  children,

  user,
  roles,
  permissions,

  requireAll = false,
  fallback = null,
  showFallback = false,

  noPermissionTitle = "Access denied",
  noPermissionDescription = "You don’t have permission to access this section.",

  render,
}) => {
  const userRoles = toArray(user?.role || user?.roles);
  const userPermissions = toArray(user?.permissions);

  const requiredRoles = toArray(roles);
  const requiredPermissions = toArray(permissions);

  const mode = requireAll ? "all" : "any";

  const hasRole = checkMatch({
    userValues: userRoles,
    requiredValues: requiredRoles,
    mode,
  });

  const hasPermission = checkMatch({
    userValues: userPermissions,
    requiredValues: requiredPermissions,
    mode,
  });

  const allowed = hasRole && hasPermission;

  if (typeof render === "function") {
    return render({ allowed, hasRole, hasPermission });
  }

  if (allowed) {
    return children;
  }

  if (fallback) {
    return fallback;
  }

  if (showFallback) {
    return (
      <AppNoPermission
        title={noPermissionTitle}
        description={noPermissionDescription}
        size="medium"
        fullHeight={false}
      />
    );
  }

  return null;
};

export default Can;
