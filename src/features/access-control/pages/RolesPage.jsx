import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppConfirmModal } from "@/components";

import useAccessControl from "../hooks/useAccessControl";

import RolesDesktopPage from "./desktop/RolesDesktopPage";
import RolesMobilePage from "./mobile/RolesMobilePage";

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "System", value: "system" },
  { label: "Custom", value: "custom" },
  { label: "Editable", value: "editable" },
  { label: "Locked", value: "locked" },
];

const initialFilters = {
  search: "",
  status: "all",
  type: "all",
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRoleName = (value) => {
  if (!value) return "-";

  return String(value)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatPermissionLabel = (permission) => formatRoleName(permission);

const getUserName = (user) =>
  user?.fullName || user?.name || user?.profile?.fullName || user?.email || "-";

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
    displayStatus: role?.status || "inactive",
    displayType: role?.isSystem ? "System" : "Custom",
    displayEditable: role?.isEditable ? "Editable" : "Locked",
    displayCreatedBy: getUserName(createdBy),
    displayCreatedAt: formatDate(role?.createdAt),
    displayUpdatedAt: formatDateTime(role?.updatedAt),
    permissionCount: permissions.length,
    permissionPreview: permissions.slice(0, 3).map(formatPermissionLabel),
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
    if (!message) return;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedRoles = useMemo(
    () => (Array.isArray(roles) ? roles : []).map(mapRoleForView),
    [roles],
  );

  const filteredRoles = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedRoles.filter((role) => {
      const matchesSearch =
        !search ||
        normalizeText(role.displayName).includes(search) ||
        normalizeText(role.displayCode).includes(search) ||
        normalizeText(role.displayDescription).includes(search) ||
        normalizeText(role.displayStatus).includes(search) ||
        normalizeText(role.displayType).includes(search) ||
        normalizeText(role.displayEditable).includes(search) ||
        role.permissions.some((permission) =>
          normalizeText(permission).includes(search),
        );

      const matchesStatus =
        filters.status === "all" || role.displayStatus === filters.status;

      const matchesType =
        filters.type === "all" ||
        (filters.type === "system" && role.isSystem) ||
        (filters.type === "custom" && !role.isSystem) ||
        (filters.type === "editable" && role.isEditable) ||
        (filters.type === "locked" && !role.isEditable);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [filters, mappedRoles]);

  const stats = useMemo(() => {
    const total = mappedRoles.length;
    const active = mappedRoles.filter(
      (role) => role.displayStatus === "active",
    ).length;
    const system = mappedRoles.filter((role) => role.isSystem).length;
    const custom = mappedRoles.filter((role) => !role.isSystem).length;

    return [
      {
        id: "total",
        title: "Total",
        value: total,
        description: "Workspace roles",
        colorVariant: "primary",
      },
      {
        id: "active",
        title: "Active",
        value: active,
        description: "Available for assignment",
        colorVariant: "success",
      },
      {
        id: "system",
        title: "System",
        value: system,
        description: "Default locked roles",
        colorVariant: "info",
      },
      {
        id: "custom",
        title: "Custom",
        value: custom,
        description: "Created by workspace",
        colorVariant: "warning",
      },
    ];
  }, [mappedRoles]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({
        key: "search",
        label: `Search: ${filters.search}`,
        value: filters.search,
      });
    }

    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label:
          statusOptions.find((option) => option.value === filters.status)
            ?.label || filters.status,
        value: filters.status,
      });
    }

    if (filters.type !== "all") {
      chips.push({
        key: "type",
        label:
          typeOptions.find((option) => option.value === filters.type)?.label ||
          filters.type,
        value: filters.type,
      });
    }

    return chips;
  }, [filters]);

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
    hasFetchedRolesRef.current = false;
    fetchRoles();
  }, [fetchRoles]);

  const handleBackToAccessControl = useCallback(() => {
    navigate(ROUTES.ACCESS_CONTROL);
  }, [navigate]);

  const handleCreateRole = useCallback(() => {
    navigate(ROUTES.CREATE_ROLE);
  }, [navigate]);

  const handleViewPermissions = useCallback(() => {
    navigate(ROUTES.PERMISSIONS);
  }, [navigate]);

  const handleViewRole = useCallback(
    (role) => {
      if (!role?._id) return;

      navigate(ROUTES.ROLE_DETAILS.replace(":roleId", role._id));
    },
    [navigate],
  );

  const handleEditRole = useCallback(
    (role) => {
      if (!role?._id || !role?.canEdit) return;

      navigate(ROUTES.EDIT_ROLE.replace(":roleId", role._id));
    },
    [navigate],
  );

  const handleDeleteRole = useCallback((role) => {
    if (!role?._id || !role?.canDelete) return;

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

      <AppConfirmModal
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDeleteRole}
        title="Delete Role"
        message={`Delete ${selectedRole?.displayName || "this role"}?`}
        description="This role will be soft deleted and can no longer be assigned to workspace members. System roles cannot be deleted."
        variant="error"
        confirmLabel="Delete Role"
        cancelLabel="Keep Role"
        loading={isDeletingRole}
        confirmDisabled={isDeletingRole}
        cancelDisabled={isDeletingRole}
        closeOnBackdrop={!isDeletingRole}
      />
    </>
  );
};

export default RolesPage;
