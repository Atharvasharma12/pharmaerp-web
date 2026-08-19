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
import AssignAccessMobilePage from "./mobile/AssignAccessMobilePage";

const INITIAL_FORM_DATA = {
  memberUserId: "",
  accessAllCompanies: false,
  accessAllBranches: false,
  companyIds: [],
  branchIds: [],
  branchAccess: [], // [{ branchId, roleId, canOperateMarketplaceStore }]
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

const getDisplayEmail = (member) => getUser(member)?.email || "-";

const getDisplayPhone = (member) => {
  const user = getUser(member);
  const phone = user?.phone || user?.mobile || user?.profile?.phone;
  if (!phone) return "-";
  return String(phone).startsWith("+") ? phone : `+91 ${phone}`;
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
    joinedOn: member?.joinedOn || "10 Mar 2024",
    lastLogin: member?.lastLogin || "27 May 2024, 09:15 AM",
    status: member?.status || "active",
    disabled:
      Boolean(member?.isOwner) || member?.status !== "active" || !memberUserId,
  };
};

const buildAccessPayload = (formData) => {
  const accessAllCompanies = Boolean(formData.accessAllCompanies);
  const accessAllBranches = Boolean(formData.accessAllBranches);

  return {
    accessAllCompanies,
    accessAllBranches,
    companyIds: accessAllCompanies ? [] : formData.companyIds,
    branchIds: accessAllBranches ? [] : formData.branchIds,
    branchAccess: accessAllBranches ? [] : formData.branchAccess || [],
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
    getWorkspaceMembersStatus,
  } = useWorkspace();
  const { companies, getWorkspaceCompanies, getWorkspaceCompaniesStatus } =
    useCompany();
  const {
    branches,
    getCompanyBranches,
    getCompanyBranchesStatus,
    clearBranches,
  } = useBranch();
  const {
    updateMemberAccess,
    updateMemberAccessStatus,
    error,
    message,
    clearError,
    clearMessage,
  } = useAccessControl();

  const hasFetchedWorkspacesRef = useRef(false);
  const hasFetchedMembersRef = useRef(false);
  const hasFetchedCompaniesRef = useRef(false);

  const previousCompanyIdsStrRef = useRef("");

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const workspaceId = currentWorkspace?._id || currentWorkspace?.id;
  const isSubmitting = updateMemberAccessStatus === API_STATUS.LOADING;

  const isLoading =
    getWorkspaceMembersStatus === API_STATUS.LOADING ||
    getWorkspaceCompaniesStatus === API_STATUS.LOADING ||
    getCompanyBranchesStatus === API_STATUS.LOADING;

  useEffect(() => {
    if (workspaceId || hasFetchedWorkspacesRef.current) return;
    hasFetchedWorkspacesRef.current = true;
    getMyWorkspaces().catch(() => {});
  }, [getMyWorkspaces, workspaceId]);

  useEffect(() => {
    if (!workspaceId || hasFetchedMembersRef.current) return;
    hasFetchedMembersRef.current = true;
    getWorkspaceMembers(workspaceId).catch(() => {});
  }, [getWorkspaceMembers, workspaceId]);

  useEffect(() => {
    if (hasFetchedCompaniesRef.current) return;
    hasFetchedCompaniesRef.current = true;
    getWorkspaceCompanies().catch(() => {});
  }, [getWorkspaceCompanies]);

  // Fetches branches ONLY when specific companies are selected
  useEffect(() => {
    const currentIdsStr = [...(formData.companyIds || [])].sort().join(",");

    if (
      formData.accessAllCompanies ||
      !formData.companyIds ||
      !formData.companyIds.length
    ) {
      if (previousCompanyIdsStrRef.current !== "") {
        previousCompanyIdsStrRef.current = "";
        clearBranches?.();
      }
      return;
    }

    if (currentIdsStr !== previousCompanyIdsStrRef.current) {
      previousCompanyIdsStrRef.current = currentIdsStr;
      getCompanyBranches(formData.companyIds).catch(() => {});
    }
  }, [
    formData.companyIds,
    formData.accessAllCompanies,
    getCompanyBranches,
    clearBranches,
  ]);

  const memberOptions = useMemo(() => {
    return (Array.isArray(members) ? members : []).map(mapMemberForOption);
  }, [members]);

  const selectedMember = useMemo(() => {
    return memberOptions.find((m) => m.value === formData.memberUserId) || null;
  }, [formData.memberUserId, memberOptions]);

  const companyOptions = useMemo(() => {
    return (Array.isArray(companies) ? companies : []).map((c) => ({
      ...c,
      label: c.name || c.companyName || "Company",
      value: getObjectId(c),
      description: c.description || "Registered corporate hub node",
      disabled: c.status && c.status !== "active",
    }));
  }, [companies]);

  // STRICT RULE COMPLIANCE: If no company is selected, branch list evaluates to an absolute empty array
  const filteredBranchOptions = useMemo(() => {
    if (!formData.companyIds || !formData.companyIds.length) {
      return [];
    }
    const currentCompanyIdsSet = new Set(formData.companyIds);
    const mappedBranches = (Array.isArray(branches) ? branches : []).map(
      (b) => ({
        ...b,
        label: b.name || b.branchName || "Branch",
        value: getObjectId(b),
        companyId: b.companyId || b.company || "",
        companyName: b.companyName || "Company Location",
        location:
          b.city && b.state
            ? `${b.city}, ${b.state}`
            : b.location || b.addressLine1 || "India",
        disabled: b.status && b.status !== "active",
      }),
    );

    return mappedBranches.filter((b) => currentCompanyIdsSet.has(b.companyId));
  }, [formData.companyIds, branches]);

  // Clean-up loop handler when unchecking items in real-time
  useEffect(() => {
    if (
      formData.accessAllCompanies ||
      !formData.branchIds ||
      !formData.branchIds.length
    )
      return;

    const activeSet = new Set(formData.companyIds || []);
    const cleanedBranches = formData.branchIds.filter((bId) => {
      const matchingBranch = filteredBranchOptions.find((b) => b.value === bId);
      return matchingBranch ? activeSet.has(matchingBranch.companyId) : false;
    });

    if (cleanedBranches.length !== formData.branchIds.length) {
      setFormData((prev) => ({ ...prev, branchIds: cleanedBranches }));
    }
  }, [
    formData.companyIds,
    formData.accessAllCompanies,
    formData.branchIds,
    filteredBranchOptions,
  ]);

  const accessSummary = useMemo(
    () => ({
      member: selectedMember,
      companyAccessLabel: formData.accessAllCompanies
        ? "All Companies"
        : `${(formData.companyIds || []).length} Selected`,
      branchAccessLabel: formData.accessAllBranches
        ? "All Branches"
        : `${(formData.branchIds || []).length} Selected`,
      selectedCompanies: companyOptions.filter((c) =>
        (formData.companyIds || []).includes(c.value),
      ),
      selectedBranches: filteredBranchOptions.filter((b) =>
        (formData.branchIds || []).includes(b.value),
      ),
    }),
    [
      formData.accessAllBranches,
      formData.accessAllCompanies,
      formData.branchIds,
      formData.companyIds,
      companyOptions,
      filteredBranchOptions,
      selectedMember,
    ],
  );

  const validateStepData = useCallback((step, data) => {
    const errors = {};
    if (step === 1 && !normalizeText(data.memberUserId)) {
      errors.memberUserId = "Workspace member is required";
    }
    return errors;
  }, []);

  const handleChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
      clearError();
    },
    [clearError],
  );

  const handleStepChange = useCallback(
    (step) => {
      if (step <= currentStep) {
        setCurrentStep(step);
        return;
      }
      for (let i = 1; i < step; i++) {
        const stepErrors = validateStepData(i, formData);
        if (Object.keys(stepErrors).length > 0) {
          setFormErrors(stepErrors);
          setCurrentStep(i);
          return;
        }
      }
      setCurrentStep(step);
    },
    [currentStep, formData, validateStepData],
  );

  const handleContinue = useCallback(() => {
    const stepErrors = validateStepData(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setFormErrors(stepErrors);
      return;
    }
    setFormErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, [currentStep, formData, validateStepData]);

  const handleBackStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    else navigate(ROUTES.MEMBER_ACCESS);
  }, [currentStep, navigate]);

  const handleResetForm = useCallback(() => {
    previousCompanyIdsStrRef.current = "";
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
    setCurrentStep(1);
    clearError();
    clearMessage();
    clearBranches?.();
  }, [clearError, clearMessage, clearBranches]);

  const handleSubmit = useCallback(
    async (event) => {
      if (event) event.preventDefault();
      clearError();
      const errors = validateStepData(1, formData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setCurrentStep(1);
        return;
      }
      try {
        await updateMemberAccess(
          formData.memberUserId,
          buildAccessPayload(formData),
        );
        navigate(ROUTES.MEMBER_ACCESS, { replace: true });
      } catch (err) {
        setFormErrors({
          submit:
            typeof err === "string"
              ? err
              : "Failed to assign access rules configurations.",
        });
      }
    },
    [formData, navigate, updateMemberAccess, validateStepData, clearError],
  );

  return isMobile ? (
    <AssignAccessMobilePage
      formData={formData}
      formErrors={formErrors}
      currentStep={currentStep}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      error={error}
      message={message}
      memberOptions={memberOptions}
      companyOptions={companyOptions}
      filteredBranchOptions={filteredBranchOptions}
      selectedMember={selectedMember}
      accessSummary={accessSummary}
      handleChange={handleChange}
      handleStepChange={handleStepChange}
      handleContinue={handleContinue}
      handleBack={handleBackStep}
      handleCancel={() => navigate(ROUTES.MEMBER_ACCESS)}
      handleReset={handleResetForm}
      handleSubmit={handleSubmit}
    />
  ) : (
    <AssignAccessDesktopPage
      formData={formData}
      formErrors={formErrors}
      currentStep={currentStep}
      isLoading={isLoading}
      isSubmitting={isSubmitting}
      error={error}
      memberOptions={memberOptions}
      companyOptions={companyOptions}
      filteredBranchOptions={filteredBranchOptions}
      selectedMember={selectedMember}
      accessSummary={accessSummary}
      handleChange={handleChange}
      handleStepChange={handleStepChange}
      handleContinue={handleContinue}
      handleBack={handleBackStep}
      handleSaveDraft={() => navigate(ROUTES.MEMBER_ACCESS)}
      handleCancel={() => navigate(ROUTES.MEMBER_ACCESS)}
      handleReset={handleResetForm}
      handleSubmit={handleSubmit}
    />
  );
};

export default AssignAccessPage;
