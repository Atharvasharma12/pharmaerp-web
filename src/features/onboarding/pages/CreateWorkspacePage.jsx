// src/features/onboarding/pages/CreateWorkspacePage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import CreateWorkspaceDesktopPage from "./desktop/CreateWorkspaceDesktopPage";
import CreateWorkspaceMobilePage from "./mobile/CreateWorkspaceMobilePage";

const CreateWorkspacePage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    workspaceName: "",
    pharmacyName: "",
    ownerName: "",
    phone: "",
    email: "",
    state: "",
    city: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const states = [
    { label: "Select state", value: "" },
    { label: "Gujarat", value: "gujarat" },
    { label: "Maharashtra", value: "maharashtra" },
    { label: "Rajasthan", value: "rajasthan" },
  ];

  const cities = [
    { label: "Select city", value: "" },
    { label: "Ahmedabad", value: "ahmedabad" },
    { label: "Surat", value: "surat" },
    { label: "Mumbai", value: "mumbai" },
    { label: "Pune", value: "pune" },
    { label: "Jaipur", value: "jaipur" },
  ];

  const validateForm = () => {
    const errors = {};

    if (!formData.workspaceName.trim()) {
      errors.workspaceName = "Workspace name is required";
    }

    if (!formData.pharmacyName.trim()) {
      errors.pharmacyName = "Pharmacy name is required";
    }

    if (!formData.ownerName.trim()) {
      errors.ownerName = "Owner name is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      errors.phone = "Enter a valid 10-digit Indian mobile number";
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Enter a valid email address";
      }
    }

    if (!formData.state) {
      errors.state = "Please select state";
    }

    if (!formData.city) {
      errors.city = "Please select city";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
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
      workspaceName: formData.workspaceName.trim(),
      pharmacyName: formData.pharmacyName.trim(),
      ownerName: formData.ownerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim().toLowerCase(),
      state: formData.state,
      city: formData.city,
      address: formData.address.trim(),
    };

    if (!payload.email) {
      delete payload.email;
    }

    try {
      setIsLoading(true);

      // TODO: Replace with create workspace API call
      // await createWorkspace(payload);

      navigate(ROUTES.CHOOSE_PLAN, { replace: true });
    } catch {
      setFormErrors({
        submit: "Unable to create workspace. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pageProps = {
    formData,
    formErrors,
    states,
    cities,
    isLoading,
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
