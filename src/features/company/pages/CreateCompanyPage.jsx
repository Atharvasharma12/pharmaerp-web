// src/features/company/pages/CreateCompanyPage.jsx

import { useCallback, useMemo, useRef, useState } from "react";
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
  website: "",

  phoneCountryCode: "+91",
  companyPhone: "",
  whatsappNumber: "",
  landlineNumber: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  pincode: "",

  ownerName: "",
  ownerEmail: "",
  ownerMobile: "",
  ownerAadhaar: "",
  ownerPan: "",

  pharmacistName: "",
  pharmacistRegistrationNumber: "",
  pharmacistMobile: "",
  pharmacistEmail: "",
  pharmacistRegistrationExpiryDate: "",

  licenseType: "",
  retailLicenseNumber: "",
  wholesaleLicenseNumber: "",
  drugLicenseNumber: "",
  fssaiNumber: "",
  licenseIssuedAt: "",
  licenseExpiresAt: "",
  licenseStatus: "pending",

  gstType: "regular",
  gstJurisdiction: "",
  defaultGstRate: "0",
  isGstInclusive: "false",

  invoicePrefix: "INV",
  invoiceStartNumber: "1",
  purchasePrefix: "PUR",
  purchaseStartNumber: "1",
  creditNotePrefix: "CRN",
  debitNotePrefix: "DBN",
  barcodeFormat: "Code128",
  roundingType: "2 Decimal Places",
  printCompanyLogoOnInvoice: "true",
  footerMessage: "",

  timezone: "Asia/Kolkata",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",

  allowNegativeStock: "false",
  enableBatchWiseInventory: "true",
  enableExpiryTracking: "true",
  enableScheduleHTracking: "true",
  enableNarcoticDrugTracking: "true",
  enableSmsNotifications: "true",
  enableWhatsappNotifications: "true",
  enableEmailNotifications: "true",
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
const AADHAAR_REGEX = /^[0-9]{12}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeText = (value) => String(value || "").trim();
const normalizeUpperText = (value) => normalizeText(value).toUpperCase();
const normalizeLowerText = (value) => normalizeText(value).toLowerCase();
const normalizePhone = (value) => normalizeText(value).replace(/\D/g, "");
const toBoolean = (value) => value === true || value === "true";

const toNumber = (value, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? fallback : numberValue;
};

