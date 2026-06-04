// src/features/branch/pages/CreateBranchPage.jsx

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBranch from "../hooks/useBranch";

import CreateBranchDesktopPage from "./desktop/CreateBranchDesktopPage";
import CreateBranchMobilePage from "./mobile/CreateBranchMobilePage";

const INITIAL_FORM_DATA = {
  branchName: "",
  branchType: "retail",
  status: "active",
  isPrimary: "false",

  branchEmail: "",
  phoneCountryCode: "+91",
  branchPhone: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  pincode: "",
  googleMapLocation: "",

  drugLicenseNumber: "",
  drugLicenseType: "",
  fssaiNumber: "",
  licenseExpiresAt: "",

  pharmacistName: "",
  pharmacistRegistrationNumber: "",
  pharmacistMobile: "",
  pharmacistEmail: "",

  emergencyContactName: "",
  emergencyContactMobile: "",
  emergencyContactRelationship: "",

  invoicePrefix: "INV",
  purchasePrefix: "PUR",
  salesReturnPrefix: "SR",
  purchaseReturnPrefix: "PR",
  creditNotePrefix: "CN",
  debitNotePrefix: "DBN",
  startingInvoiceNumber: "1",
  startingPurchaseNumber: "1",

  inventoryMode: "independent",
  priceMode: "company_default",
  allowNegativeStock: "false",
  allowBackdatedEntries: "false",
  enableBatchTracking: "true",
  enableExpiryTracking: "true",
  enableRackTracking: "true",
  enableStockTracking: "true",

  openingTime: "",
  closingTime: "",
  weeklyOff: "",
  workingDays: "",

  homeDelivery: "false",
  whatsappOrders: "false",
  onlineOrders: "false",
  coldStorageAvailable: "false",
  twentyFourSevenService: "false",

  timezone: "Asia/Kolkata",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",
};

