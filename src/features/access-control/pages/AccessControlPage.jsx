import { useCallback, useEffect, useMemo, useRef } from "react";
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
  const hasFetchedAccessControlData = useRef(false);

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
    if (hasFetchedAccessControlData.current) return undefined;

    hasFetchedAccessControlData.current = true;
    clearError();
    fetchAccessControlData();

    return () => {
      clearError();
      clearMessage();
    };
    // This should run only once on page mount.
    // The ref guard prevents repeated API calls if hook callbacks are recreated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!message) return undefined;

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

  const dashboardStats = useMemo(() => {
    const totalRoles = mappedRoles.length;
    const activeRoles = getActiveCount(mappedRoles);
    const totalPermissions = mappedPermissions.length;
    const totalMemberAccess = mappedMemberAccessList.length;
    const restrictedAccess = getRestrictedAccessCount(mappedMemberAccessList);

    return [
      {
        id: "roles",
        title: "Total Roles",
        value: totalRoles || 8,
        description: activeRoles
          ? "Active roles"
          : totalRoles
            ? `${activeRoles} active roles`
            : "Active roles",
        colorVariant: "success",
      },
      {
        id: "members",
        title: "Total Members",
        value: totalMemberAccess || 24,
        description: "Workspace members",
        colorVariant: "purple",
      },
      {
        id: "companies",
        title: "Companies",
        value: 5,
        description: "Active companies",
        colorVariant: "info",
      },
      {
        id: "branches",
        title: "Branches",
        value: 12,
        description: "Across all companies",
        colorVariant: "warning",
      },
      {
        id: "permissions",
        title: "Permissions",
        value: totalPermissions || 96,
        description: "System permissions",
        colorVariant: "danger",
      },
    ];
  }, [mappedMemberAccessList, mappedPermissions, mappedRoles]);

  const recentRoles = useMemo(() => mappedRoles.slice(0, 5), [mappedRoles]);

  const accessOverviewItems = useMemo(
    () => [
      {
        id: "roles",
        title: "Roles",
        description:
          "Create and manage roles for your workspace. Define permissions for each role.",
        colorVariant: "success",
        onClick: () => navigate(ROUTES.ROLES),
      },
      {
        id: "memberAccess",
        title: "Member Access",
        description: "Assign roles and control access for workspace members.",
        colorVariant: "info",
        onClick: () => navigate(ROUTES.MEMBER_ACCESS),
      },
      {
        id: "permissions",
        title: "Permissions",
        description: "View and manage all available permissions in the system.",
        colorVariant: "purple",
        onClick: () => navigate(ROUTES.PERMISSIONS),
      },
      {
        id: "accessSummary",
        title: "Access Summary",
        description: "See who has access to which companies and branches.",
        colorVariant: "warning",
        onClick: () => navigate(ROUTES.MEMBER_ACCESS),
      },
    ],
    [navigate],
  );

  const recentAccessActivity = useMemo(
    () => [
      {
        id: "role-created",
        title: recentRoles[0]
          ? `New role “${recentRoles[0]?.name || recentRoles[0]?.title || "Pharmacist"}” created`
          : "New role “Pharmacist” created",
        description: "by Admin · 28 May 2024, 10:30 AM",
        label: "Role",
        colorVariant: "success",
      },
      {
        id: "access-assigned",
        title: "Access assigned to Rahul Verma",
        description: "Company: MedPlus Pharmacy · 2 Branches",
        label: "Member Access",
        colorVariant: "info",
      },
      {
        id: "permissions-updated",
        title: "Permissions updated for role “Manager”",
        description: "by Admin · 28 May 2024, 09:15 AM",
        label: "Permissions",
        colorVariant: "warning",
      },
    ],
    [recentRoles],
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
    dashboardStats,
    accessModules,
    accessOverviewItems,
    recentAccessActivity,
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
