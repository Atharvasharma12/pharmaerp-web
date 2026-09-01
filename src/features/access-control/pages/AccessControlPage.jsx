// src/features/access-control/pages/AccessControlPage.jsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const formatRoleName = (role) => {
  const roleName = role?.name || role?.title || role?.code;
  if (!roleName) return "-";
  return String(roleName)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const AccessControlPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedAccessControlData = useRef(false);

  const {
    roles,
    permissions,

    getWorkspaceRoles,
    getAvailablePermissions,

    getWorkspaceRolesStatus,
    getAvailablePermissionsStatus,

    error,
    message,

    clearError,
    clearMessage,
  } = useAccessControl();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const isLoadingRoles = getWorkspaceRolesStatus === API_STATUS.LOADING;
  const isLoadingPermissions =
    getAvailablePermissionsStatus === API_STATUS.LOADING;

  const hasRolesError = getWorkspaceRolesStatus === API_STATUS.ERROR;
  const hasPermissionsError =
    getAvailablePermissionsStatus === API_STATUS.ERROR;

  const isLoading = isLoadingRoles || isLoadingPermissions;
  const hasError = hasRolesError || hasPermissionsError;

  const fetchAccessControlData = useCallback(async () => {
    const requests = [
      getWorkspaceRoles(),
      getAvailablePermissions(),
    ];

    const results = await Promise.allSettled(requests);
    return results;
  }, [getAvailablePermissions, getWorkspaceRoles]);

  useEffect(() => {
    if (hasFetchedAccessControlData.current) return undefined;

    hasFetchedAccessControlData.current = true;
    clearError();
    fetchAccessControlData();

    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage, fetchAccessControlData]);

  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  // Sort roles descending by member count
  const mappedRoles = useMemo(() => {
    const sourceRoles = Array.isArray(roles) ? roles : [];
    return [...sourceRoles].sort((a, b) => {
      const countA = a.membersCount ?? 0;
      const countB = b.membersCount ?? 0;
      if (countB !== countA) return countB - countA;
      if (a.isSystem !== b.isSystem) return a.isSystem ? -1 : 1;
      return String(a.name).localeCompare(String(b.name));
    });
  }, [roles]);

  const mappedPermissions = useMemo(
    () => (Array.isArray(permissions) ? permissions : []),
    [permissions]
  );

  const filteredRoles = useMemo(() => {
    const q = normalizeText(search);
    if (!q) return mappedRoles;
    return mappedRoles.filter(
      (r) =>
        normalizeText(r.name).includes(q) ||
        normalizeText(r.code).includes(q) ||
        normalizeText(r.description).includes(q)
    );
  }, [mappedRoles, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize));
  const paginatedRoles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRoles.slice(start, start + pageSize);
  }, [filteredRoles, currentPage, pageSize]);

  const stats = useMemo(() => {
    const totalRoles = mappedRoles.length;
    const systemRoles = mappedRoles.filter((r) => r.isSystem).length;
    const customRoles = mappedRoles.filter((r) => !r.isSystem).length;
    const totalPermissions = mappedPermissions.length;

    return [
      {
        id: "totalRoles",
        title: "Total Roles",
        value: totalRoles,
        description: "Configured roles",
        colorVariant: "primary",
      },
      {
        id: "systemRoles",
        title: "System Roles",
        value: systemRoles,
        description: "Protected default tiers",
        colorVariant: "purple",
      },
      {
        id: "customRoles",
        title: "Custom Roles",
        value: customRoles,
        description: "Workspace-specific",
        colorVariant: "info",
      },
      {
        id: "permissions",
        title: "Total Permissions",
        value: totalPermissions,
        description: "Security capabilities",
        colorVariant: "success",
      },
    ];
  }, [mappedPermissions, mappedRoles]);

  const handleRefresh = useCallback(() => {
    clearError();
    clearMessage();
    hasFetchedAccessControlData.current = false;
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

  const handleViewRole = useCallback(
    (roleId) => {
      navigate(ROUTES.ROLE_DETAILS.replace(":roleId", roleId));
    },
    [navigate]
  );

  const handleEditRole = useCallback(
    (roleId) => {
      navigate(ROUTES.EDIT_ROLE.replace(":roleId", roleId));
    },
    [navigate]
  );

  const pageProps = {
    stats,
    roles: filteredRoles,
    paginatedRoles,
    permissions: mappedPermissions,

    search,
    setSearch,
    currentPage,
    pageSize,
    totalPages,
    handlePageChange: setCurrentPage,
    handlePageSizeChange: (size) => {
      setPageSize(size);
      setCurrentPage(1);
    },

    totalRolesCount: mappedRoles.length,
    filteredRolesCount: filteredRoles.length,

    isLoading,
    hasError,
    error,
    message,

    handleRefresh,
    handleCreateRole,
    handleViewRoles,
    handleViewPermissions,
    handleViewRole,
    handleEditRole,

    clearMessage,
  };

  return isMobile ? (
    <AccessControlMobilePage {...pageProps} />
  ) : (
    <AccessControlDesktopPage {...pageProps} />
  );
};

export default AccessControlPage;