const branchTypeOptions = [
  { label: "Retail", value: "retail" },
  { label: "Wholesale", value: "wholesale" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Clinic Pharmacy", value: "clinic_pharmacy" },
  { label: "Hospital Pharmacy", value: "hospital_pharmacy" },
  { label: "Online", value: "online" },
  { label: "Other", value: "other" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const inventoryModeOptions = [
  { label: "Independent", value: "independent" },
  { label: "Shared", value: "shared" },
];

const priceModeOptions = [
  { label: "Company Default", value: "company_default" },
  { label: "Branch Specific", value: "branch_specific" },
];

const currencyOptions = [
  { label: "INR - Indian Rupee (₹)", value: "INR" },
  { label: "USD - US Dollar ($)", value: "USD" },
];

const timeFormatOptions = [
  { label: "12 Hour", value: "12h" },
  { label: "24 Hour", value: "24h" },
];

const booleanOptions = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const PHONE_REGEX = /^[6-9][0-9]{9}$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const hasAddress = (formData) => {
  return Boolean(
    normalizeText(formData.addressLine1) ||
    normalizeText(formData.addressLine2) ||
    normalizeText(formData.city) ||
    normalizeText(formData.district) ||
    normalizeText(formData.state) ||
    normalizeText(formData.country) ||
    normalizeText(formData.pincode) ||
    normalizeText(formData.googleMapLocation),
  );
};

const buildAddressPayload = (formData) => {
  if (!hasAddress(formData)) {
    return undefined;
  }

  return {
    addressLine1: normalizeText(formData.addressLine1) || null,
    addressLine2: normalizeText(formData.addressLine2) || null,
    city: normalizeText(formData.city) || null,
    district: normalizeText(formData.district) || null,
    state: normalizeText(formData.state) || null,
    country: normalizeText(formData.country) || "India",
    pincode: normalizeText(formData.pincode) || null,
    googleMapLocation: normalizeText(formData.googleMapLocation) || null,
  };
};

const hasLicense = (formData) => {
  return Boolean(
    normalizeText(formData.drugLicenseNumber) ||
    normalizeText(formData.drugLicenseType) ||
    normalizeText(formData.fssaiNumber) ||
    normalizeText(formData.licenseExpiresAt),
  );
};

const buildLicensePayload = (formData) => {
  if (!hasLicense(formData)) {
    return undefined;
  }

  return {
    drugLicenseNumber: normalizeUpperText(formData.drugLicenseNumber) || null,
    drugLicenseType: normalizeText(formData.drugLicenseType) || null,
    fssaiNumber: normalizeText(formData.fssaiNumber) || null,
    expiresAt: normalizeText(formData.licenseExpiresAt) || null,
  };
};

const hasPharmacist = (formData) => {
  return Boolean(
    normalizeText(formData.pharmacistName) ||
    normalizeText(formData.pharmacistRegistrationNumber) ||
    normalizeText(formData.pharmacistMobile) ||
    normalizeText(formData.pharmacistEmail),
  );
};

const buildPharmacistPayload = (formData) => {
  if (!hasPharmacist(formData)) {
    return undefined;
  }

  return {
    name: normalizeText(formData.pharmacistName) || null,
    registrationNumber:
      normalizeUpperText(formData.pharmacistRegistrationNumber) || null,
    mobile: normalizePhone(formData.pharmacistMobile) || null,
    email: normalizeLowerText(formData.pharmacistEmail) || null,
  };
};

const hasEmergencyContact = (formData) => {
  return Boolean(
    normalizeText(formData.emergencyContactName) ||
    normalizeText(formData.emergencyContactMobile) ||
    normalizeText(formData.emergencyContactRelationship),
  );
};

const buildEmergencyContactPayload = (formData) => {
  if (!hasEmergencyContact(formData)) {
    return undefined;
  }

  return {
    name: normalizeText(formData.emergencyContactName) || null,
    mobile: normalizePhone(formData.emergencyContactMobile) || null,
    relationship: normalizeText(formData.emergencyContactRelationship) || null,
  };
};

const buildWorkingDays = (value) => {
  return normalizeText(value)
    .split(",")
    .map((day) => normalizeText(day))
    .filter(Boolean);
};

const buildBranchPayload = (formData) => {
  const phone = normalizePhone(formData.branchPhone);

  return {
    name: normalizeText(formData.branchName),
    type: formData.branchType || "retail",

    email: normalizeLowerText(formData.branchEmail) || null,
    phone: phone || null,

    address: buildAddressPayload(formData),

    license: buildLicensePayload(formData),
    pharmacist: buildPharmacistPayload(formData),
    emergencyContact: buildEmergencyContactPayload(formData),

    billingSettings: {
      invoicePrefix: normalizeUpperText(formData.invoicePrefix) || "INV",
      purchasePrefix: normalizeUpperText(formData.purchasePrefix) || "PUR",
      salesReturnPrefix: normalizeUpperText(formData.salesReturnPrefix) || "SR",
      purchaseReturnPrefix:
        normalizeUpperText(formData.purchaseReturnPrefix) || "PR",
      creditNotePrefix: normalizeUpperText(formData.creditNotePrefix) || "CN",
      debitNotePrefix: normalizeUpperText(formData.debitNotePrefix) || "DBN",
      startingInvoiceNumber: toNumber(formData.startingInvoiceNumber, 1),
      startingPurchaseNumber: toNumber(formData.startingPurchaseNumber, 1),
    },

    inventorySettings: {
      inventoryMode: formData.inventoryMode || "independent",
      priceMode: formData.priceMode || "company_default",
      allowNegativeStock: toBoolean(formData.allowNegativeStock),
      allowBackdatedEntries: toBoolean(formData.allowBackdatedEntries),
      enableBatchTracking: toBoolean(formData.enableBatchTracking),
      enableExpiryTracking: toBoolean(formData.enableExpiryTracking),
      enableRackTracking: toBoolean(formData.enableRackTracking),
      enableStockTracking: toBoolean(formData.enableStockTracking),
    },

    workingHours: {
      openingTime: normalizeText(formData.openingTime) || null,
      closingTime: normalizeText(formData.closingTime) || null,
      weeklyOff: normalizeText(formData.weeklyOff) || null,
      workingDays: buildWorkingDays(formData.workingDays),
    },

    facilities: {
      homeDelivery: toBoolean(formData.homeDelivery),
      whatsappOrders: toBoolean(formData.whatsappOrders),
      onlineOrders: toBoolean(formData.onlineOrders),
      coldStorageAvailable: toBoolean(formData.coldStorageAvailable),
      twentyFourSevenService: toBoolean(formData.twentyFourSevenService),
    },

    settings: {
      timezone: normalizeText(formData.timezone) || "Asia/Kolkata",
      currency: normalizeUpperText(formData.currency) || "INR",
      dateFormat: normalizeText(formData.dateFormat) || "DD/MM/YYYY",
      timeFormat: formData.timeFormat || "12h",
    },

    isPrimary: toBoolean(formData.isPrimary),
  };
};

const CreateBranchPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    createBranch,
    createBranchStatus,
    error: branchError,
    clearError,
  } = useBranch();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const isLoading = createBranchStatus === API_STATUS.LOADING;

  const validateForm = () => {
    const errors = {};

    const branchName = normalizeText(formData.branchName);
    const branchEmail = normalizeLowerText(formData.branchEmail);
    const branchPhone = normalizePhone(formData.branchPhone);

    const pharmacistMobile = normalizePhone(formData.pharmacistMobile);
    const pharmacistEmail = normalizeLowerText(formData.pharmacistEmail);

    const emergencyContactMobile = normalizePhone(
      formData.emergencyContactMobile,
    );

    const startingInvoiceNumber = toNumber(formData.startingInvoiceNumber, 1);
    const startingPurchaseNumber = toNumber(formData.startingPurchaseNumber, 1);

    if (!branchName) {
      errors.branchName = "Branch name is required";
    } else if (branchName.length < 2) {
      errors.branchName = "Branch name must be at least 2 characters";
    } else if (branchName.length > 160) {
      errors.branchName = "Branch name cannot exceed 160 characters";
    }

    if (branchEmail && !EMAIL_REGEX.test(branchEmail)) {
      errors.branchEmail = "Enter a valid email address";
    }

    if (branchPhone && !PHONE_REGEX.test(branchPhone)) {
      errors.branchPhone = "Invalid phone number";
    }

    if (pharmacistMobile && !PHONE_REGEX.test(pharmacistMobile)) {
      errors.pharmacistMobile = "Invalid pharmacist mobile number";
    }

    if (pharmacistEmail && !EMAIL_REGEX.test(pharmacistEmail)) {
      errors.pharmacistEmail = "Enter a valid pharmacist email";
    }

    if (emergencyContactMobile && !PHONE_REGEX.test(emergencyContactMobile)) {
      errors.emergencyContactMobile = "Invalid emergency contact mobile number";
    }

    if (startingInvoiceNumber < 1) {
      errors.startingInvoiceNumber =
        "Starting invoice number must be at least 1";
    }

    if (startingPurchaseNumber < 1) {
      errors.startingPurchaseNumber =
        "Starting purchase number must be at least 1";
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

    if (branchError) {
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
      const payload = buildBranchPayload(formData);

      await createBranch(payload);

      navigate("/branches", { replace: true });
    } catch (error) {
      setFormErrors({
        submit:
          typeof error === "string"
            ? error
            : "Unable to create branch. Please try again.",
      });
    }
  };

  const pageProps = useMemo(
    () => ({
      formData,
      formErrors,
      isLoading,

      branchTypeOptions,
      statusOptions,
      inventoryModeOptions,
      priceModeOptions,
      currencyOptions,
      timeFormatOptions,
      booleanOptions,

      handleChange,
      handleSubmit,
      handleBack: () => navigate("/branches"),
    }),
    [formData, formErrors, isLoading, navigate],
  );

  return isMobile ? (
    <CreateBranchMobilePage {...pageProps} />
  ) : (
    <CreateBranchDesktopPage {...pageProps} />
  );
};

export default CreateBranchPage;
