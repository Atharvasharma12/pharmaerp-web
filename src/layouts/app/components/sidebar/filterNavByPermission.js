// src/layouts/app/components/sidebar/filterNavByPermission.js
//
// Pure utility that recursively filters sidebar nav groups/items
// based on the current user's permissions and owner status.

/**
 * Filter a single nav item (and its children) by permission.
 * @param {object} item - nav item from sidebarNavConfig
 * @param {function} canFn - can(permissionKey) -> boolean
 * @param {function} [canAnyFn] - canAny(permissionKeys) -> boolean
 * @param {boolean} [isOwner=false] - whether current user is owner
 * @returns {object|null} filtered item or null if access denied
 */
const filterItem = (item, canFn, canAnyFn, isOwner = false) => {
  // Check owner-only items
  if (item.requireOwner && !isOwner) {
    return null;
  }

  // Check array of permissions (user needs ANY one)
  if (item.permissions?.length) {
    const hasAny = typeof canAnyFn === "function"
      ? canAnyFn(item.permissions)
      : item.permissions.some((p) => canFn(p));
    if (!hasAny) return null;
  }
  // Check single permission key
  else if (item.permission && !canFn(item.permission)) {
    return null;
  }

  // If the item has children, filter them recursively
  if (item.children?.length) {
    const visibleChildren = item.children
      .map((child) => filterItem(child, canFn, canAnyFn, isOwner))
      .filter(Boolean);

    // If all children are hidden and parent had no independent action, hide parent
    if (visibleChildren.length === 0) {
      return null;
    }

    return { ...item, children: visibleChildren };
  }

  return item;
};

/**
 * Filter the full SIDEBAR_NAV_GROUPS structure by permission.
 * @param {object[]} groups - array of nav group objects
 * @param {function} canFn - can(permissionKey) -> boolean
 * @param {function} [canAnyFn] - canAny(permissionKeys) -> boolean
 * @param {boolean} [isOwner=false] - whether current user is owner
 * @returns {object[]} filtered groups (empty groups are removed)
 */
export const filterNavByPermission = (groups, canFn, canAnyFn, isOwner = false) => {
  return groups
    .map((group) => {
      const visibleItems = group.items
        .map((item) => filterItem(item, canFn, canAnyFn, isOwner))
        .filter(Boolean);

      if (visibleItems.length === 0) return null;

      return { ...group, items: visibleItems };
    })
    .filter(Boolean);
};

export default filterNavByPermission;

