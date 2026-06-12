import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useAccessControl from "../hooks/useAccessControl";

import AssignRoleDesktopPage from "./desktop/AssignRoleDesktopPage";
import AssignRoleMobilePage from "./mobile/AssignRoleMobilePage";

const INITIAL_FORM_DATA = {
  memberUserId: "",
  roleId: "",
};

const dummyMembers = [
  {
    _id: "dummy-member-ravi",
    userId: {
      _id: "dummy-ravi-user",
      fullName: "Ravi Verma",
      email: "ravi.verma@medplus.com",
    },
    roleId: { _id: "dummy-role-pharmacist", name: "Pharmacist" },
    status: "active",
    isOwner: false,
  },
  {
    _id: "dummy-member-sneha",
    userId: {
      _id: "dummy-sneha-user",
      fullName: "Sneha Kapoor",
      email: "sneha.kapoor@medplus.com",
    },
    roleId: { _id: "dummy-role-manager", name: "Manager" },
    status: "active",
    isOwner: false,
  },
  {
    _id: "dummy-member-amit",
    userId: {
      _id: "dummy-amit-user",
      fullName: "Amit Mishra",
      email: "amit.mishra@medplus.com",
    },
    roleId: { _id: "dummy-role-cashier", name: "Cashier" },
    status: "active",
    isOwner: false,
  },
];

const dummyRoles = [
  {
    _id: "dummy-role-admin",
    name: "Admin",
    code: "admin",
    status: "active",
    isSystem: true,
  },
  {
    _id: "dummy-role-manager",
    name: "Manager",
    code: "manager",
    status: "active",
    isSystem: true,
  },
  {
    _id: "dummy-role-pharmacist",
    name: "Pharmacist",
    code: "pharmacist",
    status: "active",
    isSystem: true,
  },
  {
    _id: "dummy-role-cashier",
    name: "Cashier",
    code: "cashier",
    status: "active",
    isSystem: true,
  },
  {
    _id: "dummy-role-custom",
    name: "Store Supervisor",
    code: "store_supervisor",
    status: "active",
    isSystem: false,
  },
];

const normalizeText = (value) => String(value || "").trim();

const formatName = (value, fallback = "-") => {
  if (!value) return fallback;
  return String(value)
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const getObjectId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value?._id || value?.id || "";
};

const getUser = (member) => member?.userId || member?.user || null;

const getDisplayName = (member) => {
  const user = getUser(member);
  return (
    user?.fullName ||
    user?.name ||
    user?.profile?.fullName ||
    user?.email ||
    "Workspace Member"
  );
};

const getDisplayEmail = (member) => getUser(member)?.email || "-";

const getRoleName = (role) => {
  if (!role) return "Staff";
  return formatName(role?.name || role?.title || role?.code, "Staff");
};

const mapMemberForOption = (member) => {
  const user = getUser(member);
  const memberUserId = getObjectId(user || member?.userId);
  const displayName = getDisplayName(member);
  const displayEmail = getDisplayEmail(member);
  const displayRole = member?.isOwner
    ? "Owner"
    : getRoleName(member?.roleId || member?.role);

  return {
    ...member,
    memberUserId,
    label: `${displayName} · ${displayEmail}`,
    value: memberUserId,
    displayName,
    displayEmail,
    displayRole,
    status: member?.status || "active",
    disabled:
      Boolean(member?.isOwner) || member?.status !== "active" || !memberUserId,
  };
};

const mapRoleForOption = (role) => ({
  ...role,
  label: formatName(role?.name || role?.code),
  value: getObjectId(role),
  disabled: role?.status && role.status !== "active",
});

const AssignRolePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    currentWorkspace,
    members,
    getWorkspaceMembers,
    getWorkspaceMembersStatus,
    error: workspaceError,
    clearError: clearWorkspaceError,
  } = useWorkspace();

  const {
    roles,
    getWorkspaceRoles,
    assignRoleToMember,
    getWorkspaceRolesStatus,
    assignRoleToMemberStatus,
    error,
    message,
    clearError,
    clearMessage,
    clearCurrentRole,
  } = useAccessControl();

  const hasFetchedMembersRef = useRef(false);
  const hasFetchedRolesRef = useRef(false);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const workspaceId = currentWorkspace?._id || currentWorkspace?.id;

  const isLoadingMembers = getWorkspaceMembersStatus === API_STATUS.LOADING;
  const isLoadingRoles = getWorkspaceRolesStatus === API_STATUS.LOADING;
  const isSubmitting = assignRoleToMemberStatus === API_STATUS.LOADING;

  const isLoading = isLoadingMembers || isLoadingRoles;
  const combinedError = error || workspaceError;

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) return;
    try {
      await getWorkspaceMembers(workspaceId);
    } catch {
      // Error handles inside architecture slices
    }
  }, [getWorkspaceMembers, workspaceId]);

  const fetchRoles = useCallback(async () => {
    try {
      await getWorkspaceRoles();
    } catch {
      // Error handles inside architecture slices
    }
  }, [getWorkspaceRoles]);

  useEffect(() => {
    clearError();
    clearMessage();
    clearCurrentRole();
    clearWorkspaceError?.();

    return () => {
      clearError();
      clearWorkspaceError?.();
    };
  }, [clearCurrentRole, clearError, clearMessage, clearWorkspaceError]);

  useEffect(() => {
    if (!workspaceId || hasFetchedMembersRef.current) return;
    hasFetchedMembersRef.current = true;
    fetchMembers();
  }, [fetchMembers, workspaceId]);

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

  const memberOptions = useMemo(() => {
    const sourceMembers =
      Array.isArray(members) && members.length ? members : dummyMembers;
    return sourceMembers.map(mapMemberForOption);
  }, [members]);

  const roleOptions = useMemo(() => {
    const sourceRoles =
      Array.isArray(roles) && roles.length ? roles : dummyRoles;
    return sourceRoles.map(mapRoleForOption);
  }, [roles]);

  const selectedMember = useMemo(
    () => memberOptions.find((m) => m.value === formData.memberUserId) || null,
    [formData.memberUserId, memberOptions],
  );

  const selectedRole = useMemo(
    () => roleOptions.find((r) => r.value === formData.roleId) || null,
    [formData.roleId, roleOptions],
  );

  const assignmentSummary = useMemo(
    () => ({
      member: selectedMember,
      currentRole: selectedMember ? selectedMember.displayRole : "None",
      targetRole: selectedRole ? selectedRole.label : "Not selected",
    }),
    [selectedMember, selectedRole],
  );

  const validateForm = useCallback(() => {
    const errors = {};

    if (!normalizeText(formData.memberUserId)) {
      errors.memberUserId = "Select an active workspace member";
    }

    if (selectedMember?.disabled) {
      errors.memberUserId = selectedMember?.isOwner
        ? "Workspace owners manage operations and cannot be modified here"
        : "Only active workspace members can be re-assigned roles";
    }

    if (!normalizeText(formData.roleId)) {
      errors.roleId = "Select a target security role to associate";
    }

    return errors;
  }, [formData, selectedMember]);

  const handleChange = useCallback(
    (eventOrValue) => {
      const { name, value } = eventOrValue?.target || eventOrValue || {};
      if (!name) return;

      clearError();
      if (formErrors[name] || formErrors.submit) {
        setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
      }

      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [clearError, formErrors],
  );

  const handleReset = useCallback(() => {
    if (isSubmitting) return;
    clearError();
    clearMessage();
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  }, [clearError, clearMessage, isSubmitting]);

  const handleRefresh = useCallback(async () => {
    clearError();
    clearMessage();
    clearWorkspaceError?.();

    hasFetchedMembersRef.current = false;
    hasFetchedRolesRef.current = false;

    await Promise.allSettled([fetchMembers(), fetchRoles()]);
  }, [clearMessage, clearError, clearWorkspaceError, fetchMembers, fetchRoles]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.MEMBER_ACCESS);
  }, [navigate]);

  const handleBackToAccessControl = useCallback(() => {
    navigate(ROUTES.ACCESS_CONTROL);
  }, [navigate]);

  const handleViewMembersList = useCallback(() => {
    navigate(ROUTES.WORKSPACE_MEMBERS);
  }, [navigate]);

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
        await assignRoleToMember(formData.memberUserId, {
          roleId: formData.roleId,
        });
        navigate(ROUTES.MEMBER_ACCESS, { replace: true });
      } catch (submitError) {
        setFormErrors((prev) => ({
          ...prev,
          submit:
            submitError ||
            "Role structure assignment failed. Verify configuration parameters.",
        }));
      }
    },
    [
      clearError,
      clearMessage,
      formData,
      navigate,
      assignRoleToMember,
      validateForm,
    ],
  );

  const pageProps = {
    formData,
    formErrors,
    memberOptions,
    roleOptions,
    selectedMember,
    assignmentSummary,
    isLoading,
    isLoadingMembers,
    isLoadingRoles,
    isSubmitting,
    error: combinedError,
    message,
    handleChange,
    handleSubmit,
    handleReset,
    handleRefresh,
    handleBack,
    handleBackToAccessControl,
    handleViewMembersList,
    clearMessage,
  };

  return isMobile ? (
    <AssignRoleMobilePage {...pageProps} />
  ) : (
    <AssignRoleDesktopPage {...pageProps} />
  );
};

export default AssignRolePage;
