// src/features/company/pages/CreateCompanyPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useIsMobile } from "@/hooks";

import CreateCompanyDesktopPage from "./desktop/CreateCompanyDesktopPage";
import CreateCompanyMobilePage from "./mobile/CreateCompanyMobilePage";

const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    companyName: "MedPlus Pharmacy Pvt. Ltd.",
    legalCompanyName: "MedPlus Pharmacy Private Limited",
    gstNumber: "27AABCM1234C1Z5",
    panNumber: "AABCM1234C",
    companyEmail: "info@medpluspharmacy.com",
    phoneCountryCode: "+91",
    companyPhone: "98765 43210",
    drugLicenseNumber: "MH/25B/123456",
    drugLicenseExpiry: "31 Dec 2026",
    tradeLicenseNumber: "TL/2024/45879",
    tradeLicenseExpiry: "31 Dec 2025",
    legalAddress:
      "Shop No. 12, MG Road, Andheri East, Mumbai, Maharashtra - 400069",
    currency: "inr",
    taxPreference: "gst_exclusive",
    defaultBillingPrefix: "INV-",
    financialYearStart: "1_april",
    status: "active",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const currencyOptions = [
    { label: "INR - Indian Rupee (₹)", value: "inr" },
    { label: "USD - US Dollar ($)", value: "usd" },
  ];

  const taxPreferenceOptions = [
    { label: "GST Exclusive", value: "gst_exclusive" },
    { label: "GST Inclusive", value: "gst_inclusive" },
    { label: "No GST", value: "no_gst" },
  ];

  const financialYearOptions = [
    { label: "1 April", value: "1_april" },
    { label: "1 January", value: "1_january" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const validateForm = () => {
    const errors = {};

    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    }

    if (!formData.gstNumber.trim()) {
      errors.gstNumber = "GST number is required";
    }

    if (!formData.companyEmail.trim()) {
      errors.companyEmail = "Company email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
      errors.companyEmail = "Enter a valid email address";
    }

    if (!formData.companyPhone.trim()) {
      errors.companyPhone = "Company phone number is required";
    }

    if (!formData.drugLicenseNumber.trim()) {
      errors.drugLicenseNumber = "Drug license number is required";
    }

    if (!formData.drugLicenseExpiry.trim()) {
      errors.drugLicenseExpiry = "Drug license expiry is required";
    }

    if (!formData.legalAddress.trim()) {
      errors.legalAddress = "Legal address is required";
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
      ...formData,
      companyName: formData.companyName.trim(),
      legalCompanyName: formData.legalCompanyName.trim(),
      gstNumber: formData.gstNumber.trim().toUpperCase(),
      panNumber: formData.panNumber.trim().toUpperCase(),
      companyEmail: formData.companyEmail.trim().toLowerCase(),
      companyPhone: formData.companyPhone.trim(),
      legalAddress: formData.legalAddress.trim(),
    };

    try {
      setIsLoading(true);

      // TODO: Replace with create company API call
      // await createCompany(payload);

      navigate("/companies", { replace: true });
    } catch {
      setFormErrors({
        submit: "Unable to create company. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    currencyOptions,
    taxPreferenceOptions,
    financialYearOptions,
    statusOptions,
    handleChange,
    handleSubmit,
    handleBack: () => navigate("/companies"),
  };

  return isMobile ? (
    <CreateCompanyMobilePage {...pageProps} />
  ) : (
    <CreateCompanyDesktopPage {...pageProps} />
  );
};

export default CreateCompanyPage;
