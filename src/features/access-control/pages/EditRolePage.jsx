// src/features/access-control/pages/EditRolePage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccessControl from "../hooks/useAccessControl";

import EditRoleDesktopPage from "./desktop/EditRoleDesktopPage";
import EditRoleMobilePage from "./mobile/EditRoleMobilePage";

const INITIAL_FORM_DATA = {
  name: "",
  code: "",
  description: "",
  permissions: [],
  status: "active",
};

const ROLE_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const normalizeText = (value) => String(value || "").trim();
const normalizeLowerText = (value) => normalizeText(value).toLowerCase();

const formatPermissionLabel = (permission) => {
  if (!permission) return "Permission";

  return String(permission)
    .replace(/[.:_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getPermissionGroup = (permission) => {
  const value = String(permission || "");

  if (!value) return "General";

  const [firstPart] = value.split(/[.:_-]/);

  return formatPermissionLabel(firstPart || "General");
};

const mapRoleToFormData = (role) => ({
  name: role?.name || "",
  code: role?.code || "",
  description: role?.description || "",
  permissions: Array.isArray(role?.permissions) ? role.permissions : [],
  status: role?.status || "active",
});

const buildUpdateRolePayload = (formData) => {
  const description = normalizeText(formData.description);

  return {
    name: normalizeText(formData.name),
    description: description || null,
    permissions: Array.isArray(formData.permissions)
      ? formData.permissions
      : [],
    status: normalizeLowerText(formData.status) || "active",
  };
};

const EditRolePage = () => {
  const navigate = useNavigate();
  const { roleId } = useParams();
  const isMobile = useIsMobile();

  const {
    currentRole,
    permissions,

    getRoleById,
    updateRole,
    getAvailablePermissions,

    getRoleStatus,
    updateRoleStatus,
    getAvailablePermissionsStatus,

    error,
    message,

    clearError,
    clearMessage,
    clearCurrentRole,
  } = useAccessControl();

  const hasFetchedRoleRef = useRef(false);
  const hasFetchedPermissionsRef = useRef(false);
  const hasHydratedFormRef = useRef(false);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const isFetchingRole =
    getRoleStatus === API_STATUS.LOADING ||
    (!currentRole && !hasFetchedRoleRef.current);
  const isUpdating = updateRoleStatus === API_STATUS.LOADING;
  const isLoadingPermissions =
    getAvailablePermissionsStatus === API_STATUS.LOADING;
  const isLoading = isFetchingRole || isUpdating || isLoadingPermissions;
  const hasRoleError = getRoleStatus === API_STATUS.ERROR;
  const hasPermissionError = getAvailablePermissionsStatus === API_STATUS.ERROR;
  const isRoleLocked = Boolean(
    currentRole?.isSystem && !currentRole?.isEditable,
  );

  const permissionOptions = useMemo(
    () =>
      (Array.isArray(permissions) ? permissions : []).map((permission) => ({
        label: formatPermissionLabel(permission),
        value: permission,
        group: getPermissionGroup(permission),
      })),
    [permissions],
  );

  const selectedPermissionOptions = useMemo(
    () =>
      permissionOptions.filter((option) =>
        formData.permissions.includes(option.value),
      ),
    [formData.permissions, permissionOptions],
  );

  const permissionSummary = useMemo(() => {
    const total = permissionOptions.length;
    const selected = formData.permissions.length;
    const groups = new Set(permissionOptions.map((option) => option.group))
      .size;

    return {
      total,
      selected,
      groups,
      remaining: Math.max(total - selected, 0),
    };
  }, [formData.permissions.length, permissionOptions]);

  const previewRole = useMemo(
    () => ({
      name: normalizeText(formData.name) || currentRole?.name || "Role",
      code: normalizeText(formData.code) || currentRole?.code || "-",
      description:
        normalizeText(formData.description) ||
        currentRole?.description ||
        "Workspace role with selected permissions.",
      permissionsCount: formData.permissions.length,
      status: normalizeLowerText(formData.status) || "active",
      isSystem: Boolean(currentRole?.isSystem),
      isEditable: currentRole?.isEditable !== false,
    }),
    [currentRole, formData],
  );

  const fetchRole = useCallback(async () => {
    if (!roleId) return;

    hasHydratedFormRef.current = false;

    try {
      await getRoleById(roleId);
    } catch {
      // Error is already stored in access-control slice.
    }
  }, [getRoleById, roleId]);

  const fetchPermissions = useCallback(async () => {
    try {
      await getAvailablePermissions();
    } catch {
      // Error is already stored in access-control slice.
    }
  }, [getAvailablePermissions]);

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
    if (hasFetchedPermissionsRef.current) return;

    hasFetchedPermissionsRef.current = true;
    fetchPermissions();
  }, [fetchPermissions]);

  useEffect(() => {
    if (!currentRole || hasHydratedFormRef.current) return;

    hasHydratedFormRef.current = true;
    setFormData(mapRoleToFormData(currentRole));
  }, [currentRole]);

  useEffect(() => {
    if (!error) return;

    setFormErrors((prev) => ({
      ...prev,
      submit: error,
    }));
  }, [error]);

  const validateForm = useCallback(() => {
    const errors = {};
    const name = normalizeText(formData.name);
    const description = normalizeText(formData.description);
    const status = normalizeLowerText(formData.status);
    const selectedPermissions = Array.isArray(formData.permissions)
      ? formData.permissions
      : [];

    if (!roleId) {
      errors.submit = "Role id is missing. Please go back and try again.";
    }

    if (isRoleLocked) {
      errors.submit = "System role cannot be updated.";
    }

    if (!name) {
      errors.name = "Role name is required";
    } else if (name.length < 2) {
      errors.name = "Role name must be at least 2 characters";
    } else if (name.length > 80) {
      errors.name = "Role name cannot exceed 80 characters";
    }

    if (description.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
    }

    if (!ROLE_STATUS_OPTIONS.some((option) => option.value === status)) {
      errors.status = "Select a valid role status";
    }

    const availablePermissionValues = new Set(
      permissionOptions.map((option) => option.value),
    );

    const hasInvalidPermission = selectedPermissions.some(
      (permission) => !availablePermissionValues.has(permission),
    );

    if (hasInvalidPermission) {
      errors.permissions = "One or more selected permissions are invalid";
    }

    return errors;
  }, [formData, isRoleLocked, permissionOptions, roleId]);

  const handleChange = useCallback(
    (eventOrValue) => {
      if (error) {
        clearError();
      }

      if (eventOrValue?.target) {
        const { name, value } = eventOrValue.target;

        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
          submit: "",
        }));

        setFormData((prev) => ({
          ...prev,
          [name]: name === "status" ? normalizeLowerText(value) : value,
        }));

        return;
      }

      setFormErrors((prev) => ({
        ...prev,
        submit: "",
      }));

      setFormData((prev) => ({
        ...prev,
        ...eventOrValue,
      }));
    },
    [clearError, error],
  );

  const handlePermissionsChange = useCallback(
    (eventOrValue) => {
      if (error) {
        clearError();
      }

      const value = eventOrValue?.target?.value ?? eventOrValue ?? [];

      setFormErrors((prev) => ({
        ...prev,
        permissions: "",
        submit: "",
      }));

      setFormData((prev) => ({
        ...prev,
        permissions: Array.isArray(value) ? value : [],
      }));
    },
    [clearError, error],
  );

  const handleSelectAllPermissions = useCallback(() => {
    setFormErrors((prev) => ({
      ...prev,
      permissions: "",
      submit: "",
    }));

    setFormData((prev) => ({
      ...prev,
      permissions: permissionOptions.map((option) => option.value),
    }));
  }, [permissionOptions]);

  const handleClearPermissions = useCallback(() => {
    setFormErrors((prev) => ({
      ...prev,
      permissions: "",
      submit: "",
    }));

    setFormData((prev) => ({
      ...prev,
      permissions: [],
    }));
  }, []);

  const handleReset = useCallback(() => {
    if (isLoading) return;

    clearError();
    clearMessage();
    setFormData(
      currentRole ? mapRoleToFormData(currentRole) : INITIAL_FORM_DATA,
    );
    setFormErrors({});
  }, [clearError, clearMessage, currentRole, isLoading]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleViewPermissions = useCallback(() => {
    navigate(ROUTES.PERMISSIONS);
  }, [navigate]);

  const handleViewDetails = useCallback(() => {
    if (!roleId) {
      navigate(ROUTES.ROLES);
      return;
    }

    navigate(ROUTES.ROLE_DETAILS.replace(":roleId", roleId));
  }, [navigate, roleId]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      clearError();
      clearMessage();

      const validationErrors = validateForm();

      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);
        return;
      }

      try {
        await updateRole(roleId, buildUpdateRolePayload(formData));
        navigate(ROUTES.ROLES, { replace: true });
      } catch (submitError) {
        setFormErrors((prev) => ({
          ...prev,
          submit: submitError || "Unable to update role. Please try again.",
        }));
      }
    },
    [
      clearError,
      clearMessage,
      formData,
      navigate,
      roleId,
      updateRole,
      validateForm,
    ],
  );

  const pageProps = {
    role: currentRole,
    roleId,
    formData,
    formErrors,
    statusOptions: ROLE_STATUS_OPTIONS,
    permissionOptions,
    selectedPermissionOptions,
    permissionSummary,
    previewRole,

    isLoading,
    isFetchingRole,
    isUpdating,
    isLoadingPermissions,
    hasRoleError,
    hasPermissionError,
    isRoleLocked,
    error,
    message,

    handleChange,
    handlePermissionsChange,
    handleSelectAllPermissions,
    handleClearPermissions,
    handleSubmit,
    handleReset,
    handleBack,
    handleViewDetails,
    handleViewPermissions,
    handleRefreshRole: fetchRole,
    handleRefreshPermissions: fetchPermissions,
  };

  return isMobile ? (
    <EditRoleMobilePage {...pageProps} />
  ) : (
    <EditRoleDesktopPage {...pageProps} />
  );
};

export default EditRolePage;
