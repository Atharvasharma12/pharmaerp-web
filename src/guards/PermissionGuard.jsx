// src/guards/PermissionGuard.jsx
//
// Route-level permission guard.
//
// Usage in routes.jsx:
//   { element: <PermissionGuard permission="product:view"><InventoryPage /></PermissionGuard> }
//   { element: <PermissionGuard permissions={["customer:view", "supplier:view"]}><PartiesPage /></PermissionGuard> }
//
// Props:
//   permission  - string: required permission key.
//   permissions - string[]: array of permissions (user needs ANY one of them).
//   fallback    - ReactNode: custom fallback. Defaults to <AccessDeniedPage />.
//   children    - ReactNode: content to render if permission is granted.

import { Outlet, Navigate } from "react-router-dom";
import { ROUTES } from "@/constants";

import usePermission from "@/hooks/usePermission";

const PermissionGuard = ({
  permission,
  permissions,
  requireOwner = false,
  fallback,
  children,
}) => {
  const { can, canAny, isOwner, isLoaded } = usePermission();

  // While permissions are loading, render nothing (AppLayout handles the loader)
  if (!isLoaded) {
    return null;
  }

  // Determine if access is granted
  let hasAccess = true;

  if (requireOwner) {
    hasAccess = Boolean(isOwner);
  } else if (permissions?.length) {
    // Array of permissions — user needs ANY one
    hasAccess = canAny(permissions);
  } else if (permission) {
    // Single permission key
    hasAccess = can(permission);
  }

  if (!hasAccess) {
    return (
      fallback || (
        <Navigate 
          to={ROUTES.DASHBOARD} 
          replace 
          state={{ unauthorizedPermission: true }} 
        />
      )
    );
  }

  // Render children directly or outlet for nested routes
  return children || <Outlet />;
};

export default PermissionGuard;
