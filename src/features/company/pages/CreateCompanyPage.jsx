// src/features/company/pages/CreateCompanyPage.jsx

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCompany from "../hooks/useCompany";

import CreateCompanyDesktopPage from "./desktop/CreateCompanyDesktopPage";
import CreateCompanyMobilePage from "./mobile/CreateCompanyMobilePage";

const INITIAL_FORM_DATA = {
  companyName: "",
  companyType: "proprietorship",
  status: "active",

  gstNumber: "",
  panNumber: "",
  companyEmail: "",
  phoneCountryCode: "+91",
  companyPhone: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",

  drugLicenseNumber: "",
  drugLicenseIssuedAt: "",
  drugLicenseExpiry: "",
  drugLicenseStatus: "pending",

  foodLicenseNumber: "",
  foodLicenseIssuedAt: "",
  foodLicenseExpiry: "",
  foodLicenseStatus: "pending",

  tradeLicenseNumber: "",
  tradeLicenseIssuedAt: "",
  tradeLicenseExpiry: "",
  tradeLicenseStatus: "pending",

  gstType: "regular",
  billingType: "gst",
  defaultGstRate: "0",
  isGstInclusive: "false",

  invoicePrefix: "INV",
  invoiceStartNumber: "1",
  purchasePrefix: "PUR",
  purchaseStartNumber: "1",
  salesReturnPrefix: "SR",
  purchaseReturnPrefix: "PR",

  timezone: "Asia/Kolkata",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",

  allowNegativeStock: "false",
  allowBackdatedEntries: "false",
  enableBatchTracking: "true",
  enableExpiryTracking: "true",
  enablePurchaseModule: "true",
  enableSalesModule: "true",
  enableInventoryModule: "true",
};

