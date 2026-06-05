// src/features/access-control/pages/RoleDetailsPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppConfirmModal } from "@/components";

import useAccessControl from "../hooks/useAccessControl";

import RoleDetailsDesktopPage from "./desktop/RoleDetailsDesktopPage";
import RoleDetailsMobilePage from "./mobile/RoleDetailsMobilePage";

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

const formatLabel = (value) => {
  if (!value) return "-";

  return String(value)
    .replace(/[.:_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getPermissionGroup = (permission) => {
  const [firstPart] = String(permission || "").split(/[.:_-]/);

  return formatLabel(firstPart || "General");
};

const getUserName = (user) =>
  user?.fullName || user?.name || user?.profile?.fullName || user?.email || "-";

const mapRoleForView = (role) => {
  const permissions = Array.isArray(role?.permissions) ? role.permissions : [];
  const createdBy = role?.createdBy || null;

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const group = getPermissionGroup(permission);

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push({
      label: formatLabel(permission),
      value: permission,
    });

    return acc;
  }, {});

  return {
    ...role,
    permissions,
    createdBy,
    groupedPermissions,

    displayName: role?.name || formatLabel(role?.code) || "Role",
    displayCode: role?.code || "-",
    displayDescription: role?.description || "No description added.",
    displayStatus: role?.status || "inactive",
    displayType: role?.isSystem ? "System" : "Custom",
    displayEditable: role?.isEditable ? "Editable" : "Locked",
    displayCreatedBy: getUserName(createdBy),
    displayCreatedAt: formatDate(role?.createdAt),
    displayCreatedAtTime: formatDateTime(role?.createdAt),
    displayUpdatedAt: formatDateTime(role?.updatedAt),
    displayDeletedAt: formatDateTime(role?.deletedAt),

    permissionCount: permissions.length,
    permissionGroupCount: Object.keys(groupedPermissions).length,
    permissionPreview: permissions.slice(0, 6).map((permission) => ({
      label: formatLabel(permission),
      value: permission,
    })),

    canEdit: Boolean(role?.isEditable),
    canDelete: !role?.isSystem,
  };
};

const RoleDetailsPage = () => {
  const navigate = useNavigate();
  const { roleId } = useParams();
  const isMobile = useIsMobile();

  const {
    currentRole,

    getRoleById,
    deleteRole,

    getRoleStatus,
    deleteRoleStatus,

    error,
    message,

    clearError,
    clearMessage,
    clearCurrentRole,
  } = useAccessControl();

  const hasFetchedRoleRef = useRef(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isFetchingRole = getRoleStatus === API_STATUS.LOADING;
  const isDeletingRole = deleteRoleStatus === API_STATUS.LOADING;
  const isLoading = isFetchingRole || isDeletingRole;
  const hasError = getRoleStatus === API_STATUS.ERROR;

  const role = useMemo(
    () => (currentRole ? mapRoleForView(currentRole) : null),
    [currentRole],
  );

  const permissionStats = useMemo(
    () => [
      {
        id: "total",
        title: "Permissions",
        value: role?.permissionCount || 0,
        description: "Assigned to this role",
        colorVariant: "primary",
      },
      {
        id: "groups",
        title: "Groups",
        value: role?.permissionGroupCount || 0,
        description: "Permission modules",
        colorVariant: "info",
      },
      {
        id: "type",
        title: "Type",
        value: role?.displayType || "-",
        description: role?.isSystem ? "Default workspace role" : "Custom role",
        colorVariant: role?.isSystem ? "info" : "warning",
      },
      {
        id: "status",
        title: "Status",
        value: formatLabel(role?.displayStatus || "inactive"),
        description: role?.displayEditable || "Locked",
        colorVariant: role?.displayStatus === "active" ? "success" : "warning",
      },
    ],
    [role],
  );

  const fetchRole = useCallback(async () => {
    if (!roleId) return;

    try {
      await getRoleById(roleId);
    } catch {
      // Error is already stored in access-control slice.
    }
  }, [getRoleById, roleId]);

  useEffect(() => {
    clearError();
    clearMessage();
    clearCurrentRole();

    return () => {
      clearError();
      clearMessage();
      clearCurrentRole();
    };
  }, [clearCurrentRole, clearError, clearMessage]);

  useEffect(() => {
    if (hasFetchedRoleRef.current) return;

    hasFetchedRoleRef.current = true;
    fetchRole();
  }, [fetchRole]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const handleRefresh = useCallback(() => {
    hasFetchedRoleRef.current = false;
    fetchRole();
  }, [fetchRole]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleEditRole = useCallback(() => {
    if (!role?._id || !role.canEdit) return;

    navigate(ROUTES.EDIT_ROLE.replace(":roleId", role._id));
  }, [navigate, role]);

  const handleViewPermissions = useCallback(() => {
    navigate(ROUTES.PERMISSIONS);
  }, [navigate]);

  const handleCreateRole = useCallback(() => {
    navigate(ROUTES.CREATE_ROLE);
  }, [navigate]);

  const handleOpenDeleteModal = useCallback(() => {
    if (!role?._id || !role.canDelete) return;

    setIsDeleteModalOpen(true);
  }, [role]);

  const handleCloseDeleteModal = useCallback(() => {
    if (isDeletingRole) return;

    setIsDeleteModalOpen(false);
  }, [isDeletingRole]);

  const handleConfirmDeleteRole = useCallback(async () => {
    if (!role?._id) return;

    try {
      await deleteRole(role._id);
      setIsDeleteModalOpen(false);
      navigate(ROUTES.ROLES, { replace: true });
    } catch {
      // Error is already stored in access-control slice.
    }
  }, [deleteRole, navigate, role]);

  const pageProps = {
    role,
    permissionStats,

    isLoading,
    isFetchingRole,
    isDeletingRole,
    hasError,
    error,
    message,

    handleRefresh,
    handleBack,
    handleEditRole,
    handleViewPermissions,
    handleCreateRole,
    handleDeleteRole: handleOpenDeleteModal,

    clearMessage,
  };

  return (
    <>
      {isMobile ? (
        <RoleDetailsMobilePage {...pageProps} />
      ) : (
        <RoleDetailsDesktopPage {...pageProps} />
      )}

      <AppConfirmModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteRole}
        title="Delete Role"
        message={`Delete ${role?.displayName || "this role"}?`}
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

export default RoleDetailsPage;
