import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useAuth from "../hooks/useAuth";
import { clearSignupData } from "../store/authSlice";
import { setCurrentWorkspace } from "@/features/workspace/store/workspaceSlice";
import { setCurrentSubscription } from "@/features/subscription/subscriptions/store/subscriptionSlice";

import RegisterDesktopPage from "./desktop/RegisterDesktopPage";
import RegisterMobilePage from "./mobile/RegisterMobilePage";

export const WORKSPACE_TYPE = {
  PHARMACY: "pharmacy",
  CLINIC: "clinic",
  HOSPITAL: "hospital",
  DISTRIBUTOR: "distributor",
  OTHER: "other",
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();

  const { register, error, clearError } = useAuth();

  const [agree, setAgree] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    workspaceName: "",
    workspaceType: WORKSPACE_TYPE.PHARMACY,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const workspaceTypes = [
    { label: "Pharmacy", value: WORKSPACE_TYPE.PHARMACY },
    { label: "Clinic", value: WORKSPACE_TYPE.CLINIC },
    { label: "Hospital", value: WORKSPACE_TYPE.HOSPITAL },
    { label: "Distributor", value: WORKSPACE_TYPE.DISTRIBUTOR },
    { label: "Other", value: WORKSPACE_TYPE.OTHER },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (error) clearError();

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

  const handleAgreeChange = (event) => {
    setAgree(event.target.checked);

    if (formErrors.agree) {
      setFormErrors((prev) => ({
        ...prev,
        agree: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};
    if (!formData.fullName?.trim() || formData.fullName.trim().length < 3) {
      errors.fullName = "Full name must be at least 3 characters";
    }
    if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = "Phone number must be a valid 10-digit mobile number";
    }
    if (!formData.password || formData.password.length < 6 || formData.password.length > 128) {
      errors.password = "Password must be between 6 and 128 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.workspaceName?.trim()) {
      errors.workspaceName = "Workspace name is required";
    }
    if (!Object.values(WORKSPACE_TYPE).includes(formData.workspaceType)) {
      errors.workspaceType = "Select a valid workspace type";
    }
    if (!agree) {
      errors.agree = "Please accept terms and privacy policy";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      workspaceName: formData.workspaceName.trim(),
      workspaceType: formData.workspaceType,
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
    agree,
    isLoading: isSubmitting,
    error,
    workspaceTypes,
    handleChange,
    handleAgreeChange,
    handleSubmit,
  };

  return isMobile ? (
    <RegisterMobilePage {...pageProps} />
  ) : (
    <RegisterDesktopPage {...pageProps} />
  );
};

export default RegisterPage;