const companyTypeOptions = [
  { label: "Proprietorship", value: "proprietorship" },
  { label: "Partnership", value: "partnership" },
  { label: "LLP", value: "llp" },
  { label: "Private Limited", value: "private_limited" },
  { label: "Public Limited", value: "public_limited" },
  { label: "OPC", value: "opc" },
  { label: "Trust", value: "trust" },
  { label: "Society", value: "society" },
  { label: "Other", value: "other" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const currencyOptions = [
  { label: "INR - Indian Rupee (₹)", value: "INR" },
  { label: "USD - US Dollar ($)", value: "USD" },
];

const gstTypeOptions = [
  { label: "Regular", value: "regular" },
  { label: "Composition", value: "composition" },
  { label: "Unregistered", value: "unregistered" },
];

const billingTypeOptions = [
  { label: "GST", value: "gst" },
  { label: "Non GST", value: "non_gst" },
];

const licenseStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Suspended", value: "suspended" },
];

const timeFormatOptions = [
  { label: "12 Hour", value: "12h" },
  { label: "24 Hour", value: "24h" },
];

const booleanOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const PHONE_REGEX = /^[6-9][0-9]{9}$/;

const normalizeText = (value) => String(value || "").trim();

const normalizeUpperText = (value) => normalizeText(value).toUpperCase();

const normalizeLowerText = (value) => normalizeText(value).toLowerCase();

const normalizePhone = (value) => normalizeText(value).replace(/\D/g, "");

const toBoolean = (value) => value === true || value === "true";

const toNumber = (value, fallback = 0) => {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return numberValue;
};

const toDateOrNull = (value) => {
  const trimmedValue = normalizeText(value);

  if (!trimmedValue) {
    return null;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
};

const hasAddress = (formData) => {
  return Boolean(
    normalizeText(formData.addressLine1) ||
    normalizeText(formData.addressLine2) ||
    normalizeText(formData.city) ||
    normalizeText(formData.state) ||
    normalizeText(formData.country) ||
    normalizeText(formData.pincode),
  );
};

const buildAddressPayload = (formData) => {
  if (!hasAddress(formData)) {
    return null;
  }

  return {
    addressLine1: normalizeText(formData.addressLine1) || null,
    addressLine2: normalizeText(formData.addressLine2) || null,
    city: normalizeText(formData.city) || null,
    state: normalizeText(formData.state) || null,
    country: normalizeText(formData.country) || "India",
    pincode: normalizeText(formData.pincode) || null,
  };
};

const hasLicense = (licenseNumber, issuedAt, expiresAt) => {
  return Boolean(
    normalizeText(licenseNumber) ||
    normalizeText(issuedAt) ||
    normalizeText(expiresAt),
  );
};

const buildLicensePayload = ({
  licenseNumber,
  issuedAt,
  expiresAt,
  status,
}) => {
  if (!hasLicense(licenseNumber, issuedAt, expiresAt)) {
    return null;
  }

  return {
    licenseNumber: normalizeUpperText(licenseNumber) || null,
    issuedAt: toDateOrNull(issuedAt),
    expiresAt: toDateOrNull(expiresAt),
    status: status || "pending",
  };
};

const buildCompanyPayload = (formData) => {
  const phone = normalizePhone(formData.companyPhone);

  return {
    name: normalizeText(formData.companyName),
    type: formData.companyType || "proprietorship",

    email: normalizeLowerText(formData.companyEmail) || null,
    phone: phone || null,
    gstin: normalizeUpperText(formData.gstNumber) || null,
    pan: normalizeUpperText(formData.panNumber) || null,

    address: buildAddressPayload(formData),

    drugLicense: buildLicensePayload({
      licenseNumber: formData.drugLicenseNumber,
      issuedAt: formData.drugLicenseIssuedAt,
      expiresAt: formData.drugLicenseExpiry,
      status: formData.drugLicenseStatus,
    }),

    foodLicense: buildLicensePayload({
      licenseNumber: formData.foodLicenseNumber,
      issuedAt: formData.foodLicenseIssuedAt,
      expiresAt: formData.foodLicenseExpiry,
      status: formData.foodLicenseStatus,
    }),

    tradeLicense: buildLicensePayload({
      licenseNumber: formData.tradeLicenseNumber,
      issuedAt: formData.tradeLicenseIssuedAt,
      expiresAt: formData.tradeLicenseExpiry,
      status: formData.tradeLicenseStatus,
    }),

    taxSettings: {
      gstType: formData.gstType || "regular",
      billingType: formData.billingType || "gst",
      defaultGstRate: toNumber(formData.defaultGstRate, 0),
      isGstInclusive: toBoolean(formData.isGstInclusive),
    },

    billingSettings: {
      invoicePrefix: normalizeUpperText(formData.invoicePrefix) || "INV",
      invoiceStartNumber: toNumber(formData.invoiceStartNumber, 1),
      purchasePrefix: normalizeUpperText(formData.purchasePrefix) || "PUR",
      purchaseStartNumber: toNumber(formData.purchaseStartNumber, 1),
      salesReturnPrefix: normalizeUpperText(formData.salesReturnPrefix) || "SR",
      purchaseReturnPrefix:
        normalizeUpperText(formData.purchaseReturnPrefix) || "PR",
    },

    settings: {
      timezone: normalizeText(formData.timezone) || "Asia/Kolkata",
      currency: normalizeUpperText(formData.currency) || "INR",
      dateFormat: normalizeText(formData.dateFormat) || "DD/MM/YYYY",
      timeFormat: formData.timeFormat || "12h",
      allowNegativeStock: toBoolean(formData.allowNegativeStock),
      allowBackdatedEntries: toBoolean(formData.allowBackdatedEntries),
      enableBatchTracking: toBoolean(formData.enableBatchTracking),
      enableExpiryTracking: toBoolean(formData.enableExpiryTracking),
      enablePurchaseModule: toBoolean(formData.enablePurchaseModule),
      enableSalesModule: toBoolean(formData.enableSalesModule),
      enableInventoryModule: toBoolean(formData.enableInventoryModule),
    },
  };
};

const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    createCompany,
    createCompanyStatus,
    error: companyError,
    clearError,
  } = useCompany();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const isLoading = createCompanyStatus === API_STATUS.LOADING;

  const validateForm = () => {
    const errors = {};

    const companyName = normalizeText(formData.companyName);
    const gstNumber = normalizeUpperText(formData.gstNumber);
    const panNumber = normalizeUpperText(formData.panNumber);
    const companyEmail = normalizeLowerText(formData.companyEmail);
    const companyPhone = normalizePhone(formData.companyPhone);
    const defaultGstRate = toNumber(formData.defaultGstRate, 0);
    const invoiceStartNumber = toNumber(formData.invoiceStartNumber, 1);
    const purchaseStartNumber = toNumber(formData.purchaseStartNumber, 1);

    if (!companyName) {
      errors.companyName = "Company name is required";
    } else if (companyName.length < 2) {
      errors.companyName = "Company name must be at least 2 characters";
    } else if (companyName.length > 160) {
      errors.companyName = "Company name cannot exceed 160 characters";
    }

    if (gstNumber && !GSTIN_REGEX.test(gstNumber)) {
      errors.gstNumber = "Invalid GSTIN";
    }

    if (panNumber && !PAN_REGEX.test(panNumber)) {
      errors.panNumber = "Invalid PAN number";
    }

    if (companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail)) {
      errors.companyEmail = "Enter a valid email address";
    }

    if (companyPhone && !PHONE_REGEX.test(companyPhone)) {
      errors.companyPhone = "Invalid phone number";
    }

    if (defaultGstRate < 0 || defaultGstRate > 100) {
      errors.defaultGstRate = "GST rate must be between 0 and 100";
    }

    if (invoiceStartNumber < 1) {
      errors.invoiceStartNumber = "Invoice start number must be at least 1";
    }

    if (purchaseStartNumber < 1) {
      errors.purchaseStartNumber = "Purchase start number must be at least 1";
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

    if (companyError) {
      clearError();
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

    try {
      const payload = buildCompanyPayload(formData);

      await createCompany(payload);

      navigate("/companies", { replace: true });
    } catch (error) {
      setFormErrors({
        submit:
          typeof error === "string"
            ? error
            : "Unable to create company. Please try again.",
      });
    }
  };

  const pageProps = useMemo(
    () => ({
      formData,
      formErrors,
      isLoading,

      companyTypeOptions,
      currencyOptions,
      gstTypeOptions,
      billingTypeOptions,
      licenseStatusOptions,
      statusOptions,
      timeFormatOptions,
      booleanOptions,

      handleChange,
      handleSubmit,
      handleBack: () => navigate("/companies"),
    }),
    [formData, formErrors, isLoading, navigate],
  );

  return isMobile ? (
    <CreateCompanyMobilePage {...pageProps} />
  ) : (
    <CreateCompanyDesktopPage {...pageProps} />
  );
};

export default CreateCompanyPage;
