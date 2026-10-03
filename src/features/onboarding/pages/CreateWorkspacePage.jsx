// src/features/onboarding/pages/CreateWorkspacePage.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useAuth from "@/features/auth/hooks/useAuth";
import { clearSignupData } from "@/features/auth/store/authSlice";
import { setCurrentWorkspace } from "@/features/workspace/store/workspaceSlice";
import { setCurrentSubscription } from "@/features/subscription/subscriptions/store/subscriptionSlice";

import CreateWorkspaceDesktopPage from "./desktop/CreateWorkspaceDesktopPage";
import CreateWorkspaceMobilePage from "./mobile/CreateWorkspaceMobilePage";

const WORKSPACE_TYPE = {
  PHARMACY: "pharmacy",
  CLINIC: "clinic",
  HOSPITAL: "hospital",
  DISTRIBUTOR: "distributor",
  OTHER: "other",
};

const CreateWorkspacePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { register } = useAuth();

  const signupData = useSelector((state) => state.auth.signupData) || {};

  // Security guard: Send back to Step 1 if account details are empty
  useEffect(() => {
    if (!signupData.fullName) {
      navigate(ROUTES.REGISTER, { replace: true });
    }
  }, [signupData.fullName, navigate]);

  const [formData, setFormData] = useState({
    workspaceName: signupData.workspaceName || "",
    type: signupData.workspaceType || WORKSPACE_TYPE.PHARMACY,
    phone: signupData.workspacePhone || "",
    email: signupData.workspaceEmail || "",
    state: signupData.workspaceState || "",
    city: signupData.workspaceCity || "",
    address: signupData.workspaceAddress || "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workspaceTypes = useMemo(
    () => [
      { label: "Pharmacy", value: WORKSPACE_TYPE.PHARMACY },
      { label: "Clinic", value: WORKSPACE_TYPE.CLINIC },
      { label: "Hospital", value: WORKSPACE_TYPE.HOSPITAL },
      { label: "Distributor", value: WORKSPACE_TYPE.DISTRIBUTOR },
      { label: "Other", value: WORKSPACE_TYPE.OTHER },
    ],
    [],
  );

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

  const validateForm = () => {
    const errors = {};

    if (!formData.workspaceName.trim()) {
      errors.workspaceName = "Workspace name is required";
    }

    if (!Object.values(WORKSPACE_TYPE).includes(formData.type)) {
      errors.type = "Select a valid workspace type";
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    const payload = {
      fullName: signupData.fullName,
      email: signupData.email,
      password: signupData.password,
      phone: signupData.phone,
      workspaceName: formData.workspaceName.trim(),
      workspaceType: formData.type,
    };

    if (!payload.phone) {
      delete payload.phone;
    }

    try {
      setIsSubmitting(true);
      setFormErrors({});

      const result = await register(payload);

      if (result?.workspace) {
        dispatch(setCurrentWorkspace(result.workspace));
      }
      if (result?.subscription) {
        dispatch(setCurrentSubscription(result.subscription));
      }

      dispatch(clearSignupData());

      navigate(ROUTES.DASHBOARD, {
        replace: true,
        state: { showWelcomeToast: true },
      });
    } catch (err) {
      setFormErrors({
        submit: typeof err === "string" ? err : "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageProps = {
    formData,
    formErrors,
    workspaceTypes,
    states,
    cities,
    isLoading: isSubmitting,
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