const toDateOrNull = (value) => {
  const trimmedValue = normalizeText(value);

  if (!trimmedValue) return null;

  const parsedDate = new Date(trimmedValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
};

const hasAddress = (formData) =>
  Boolean(
    normalizeText(formData.addressLine1) ||
    normalizeText(formData.addressLine2) ||
    normalizeText(formData.city) ||
    normalizeText(formData.district) ||
    normalizeText(formData.state) ||
    normalizeText(formData.country) ||
    normalizeText(formData.pincode),
  );

const buildAddressPayload = (formData) => {
  if (!hasAddress(formData)) return null;

  return {
    addressLine1: normalizeText(formData.addressLine1) || null,
    addressLine2: normalizeText(formData.addressLine2) || null,
    city: normalizeText(formData.city) || null,
    district: normalizeText(formData.district) || null,
    state: normalizeText(formData.state) || null,
    country: normalizeText(formData.country) || "India",
    pincode: normalizeText(formData.pincode) || null,
  };
};

const hasOwner = (formData) =>
  Boolean(
    normalizeText(formData.ownerName) ||
    normalizeText(formData.ownerEmail) ||
    normalizeText(formData.ownerMobile) ||
    normalizeText(formData.ownerAadhaar) ||
    normalizeText(formData.ownerPan),
  );

const buildOwnerPayload = (formData) => {
  if (!hasOwner(formData)) return null;

  return {
    name: normalizeText(formData.ownerName) || null,
    email: normalizeLowerText(formData.ownerEmail) || null,
    mobile: normalizePhone(formData.ownerMobile) || null,
    aadhaar: normalizeText(formData.ownerAadhaar) || null,
    pan: normalizeUpperText(formData.ownerPan) || null,
  };
};

const hasPharmacist = (formData) =>
  Boolean(
    normalizeText(formData.pharmacistName) ||
    normalizeText(formData.pharmacistRegistrationNumber) ||
    normalizeText(formData.pharmacistMobile) ||
    normalizeText(formData.pharmacistEmail) ||
    normalizeText(formData.pharmacistRegistrationExpiryDate),
  );

const buildPharmacistPayload = (formData) => {
  if (!hasPharmacist(formData)) return null;

  return {
    name: normalizeText(formData.pharmacistName) || null,
    registrationNumber:
      normalizeUpperText(formData.pharmacistRegistrationNumber) || null,
    mobile: normalizePhone(formData.pharmacistMobile) || null,
    email: normalizeLowerText(formData.pharmacistEmail) || null,
    registrationExpiryDate: toDateOrNull(
      formData.pharmacistRegistrationExpiryDate,
    ),
  };
};

const hasLicense = (formData) =>
  Boolean(
    normalizeText(formData.licenseType) ||
    normalizeText(formData.retailLicenseNumber) ||
    normalizeText(formData.wholesaleLicenseNumber) ||
    normalizeText(formData.drugLicenseNumber) ||
    normalizeText(formData.fssaiNumber) ||
    normalizeText(formData.licenseIssuedAt) ||
    normalizeText(formData.licenseExpiresAt),
  );

const buildLicensePayload = (formData) => {
  if (!hasLicense(formData)) return null;

  return {
    licenseType: normalizeText(formData.licenseType) || null,
    retailLicenseNumber:
      normalizeUpperText(formData.retailLicenseNumber) || null,
    wholesaleLicenseNumber:
      normalizeUpperText(formData.wholesaleLicenseNumber) || null,
    drugLicenseNumber: normalizeUpperText(formData.drugLicenseNumber) || null,
    fssaiNumber: normalizeText(formData.fssaiNumber) || null,
    issuedAt: toDateOrNull(formData.licenseIssuedAt),
    expiresAt: toDateOrNull(formData.licenseExpiresAt),
    status: formData.licenseStatus || "pending",
  };
};

const buildCompanyPayload = (formData) => {
  const mobile = normalizePhone(formData.companyPhone);
  const whatsapp = normalizePhone(formData.whatsappNumber);

  return {
    name: normalizeText(formData.companyName),
    type: formData.companyType || "proprietorship",

    email: normalizeLowerText(formData.companyEmail) || null,
    website: normalizeLowerText(formData.website) || null,

    phones: {
      mobile: mobile || null,
      whatsapp: whatsapp || null,
      landline: normalizeText(formData.landlineNumber) || null,
    },

    gstin: normalizeUpperText(formData.gstNumber) || null,
    pan: normalizeUpperText(formData.panNumber) || null,

    address: buildAddressPayload(formData),
    owner: buildOwnerPayload(formData),
    pharmacist: buildPharmacistPayload(formData),
    license: buildLicensePayload(formData),

    taxSettings: {
      gstType: formData.gstType || "regular",
      gstJurisdiction: normalizeText(formData.gstJurisdiction) || null,
      defaultGstRate: toNumber(formData.defaultGstRate, 0),
      isGstInclusive: toBoolean(formData.isGstInclusive),
    },

    billingSettings: {
      invoicePrefix: normalizeUpperText(formData.invoicePrefix) || "INV",
      invoiceStartNumber: toNumber(formData.invoiceStartNumber, 1),
      purchasePrefix: normalizeUpperText(formData.purchasePrefix) || "PUR",
      purchaseStartNumber: toNumber(formData.purchaseStartNumber, 1),
      creditNotePrefix: normalizeUpperText(formData.creditNotePrefix) || "CRN",
      debitNotePrefix: normalizeUpperText(formData.debitNotePrefix) || "DBN",
      barcodeFormat: normalizeText(formData.barcodeFormat) || "Code128",
      roundingType: normalizeText(formData.roundingType) || "2 Decimal Places",
      printCompanyLogoOnInvoice: toBoolean(formData.printCompanyLogoOnInvoice),
      footerMessage: normalizeText(formData.footerMessage) || null,
    },

    businessSettings: {
      allowNegativeStock: toBoolean(formData.allowNegativeStock),
      enableBatchWiseInventory: toBoolean(formData.enableBatchWiseInventory),
      enableExpiryTracking: toBoolean(formData.enableExpiryTracking),
      enableScheduleHTracking: toBoolean(formData.enableScheduleHTracking),
      enableNarcoticDrugTracking: toBoolean(
        formData.enableNarcoticDrugTracking,
      ),
      enableSmsNotifications: toBoolean(formData.enableSmsNotifications),
      enableWhatsappNotifications: toBoolean(
        formData.enableWhatsappNotifications,
      ),
      enableEmailNotifications: toBoolean(formData.enableEmailNotifications),
    },

    settings: {
      timezone: normalizeText(formData.timezone) || "Asia/Kolkata",
      currency: normalizeUpperText(formData.currency) || "INR",
      dateFormat: normalizeText(formData.dateFormat) || "DD/MM/YYYY",
      timeFormat: formData.timeFormat || "12h",
    },
  };
};

const validateForm = (formData) => {
  const errors = {};

  const companyName = normalizeText(formData.companyName);
  const gstNumber = normalizeUpperText(formData.gstNumber);
  const panNumber = normalizeUpperText(formData.panNumber);
  const companyEmail = normalizeLowerText(formData.companyEmail);
  const companyPhone = normalizePhone(formData.companyPhone);
  const whatsappNumber = normalizePhone(formData.whatsappNumber);
  const ownerEmail = normalizeLowerText(formData.ownerEmail);
  const ownerMobile = normalizePhone(formData.ownerMobile);
  const ownerAadhaar = normalizeText(formData.ownerAadhaar);
  const ownerPan = normalizeUpperText(formData.ownerPan);
  const pharmacistMobile = normalizePhone(formData.pharmacistMobile);
  const pharmacistEmail = normalizeLowerText(formData.pharmacistEmail);

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

  if (companyEmail && !EMAIL_REGEX.test(companyEmail)) {
    errors.companyEmail = "Enter a valid email address";
  }

  if (companyPhone && !PHONE_REGEX.test(companyPhone)) {
    errors.companyPhone = "Invalid phone number";
  }

  if (whatsappNumber && !PHONE_REGEX.test(whatsappNumber)) {
    errors.whatsappNumber = "Invalid WhatsApp number";
  }

  if (ownerEmail && !EMAIL_REGEX.test(ownerEmail)) {
    errors.ownerEmail = "Enter a valid owner email";
  }

  if (ownerMobile && !PHONE_REGEX.test(ownerMobile)) {
    errors.ownerMobile = "Invalid owner mobile number";
  }

  if (ownerAadhaar && !AADHAAR_REGEX.test(ownerAadhaar)) {
    errors.ownerAadhaar = "Invalid Aadhaar number";
  }

  if (ownerPan && !PAN_REGEX.test(ownerPan)) {
    errors.ownerPan = "Invalid owner PAN number";
  }

  if (pharmacistMobile && !PHONE_REGEX.test(pharmacistMobile)) {
    errors.pharmacistMobile = "Invalid pharmacist mobile number";
  }

  if (pharmacistEmail && !EMAIL_REGEX.test(pharmacistEmail)) {
    errors.pharmacistEmail = "Enter a valid pharmacist email";
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

const CreateCompanyPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    createCompany,
    createCompanyStatus,
    error: companyError,
    clearError,
  } = useCompany();

  const formDataRef = useRef({ ...INITIAL_FORM_DATA });
  const [mobileFormData, setMobileFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const isLoading = createCompanyStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback(
    (nameOrEvent, maybeValue) => {
      const isEvent = Boolean(nameOrEvent?.target);
      const name = isEvent ? nameOrEvent.target.name : nameOrEvent;
      const value = isEvent ? nameOrEvent.target.value : maybeValue;

      formDataRef.current[name] = value;

      if (isMobile) {
        setMobileFormData((prev) => {
          if (prev[name] === value) return prev;
          return { ...prev, [name]: value };
        });
      }

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
    },
    [clearError, companyError, formErrors, isMobile],
  );

  const handleBack = useCallback(() => {
    navigate("/companies");
  }, [navigate]);

  const closeConfirm = useCallback(() => {
    if (!isLoading) {
      setIsConfirmOpen(false);
    }
  }, [isLoading]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();

    const snapshot = { ...formDataRef.current };
    const validationErrors = validateForm(snapshot);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setIsConfirmOpen(false);
      return;
    }

    setFormErrors({});
    setPreviewData(snapshot);
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmCreate = useCallback(async () => {
    try {
      const snapshot = previewData || { ...formDataRef.current };
      const payload = buildCompanyPayload(snapshot);

      await createCompany(payload);
      navigate("/companies", { replace: true });
    } catch (error) {
      setIsConfirmOpen(false);
      setFormErrors({
        submit:
          typeof error === "string"
            ? error
            : "Unable to create company. Please try again.",
      });
    }
  }, [createCompany, navigate, previewData]);

  const desktopProps = useMemo(
    () => ({
      initialFormData: INITIAL_FORM_DATA,
      formErrors,
      isLoading,
      isConfirmOpen,
      previewData,

      companyTypeOptions,
      currencyOptions,
      gstTypeOptions,
      licenseStatusOptions,
      statusOptions,
      timeFormatOptions,
      booleanOptions,

      handleChange: handleFieldChange,
      handleSubmit,
      handleBack,
      closeConfirm,
      handleConfirmCreate,
    }),
    [
      closeConfirm,
      formErrors,
      handleBack,
      handleConfirmCreate,
      handleFieldChange,
      handleSubmit,
      isConfirmOpen,
      isLoading,
      previewData,
    ],
  );

  const mobileProps = useMemo(
    () => ({
      formData: mobileFormData,
      formErrors,
      isLoading,

      companyTypeOptions,
      currencyOptions,
      gstTypeOptions,
      licenseStatusOptions,
      statusOptions,
      timeFormatOptions,
      booleanOptions,

      handleChange: handleFieldChange,
      handleSubmit,
      handleBack,
    }),
    [
      formErrors,
      handleBack,
      handleFieldChange,
      handleSubmit,
      isLoading,
      mobileFormData,
    ],
  );

  return isMobile ? (
    <CreateCompanyMobilePage {...mobileProps} />
  ) : (
    <CreateCompanyDesktopPage {...desktopProps} />
  );
};

export default CreateCompanyPage;
