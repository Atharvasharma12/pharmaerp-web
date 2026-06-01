// src/features/branch/pages/CreateBranchPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useIsMobile } from "@/hooks";

import CreateBranchDesktopPage from "./desktop/CreateBranchDesktopPage";
import CreateBranchMobilePage from "./mobile/CreateBranchMobilePage";

const CreateBranchPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    companyId: "medplus-pharmacy",
    branchName: "MedPlus Andheri East",
    branchCode: "BR-001",
    branchType: "retail",
    branchEmail: "andheri@medpluspharmacy.com",
    phoneCountryCode: "+91",
    branchPhone: "98765 43210",
    managerName: "Rahul Sharma",
    managerPhone: "98765 12345",
    addressLine1: "Shop No. 12, MG Road",
    addressLine2: "Near Metro Station, Andheri East",
    city: "Mumbai",
    state: "maharashtra",
    pincode: "400069",
    country: "india",
    gstNumber: "27AABCM1234C1Z5",
    drugLicenseNumber: "MH/25B/123456",
    fssaiNumber: "",
    openingTime: "09:00",
    closingTime: "22:00",
    inventoryTracking: "enabled",
    posEnabled: "enabled",
    allowNegativeStock: "disabled",
    status: "active",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const companyOptions = [
    { label: "MedPlus Pharmacy Pvt. Ltd.", value: "medplus-pharmacy" },
    { label: "Apollo Pharmacy Pvt. Ltd.", value: "apollo-pharmacy" },
  ];

  const branchTypeOptions = [
    { label: "Retail Pharmacy", value: "retail" },
    { label: "Wholesale Pharmacy", value: "wholesale" },
    { label: "Warehouse", value: "warehouse" },
    { label: "Franchise", value: "franchise" },
  ];

  const stateOptions = [
    { label: "Maharashtra", value: "maharashtra" },
    { label: "Gujarat", value: "gujarat" },
    { label: "Rajasthan", value: "rajasthan" },
    { label: "Karnataka", value: "karnataka" },
  ];

  const countryOptions = [{ label: "India", value: "india" }];

  const inventoryTrackingOptions = [
    { label: "Enabled", value: "enabled" },
    { label: "Disabled", value: "disabled" },
  ];

  const posEnabledOptions = [
    { label: "Enabled", value: "enabled" },
    { label: "Disabled", value: "disabled" },
  ];

  const allowNegativeStockOptions = [
    { label: "Disabled", value: "disabled" },
    { label: "Enabled", value: "enabled" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  const validateForm = () => {
    const errors = {};

    if (!formData.companyId) {
      errors.companyId = "Please select company";
    }

    if (!formData.branchName.trim()) {
      errors.branchName = "Branch name is required";
    }

    if (!formData.branchCode.trim()) {
      errors.branchCode = "Branch code is required";
    }

    if (!formData.branchEmail.trim()) {
      errors.branchEmail = "Branch email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.branchEmail)) {
      errors.branchEmail = "Enter a valid email address";
    }

    if (!formData.branchPhone.trim()) {
      errors.branchPhone = "Branch phone number is required";
    }

    if (!formData.managerName.trim()) {
      errors.managerName = "Manager name is required";
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = "Address line 1 is required";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    if (!formData.state) {
      errors.state = "Please select state";
    }

    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = "Enter a valid 6-digit pincode";
    }

    if (!formData.openingTime.trim()) {
      errors.openingTime = "Opening time is required";
    }

    if (!formData.closingTime.trim()) {
      errors.closingTime = "Closing time is required";
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
      branchName: formData.branchName.trim(),
      branchCode: formData.branchCode.trim().toUpperCase(),
      branchEmail: formData.branchEmail.trim().toLowerCase(),
      branchPhone: formData.branchPhone.trim(),
      managerName: formData.managerName.trim(),
      managerPhone: formData.managerPhone.trim(),
      addressLine1: formData.addressLine1.trim(),
      addressLine2: formData.addressLine2.trim(),
      city: formData.city.trim(),
      pincode: formData.pincode.trim(),
      gstNumber: formData.gstNumber.trim().toUpperCase(),
      drugLicenseNumber: formData.drugLicenseNumber.trim(),
      fssaiNumber: formData.fssaiNumber.trim(),
    };

    try {
      setIsLoading(true);

      // TODO: Replace with create branch API call
      // await createBranch(payload);

      navigate("/branches", { replace: true });
    } catch {
      setFormErrors({
        submit: "Unable to create branch. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    companyOptions,
    branchTypeOptions,
    stateOptions,
    countryOptions,
    inventoryTrackingOptions,
    posEnabledOptions,
    allowNegativeStockOptions,
    statusOptions,
    handleChange,
    handleSubmit,
    handleBack: () => navigate("/branches"),
  };

  return isMobile ? (
    <CreateBranchMobilePage {...pageProps} />
  ) : (
    <CreateBranchDesktopPage {...pageProps} />
  );
};

export default CreateBranchPage;
