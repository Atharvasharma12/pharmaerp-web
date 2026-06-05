import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    return {
      moduleKey: "general",
      actionKey: "access",
    };
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

  return {
    moduleKey: "general",
    actionKey: value,
  };
};

const formatLabel = (value) => {
  if (!value) return "-";

  return String(value)
    .replace(/[.:/]/g, " ")
    .replace(/_/g, " ")
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

  if (
    ["update", "edit", "manage", "assign"].some((item) => action.includes(item))
  ) {
    return "manage";
  }

  if (["delete", "remove", "cancel"].some((item) => action.includes(item))) {
    return "delete";
  }

  if (["view", "read", "list", "get"].some((item) => action.includes(item))) {
    return "view";
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
        permissions: [],
      });
    }

    groupMap.get(permission.moduleKey).permissions.push(permission);
  });

  return Array.from(groupMap.values()).sort((a, b) =>
    a.displayModule.localeCompare(b.displayModule),
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
    } catch {
      // Error is already stored in access control slice.
    }
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

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedPermissions = useMemo(
    () =>
      (Array.isArray(permissions) ? permissions : []).map(mapPermissionForView),
    [permissions],
  );

  const moduleOptions = useMemo(() => {
    const modules = Array.from(
      new Map(
        mappedPermissions.map((permission) => [
          permission.moduleKey,
          permission.displayModule,
        ]),
      ).entries(),
    )
      .map(([value, label]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [...moduleOptionsBase, ...modules];
  }, [mappedPermissions]);

  const filteredPermissions = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedPermissions.filter((permission) => {
      const matchesSearch =
        !search ||
        normalizeText(permission.value).includes(search) ||
        normalizeText(permission.displayPermission).includes(search) ||
        normalizeText(permission.displayModule).includes(search) ||
        normalizeText(permission.displayAction).includes(search) ||
        normalizeText(permission.actionType).includes(search);

      const matchesModule =
        filters.module === "all" || permission.moduleKey === filters.module;

      return matchesSearch && matchesModule;
    });
  }, [filters, mappedPermissions]);

  const permissionGroups = useMemo(
    () => buildPermissionGroups(filteredPermissions),
    [filteredPermissions],
  );

  const stats = useMemo(() => {
    const total = mappedPermissions.length;
    const modules = new Set(mappedPermissions.map((item) => item.moduleKey))
      .size;
    const view = mappedPermissions.filter(
      (item) => item.actionType === "view",
    ).length;
    const manage = mappedPermissions.filter((item) =>
      ["create", "manage", "delete"].includes(item.actionType),
    ).length;

    return [
      {
        id: "total",
        title: "Total",
        value: total,
        description: "Available permissions",
        colorVariant: "primary",
      },
      {
        id: "modules",
        title: "Modules",
        value: modules,
        description: "Permission groups",
        colorVariant: "info",
      },
      {
        id: "view",
        title: "View",
        value: view,
        description: "Read-only actions",
        colorVariant: "success",
      },
      {
        id: "manage",
        title: "Manage",
        value: manage,
        description: "Write or admin actions",
        colorVariant: "warning",
      },
    ];
  }, [mappedPermissions]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({
        key: "search",
        label: `Search: ${filters.search}`,
        value: filters.search,
      });
    }

    if (filters.module !== "all") {
      chips.push({
        key: "module",
        label:
          moduleOptions.find((option) => option.value === filters.module)
            ?.label || filters.module,
        value: filters.module,
      });
    }

    return chips;
  }, [filters, moduleOptions]);

  const handleFilterChange = useCallback((eventOrValue) => {
    if (eventOrValue?.target) {
      const { name, value } = eventOrValue.target;

      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));

      return;
    }

    setFilters((prev) => ({
      ...prev,
      ...eventOrValue,
    }));
  }, []);

  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? event;

    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: initialFilters[key],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    hasFetchedPermissionsRef.current = false;
    fetchPermissions();
  }, [fetchPermissions]);

  const handleBackToAccessControl = useCallback(() => {
    navigate(ROUTES.ACCESS_CONTROL);
  }, [navigate]);

  const handleViewRoles = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleViewMemberAccess = useCallback(() => {
    navigate(ROUTES.MEMBER_ACCESS);
  }, [navigate]);

  const pageProps = {
    permissions: filteredPermissions,
    permissionGroups,
    stats,

    filters,
    activeFilterChips,
    moduleOptions,

    isLoading,
    hasError,
    error,
    message,

    totalPermissions: mappedPermissions.length,
    filteredPermissionsCount: filteredPermissions.length,
    totalModules: moduleOptions.length - 1,
    hasPermissions: mappedPermissions.length > 0,
    hasFilteredPermissions: filteredPermissions.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,

    handleRefresh,
    handleBackToAccessControl,
    handleViewRoles,
    handleViewMemberAccess,

    clearMessage,
  };

  return isMobile ? (
    <PermissionMobilePage {...pageProps} />
  ) : (
    <PermissionDesktopPage {...pageProps} />
  );
};

export default PermissionPage;
