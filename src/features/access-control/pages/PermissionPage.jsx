// src/features/access-control/pages/PermissionPage.jsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccessControl from "../hooks/useAccessControl";

import PermissionDesktopPage from "./desktop/PermissionDesktopPage";
import PermissionMobilePage from "./mobile/PermissionMobilePage";

const moduleOptionsBase = [{ label: "All Modules", value: "all" }];

const initialFilters = {
  search: "",
  module: "all",
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const splitPermission = (permission) => {
  const value = normalizeText(permission);
  if (!value) {
    return { moduleKey: "general", actionKey: "access" };
  }

  const parts = value
    .split(/[.:/]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 2) {
    return {
      moduleKey: parts[0],
      actionKey: parts.slice(1).join("_"),
    };
  }

  const underscoreParts = value.split("_").filter(Boolean);
  if (underscoreParts.length >= 2) {
    return {
      moduleKey: underscoreParts[0],
      actionKey: underscoreParts.slice(1).join("_"),
    };
  }

  return { moduleKey: "general", actionKey: value };
};

const formatLabel = (value) => {
  if (!value) return "-";
  return String(value)
    .replace(/[.:/]/g, " ")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const inferActionType = (actionKey) => {
  const action = normalizeText(actionKey);
  if (["create", "add", "invite"].some((item) => action.includes(item))) {
    return "create";
  }
  if (["update", "edit", "manage", "assign", "set"].some((item) => action.includes(item))) {
    return "manage";
  }
  if (["delete", "remove", "cancel", "revoke"].some((item) => action.includes(item))) {
    return "delete";
  }
  if (["view", "read", "list", "get"].some((item) => action.includes(item))) {
    return "view";
  }
  if (["export", "download", "print"].some((item) => action.includes(item))) {
    return "export";
  }
  return "other";
};

const mapPermissionForView = (permission, index) => {
  const { moduleKey, actionKey } = splitPermission(permission);
  const actionType = inferActionType(actionKey);

  return {
    id: `${permission}-${index}`,
    value: permission,
    moduleKey,
    actionKey,
    actionType,
    displayModule: formatLabel(moduleKey),
    displayAction: formatLabel(actionKey),
    displayPermission: formatLabel(permission),
  };
};

const buildPermissionGroups = (permissions) => {
  const groupMap = new Map();

  permissions.forEach((permission) => {
    if (!groupMap.has(permission.moduleKey)) {
      groupMap.set(permission.moduleKey, {
        id: permission.moduleKey,
        moduleKey: permission.moduleKey,
        displayModule: permission.displayModule,
        description: `Operational clearance for ${permission.displayModule} services`,
        permissions: [],
        items: [],
        totalPermissions: 0,
      });
    }

    const group = groupMap.get(permission.moduleKey);
    group.permissions.push(permission.value);
    group.items.push(permission);
    group.totalPermissions += 1;
  });

  return Array.from(groupMap.values()).sort((a, b) =>
    a.displayModule.localeCompare(b.displayModule)
  );
};

const PermissionPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    permissions,
    getAvailablePermissions,
    getAvailablePermissionsStatus,
    error,
    message,
    clearError,
    clearMessage,
  } = useAccessControl();

  const hasFetchedPermissionsRef = useRef(false);
  const [filters, setFilters] = useState(initialFilters);

  const isLoading = getAvailablePermissionsStatus === API_STATUS.LOADING;
  const hasError = getAvailablePermissionsStatus === API_STATUS.ERROR;

  const fetchPermissions = useCallback(async () => {
    try {
      await getAvailablePermissions();
    } catch {}
  }, [getAvailablePermissions]);

  useEffect(() => {
    clearError();
    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    if (hasFetchedPermissionsRef.current) return;
    hasFetchedPermissionsRef.current = true;
    fetchPermissions();
  }, [fetchPermissions]);

  const rawPermissions = useMemo(() => {
    return Array.isArray(permissions) ? permissions : [];
  }, [permissions]);

  const mappedPermissions = useMemo(() => {
    return rawPermissions.map(mapPermissionForView);
  }, [rawPermissions]);

  const permissionModules = useMemo(() => {
    return buildPermissionGroups(mappedPermissions);
  }, [mappedPermissions]);

  const moduleOptions = useMemo(() => {
    const modules = permissionModules.map((m) => ({
      label: m.displayModule,
      value: m.moduleKey,
    }));
    return [...moduleOptionsBase, ...modules];
  }, [permissionModules]);

  const filteredPermissionModules = useMemo(() => {
    const search = normalizeText(filters.search);

    return permissionModules
      .map((module) => {
        const matchesModule =
          filters.module === "all" || module.moduleKey === filters.module;

        if (!matchesModule) return null;

        if (!search) return module;

        const moduleMatches =
          normalizeText(module.displayModule).includes(search) ||
          normalizeText(module.moduleKey).includes(search);

        const filteredItems = module.items.filter(
          (p) =>
            normalizeText(p.value).includes(search) ||
            normalizeText(p.displayAction).includes(search)
        );

        if (moduleMatches) {
          return module;
        }

        if (filteredItems.length > 0) {
          return {
            ...module,
            items: filteredItems,
            permissions: filteredItems.map((i) => i.value),
            totalPermissions: filteredItems.length,
          };
        }

        return null;
      })
      .filter(Boolean);
  }, [filters, permissionModules]);

  const stats = useMemo(() => {
    const totalModules = permissionModules.length;
    const totalPermissions = rawPermissions.length;

    let viewCount = 0;
    let createCount = 0;
    let manageCount = 0;
    let deleteCount = 0;

    mappedPermissions.forEach((p) => {
      if (p.actionType === "view") viewCount++;
      else if (p.actionType === "create") createCount++;
      else if (p.actionType === "delete") deleteCount++;
      else manageCount++;
    });

    return [
      {
        id: "total",
        title: "Total Capabilities",
        value: totalPermissions,
        description: "Granular permission keys",
        colorVariant: "primary",
      },
      {
        id: "modules",
        title: "System Modules",
        value: totalModules,
        description: "Domain feature groups",
        colorVariant: "purple",
      },
      {
        id: "view",
        title: "Read / View Keys",
        value: viewCount,
        description: "Auditing & inspection",
        colorVariant: "info",
      },
      {
        id: "manage",
        title: "Write & Admin Keys",
        value: createCount + manageCount + deleteCount,
        description: `${createCount} Create • ${deleteCount} Delete`,
        colorVariant: "success",
      },
    ];
  }, [mappedPermissions, permissionModules, rawPermissions]);

  const handleFilterChange = useCallback((eventOrValue) => {
    if (eventOrValue?.target) {
      const { name, value } = eventOrValue.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
      return;
    }
    setFilters((prev) => ({ ...prev, ...eventOrValue }));
  }, []);

  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? event;
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    hasFetchedPermissionsRef.current = false;
    fetchPermissions();
  }, [fetchPermissions]);

  const handleViewRoles = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleBackToAccessControl = useCallback(() => {
    navigate(ROUTES.ACCESS_CONTROL);
  }, [navigate]);

  const pageProps = {
    permissionModules: filteredPermissionModules,
    allModules: permissionModules,
    stats,

    filters,
    moduleOptions,

    isLoading,
    hasError,
    error,
    message,

    totalPermissionsCount: rawPermissions.length,
    filteredModulesCount: filteredPermissionModules.length,
    hasPermissions: rawPermissions.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleClearFilters,

    handleRefresh,
    handleViewRoles,
    handleBackToAccessControl,

    clearMessage,
  };

  return isMobile ? (
    <PermissionMobilePage {...pageProps} />
  ) : (
    <PermissionDesktopPage {...pageProps} />
  );
};

export default PermissionPage;
