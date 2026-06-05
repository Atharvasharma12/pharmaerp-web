import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccessControl from "../hooks/useAccessControl";

import AccessControlDesktopPage from "./desktop/AccessControlDesktopPage";
import AccessControlMobilePage from "./mobile/AccessControlMobilePage";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getActiveCount = (items = [], statusKey = "status") =>
  items.filter((item) => item?.[statusKey] === "active").length;

const getRestrictedAccessCount = (items = []) =>
  items.filter(
    (item) =>
      item?.accessAllCompanies === false || item?.accessAllBranches === false,
  ).length;

const getSystemRoleCount = (roles = []) =>
  roles.filter((role) => Boolean(role?.isSystem)).length;

const AccessControlPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    roles,
    permissions,
    memberAccessList,

    getWorkspaceRoles,
    getAvailablePermissions,
    getWorkspaceMemberAccessList,

    getWorkspaceRolesStatus,
    getAvailablePermissionsStatus,
    getWorkspaceMemberAccessListStatus,

    error,
    message,

    clearError,
    clearMessage,
  } = useAccessControl();

  const isLoadingRoles = getWorkspaceRolesStatus === API_STATUS.LOADING;
  const isLoadingPermissions =
    getAvailablePermissionsStatus === API_STATUS.LOADING;
  const isLoadingMemberAccess =
    getWorkspaceMemberAccessListStatus === API_STATUS.LOADING;

  const hasRolesError = getWorkspaceRolesStatus === API_STATUS.ERROR;
  const hasPermissionsError =
    getAvailablePermissionsStatus === API_STATUS.ERROR;
  const hasMemberAccessError =
    getWorkspaceMemberAccessListStatus === API_STATUS.ERROR;

  const isLoading =
    isLoadingRoles || isLoadingPermissions || isLoadingMemberAccess;
  const hasError = hasRolesError || hasPermissionsError || hasMemberAccessError;

  const fetchAccessControlData = useCallback(async () => {
    const requests = [
      getWorkspaceRoles(),
      getAvailablePermissions(),
      getWorkspaceMemberAccessList(),
    ];

    const results = await Promise.allSettled(requests);

    return results;
  }, [
    getAvailablePermissions,
    getWorkspaceMemberAccessList,
    getWorkspaceRoles,
  ]);

  useEffect(() => {
    clearError();

    fetchAccessControlData();

    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage, fetchAccessControlData]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedRoles = useMemo(
    () => (Array.isArray(roles) ? roles : []),
    [roles],
  );

  const mappedPermissions = useMemo(
    () => (Array.isArray(permissions) ? permissions : []),
    [permissions],
  );

  const mappedMemberAccessList = useMemo(
    () => (Array.isArray(memberAccessList) ? memberAccessList : []),
    [memberAccessList],
  );

  const stats = useMemo(() => {
    const totalRoles = mappedRoles.length;
    const activeRoles = getActiveCount(mappedRoles);
    const systemRoles = getSystemRoleCount(mappedRoles);
    const totalPermissions = mappedPermissions.length;
    const totalMemberAccess = mappedMemberAccessList.length;
    const restrictedAccess = getRestrictedAccessCount(mappedMemberAccessList);

    return [
      {
        id: "roles",
        title: "Roles",
        value: totalRoles,
        description: `${activeRoles} active roles`,
        colorVariant: "primary",
      },
      {
        id: "permissions",
        title: "Permissions",
        value: totalPermissions,
        description: "Available permission keys",
        colorVariant: "info",
      },
      {
        id: "systemRoles",
        title: "System Roles",
        value: systemRoles,
        description: "Protected default roles",
        colorVariant: "warning",
      },
      {
        id: "memberAccess",
        title: "Member Access",
        value: totalMemberAccess,
        description: `${restrictedAccess} restricted members`,
        colorVariant: "success",
      },
    ];
  }, [mappedMemberAccessList, mappedPermissions, mappedRoles]);

  const recentRoles = useMemo(() => mappedRoles.slice(0, 5), [mappedRoles]);

  const permissionGroups = useMemo(() => {
    const groups = mappedPermissions.reduce((acc, permission) => {
      const group = normalizeText(permission).split(/[.:_]/)[0] || "general";

      if (!acc[group]) {
        acc[group] = {
          id: group,
          title: group
            .split("-")
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          count: 0,
        };
      }

      acc[group].count += 1;

      return acc;
    }, {});

    return Object.values(groups).slice(0, 6);
  }, [mappedPermissions]);

  const accessModules = useMemo(
    () => [
      {
        id: "roles",
        title: "Role Management",
        description:
          "Create custom workspace roles and manage permission sets.",
        stat: mappedRoles.length,
        statLabel: "roles",
        colorVariant: "primary",
        actionText: "Manage Roles",
        onClick: () => navigate(ROUTES.ROLES),
      },
      {
        id: "permissions",
        title: "Permission Catalog",
        description:
          "Review all backend-supported permissions available to roles.",
        stat: mappedPermissions.length,
        statLabel: "permissions",
        colorVariant: "info",
        actionText: "View Permissions",
        onClick: () => navigate(ROUTES.PERMISSIONS),
      },
      {
        id: "memberAccess",
        title: "Member Access",
        description:
          "Control company and branch access for active workspace members.",
        stat: mappedMemberAccessList.length,
        statLabel: "members",
        colorVariant: "success",
        actionText: "Manage Access",
        onClick: () => navigate(ROUTES.MEMBER_ACCESS),
      },
    ],
    [
      mappedMemberAccessList.length,
      mappedPermissions.length,
      mappedRoles.length,
      navigate,
    ],
  );

  const handleRefresh = useCallback(() => {
    clearError();
    clearMessage();
    fetchAccessControlData();
  }, [clearError, clearMessage, fetchAccessControlData]);

  const handleCreateRole = useCallback(() => {
    navigate(ROUTES.CREATE_ROLE);
  }, [navigate]);

  const handleViewRoles = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleViewPermissions = useCallback(() => {
    navigate(ROUTES.PERMISSIONS);
  }, [navigate]);

  const handleViewMemberAccess = useCallback(() => {
    navigate(ROUTES.MEMBER_ACCESS);
  }, [navigate]);

  const pageProps = {
    stats,
    accessModules,
    recentRoles,
    permissionGroups,

    roles: mappedRoles,
    permissions: mappedPermissions,
    memberAccessList: mappedMemberAccessList,

    isLoading,
    hasError,
    error,
    message,

    hasRoles: mappedRoles.length > 0,
    hasPermissions: mappedPermissions.length > 0,
    hasMemberAccessList: mappedMemberAccessList.length > 0,

    handleRefresh,
    handleCreateRole,
    handleViewRoles,
    handleViewPermissions,
    handleViewMemberAccess,

    clearMessage,
  };

  return isMobile ? (
    <AccessControlMobilePage {...pageProps} />
  ) : (
    <AccessControlDesktopPage {...pageProps} />
  );
};

export default AccessControlPage;
