// src/features/access-control/pages/PermissionPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccessControl from "../hooks/useAccessControl";

import PermissionDesktopPage from "./desktop/PermissionDesktopPage";
import PermissionMobilePage from "./mobile/PermissionMobilePage";

const moduleOptionsBase = [{ label: "Module: All", value: "all" }];

const statusOptions = [
  { label: "Status: All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const initialFilters = {
  search: "",
  module: "all",
  status: "all",
};

const dummyPermissionModules = [
  {
    id: "dashboard",
    moduleKey: "dashboard",
    displayModule: "Dashboard",
    description: "Dashboard and analytics access",
    totalPermissions: 8,
    activePermissions: 8,
    inactivePermissions: 0,
    type: "system",
    permissions: [
      "dashboard.view",
      "dashboard.export",
      "dashboard.analytics.view",
      "dashboard.summary.view",
      "dashboard.reports.view",
      "dashboard.stats.view",
      "dashboard.notifications.view",
      "dashboard.widgets.manage",
    ],
  },
  {
    id: "companies",
    moduleKey: "companies",
    displayModule: "Companies",
    description: "Manage companies and company settings",
    totalPermissions: 16,
    activePermissions: 15,
    inactivePermissions: 1,
    type: "system",
    permissions: [
      "companies.view",
      "companies.create",
      "companies.update",
      "companies.delete",
      "companies.export",
      "companies.settings.manage",
    ],
  },
  {
    id: "branches",
    moduleKey: "branches",
    displayModule: "Branches",
    description: "Manage branches and branch settings",
    totalPermissions: 14,
    activePermissions: 13,
    inactivePermissions: 1,
    type: "system",
    permissions: [
      "branches.view",
      "branches.create",
      "branches.update",
      "branches.delete",
      "branches.export",
    ],
  },
  {
    id: "inventory",
    moduleKey: "inventory",
    displayModule: "Inventory",
    description: "Manage inventory, stock and items",
    totalPermissions: 24,
    activePermissions: 22,
    inactivePermissions: 2,
    type: "custom",
    permissions: [
      "inventory.view",
      "inventory.create",
      "inventory.update",
      "inventory.delete",
      "inventory.export",
      "stock.view",
      "stock.update",
    ],
  },
  {
    id: "purchases",
    moduleKey: "purchases",
    displayModule: "Purchases",
    description: "Manage purchase orders and suppliers",
    totalPermissions: 16,
    activePermissions: 15,
    inactivePermissions: 1,
    type: "custom",
    permissions: [
      "purchases.view",
      "purchases.create",
      "purchases.update",
      "purchases.delete",
      "suppliers.manage",
    ],
  },
  {
    id: "sales",
    moduleKey: "sales",
    displayModule: "Sales (POS)",
    description: "Manage sales and POS transactions",
    totalPermissions: 20,
    activePermissions: 18,
    inactivePermissions: 2,
    type: "custom",
    permissions: [
      "sales.view",
      "sales.create",
      "sales.update",
      "sales.return",
      "sales.export",
      "pos.manage",
    ],
  },
  {
    id: "billing",
    moduleKey: "billing",
    displayModule: "Billing & Invoicing",
    description: "Manage invoices and billing",
    totalPermissions: 12,
    activePermissions: 12,
    inactivePermissions: 0,
    type: "custom",
    permissions: [
      "billing.view",
      "billing.create",
      "billing.update",
      "billing.export",
    ],
  },
  {
    id: "staff",
    moduleKey: "staff",
    displayModule: "Staff & Users",
    description: "Manage staff and user accounts",
    totalPermissions: 16,
    activePermissions: 14,
    inactivePermissions: 2,
    type: "system",
    permissions: ["staff.view", "staff.create", "staff.update", "staff.delete"],
  },
  {
    id: "reports",
    moduleKey: "reports",
    displayModule: "Reports",
    description: "View and export reports",
    totalPermissions: 10,
    activePermissions: 10,
    inactivePermissions: 0,
    type: "custom",
    permissions: ["reports.view", "reports.export", "reports.finance.view"],
  },
  {
    id: "expenses",
    moduleKey: "expenses",
    displayModule: "Expenses",
    description: "Manage expenses and categories",
    totalPermissions: 10,
    activePermissions: 9,
    inactivePermissions: 1,
    type: "custom",
    permissions: [
      "expenses.view",
      "expenses.create",
      "expenses.update",
      "expenses.delete",
    ],
  },
  {
    id: "access-control",
    moduleKey: "access-control",
    displayModule: "Access Control",
    description: "Manage roles, permissions and access",
    totalPermissions: 6,
    activePermissions: 6,
    inactivePermissions: 0,
    type: "system",
    permissions: [
      "roles.view",
      "roles.create",
      "roles.update",
      "permissions.view",
    ],
  },
  {
    id: "settings",
    moduleKey: "settings",
    displayModule: "Settings",
    description: "System settings and configurations",
    totalPermissions: 4,
    activePermissions: 4,
    inactivePermissions: 0,
    type: "system",
    permissions: ["settings.view", "settings.update", "settings.manage"],
  },
];

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

  if (["export", "download"].some((item) => action.includes(item))) {
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
    status: "active",
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
        description: `${permission.displayModule} permissions`,
        permissions: [],
        totalPermissions: 0,
        activePermissions: 0,
        inactivePermissions: 0,
        type: "custom",
      });
    }

    const group = groupMap.get(permission.moduleKey);
    group.permissions.push(permission.value);
    group.totalPermissions += 1;
    group.activePermissions += 1;
  });

  return Array.from(groupMap.values()).sort((a, b) =>
    a.displayModule.localeCompare(b.displayModule),
  );
};

