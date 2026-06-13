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

const PERMISSION_ACTIONS = ["view", "create", "update", "delete"];

const ACTION_LABELS = {
  view: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
};

const normalizeText = (value) => String(value || "").trim();

const normalizeLowerText = (value) => normalizeText(value).toLowerCase();

const formatPermissionLabel = (permission) => {
  if (!permission) return "Permission";

  return String(permission)
    .replace(/\bedit\b/gi, "update")
    .replace(/[.:_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getPermissionParts = (permission) => {
  const parts = String(permission || "")
    .toLowerCase()
    .replace(/\bedit\b/g, "update")
    .split(/[.:_-]/)
    .filter(Boolean);

  const action = PERMISSION_ACTIONS.find((item) => parts.includes(item));
  const module = parts.find((item) => !PERMISSION_ACTIONS.includes(item));

  return {
    action: action || "other",
    actionLabel: ACTION_LABELS[action] || "Other",
    module: module || "general",
  };
};

const getPermissionGroup = (permission) =>
  formatPermissionLabel(getPermissionParts(permission).module || "General");

const buildUpdateRolePayload = (formData) => {
  const payload = {
    name: normalizeText(formData.name),
    description: normalizeText(formData.description),
    permissions: Array.isArray(formData.permissions)
      ? formData.permissions
      : [],
    status: formData.status || "active",
  };

  if (!payload.description) {
    payload.description = "";
  }

  return payload;
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
  const [currentStep, setCurrentStep] = useState(1);
  const [permissionSearch, setPermissionSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  const isUpdating = updateRoleStatus === API_STATUS.LOADING;
  const isLoadingRole = getRoleStatus === API_STATUS.LOADING;
  const isLoadingPermissions =
    getAvailablePermissionsStatus === API_STATUS.LOADING;

  const isLoading = isUpdating || isLoadingRole || isLoadingPermissions;

  const hasRoleError = getRoleStatus === API_STATUS.ERROR;
  const hasPermissionError = getAvailablePermissionsStatus === API_STATUS.ERROR;

  const permissionOptions = useMemo(
    () =>
      (Array.isArray(permissions) ? permissions : []).map((permission) => {
        const parts = getPermissionParts(permission);

        return {
          label: formatPermissionLabel(permission),
          value: permission,
          group: getPermissionGroup(permission),
          action: parts.action,
          actionLabel: parts.actionLabel,
          moduleKey: parts.module,
        };
      }),
    [permissions],
  );

  const selectedPermissionOptions = useMemo(
    () =>
      permissionOptions.filter((option) =>
        formData.permissions.includes(option.value),
      ),
    [formData.permissions, permissionOptions],
  );

  const permissionModules = useMemo(() => {
    const grouped = permissionOptions.reduce((acc, option) => {
      if (!acc[option.group]) {
        acc[option.group] = {
          id: option.moduleKey || option.group.toLowerCase(),
          title: option.group,
          permissions: [],
          actions: {},
        };
      }

      acc[option.group].permissions.push(option);

      if (PERMISSION_ACTIONS.includes(option.action)) {
        acc[option.group].actions[option.action] = option;
      }

      return acc;
    }, {});

    const query = normalizeLowerText(permissionSearch);

    return Object.values(grouped).filter((module) => {
      const matchesModule =
        moduleFilter === "all" || module.id === moduleFilter;

      const matchesSearch =
        !query ||
        module.title.toLowerCase().includes(query) ||
        module.permissions.some((item) =>
          item.label.toLowerCase().includes(query),
        );

      return matchesModule && matchesSearch;
    });
  }, [moduleFilter, permissionOptions, permissionSearch]);

  const moduleOptions = useMemo(
    () => [
      { label: "Module: All", value: "all" },
      ...Object.values(
        permissionOptions.reduce((acc, option) => {
          acc[option.moduleKey] = {
            label: `Module: ${option.group}`,
            value: option.moduleKey,
          };

          return acc;
        }, {}),
      ),
    ],
    [permissionOptions],
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

  const previewRole = useMemo(() => {
    const name = normalizeText(formData.name) || "Role";
    const code = normalizeLowerText(formData.code) || "role";

    const description =
      normalizeText(formData.description) ||
      "Workspace role with selected permissions.";

    return {
      ...(currentRole || {}),
      name,
      code,
      description,
      permissionsCount: formData.permissions.length,
      status: formData.status || "active",
      type: currentRole?.isSystem ? "System Role" : "Custom Role",
      isSystem: Boolean(currentRole?.isSystem),
      isEditable: currentRole?.isEditable !== false,
    };
  }, [currentRole, formData]);

  const fetchRole = useCallback(async () => {
    if (!roleId) return;

    try {
      await getRoleById(roleId);
    } catch {
      // Error is stored in slice context.
    }
  }, [getRoleById, roleId]);

  const fetchPermissions = useCallback(async () => {
    try {
      await getAvailablePermissions();
    } catch {
      // Error is stored in slice context.
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

    setFormData({
      name: currentRole.name || "",
      code: currentRole.code || "",
      description: currentRole.description || "",
      permissions: Array.isArray(currentRole.permissions)
        ? currentRole.permissions
        : [],
      status: currentRole.status || "active",
    });
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

    const selectedPermissions = Array.isArray(formData.permissions)
      ? formData.permissions
      : [];

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

    if (!["active", "inactive"].includes(formData.status)) {
      errors.status = "Invalid role status";
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
  }, [formData, permissionOptions]);

  const validateStepOne = useCallback(() => {
    const errors = validateForm();
    delete errors.permissions;

    return errors;
  }, [validateForm]);

  const handleChange = useCallback(
    (eventOrValue) => {
      if (error) clearError();

      if (eventOrValue?.target) {
        const { name, value } = eventOrValue.target;

        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
          submit: "",
        }));

        setFormData((prev) => ({
          ...prev,
          [name]: value,
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
      if (error) clearError();

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

  const handleTogglePermission = useCallback((permission) => {
    setFormErrors((prev) => ({
      ...prev,
      permissions: "",
      submit: "",
    }));

    setFormData((prev) => {
      const exists = prev.permissions.includes(permission);

      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((item) => item !== permission)
          : [...prev.permissions, permission],
      };
    });
  }, []);

  const handleToggleModule = useCallback((module) => {
    const values = module.permissions.map((permission) => permission.value);

    setFormErrors((prev) => ({
      ...prev,
      permissions: "",
      submit: "",
    }));

    setFormData((prev) => {
      const hasAll = values.every((value) => prev.permissions.includes(value));

      const next = hasAll
        ? prev.permissions.filter((value) => !values.includes(value))
        : Array.from(new Set([...prev.permissions, ...values]));

      return {
        ...prev,
        permissions: next,
      };
    });
  }, []);

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
    if (isLoading || !currentRole) return;

    clearError();
    clearMessage();

    setFormData({
      name: currentRole.name || "",
      code: currentRole.code || "",
      description: currentRole.description || "",
      permissions: Array.isArray(currentRole.permissions)
        ? currentRole.permissions
        : [],
      status: currentRole.status || "active",
    });

    setFormErrors({});
    setCurrentStep(1);
    setPermissionSearch("");
    setModuleFilter("all");
  }, [clearError, clearMessage, currentRole, isLoading]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
      return;
    }

    navigate(ROUTES.ROLES);
  }, [currentStep, navigate]);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.ROLES);
  }, [navigate]);

  const handleStepChange = useCallback(
    (step) => {
      if (step <= currentStep) {
        setCurrentStep(step);
        return;
      }

      if (step >= 2) {
        const stepErrors = validateStepOne();

        if (Object.keys(stepErrors).length > 0) {
          setFormErrors(stepErrors);
          setCurrentStep(1);
          return;
        }
      }

      setCurrentStep(step);
    },
    [currentStep, validateStepOne],
  );

  const handleContinue = useCallback(() => {
    if (currentStep === 1) {
      const stepErrors = validateStepOne();

      if (Object.keys(stepErrors).length > 0) {
        setFormErrors(stepErrors);
        return;
      }

      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      setCurrentStep(3);
    }
  }, [currentStep, validateStepOne]);

  const handleRefreshRole = useCallback(async () => {
    hasHydratedFormRef.current = false;
    await fetchRole();
  }, [fetchRole]);

  const handleSubmit = useCallback(
    async (event) => {
      if (event) event.preventDefault();

      clearError();
      clearMessage();

      const validationErrors = validateForm();

      if (Object.keys(validationErrors).length > 0) {
        setFormErrors(validationErrors);

        setCurrentStep(
          validationErrors.name ||
            validationErrors.description ||
            validationErrors.status
            ? 1
            : 2,
        );

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
    formData,
    formErrors,

    permissionOptions,
    selectedPermissionOptions,
    permissionModules,
    moduleOptions,
    moduleFilter,
    permissionSearch,
    permissionSummary,

    previewRole,
    currentStep,

    isLoading,
    isUpdating,
    isLoadingRole,
    isLoadingPermissions,
    hasRoleError,
    hasPermissionError,
    error,
    message,

    handleChange,
    handlePermissionsChange,
    handleTogglePermission,
    handleToggleModule,
    handleSelectAllPermissions,
    handleClearPermissions,
    handleSubmit,
    handleReset,
    handleBack,
    handleCancel,
    handleContinue,
    handleStepChange,
    handleRefreshPermissions: fetchPermissions,
    handleRefreshRole,

    setPermissionSearch,
    setModuleFilter,
  };

  return isMobile ? (
    <EditRoleMobilePage {...pageProps} />
  ) : (
    <EditRoleDesktopPage {...pageProps} />
  );
};

export default EditRolePage;
