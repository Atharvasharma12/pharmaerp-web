import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import { UIConfirmDialog, uiToast } from "@/components/ui";

import useAccessControl from "../hooks/useAccessControl";

import RolesDesktopPage from "./desktop/RolesDesktopPage";
import RolesMobilePage from "./mobile/RolesMobilePage";

const statusOptions = [
  { label: "Status: All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const typeOptions = [
  { label: "Type: All", value: "all" },
  { label: "System", value: "system" },
  { label: "Custom", value: "custom" },
];

const initialFilters = {
  search: "",
  status: "all",
  type: "all",
};

const dummyRoles = [
  {
    _id: "dummy-pharmacist",
    name: "Pharmacist",
    description: "Full access to pharmacy operations and inventory",
    subtitle: "Manage medicines, prescriptions and inventory",
    status: "active",
    isSystem: true,
    isEditable: false,
    membersCount: 4,
    permissions: ["inventory.view", "sales.create", "purchase.manage"],
  },
  {
    _id: "dummy-manager",
    name: "Manager",
    description: "Access to reports, billing, users and settings",
    subtitle: "Manage overall operations and reports",
    status: "active",
    isSystem: true,
    isEditable: false,
    membersCount: 2,
    permissions: ["reports.view", "billing.manage", "users.manage"],
  },
  {
    _id: "dummy-cashier",
    name: "Cashier",
    description: "Process sales, returns and payments",
    subtitle: "Handle sales and billing",
    status: "active",
    isSystem: true,
    isEditable: false,
    membersCount: 5,
    permissions: ["sales.create", "sales.return", "payments.manage"],
  },
  {
    _id: "dummy-store-incharge",
    name: "Store Incharge",
    description: "Handle stock, purchases and suppliers",
    subtitle: "Manage inventory and purchases",
    status: "active",
    isSystem: false,
    isEditable: true,
    membersCount: 3,
    permissions: ["stock.manage", "purchase.manage", "supplier.manage"],
  },
  {
    _id: "dummy-stock-viewer",
    name: "Stock Viewer",
    description: "Read-only access to inventory data",
    subtitle: "View inventory and stock reports",
    status: "active",
    isSystem: false,
    isEditable: true,
    membersCount: 2,
    permissions: ["inventory.view", "stock.view"],
  },
  {
    _id: "dummy-accountant",
    name: "Accountant",
    description: "Manage expenses, payments and financial reports",
    subtitle: "Manage accounts and finances",
    status: "active",
    isSystem: false,
    isEditable: true,
    membersCount: 1,
    permissions: ["expenses.manage", "payments.view", "reports.finance"],
  },
  {
    _id: "dummy-delivery-boy",
    name: "Delivery Boy",
    description: "Access to delivery and customer information",
    subtitle: "Delivery and customer related access",
    status: "inactive",
    isSystem: false,
    isEditable: true,
    membersCount: 2,
    permissions: ["delivery.view", "customers.view"],
  },
  {
    _id: "dummy-support-staff",
    name: "Support Staff",
    description: "Limited access for customer support",
    subtitle: "Customer support and basic operations",
    status: "inactive",
    isSystem: false,
    isEditable: true,
    membersCount: 0,
    permissions: ["customers.view", "tickets.manage"],
  },
];

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatRoleName = (value) => {
  if (!value) return "-";

  return String(value)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getUserName = (user) =>
  user?.fullName || user?.name || user?.profile?.fullName || user?.email || "-";

const getMembersCount = (role) => {
  if (typeof role?.membersCount === "number") return role.membersCount;
  if (typeof role?.memberCount === "number") return role.memberCount;
  if (Array.isArray(role?.members)) return role.members.length;
  if (Array.isArray(role?.users)) return role.users.length;
  return 0;
};

const mapRoleForView = (role) => {
  const permissions = Array.isArray(role?.permissions) ? role.permissions : [];
  const createdBy = role?.createdBy || null;

  return {
    ...role,
    permissions,
    createdBy,
    displayName: role?.name || formatRoleName(role?.code) || "Role",
    displayCode: role?.code || "-",
    displayDescription: role?.description || "No description added.",
    displaySubtitle:
      role?.subtitle ||
      role?.shortDescription ||
      role?.description ||
      "Role access and permission management",
    displayStatus: role?.status || "inactive",
    displayType: role?.isSystem ? "System" : "Custom",
    displayEditable: role?.isEditable ? "Editable" : "Locked",
    displayCreatedBy: getUserName(createdBy),
    membersCount: getMembersCount(role),
    permissionCount: permissions.length,
    canEdit: Boolean(role?.isEditable),
    canDelete: !role?.isSystem,
  };
};

const RolesPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    roles,
    getWorkspaceRoles,
    deleteRole,

    getWorkspaceRolesStatus,
    deleteRoleStatus,

    error,
    message,

    clearError,
    clearMessage,
    clearCurrentRole,
  } = useAccessControl();

  const hasFetchedRolesRef = useRef(false);

  const [filters, setFilters] = useState(initialFilters);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isLoadingRoles = getWorkspaceRolesStatus === API_STATUS.LOADING;
  const isDeletingRole = deleteRoleStatus === API_STATUS.LOADING;
  const isLoading = isLoadingRoles;
  const hasError = getWorkspaceRolesStatus === API_STATUS.ERROR;

  const fetchRoles = useCallback(async () => {
    try {
      await getWorkspaceRoles();
    } catch {
      // Error is already stored in access control slice.
    }
  }, [getWorkspaceRoles]);

  useEffect(() => {
    clearError();
    clearCurrentRole();

    return () => {
      clearError();
    };
  }, [clearCurrentRole, clearError]);

  useEffect(() => {
    if (hasFetchedRolesRef.current) return;

    hasFetchedRolesRef.current = true;
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedRoles = useMemo(() => {
    const sourceRoles =
      Array.isArray(roles) && roles.length ? roles : dummyRoles;
    const mapped = sourceRoles.map(mapRoleForView);

    // Sort by highest member count first (descending)
    return mapped.sort((a, b) => {
      const countA = a.membersCount ?? 0;
      const countB = b.membersCount ?? 0;
      if (countB !== countA) return countB - countA;
      if (a.isSystem !== b.isSystem) return a.isSystem ? -1 : 1;
      return String(a.displayName).localeCompare(String(b.displayName));
    });
  }, [roles]);

  const filteredRoles = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedRoles.filter((role) => {
      const matchesSearch =
        !search ||
        normalizeText(role.displayName).includes(search) ||
        normalizeText(role.displayCode).includes(search) ||
        normalizeText(role.displayDescription).includes(search) ||
        normalizeText(role.displaySubtitle).includes(search) ||
        normalizeText(role.displayStatus).includes(search) ||
        normalizeText(role.displayType).includes(search) ||
        role.permissions.some((permission) =>
          normalizeText(permission).includes(search),
        );

      const matchesStatus =
        filters.status === "all" || role.displayStatus === filters.status;

      const matchesType =
        filters.type === "all" ||
        (filters.type === "system" && role.isSystem) ||
        (filters.type === "custom" && !role.isSystem);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [filters, mappedRoles]);

  const stats = useMemo(() => {
    const total = mappedRoles.length;
    const system = mappedRoles.filter((role) => role.isSystem).length;
    const custom = mappedRoles.filter((role) => !role.isSystem).length;
    const inactive = mappedRoles.filter(
      (role) => role.displayStatus !== "active",
    ).length;

    return [
      {
        id: "total",
        title: "Total Roles",
        value: total,
        description: "Active roles",
        colorVariant: "success",
      },
      {
        id: "system",
        title: "System Roles",
        value: system,
        description: "Default system roles",
        colorVariant: "purple",
      },
      {
        id: "custom",
        title: "Custom Roles",
        value: custom,
        description: "Workspace custom roles",
        colorVariant: "info",
      },
      {
        id: "inactive",
        title: "Inactive Roles",
        value: inactive,
        description: "Disabled roles",
        colorVariant: "warning",
      },
    ];
  }, [mappedRoles]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }

    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label:
          statusOptions.find((option) => option.value === filters.status)
            ?.label || filters.status,
      });
    }

    if (filters.type !== "all") {
      chips.push({
        key: "type",
        label:
          typeOptions.find((option) => option.value === filters.type)?.label ||
          filters.type,
      });
    }

    return chips;
  }, [filters]);

  const roleHelp = useMemo(
    () => ({
      aboutPoints: [
        "Create custom roles for your team",
        "Assign permissions to each role",
        "Add members and assign roles",
        "Manage access across workspace",
      ],
      systemDescription:
        "Default roles created by the system. These roles have predefined permissions that cannot be deleted.",
      customDescription:
        "Custom roles created for your workspace. You can edit, update or delete these roles as per your requirements.",
    }),
    [],
  );

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
    hasFetchedRolesRef.current = false;
    fetchRoles();
  }, [fetchRoles]);

  const handleBackToAccessControl = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleCreateRole = useCallback(() => {
    navigate(ROUTES.CREATE_ROLE);
  }, [navigate]);

  const handleViewPermissions = useCallback(() => {
    navigate(ROUTES.PERMISSIONS);
  }, [navigate]);

  const handleExportRoles = useCallback(() => {
    // Wire this to your export API when available.
  }, []);

  const handleViewRole = useCallback(
    (role) => {
      if (!role?._id || String(role._id).startsWith("dummy-")) return;
      navigate(ROUTES.ROLE_DETAILS.replace(":roleId", role._id));
    },
    [navigate],
  );

  const handleEditRole = useCallback(
    (role) => {
      if (
        !role?._id ||
        !role?.canEdit ||
        String(role._id).startsWith("dummy-")
      ) {
        return;
      }

      navigate(ROUTES.EDIT_ROLE.replace(":roleId", role._id));
    },
    [navigate],
  );

  const handleDeleteRole = useCallback((role) => {
    if (
      !role?._id ||
      !role?.canDelete ||
      String(role._id).startsWith("dummy-")
    ) {
      return;
    }

    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (isDeletingRole) return;

    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  }, [isDeletingRole]);

  const handleConfirmDeleteRole = useCallback(async () => {
    if (!selectedRole?._id) return;

    try {
      await deleteRole(selectedRole._id);
      closeDeleteModal();
    } catch {
      // Error is already stored in access control slice.
    }
  }, [closeDeleteModal, deleteRole, selectedRole]);

  const pageProps = {
    roles: filteredRoles,
    stats,
    roleHelp,

    filters,
    activeFilterChips,
    statusOptions,
    typeOptions,

    isLoading,
    hasError,
    error,
    message,

    totalRoles: mappedRoles.length,
    filteredRolesCount: filteredRoles.length,
    hasRoles: mappedRoles.length > 0,
    hasFilteredRoles: filteredRoles.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,

    handleRefresh,
    handleBackToAccessControl,
    handleCreateRole,
    handleViewPermissions,
    handleExportRoles,
    handleViewRole,
    handleEditRole,
    handleDeleteRole,

    clearMessage,
  };

  return (
    <>
      {isMobile ? (
        <RolesMobilePage {...pageProps} />
      ) : (
        <RolesDesktopPage {...pageProps} />
      )}

      <UIConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDeleteRole}
        title="Delete Role"
        description={`Are you sure you want to delete "${selectedRole?.displayName || "this role"}"? Workspace members currently assigned to this role will lose associated permissions.`}
        intent="danger"
        confirmText="Delete Role"
        cancelText="Keep Role"
        itemName={selectedRole?.displayName}
        itemDetails={`${selectedRole?.displayType || "Custom"} Role • ${selectedRole?.permissionCount || 0} Permissions`}
        isLoading={isDeletingRole}
      />
    </>
  );
};

export default RolesPage;
