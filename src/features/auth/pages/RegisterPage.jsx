import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { validateRegisterForm } from "@/utils";
import { useIsMobile } from "@/hooks";

import useAuth from "../hooks/useAuth";
import RegisterDesktopPage from "./desktop/RegisterDesktopPage";
import RegisterMobilePage from "./mobile/RegisterMobilePage";

const RegisterPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { register, status, error, clearError } = useAuth();

  const [agree, setAgree] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    state: "",
    city: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === API_STATUS.LOADING;

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
    { label: "Jaipur", value: "jaipur" },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (error) clearError();

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

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone.trim(),
    };

    const validationErrors = validateRegisterForm(payload);

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (!agree) {
      validationErrors.agree = "Please accept terms and privacy policy";
    }

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    if (!payload.phone) {
      delete payload.phone;
    }

    try {
      await register(payload);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      // Error handled in auth state
    }
  };

  const pageProps = {
    formData,
    formErrors,
    agree,
    states,
    cities,
    isLoading,
    error,
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
