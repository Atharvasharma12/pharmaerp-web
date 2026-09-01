// src/components/common/PermissionGate.jsx
//
// Declarative component for conditionally rendering UI elements
// (e.g. Add buttons, edit actions, delete menus) based on permissions.
//
// Usage:
//   <PermissionGate permission="customer:create">
//     <Button onClick={handleAdd}>Add Customer</Button>
//   </PermissionGate>
//
//   <PermissionGate permissions={["customer:create", "customer:update"]}>
//     <CustomerActionMenu />
//   </PermissionGate>

import usePermission from "@/hooks/usePermission";

/**
 * @param {object} props
 * @param {string} [props.permission] - Single permission required
 * @param {string[]} [props.permissions] - Array of permissions (user needs ANY by default)
 * @param {boolean} [props.requireAll=false] - If true with permissions array, user needs ALL
 * @param {React.ReactNode} [props.fallback=null] - Fallback rendered when permission is denied
 * @param {React.ReactNode} props.children - Protected children to render
 */
export const PermissionGate = ({
  permission,
  permissions,
  requireOwner = false,
  requireAll = false,
  fallback = null,
  children,
}) => {
  const { can, canAny, canAll, isOwner, isLoaded } = usePermission();

  if (!isLoaded) {
    return fallback;
  }

  let hasAccess = true;

  if (requireOwner) {
    hasAccess = Boolean(isOwner);
  } else if (permissions?.length) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  } else if (permission) {
    hasAccess = can(permission);
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

export default PermissionGate;
