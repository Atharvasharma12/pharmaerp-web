import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBranch from "../hooks/useBranch";

import EditBranchDesktopPage from "./desktop/EditBranchDesktopPage";
import EditBranchMobilePage from "./mobile/EditBranchMobilePage";

const INITIAL_FORM_DATA = {
  // Step 1: Basic Profile Details
  branchName: "",
  branchType: "retail",
  isPrimary: "false",
  branchEmail: "",
  mobile: "",
  whatsapp: "",
  landline: "",

  // Step 2: Address (ADDRESS_SCHEMA)
  addressLine1: "",
  addressLine2: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  pincode: "",
  googleMapLocation: "",

  // Step 3: Licenses (LICENSE_SCHEMA)
  drugLicenseNumber: "",
  drugLicenseType: "",
  fssaiNumber: "",
  licenseExpiresAt: "",

  // Step 4: Compliance Contacts (PHARMACIST_SCHEMA & EMERGENCY_CONTACT_SCHEMA)
  pharmacistName: "",
  pharmacistRegistrationNumber: "",
  pharmacistMobile: "",
  pharmacistEmail: "",
  emergencyContactName: "",
  emergencyContactMobile: "",
  emergencyContactRelationship: "",

  // Operational parameters status flag
  status: "active",
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

const toDateOrNull = (value) => {
  const trimmedValue = normalizeText(value);
  if (!trimmedValue) return null;
  const parsedDate = new Date(trimmedValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
};

const formatIsoToDateString = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const buildBranchPayload = (formData) => {
  return {
    name: normalizeText(formData.branchName),
    type: formData.branchType || "retail",
    isPrimary: toBoolean(formData.isPrimary),
    email: normalizeLowerText(formData.branchEmail) || null,
    status: formData.status || "active",

    phones: {
      mobile: normalizePhone(formData.mobile) || null,
      whatsapp: normalizePhone(formData.whatsapp) || null,
      landline: normalizeText(formData.landline) || null,
    },

    address: {
      addressLine1: normalizeText(formData.addressLine1) || null,
      addressLine2: normalizeText(formData.addressLine2) || null,
      city: normalizeText(formData.city) || null,
      district: normalizeText(formData.district) || null,
      state: normalizeText(formData.state) || null,
      country: normalizeText(formData.country) || "India",
      pincode: normalizeText(formData.pincode) || null,
      googleMapLocation: normalizeText(formData.googleMapLocation) || null,
    },

    license: {
      drugLicenseNumber: normalizeUpperText(formData.drugLicenseNumber) || null,
      drugLicenseType: normalizeText(formData.drugLicenseType) || null,
      fssaiNumber: normalizeText(formData.fssaiNumber) || null,
      expiresAt: toDateOrNull(formData.licenseExpiresAt),
    },

    pharmacist: {
      name: normalizeText(formData.pharmacistName) || null,
      registrationNumber:
        normalizeUpperText(formData.pharmacistRegistrationNumber) || null,
      mobile: normalizePhone(formData.pharmacistMobile) || null,
      email: normalizeLowerText(formData.pharmacistEmail) || null,
    },

    emergencyContact: {
      name: normalizeText(formData.emergencyContactName) || null,
      mobile: normalizePhone(formData.emergencyContactMobile) || null,
      relationship:
        normalizeText(formData.emergencyContactRelationship) || null,
    },
  };
};

const validateStepData = (step, formData) => {
  const errors = {};

  if (step === 1) {
    const branchName = normalizeText(formData.branchName);
    const branchEmail = normalizeLowerText(formData.branchEmail);
    const mobile = normalizePhone(formData.mobile);
    const whatsapp = normalizePhone(formData.whatsapp);

    if (!branchName) {
      errors.branchName = "Branch name is required";
    } else if (branchName.length < 2) {
      errors.branchName = "Branch name must be at least 2 characters";
    } else if (branchName.length > 160) {
      errors.branchName = "Branch name cannot exceed 160 characters";
    }

    if (branchEmail && !EMAIL_REGEX.test(branchEmail)) {
      errors.branchEmail = "Enter a valid branch email address";
    }
    if (mobile && !PHONE_REGEX.test(mobile)) {
      errors.mobile = "Invalid mobile number";
    }
    if (whatsapp && !PHONE_REGEX.test(whatsapp)) {
      errors.whatsapp = "Invalid WhatsApp number";
    }
  }

  if (step === 2) {
    const pincode = normalizeText(formData.pincode);
    if (pincode && pincode.length !== 6) {
      errors.pincode = "Pincode must be exactly 6 digits";
    }
  }

  if (step === 4) {
    const pharmacistMobile = normalizePhone(formData.pharmacistMobile);
    const pharmacistEmail = normalizeLowerText(formData.pharmacistEmail);
    const emergencyContactMobile = normalizePhone(
      formData.emergencyContactMobile,
    );

    if (pharmacistEmail && !EMAIL_REGEX.test(pharmacistEmail)) {
      errors.pharmacistEmail = "Enter a valid pharmacist email";
    }
    if (pharmacistMobile && !PHONE_REGEX.test(pharmacistMobile)) {
      errors.pharmacistMobile = "Invalid pharmacist mobile number";
    }
    if (emergencyContactMobile && !PHONE_REGEX.test(emergencyContactMobile)) {
      errors.emergencyContactMobile = "Invalid emergency contact mobile number";
    }
  }

  return errors;
};

const EditBranchPage = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    getBranchById,
    updateBranch,
    currentBranch,
    getBranchStatus,
    updateBranchStatus,
    error: branchError,
    clearError,
    clearCurrentBranch,
  } = useBranch();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const isDataFetching = getBranchStatus === API_STATUS.LOADING;
  const isSubmitting = updateBranchStatus === API_STATUS.LOADING;

  // FIXED: Separated fetching action from useEffect dependency chain to prevent infinite loops on data reload
  const loadBranchData = useCallback(async () => {
    if (!branchId) return;
    try {
      await getBranchById(branchId);
    } catch {
      setFormErrors({
        submit: "Failed to load branch data configuration parameters.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  useEffect(() => {
    loadBranchData();

    return () => {
      clearCurrentBranch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, loadBranchData]);

  // Map server schema layout structure back into form states exclusively when resource values alter
  useEffect(() => {
    if (currentBranch && currentBranch._id === branchId) {
      setFormData({
        branchName: currentBranch.name || "",
        branchType: currentBranch.type || "retail",
        isPrimary: String(currentBranch.isPrimary ?? false),
        branchEmail: currentBranch.email || "",
        status: currentBranch.status || "active",

        mobile: currentBranch.phones?.mobile || "",
        whatsapp: currentBranch.phones?.whatsapp || "",
        landline: currentBranch.phones?.landline || "",

        addressLine1: currentBranch.address?.addressLine1 || "",
        addressLine2: currentBranch.address?.addressLine2 || "",
        city: currentBranch.address?.city || "",
        district: currentBranch.address?.district || "",
        state: currentBranch.address?.state || "",
        country: currentBranch.address?.country || "India",
        pincode: currentBranch.address?.pincode || "",
        googleMapLocation: currentBranch.address?.googleMapLocation || "",

        drugLicenseNumber: currentBranch.license?.drugLicenseNumber || "",
        drugLicenseType: currentBranch.license?.drugLicenseType || "",
        fssaiNumber: currentBranch.license?.fssaiNumber || "",
        licenseExpiresAt: formatIsoToDateString(
          currentBranch.license?.expiresAt,
        ),

        pharmacistName: currentBranch.pharmacist?.name || "",
        pharmacistRegistrationNumber:
          currentBranch.pharmacist?.registrationNumber || "",
        pharmacistMobile: currentBranch.pharmacist?.mobile || "",
        pharmacistEmail: currentBranch.pharmacist?.email || "",

        emergencyContactName: currentBranch.emergencyContact?.name || "",
        emergencyContactMobile: currentBranch.emergencyContact?.mobile || "",
        emergencyContactRelationship:
          currentBranch.emergencyContact?.relationship || "",
      });
    }
  }, [currentBranch, branchId]);

  const handleFieldChange = useCallback(
    (nameOrEvent, maybeValue) => {
      const isEvent = Boolean(nameOrEvent?.target);
      const name = isEvent ? nameOrEvent.target.name : nameOrEvent;
      const value = isEvent ? nameOrEvent.target.value : maybeValue;

      setFormData((prev) => ({ ...prev, [name]: value }));

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
    },
    [clearError, branchError, formErrors],
  );

  const handleBackToBranches = useCallback(() => {
    navigate("/branches");
  }, [navigate]);

  const handleStepChange = useCallback(
    (step) => {
      if (step <= currentStep) {
        setCurrentStep(step);
        return;
      }

      for (let i = 1; i < step; i++) {
        const stepErrors = validateStepData(i, formData);
        if (Object.keys(stepErrors).length > 0) {
          setFormErrors(stepErrors);
          setCurrentStep(i);
          return;
        }
      }
      setCurrentStep(step);
    },
    [currentStep, formData],
  );

  const handleContinue = useCallback(() => {
    const stepErrors = validateStepData(currentStep, formData);

    if (Object.keys(stepErrors).length > 0) {
      setFormErrors(stepErrors);
      return;
    }

    setFormErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  }, [currentStep, formData]);

  const handleBackStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      handleBackToBranches();
    }
  }, [currentStep, handleBackToBranches]);

  const handleSaveDraft = useCallback(() => {
    setFormErrors({});
    navigate("/branches");
  }, [navigate]);

  const handleSubmit = useCallback(
    async (event) => {
      if (event) event.preventDefault();

      let structuralErrors = {};
      for (let i = 1; i <= 4; i++) {
        structuralErrors = {
          ...structuralErrors,
          ...validateStepData(i, formData),
        };
      }

      if (Object.keys(structuralErrors).length > 0) {
        setFormErrors(structuralErrors);
        if (
          structuralErrors.branchName ||
          structuralErrors.branchEmail ||
          structuralErrors.mobile ||
          structuralErrors.whatsapp
        ) {
          setCurrentStep(1);
        } else if (structuralErrors.pincode) {
          setCurrentStep(2);
        } else if (
          structuralErrors.pharmacistEmail ||
          structuralErrors.pharmacistMobile ||
          structuralErrors.emergencyContactMobile
        ) {
          setCurrentStep(4);
        } else {
          setCurrentStep(3);
        }
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
              : "Unable to update branch properties. Please verify parameters.",
        });
      }
    },
    // FIXED: Removed unstable updateBranch action method dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [branchId, formData, navigate],
  );

  const desktopProps = useMemo(
    () => ({
      formData,
      formErrors,
      isLoading: isSubmitting,
      isDataFetching,
      currentStep,
      branchCode: currentBranch?.branchCode || "",

      branchTypeOptions,
      booleanOptions,
      statusOptions,

      handleChange: handleFieldChange,
      handleSubmit,
      handleBack: handleBackStep,
      handleContinue,
      handleStepChange,
      handleSaveDraft,
      handleCancel: handleBackToBranches,
    }),
    [
      formData,
      formErrors,
      isSubmitting,
      isDataFetching,
      currentStep,
      currentBranch,
      handleFieldChange,
      handleSubmit,
      handleBackStep,
      handleContinue,
      handleStepChange,
      handleSaveDraft,
      handleBackToBranches,
    ],
  );

  return isMobile ? (
    <EditBranchMobilePage {...desktopProps} />
  ) : (
    <EditBranchDesktopPage {...desktopProps} />
  );
};

export default EditBranchPage;
