// src/hooks/usePermission.js
//
// Core permission hook for the ERP frontend.
//
// Usage:
//   const { can, canAny, isOwner, isLoaded } = usePermission();
//   if (can("inventory.view")) { ... }
//   if (canAny(["finance.view", "finance.create"])) { ... }
//
// Owner bypass: workspace owners always have all permissions.
// Permission format: plain strings matching backend keys, e.g. "inventory.view".

import { useMemo } from "react";
import { useSelector } from "react-redux";

import { selectMyAccess, selectGetMyAccessStatus } from "@/features/access-control/store/accessControlSelector";
import { selectWorkspaces, selectCurrentWorkspace } from "@/features/workspace/store/workspaceSelector";
import { selectUserProfile } from "@/features/user/store/userSelector";
import { API_STATUS } from "@/constants";

const usePermission = () => {
  const myAccess = useSelector(selectMyAccess);
  const getMyAccessStatus = useSelector(selectGetMyAccessStatus);
  const workspaces = useSelector(selectWorkspaces);
  const currentWorkspace = useSelector(selectCurrentWorkspace);
  const userProfile = useSelector(selectUserProfile);

  // Determine if the current user is the workspace owner.
  // Checks member.isOwner, myAccess.isOwner, and userProfile.isOwner.
  const isOwner = useMemo(() => {
    if (userProfile?.isOwner || myAccess?.isOwner || myAccess?.member?.isOwner) return true;

    if (!currentWorkspace?._id || !workspaces?.length) {
      return Boolean(userProfile?.isOwner || myAccess?.isOwner || myAccess?.member?.isOwner);
    }

    const matchingItem = workspaces.find((item) => {
      const ws = item?.workspace || item;
      return ws?._id === currentWorkspace._id;
    });

    if (!matchingItem) {
      return Boolean(userProfile?.isOwner || myAccess?.isOwner || myAccess?.member?.isOwner);
    }

    const member = matchingItem?.member || null;
    return Boolean(member?.isOwner || matchingItem?.isOwner || matchingItem?.isOwnerWorkspace);
  }, [workspaces, currentWorkspace, userProfile, myAccess]);

  // Build a Set of the current user's permission keys for O(1) lookup.
  // myAccess shape from backend: { permissions: [...string], ... }
  const permissionSet = useMemo(() => {
    if (!myAccess) return new Set();
    const perms = myAccess?.permissions || myAccess?.role?.permissions || [];
    return new Set(Array.isArray(perms) ? perms : []);
  }, [myAccess]);

  // Whether permissions have been loaded (or the user is owner — owner needs no load).
  const isLoaded =
    isOwner ||
    getMyAccessStatus === API_STATUS.SUCCESS ||
    getMyAccessStatus === API_STATUS.ERROR;

  /**
   * Check if the current user has a specific permission.
   * Workspace owners always return true.
   * @param {string} permissionKey - e.g. "inventory.view"
   */
  const can = (permissionKey) => {
    if (isOwner) return true;
    if (!permissionKey) return true; // no restriction = always visible
    return permissionSet.has(permissionKey);
  };

  /**
   * Check if the current user has ANY of the given permissions.
   * Workspace owners always return true.
   * @param {string[]} permissionKeys
   */
  const canAny = (permissionKeys) => {
    if (isOwner) return true;
    if (!permissionKeys?.length) return true;
    return permissionKeys.some((key) => permissionSet.has(key));
  };

  /**
   * Check if the current user has ALL of the given permissions.
   * Workspace owners always return true.
   * @param {string[]} permissionKeys
   */
  const canAll = (permissionKeys) => {
    if (isOwner) return true;
    if (!permissionKeys?.length) return true;
    return permissionKeys.every((key) => permissionSet.has(key));
  };

  return {
    can,
    canAny,
    canAll,
    isOwner,
    isLoaded,
    myAccess,
    permissionSet,
  };
};

export default usePermission;
