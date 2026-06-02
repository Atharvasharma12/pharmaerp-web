// src/features/branch/pages/EditBranchPage.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBranch from "../hooks/useBranch";

import EditBranchDesktopPage from "./desktop/EditBranchDesktopPage";
import EditBranchMobilePage from "./mobile/EditBranchMobilePage";

const INITIAL_FORM_DATA = {
  branchName: "",
  branchType: "retail",
  status: "active",

  gstNumber: "",
  branchEmail: "",
  phoneCountryCode: "+91",
  branchPhone: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",

  contactPersonName: "",
  contactPersonPhone: "",
  contactPersonEmail: "",
  contactPersonDesignation: "",

  drugLicenseNumber: "",

  billingType: "gst",
  invoicePrefix: "INV",
  invoiceStartNumber: "1",
  billPrefix: "BILL",
  billStartNumber: "1",
  purchasePrefix: "PUR",
  purchaseStartNumber: "1",
  salesReturnPrefix: "SR",
  purchaseReturnPrefix: "PR",

  inventoryMode: "independent",
  priceMode: "company_default",
  allowNegativeStock: "false",
  allowBackdatedEntries: "false",
  enableBatchTracking: "true",
  enableExpiryTracking: "true",
  enableRackTracking: "true",

  timezone: "Asia/Kolkata",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",
  enablePurchaseModule: "true",
  enableSalesModule: "true",
  enableInventoryModule: "true",
  enablePosBilling: "true",
  defaultGstRate: "0",

  isPrimary: "false",
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

const billingTypeOptions = [
  { label: "GST", value: "gst" },
  { label: "Non GST", value: "non_gst" },
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

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PHONE_REGEX = /^[6-9][0-9]{9}$/;

const normalizeText = (value) => String(value || "").trim();
const normalizeUpperText = (value) => normalizeText(value).toUpperCase();
const normalizeLowerText = (value) => normalizeText(value).toLowerCase();
const normalizePhone = (value) => normalizeText(value).replace(/\D/g, "");
const toBoolean = (value) => value === true || value === "true";

const toNumber = (value, fallback = 0) => {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? fallback : numberValue;
};

const hasAddress = (formData) =>
  Boolean(
    normalizeText(formData.addressLine1) ||
    normalizeText(formData.addressLine2) ||
    normalizeText(formData.city) ||
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
    state: normalizeText(formData.state) || null,
    country: normalizeText(formData.country) || "India",
    pincode: normalizeText(formData.pincode) || null,
  };
};

const hasContactPerson = (formData) =>
  Boolean(
    normalizeText(formData.contactPersonName) ||
    normalizeText(formData.contactPersonPhone) ||
    normalizeText(formData.contactPersonEmail) ||
    normalizeText(formData.contactPersonDesignation),
  );

const buildContactPersonPayload = (formData) => {
  if (!hasContactPerson(formData)) return null;

  return {
    name: normalizeText(formData.contactPersonName) || null,
    phone: normalizePhone(formData.contactPersonPhone) || null,
    email: normalizeLowerText(formData.contactPersonEmail) || null,
    designation: normalizeText(formData.contactPersonDesignation) || null,
  };
};

const buildBranchPayload = (formData) => {
  const branchPhone = normalizePhone(formData.branchPhone);

  return {
    name: normalizeText(formData.branchName),
    type: formData.branchType || "retail",
    status: formData.status || "active",

    email: normalizeLowerText(formData.branchEmail) || null,
    phone: branchPhone || null,
    gstin: normalizeUpperText(formData.gstNumber) || null,
    drugLicenseNumber: normalizeUpperText(formData.drugLicenseNumber) || null,

    address: buildAddressPayload(formData),
    contactPerson: buildContactPersonPayload(formData),

    billingSettings: {
      billingType: formData.billingType || "gst",
      invoicePrefix: normalizeUpperText(formData.invoicePrefix) || "INV",
      invoiceStartNumber: toNumber(formData.invoiceStartNumber, 1),
      billPrefix: normalizeUpperText(formData.billPrefix) || "BILL",
      billStartNumber: toNumber(formData.billStartNumber, 1),
      purchasePrefix: normalizeUpperText(formData.purchasePrefix) || "PUR",
      purchaseStartNumber: toNumber(formData.purchaseStartNumber, 1),
      salesReturnPrefix: normalizeUpperText(formData.salesReturnPrefix) || "SR",
      purchaseReturnPrefix:
        normalizeUpperText(formData.purchaseReturnPrefix) || "PR",
    },

    inventorySettings: {
      inventoryMode: formData.inventoryMode || "independent",
      priceMode: formData.priceMode || "company_default",
      allowNegativeStock: toBoolean(formData.allowNegativeStock),
      allowBackdatedEntries: toBoolean(formData.allowBackdatedEntries),
      enableBatchTracking: toBoolean(formData.enableBatchTracking),
      enableExpiryTracking: toBoolean(formData.enableExpiryTracking),
      enableRackTracking: toBoolean(formData.enableRackTracking),
    },

    settings: {
      timezone: normalizeText(formData.timezone) || "Asia/Kolkata",
      currency: normalizeUpperText(formData.currency) || "INR",
      dateFormat: normalizeText(formData.dateFormat) || "DD/MM/YYYY",
      timeFormat: formData.timeFormat || "12h",
      enablePurchaseModule: toBoolean(formData.enablePurchaseModule),
      enableSalesModule: toBoolean(formData.enableSalesModule),
      enableInventoryModule: toBoolean(formData.enableInventoryModule),
      enablePosBilling: toBoolean(formData.enablePosBilling),
      defaultGstRate: toNumber(formData.defaultGstRate, 0),
    },

    isPrimary: toBoolean(formData.isPrimary),
  };
};

const mapBranchToFormData = (branch) => ({
  branchName: branch?.name || "",
  branchType: branch?.type || "retail",
  status: branch?.status || "active",

  gstNumber: branch?.gstin || "",
  branchEmail: branch?.email || "",
  phoneCountryCode: "+91",
  branchPhone: branch?.phone || "",

  addressLine1: branch?.address?.addressLine1 || "",
  addressLine2: branch?.address?.addressLine2 || "",
  city: branch?.address?.city || "",
  state: branch?.address?.state || "",
  country: branch?.address?.country || "India",
  pincode: branch?.address?.pincode || "",

  contactPersonName: branch?.contactPerson?.name || "",
  contactPersonPhone: branch?.contactPerson?.phone || "",
  contactPersonEmail: branch?.contactPerson?.email || "",
  contactPersonDesignation: branch?.contactPerson?.designation || "",

  drugLicenseNumber: branch?.drugLicenseNumber || "",

  billingType: branch?.billingSettings?.billingType || "gst",
  invoicePrefix: branch?.billingSettings?.invoicePrefix || "INV",
  invoiceStartNumber: String(branch?.billingSettings?.invoiceStartNumber ?? 1),
  billPrefix: branch?.billingSettings?.billPrefix || "BILL",
  billStartNumber: String(branch?.billingSettings?.billStartNumber ?? 1),
  purchasePrefix: branch?.billingSettings?.purchasePrefix || "PUR",
  purchaseStartNumber: String(
    branch?.billingSettings?.purchaseStartNumber ?? 1,
  ),
  salesReturnPrefix: branch?.billingSettings?.salesReturnPrefix || "SR",
  purchaseReturnPrefix: branch?.billingSettings?.purchaseReturnPrefix || "PR",

  inventoryMode: branch?.inventorySettings?.inventoryMode || "independent",
  priceMode: branch?.inventorySettings?.priceMode || "company_default",
  allowNegativeStock: String(
    Boolean(branch?.inventorySettings?.allowNegativeStock),
  ),
  allowBackdatedEntries: String(
    Boolean(branch?.inventorySettings?.allowBackdatedEntries),
  ),
  enableBatchTracking: String(
    branch?.inventorySettings?.enableBatchTracking !== false,
  ),
  enableExpiryTracking: String(
    branch?.inventorySettings?.enableExpiryTracking !== false,
  ),
  enableRackTracking: String(
    branch?.inventorySettings?.enableRackTracking !== false,
  ),

  timezone: branch?.settings?.timezone || "Asia/Kolkata",
  currency: branch?.settings?.currency || "INR",
  dateFormat: branch?.settings?.dateFormat || "DD/MM/YYYY",
  timeFormat: branch?.settings?.timeFormat || "12h",
  enablePurchaseModule: String(
    branch?.settings?.enablePurchaseModule !== false,
  ),
  enableSalesModule: String(branch?.settings?.enableSalesModule !== false),
  enableInventoryModule: String(
    branch?.settings?.enableInventoryModule !== false,
  ),
  enablePosBilling: String(branch?.settings?.enablePosBilling !== false),
  defaultGstRate: String(branch?.settings?.defaultGstRate ?? 0),

  isPrimary: String(Boolean(branch?.isPrimary)),
});

const EditBranchPage = () => {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const isMobile = useIsMobile();

  const {
    currentBranch,
    getBranchById,
    updateBranch,
    getBranchStatus,
    updateBranchStatus,
    error: branchError,
    clearError,
    clearCurrentBranch,
  } = useBranch();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  const isFetching = getBranchStatus === API_STATUS.LOADING;
  const isLoading = updateBranchStatus === API_STATUS.LOADING;

  useEffect(() => {
    if (!branchId) {
      navigate("/branches", { replace: true });
      return;
    }

    getBranchById(branchId).catch((error) => {
      setFormErrors({
        submit:
          typeof error === "string" ? error : "Unable to fetch branch details.",
      });
    });

    return () => {
      clearError();
    };
  }, [branchId, getBranchById, navigate, clearError]);

  useEffect(() => {
    if (currentBranch?._id === branchId) {
      setFormData(mapBranchToFormData(currentBranch));
    }
  }, [currentBranch, branchId]);

  const validateForm = () => {
    const errors = {};

    const branchName = normalizeText(formData.branchName);
    const gstNumber = normalizeUpperText(formData.gstNumber);
    const branchEmail = normalizeLowerText(formData.branchEmail);
    const branchPhone = normalizePhone(formData.branchPhone);
    const contactPersonPhone = normalizePhone(formData.contactPersonPhone);
    const contactPersonEmail = normalizeLowerText(formData.contactPersonEmail);

    const defaultGstRate = toNumber(formData.defaultGstRate, 0);
    const invoiceStartNumber = toNumber(formData.invoiceStartNumber, 1);
    const billStartNumber = toNumber(formData.billStartNumber, 1);
    const purchaseStartNumber = toNumber(formData.purchaseStartNumber, 1);

    if (!branchName) {
      errors.branchName = "Branch name is required";
    } else if (branchName.length < 2) {
      errors.branchName = "Branch name must be at least 2 characters";
    } else if (branchName.length > 160) {
      errors.branchName = "Branch name cannot exceed 160 characters";
    }

    if (gstNumber && !GSTIN_REGEX.test(gstNumber)) {
      errors.gstNumber = "Invalid GSTIN";
    }

    if (branchEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(branchEmail)) {
      errors.branchEmail = "Enter a valid email address";
    }

    if (branchPhone && !PHONE_REGEX.test(branchPhone)) {
      errors.branchPhone = "Invalid phone number";
    }

    if (contactPersonPhone && !PHONE_REGEX.test(contactPersonPhone)) {
      errors.contactPersonPhone = "Invalid contact person phone number";
    }

    if (
      contactPersonEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactPersonEmail)
    ) {
      errors.contactPersonEmail = "Enter a valid contact person email";
    }

    if (defaultGstRate < 0 || defaultGstRate > 100) {
      errors.defaultGstRate = "GST rate must be between 0 and 100";
    }

    if (invoiceStartNumber < 1) {
      errors.invoiceStartNumber = "Invoice start number must be at least 1";
    }

    if (billStartNumber < 1) {
      errors.billStartNumber = "Bill start number must be at least 1";
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

      await updateBranch(branchId, payload);

      navigate("/branches", { replace: true });
    } catch (error) {
      setFormErrors({
        submit:
          typeof error === "string"
            ? error
            : "Unable to update branch. Please try again.",
      });
    }
  };

  const handleBack = () => {
    clearCurrentBranch();
    navigate("/branches");
  };

  const pageProps = useMemo(
    () => ({
      formData,
      formErrors,
      isLoading,
      isFetching,

      branchTypeOptions,
      statusOptions,
      billingTypeOptions,
      inventoryModeOptions,
      priceModeOptions,
      currencyOptions,
      timeFormatOptions,
      booleanOptions,

      handleChange,
      handleSubmit,
      handleBack,
    }),
    [formData, formErrors, isLoading, isFetching],
  );

  return isMobile ? (
    <EditBranchMobilePage {...pageProps} />
  ) : (
    <EditBranchDesktopPage {...pageProps} />
  );
};

export default EditBranchPage;
