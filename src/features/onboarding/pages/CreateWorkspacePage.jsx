// src/features/onboarding/pages/CreateWorkspacePage.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";

import CreateWorkspaceDesktopPage from "./desktop/CreateWorkspaceDesktopPage";
import CreateWorkspaceMobilePage from "./mobile/CreateWorkspaceMobilePage";

const CreateWorkspacePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    workspaces,
    currentWorkspace,

    createWorkspaceStatus,
    getMyWorkspacesStatus,

    error,

    createWorkspace,
    getMyWorkspaces,

    clearError,
    clearMessage,
  } = useWorkspace();

  const [formData, setFormData] = useState({
    workspaceName: "",
    workspaceSlug: "",
    pharmacyName: "",
    ownerName: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const isCreatingWorkspace = createWorkspaceStatus === API_STATUS.LOADING;
  const isCheckingWorkspaces = getMyWorkspacesStatus === API_STATUS.LOADING;

  const hasFetchedWorkspaces = getMyWorkspacesStatus === API_STATUS.SUCCESS;

  const hasWorkspace =
    Boolean(currentWorkspace) || Boolean(workspaces && workspaces.length > 0);

  const shouldHideCreatePage =
    isCheckingWorkspaces || (hasFetchedWorkspaces && hasWorkspace);

  const states = useMemo(
    () => [
      { label: "Select state", value: "" },
      { label: "Gujarat", value: "gujarat" },
      { label: "Maharashtra", value: "maharashtra" },
      { label: "Rajasthan", value: "rajasthan" },
    ],
    [],
  );

  const cities = useMemo(
    () => [
      { label: "Select city", value: "" },
      { label: "Ahmedabad", value: "ahmedabad" },
      { label: "Surat", value: "surat" },
      { label: "Mumbai", value: "mumbai" },
      { label: "Pune", value: "pune" },
      { label: "Jaipur", value: "jaipur" },
    ],
    [],
  );

  useEffect(() => {
    clearError();
    clearMessage();

    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  useEffect(() => {
    if (
      getMyWorkspacesStatus === API_STATUS.IDLE ||
      getMyWorkspacesStatus === API_STATUS.ERROR
    ) {
      getMyWorkspaces();
    }
  }, [getMyWorkspacesStatus, getMyWorkspaces]);

  useEffect(() => {
    if (hasFetchedWorkspaces && hasWorkspace) {
      navigate(ROUTES.CHOOSE_PLAN, { replace: true });
    }
  }, [hasFetchedWorkspaces, hasWorkspace, navigate]);

  useEffect(() => {
    if (error) {
      setFormErrors((prev) => ({
        ...prev,
        submit: error,
      }));
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};

    if (!formData.workspaceName.trim()) {
      errors.workspaceName = "Workspace name is required";
    }

    if (
      formData.workspaceSlug &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.workspaceSlug)
    ) {
      errors.workspaceSlug = "Use lowercase letters, numbers and hyphens only";
    }

    if (formData.phone.trim() && !/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      errors.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Enter a valid email address";
      }
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (formErrors[name] || formErrors.submit) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
        submit: "",
      }));
    }

    const nextValue =
      name === "workspaceSlug"
        ? value
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-{2,}/g, "-")
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  };

  const buildPayload = () => {
    const payload = {
      name: formData.workspaceName.trim(),
      type: "pharmacy",
    };

    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();

    if (email) {
      payload.email = email;
    }

    if (phone) {
      payload.phone = phone;
    }

    if (formData.address.trim() || formData.city || formData.state) {
      payload.address = {
        addressLine1: formData.address.trim() || null,
        city: formData.city || null,
        state: formData.state || null,
        country: "India",
      };
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    clearError();
    clearMessage();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      const workspace = await createWorkspace(buildPayload());

      navigate(ROUTES.CHOOSE_PLAN, {
        replace: true,
        state: {
          workspaceId: workspace?._id,
          workspace,
        },
      });
    } catch (submitError) {
      setFormErrors((prev) => ({
        ...prev,
        submit: submitError || "Unable to create workspace. Please try again.",
      }));
    }
  };

  if (shouldHideCreatePage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-sm font-medium text-text-muted">
          Loading workspace...
        </div>
      </div>
    );
  }

  const pageProps = {
    formData,
    formErrors,
    states,
    cities,
    isLoading: isCreatingWorkspace,
    handleChange,
    handleSubmit,
  };

  return isMobile ? (
    <CreateWorkspaceMobilePage {...pageProps} />
  ) : (
    <CreateWorkspaceDesktopPage {...pageProps} />
  );
};

export default CreateWorkspacePage;
