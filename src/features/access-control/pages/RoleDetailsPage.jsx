import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccessControl from "../hooks/useAccessControl";

import RoleDetailsDesktopPage from "./desktop/RoleDetailsDesktopPage";
import RoleDetailsMobilePage from "./mobile/RoleDetailsMobilePage";

const formatDate = (value) => {
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

const formatUser = (user) => {
  if (!user) return "-";

  if (typeof user === "string") return user;

  return (
    user.fullName ||
    user.name ||
    user.email ||
    user.profile?.fullName ||
    user._id ||
    "-"
  );
};

const normalizeRoleResponse = (response) => {
  if (!response) return null;

  if (response?._id) return response;

  if (response?.data?._id) return response.data;

  if (response?.data?.data?._id) return response.data.data;

  return null;
};

const mapRoleForView = (role) => {
  if (!role?._id) return null;

  const permissions = Array.isArray(role.permissions) ? role.permissions : [];

  return {
    _id: role._id,
    workspaceId: role.workspaceId || "-",

    name: role.name || "-",
    code: role.code || "-",
    description: role.description || "No description added.",

    permissions,
    permissionCount: permissions.length,

    isSystem: Boolean(role.isSystem),
    isEditable: Boolean(role.isEditable),

    status: role.status || "-",

    createdBy: role.createdBy || null,
    createdByText: formatUser(role.createdBy),

    createdAt: role.createdAt || null,
    updatedAt: role.updatedAt || null,
    deletedAt: role.deletedAt || null,
    deletedBy: role.deletedBy || null,

    createdAtText: formatDate(role.createdAt),
    updatedAtText: formatDate(role.updatedAt),
    deletedAtText: formatDate(role.deletedAt),
    deletedByText: formatUser(role.deletedBy),

    typeText: role.isSystem ? "System" : "Custom",
    editableText: role.isEditable ? "Editable" : "Locked",
  };
};

const RoleDetailsPage = () => {
  const navigate = useNavigate();
  const { roleId } = useParams();
  const isMobile = useIsMobile();

  const {
    currentRole,
    getRoleById,

    getRoleStatus,

    error,
    message,

    clearError,
    clearMessage,
    clearCurrentRole,
  } = useAccessControl();

  const hasFetchedRoleRef = useRef(false);

  const isLoading = getRoleStatus === API_STATUS.LOADING;
  const hasError = getRoleStatus === API_STATUS.ERROR;

  const fetchRole = useCallback(async () => {
    if (!roleId) return;

    try {
      const response = await getRoleById(roleId);

      const normalizedRole = normalizeRoleResponse(response);

      if (!normalizedRole?._id) {
        // Redux should still receive the thunk payload.
        // This only prevents page-level crash when unwrap returns unexpected shape.
      }
    } catch {
      // Error is already stored in access control slice.
    }
  }, [getRoleById, roleId]);

  useEffect(() => {
    clearError();
    clearCurrentRole();

    return () => {
      clearError();
      clearCurrentRole();
    };
  }, [clearCurrentRole, clearError]);

  useEffect(() => {
    if (!roleId) return;
    if (hasFetchedRoleRef.current) return;

    hasFetchedRoleRef.current = true;
    fetchRole();
  }, [fetchRole, roleId]);

  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const role = useMemo(() => {
    const normalizedRole = normalizeRoleResponse(currentRole);

    return mapRoleForView(normalizedRole);
  }, [currentRole]);

  const hasRole = Boolean(role?._id);

  const handleRefresh = useCallback(() => {
    hasFetchedRoleRef.current = false;
    fetchRole();
  }, [fetchRole]);

  const handleBackToRoles = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleBackToAccessControl = useCallback(() => {
    navigate(ROUTES.ACCESS_CONTROL);
  }, [navigate]);

  const handleEditRole = useCallback(() => {
    if (!role?._id || !role?.isEditable) return;

    navigate(ROUTES.EDIT_ROLE.replace(":roleId", role._id));
  }, [navigate, role]);

  const handleViewPermissions = useCallback(() => {
    navigate(ROUTES.PERMISSIONS);
  }, [navigate]);

  const pageProps = {
    role,
    roleId,

    isLoading,
    hasError,
    hasRole,
    error,
    message,

    handleRefresh,
    handleBackToRoles,
    handleBackToAccessControl,
    handleEditRole,
    handleViewPermissions,

    clearMessage,
  };

  return isMobile ? (
    <RoleDetailsMobilePage {...pageProps} />
  ) : (
    <RoleDetailsDesktopPage {...pageProps} />
  );
};

export default RoleDetailsPage;
