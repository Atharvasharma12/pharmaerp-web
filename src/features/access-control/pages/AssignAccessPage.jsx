// src/features/access-control/pages/AssignAccessPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useCompany from "@/features/company/hooks/useCompany";
import useBranch from "@/features/branch/hooks/useBranch";

import useAccessControl from "../hooks/useAccessControl";

import AssignAccessDesktopPage from "./desktop/AssignAccessDesktopPage";

const INITIAL_FORM_DATA = {
  memberUserId: "",
  accessAllCompanies: true,
  accessAllBranches: true,
  companyIds: [],
  branchIds: [],
};

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

const getDisplayEmail = (member) => {
  const user = getUser(member);

  return user?.email || "-";
};

const getDisplayPhone = (member) => {
  const user = getUser(member);
  const phone = user?.phone || user?.mobile || user?.profile?.phone;

  return phone ? `+91 ${phone}` : "-";
};

const getRoleName = (member) => {
  const role = member?.roleId || member?.role || null;

  if (member?.isOwner) return "Owner";

  return formatName(role?.name || role?.title || role?.code, "Staff");
};

const mapMemberForOption = (member) => {
  const user = getUser(member);
  const memberUserId = getObjectId(user || member?.userId);
  const displayName = getDisplayName(member);
  const displayEmail = getDisplayEmail(member);
  const displayRole = getRoleName(member);

  return {
    ...member,
    memberUserId,
    label: `${displayName} · ${displayEmail}`,
    value: memberUserId,
    displayName,
    displayEmail,
    displayPhone: getDisplayPhone(member),
    displayRole,
    disabled:
      Boolean(member?.isOwner) || member?.status !== "active" || !memberUserId,
  };
};

const getCompanyName = (company) =>
  company?.name ||
  company?.companyName ||
  company?.legalName ||
  company?.code ||
  "Company";

const getBranchName = (branch) =>
  branch?.name || branch?.branchName || branch?.code || "Branch";

const mapCompanyForOption = (company) => ({
  ...company,
  label: getCompanyName(company),
  value: getObjectId(company),
  disabled: company?.status && company.status !== "active",
});

const mapBranchForOption = (branch) => ({
  ...branch,
  label: getBranchName(branch),
  value: getObjectId(branch),
  disabled: branch?.status && branch.status !== "active",
});

const buildAccessPayload = (formData) => {
  const accessAllCompanies = Boolean(formData.accessAllCompanies);
  const accessAllBranches = Boolean(formData.accessAllBranches);

  return {
    accessAllCompanies,
    accessAllBranches,
    companyIds: accessAllCompanies ? [] : formData.companyIds,
    branchIds: accessAllBranches ? [] : formData.branchIds,
  };
};

const AssignAccessPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    currentWorkspace,
    members,
    getMyWorkspaces,
    getWorkspaceMembers,
    getMyWorkspacesStatus,
    getWorkspaceMembersStatus,
    error: workspaceError,
    clearError: clearWorkspaceError,
  } = useWorkspace();

  const {
    companies,
    getWorkspaceCompanies,
    getWorkspaceCompaniesStatus,
    error: companyError,
    clearError: clearCompanyError,
  } = useCompany();

  const {
    branches,
    getCompanyBranches,
    getCompanyBranchesStatus,
    error: branchError,
    clearError: clearBranchError,
  } = useBranch();

  const {
    updateMemberAccess,
    updateMemberAccessStatus,
    error,
    message,
    clearError,
    clearMessage,
    clearCurrentMemberAccess,
    clearMemberAccessCheck,
  } = useAccessControl();

  const hasFetchedWorkspacesRef = useRef(false);
  const hasFetchedMembersRef = useRef(false);
  const hasFetchedCompaniesRef = useRef(false);
  const hasFetchedBranchesRef = useRef(false);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const workspaceId = currentWorkspace?._id;

  const isLoadingWorkspaces = getMyWorkspacesStatus === API_STATUS.LOADING;
  const isLoadingMembers = getWorkspaceMembersStatus === API_STATUS.LOADING;
  const isLoadingCompanies = getWorkspaceCompaniesStatus === API_STATUS.LOADING;
  const isLoadingBranches = getCompanyBranchesStatus === API_STATUS.LOADING;
  const isSubmitting = updateMemberAccessStatus === API_STATUS.LOADING;

  const isLoading =
    isLoadingWorkspaces ||
    isLoadingMembers ||
    isLoadingCompanies ||
    isLoadingBranches;

  const combinedError = error || workspaceError || companyError || branchError;

  const fetchWorkspaces = useCallback(async () => {
    try {
      await getMyWorkspaces();
    } catch {
      // Error is already stored in workspace slice.
    }
  }, [getMyWorkspaces]);

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) return;

    try {
      await getWorkspaceMembers(workspaceId);
    } catch {
      // Error is already stored in workspace slice.
    }
  }, [getWorkspaceMembers, workspaceId]);

  const fetchCompanies = useCallback(async () => {
    try {
      await getWorkspaceCompanies();
    } catch {
      // Error is already stored in company slice.
    }
  }, [getWorkspaceCompanies]);

  const fetchBranches = useCallback(async () => {
    try {
      await getCompanyBranches();
    } catch {
      // Error is already stored in branch slice.
    }
  }, [getCompanyBranches]);

  useEffect(() => {
    clearError();
    clearMessage();
    clearCurrentMemberAccess();
    clearMemberAccessCheck();
    clearWorkspaceError?.();
    clearCompanyError?.();
    clearBranchError?.();

    return () => {
      clearError();
      clearWorkspaceError?.();
      clearCompanyError?.();
      clearBranchError?.();
    };
  }, [
    clearBranchError,
    clearCompanyError,
    clearCurrentMemberAccess,
    clearError,
    clearMemberAccessCheck,
    clearMessage,
    clearWorkspaceError,
  ]);

  useEffect(() => {
    if (workspaceId || hasFetchedWorkspacesRef.current) return;

    hasFetchedWorkspacesRef.current = true;
    fetchWorkspaces();
  }, [fetchWorkspaces, workspaceId]);

  useEffect(() => {
    if (!workspaceId || hasFetchedMembersRef.current) return;

    hasFetchedMembersRef.current = true;
    fetchMembers();
  }, [fetchMembers, workspaceId]);

  useEffect(() => {
    if (hasFetchedCompaniesRef.current) return;

    hasFetchedCompaniesRef.current = true;
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (hasFetchedBranchesRef.current) return;

    hasFetchedBranchesRef.current = true;
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const memberOptions = useMemo(
    () => (Array.isArray(members) ? members : []).map(mapMemberForOption),
    [members],
  );

  const selectedMember = useMemo(
    () =>
      memberOptions.find((member) => member.value === formData.memberUserId) ||
      null,
    [formData.memberUserId, memberOptions],
  );

  const companyOptions = useMemo(
    () => (Array.isArray(companies) ? companies : []).map(mapCompanyForOption),
    [companies],
  );

  const branchOptions = useMemo(
    () => (Array.isArray(branches) ? branches : []).map(mapBranchForOption),
    [branches],
  );

  const selectedCompanyOptions = useMemo(
    () =>
      companyOptions.filter((company) =>
        formData.companyIds.includes(company.value),
      ),
    [companyOptions, formData.companyIds],
  );

  const selectedBranchOptions = useMemo(
    () =>
      branchOptions.filter((branch) =>
        formData.branchIds.includes(branch.value),
      ),
    [branchOptions, formData.branchIds],
  );

  const accessSummary = useMemo(
    () => ({
      member: selectedMember,
      companyAccessLabel: formData.accessAllCompanies
        ? "All companies"
        : `${formData.companyIds.length} ${
            formData.companyIds.length === 1 ? "company" : "companies"
          }`,
      branchAccessLabel: formData.accessAllBranches
        ? "All branches"
        : `${formData.branchIds.length} ${
            formData.branchIds.length === 1 ? "branch" : "branches"
          }`,
      selectedCompanies: selectedCompanyOptions.map((company) => company.label),
      selectedBranches: selectedBranchOptions.map((branch) => branch.label),
    }),
    [
      formData.accessAllBranches,
      formData.accessAllCompanies,
      formData.branchIds.length,
      formData.companyIds.length,
      selectedBranchOptions,
      selectedCompanyOptions,
      selectedMember,
    ],
  );

  const validateForm = useCallback(() => {
    const errors = {};

    if (!normalizeText(formData.memberUserId)) {
      errors.memberUserId = "Select an active workspace member";
    }

    if (selectedMember?.disabled) {
      errors.memberUserId = selectedMember?.isOwner
        ? "Workspace owner already has full access"
        : "Only active members can be assigned access";
    }

    if (!formData.accessAllCompanies && !formData.companyIds.length) {
      errors.companyIds =
        "Select at least one company or enable all company access";
    }

    if (!formData.accessAllBranches && !formData.branchIds.length) {
      errors.branchIds =
        "Select at least one branch or enable all branch access";
    }

    return errors;
  }, [formData, selectedMember]);

  const handleChange = useCallback(
    (eventOrValue) => {
      const { name, value } = eventOrValue?.target || eventOrValue || {};

      if (!name) return;

      clearError();

      if (formErrors[name] || formErrors.submit) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
          submit: "",
        }));
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [clearError, formErrors],
  );

  const handleToggleChange = useCallback(
    (eventOrValue) => {
      const name = eventOrValue?.target?.name || eventOrValue?.name;
      const checked = eventOrValue?.target?.checked ?? eventOrValue?.checked;

      if (!name) return;

      clearError();

      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
        companyIds: name === "accessAllCompanies" ? "" : prev.companyIds,
        branchIds: name === "accessAllBranches" ? "" : prev.branchIds,
        submit: "",
      }));

      setFormData((prev) => ({
        ...prev,
        [name]: Boolean(checked),
        ...(name === "accessAllCompanies" && checked ? { companyIds: [] } : {}),
        ...(name === "accessAllBranches" && checked ? { branchIds: [] } : {}),
      }));
    },
    [clearError],
  );

  const handleMultiSelectChange = useCallback(
    (name, valueOrEvent) => {
      const value = valueOrEvent?.target?.value ?? valueOrEvent ?? [];

      clearError();

      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
        submit: "",
      }));

      setFormData((prev) => ({
        ...prev,
        [name]: Array.isArray(value) ? value : [value].filter(Boolean),
      }));
    },
    [clearError],
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
    clearCompanyError?.();
    clearBranchError?.();

    await Promise.allSettled([
      fetchMembers(),
      fetchCompanies(),
      fetchBranches(),
    ]);
  }, [
    clearBranchError,
    clearCompanyError,
    clearError,
    clearMessage,
    clearWorkspaceError,
    fetchBranches,
    fetchCompanies,
    fetchMembers,
  ]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.MEMBER_ACCESS);
  }, [navigate]);

  const handleViewMembers = useCallback(() => {
    navigate(ROUTES.WORKSPACE_MEMBERS);
  }, [navigate]);

  const handleViewAccessList = useCallback(() => {
    navigate(ROUTES.MEMBER_ACCESS);
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
        await updateMemberAccess(
          formData.memberUserId,
          buildAccessPayload(formData),
        );
        navigate(ROUTES.MEMBER_ACCESS, { replace: true });
      } catch (submitError) {
        setFormErrors((prev) => ({
          ...prev,
          submit:
            submitError || "Unable to assign member access. Please try again.",
        }));
      }
    },
    [
      clearError,
      clearMessage,
      formData,
      navigate,
      updateMemberAccess,
      validateForm,
    ],
  );

  const pageProps = {
    formData,
    formErrors,

    memberOptions,
    companyOptions,
    branchOptions,
    selectedMember,
    accessSummary,

    isLoading,
    isLoadingMembers,
    isLoadingCompanies,
    isLoadingBranches,
    isSubmitting,
    error: combinedError,
    message,

    handleChange,
    handleToggleChange,
    handleMultiSelectChange,
    handleSubmit,
    handleReset,
    handleRefresh,
    handleBack,
    handleViewMembers,
    handleViewAccessList,

    clearMessage,
  };

  return isMobile ? (
    <AssignAccessDesktopPage {...pageProps} />
  ) : (
    <AssignAccessDesktopPage {...pageProps} />
  );
};

export default AssignAccessPage;