const mapBackendPermissionsToModules = (mappedPermissions) =>
  buildPermissionGroups(mappedPermissions).map((group) => ({
    ...group,
    description: `${group.displayModule} permissions and access controls`,
    inactivePermissions: 0,
    type: "system",
  }));

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
    if (!message) return undefined;

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

  const permissionModules = useMemo(() => {
    if (mappedPermissions.length) {
      return mapBackendPermissionsToModules(mappedPermissions);
    }

    return dummyPermissionModules;
  }, [mappedPermissions]);

  const moduleOptions = useMemo(() => {
    const modules = permissionModules
      .map((module) => ({
        label: module.displayModule,
        value: module.moduleKey,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return [...moduleOptionsBase, ...modules];
  }, [permissionModules]);

  const filteredPermissionModules = useMemo(() => {
    const search = normalizeText(filters.search);

    return permissionModules.filter((module) => {
      const modulePermissions = Array.isArray(module.permissions)
        ? module.permissions
        : [];

      const matchesSearch =
        !search ||
        normalizeText(module.displayModule).includes(search) ||
        normalizeText(module.description).includes(search) ||
        normalizeText(module.moduleKey).includes(search) ||
        modulePermissions.some((permission) =>
          normalizeText(permission).includes(search),
        );

      const matchesModule =
        filters.module === "all" || module.moduleKey === filters.module;

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && module.activePermissions > 0) ||
        (filters.status === "inactive" && module.inactivePermissions > 0);

      return matchesSearch && matchesModule && matchesStatus;
    });
  }, [filters, permissionModules]);

  const stats = useMemo(() => {
    const totalModules = permissionModules.length;
    const totalPermissions = permissionModules.reduce(
      (sum, module) => sum + (Number(module.totalPermissions) || 0),
      0,
    );
    const activePermissions = permissionModules.reduce(
      (sum, module) => sum + (Number(module.activePermissions) || 0),
      0,
    );
    const inactivePermissions = permissionModules.reduce(
      (sum, module) => sum + (Number(module.inactivePermissions) || 0),
      0,
    );

    return [
      {
        id: "modules",
        title: "Total Modules",
        value: totalModules || 12,
        description: "System modules",
        colorVariant: "success",
      },
      {
        id: "total",
        title: "Total Permissions",
        value: totalPermissions || 156,
        description: "All permissions",
        colorVariant: "info",
      },
      {
        id: "active",
        title: "Active Permissions",
        value: activePermissions || 142,
        description: "Currently active",
        colorVariant: "purple",
      },
      {
        id: "inactive",
        title: "Inactive Permissions",
        value: inactivePermissions || 14,
        description: "Currently inactive",
        colorVariant: "warning",
      },
    ];
  }, [permissionModules]);

  const permissionOverview = useMemo(() => {
    const total = stats.find((stat) => stat.id === "total")?.value || 156;
    const active = stats.find((stat) => stat.id === "active")?.value || 142;
    const inactive = stats.find((stat) => stat.id === "inactive")?.value || 14;
    const system =
      permissionModules
        .filter((module) => module.type === "system")
        .reduce(
          (sum, module) => sum + (Number(module.activePermissions) || 0),
          0,
        ) || 78;
    const custom = Math.max(active - system, 0) || 64;

    const toPercent = (value) => Math.round((Number(value || 0) / total) * 100);

    return [
      {
        id: "active",
        label: "Active",
        value: active,
        percent: toPercent(active),
        colorVariant: "success",
      },
      {
        id: "inactive",
        label: "Inactive",
        value: inactive,
        percent: toPercent(inactive),
        colorVariant: "neutral",
      },
      {
        id: "system",
        label: "System",
        value: system,
        percent: toPercent(system),
        colorVariant: "purple",
      },
      {
        id: "custom",
        label: "Custom",
        value: custom,
        percent: toPercent(custom),
        colorVariant: "warning",
      },
    ];
  }, [permissionModules, stats]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }

    if (filters.module !== "all") {
      chips.push({
        key: "module",
        label:
          moduleOptions.find((option) => option.value === filters.module)
            ?.label || filters.module,
      });
    }

    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label:
          statusOptions.find((option) => option.value === filters.status)
            ?.label || filters.status,
      });
    }

    return chips;
  }, [filters, moduleOptions]);

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

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
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

  const handleExportPermissions = useCallback(() => {
    // Wire this to your export API when available.
  }, []);

  const pageProps = {
    permissionModules: filteredPermissionModules,
    stats,
    permissionOverview,

    filters,
    activeFilterChips,
    moduleOptions,
    statusOptions,

    isLoading,
    hasError,
    error,
    message,

    totalPermissions: stats.find((stat) => stat.id === "total")?.value || 156,
    filteredPermissionsCount: filteredPermissionModules.reduce(
      (sum, module) => sum + (Number(module.totalPermissions) || 0),
      0,
    ),
    totalModules: permissionModules.length,
    filteredModulesCount: filteredPermissionModules.length,
    hasPermissions: permissionModules.length > 0,
    hasFilteredPermissions: filteredPermissionModules.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,

    handleRefresh,
    handleBackToAccessControl,
    handleViewRoles,
    handleViewMemberAccess,
    handleExportPermissions,

    clearMessage,
  };

  return isMobile ? (
    <PermissionMobilePage {...pageProps} />
  ) : (
    <PermissionDesktopPage {...pageProps} />
  );
};

export default PermissionPage;
