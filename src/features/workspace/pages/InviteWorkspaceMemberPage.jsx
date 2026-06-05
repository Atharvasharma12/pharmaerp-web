// src/features/workspace/pages/InviteWorkspaceMemberPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useWorkspace from "../hooks/useWorkspace";

import InviteWorkspaceMemberDesktopPage from "./desktop/InviteWorkspaceMemberDesktopPage";
import InviteWorkspaceMemberMobilePage from "./mobile/InviteWorkspaceMemberMobilePage";

const INITIAL_FORM_DATA = {
  email: "",
  roleId: "",
  notes: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const normalizeText = (value) => String(value || "").trim();
const normalizeLowerText = (value) => normalizeText(value).toLowerCase();

const buildInvitePayload = (formData) => {
  const payload = {
    email: normalizeLowerText(formData.email),
  };

  const roleId = normalizeText(formData.roleId);
  const notes = normalizeText(formData.notes);

  if (roleId) {
    payload.roleId = roleId;
  }

  if (notes) {
    payload.notes = notes;
  }

  return payload;
};

const InviteWorkspaceMemberPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    currentWorkspace,

    getMyWorkspaces,
    inviteWorkspaceMember,

    getMyWorkspacesStatus,
    inviteWorkspaceMemberStatus,

    error,
    message,

    clearError,
    clearMessage,
  } = useWorkspace();

  const hasFetchedWorkspacesRef = useRef(false);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const workspaceId = currentWorkspace?._id;

  const isCheckingWorkspace = getMyWorkspacesStatus === API_STATUS.LOADING;
  const isInviting = inviteWorkspaceMemberStatus === API_STATUS.LOADING;
  const isLoading = isCheckingWorkspace || isInviting;

  const workspaceSummary = useMemo(
    () => ({
      name: currentWorkspace?.name || "Workspace",
      code: currentWorkspace?.workspaceCode || "-",
      type: currentWorkspace?.type || "-",
      email: currentWorkspace?.email || "-",
      phone: currentWorkspace?.phone ? `+91 ${currentWorkspace.phone}` : "-",
    }),
    [currentWorkspace],
  );

  const fetchWorkspaces = useCallback(async () => {
    try {
      await getMyWorkspaces();
    } catch {
      // Error is already stored in workspace slice.
    }
  }, [getMyWorkspaces]);

  useEffect(() => {
    clearError();
    clearMessage();

    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  useEffect(() => {
    if (workspaceId || hasFetchedWorkspacesRef.current) return;

    hasFetchedWorkspacesRef.current = true;
    fetchWorkspaces();
  }, [fetchWorkspaces, workspaceId]);

  useEffect(() => {
    if (!error) return;

    setFormErrors((prev) => ({
      ...prev,
      submit: error,
    }));
  }, [error]);

  const validateForm = useCallback(() => {
    const errors = {};
    const email = normalizeLowerText(formData.email);
    const roleId = normalizeText(formData.roleId);
    const notes = normalizeText(formData.notes);

    if (!email) {
      errors.email = "Email address is required";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (roleId && !OBJECT_ID_REGEX.test(roleId)) {
      errors.roleId = "Enter a valid role id";
    }

    if (notes.length > 500) {
      errors.notes = "Notes cannot exceed 500 characters";
    }

    if (!workspaceId) {
      errors.submit = "Workspace is not ready. Please refresh and try again.";
    }

    return errors;
  }, [formData, workspaceId]);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      if (error) {
        clearError();
      }

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
    [clearError, error, formErrors],
  );

  const handleReset = useCallback(() => {
    if (isLoading) return;

    clearError();
    clearMessage();
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  }, [clearError, clearMessage, isLoading]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.WORKSPACE_MEMBERS);
  }, [navigate]);

  const handleViewInvitations = useCallback(() => {
    navigate(ROUTES.WORKSPACE_INVITATIONS);
  }, [navigate]);

  const handleViewMembers = useCallback(() => {
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
        await inviteWorkspaceMember(workspaceId, buildInvitePayload(formData));
        navigate(ROUTES.WORKSPACE_INVITATIONS, { replace: true });
      } catch (submitError) {
        setFormErrors((prev) => ({
          ...prev,
          submit:
            submitError ||
            "Unable to invite workspace member. Please try again.",
        }));
      }
    },
    [
      clearError,
      clearMessage,
      formData,
      inviteWorkspaceMember,
      navigate,
      validateForm,
      workspaceId,
    ],
  );

  const pageProps = {
    formData,
    formErrors,
    workspace: currentWorkspace,
    workspaceSummary,

    isLoading,
    isCheckingWorkspace,
    isInviting,
    error,
    message,

    handleChange,
    handleSubmit,
    handleReset,
    handleBack,
    handleViewInvitations,
    handleViewMembers,
  };

  return isMobile ? (
    <InviteWorkspaceMemberMobilePage {...pageProps} />
  ) : (
    <InviteWorkspaceMemberDesktopPage {...pageProps} />
  );
};

export default InviteWorkspaceMemberPage;
