import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useSupplier from "../hooks/useSupplier";
import EditSupplierDesktopPage from "./desktop/EditSupplierDesktopPage";
import EditSupplierMobilePage from "./mobile/EditSupplierMobilePage";

const INITIAL_FORM_DATA = {
  // Step 1: Supplier Profile
  businessName: "",
  supplierType: "distributor",
  mobile: "",
  alternateMobile: "",
  email: "",
  status: "active",

  // Step 2: Address
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingCity: "",
  billingDistrict: "",
  billingState: "",
  billingCountry: "India",
  billingPincode: "",

  // Step 3: Financial & Credit
  creditDays: 0,
  openingBalance: 0,
  openingBalanceType: "cr",

  // Step 4: Identity & Notes
  gstNumber: "",
  panNumber: "",
  drugLicenseNumber: "",
  notes: "",
};

const supplierTypeOptions = [
  { label: "Manufacturer", value: "manufacturer" },
  { label: "Distributor", value: "distributor" },
  { label: "Wholesaler", value: "wholesaler" },
  { label: "Local Vendor", value: "local_vendor" },
  { label: "Other", value: "other" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Blocked", value: "blocked" },
];

const balanceTypeOptions = [
  { label: "Debit (Dr)", value: "dr" },
  { label: "Credit (Cr)", value: "cr" },
];

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const PHONE_REGEX = /^[6-9][0-9]{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeText = (value) => String(value || "").trim();
const normalizeUpperText = (value) => normalizeText(value).toUpperCase();
const normalizeLowerText = (value) => normalizeText(value).toLowerCase();
const normalizePhone = (value) => normalizeText(value).replace(/\D/g, "");

const buildSupplierPayload = (formData) => {
  const address = {
    addressLine1: normalizeText(formData.billingAddressLine1) || null,
    addressLine2: normalizeText(formData.billingAddressLine2) || null,
    city: normalizeText(formData.billingCity) || null,
    district: normalizeText(formData.billingDistrict) || null,
    state: normalizeText(formData.billingState) || null,
    country: normalizeText(formData.billingCountry) || "India",
    pincode: normalizeText(formData.billingPincode) || null,
  };

  return {
    businessName: normalizeText(formData.businessName),
    supplierType: formData.supplierType || "distributor",
    mobile: normalizePhone(formData.mobile) || null,
    alternateMobile: normalizePhone(formData.alternateMobile) || null,
    email: normalizeLowerText(formData.email) || null,
    status: formData.status || "active",
    
    address,

    creditDays: Number(formData.creditDays) || 0,
    openingBalance: Number(formData.openingBalance) || 0,
    openingBalanceType: formData.openingBalanceType || "cr",

    gstNumber: normalizeUpperText(formData.gstNumber) || null,
    panNumber: normalizeUpperText(formData.panNumber) || null,
    drugLicenseNumber: normalizeUpperText(formData.drugLicenseNumber) || null,
    notes: normalizeText(formData.notes) || null,
  };
};

const validateStepData = (step, formData) => {
  const errors = {};

  if (step === 1) {
    const businessName = normalizeText(formData.businessName);
    const email = normalizeLowerText(formData.email);
    const mobile = normalizePhone(formData.mobile);
    const alternateMobile = normalizePhone(formData.alternateMobile);

    if (!businessName) {
      errors.businessName = "Business name is required";
    } else if (businessName.length < 2) {
      errors.businessName = "Business name must be at least 2 characters";
    } else if (businessName.length > 200) {
      errors.businessName = "Business name cannot exceed 200 characters";
    }

    if (!formData.supplierType) {
      errors.supplierType = "Supplier type is required";
    }

    if (email && !EMAIL_REGEX.test(email)) {
      errors.email = "Enter a valid email address";
    }

    if (mobile && !PHONE_REGEX.test(mobile)) {
      errors.mobile = "Invalid mobile number";
    }

    if (alternateMobile && !PHONE_REGEX.test(alternateMobile)) {
      errors.alternateMobile = "Invalid alternate mobile number";
    }
  }

  if (step === 2) {
    const billingPincode = normalizeText(formData.billingPincode);
    if (billingPincode && billingPincode.length !== 6) {
      errors.billingPincode = "Pincode must be exactly 6 digits";
    }
  }

  if (step === 3) {
    const creditDays = Number(formData.creditDays);
    const openingBalance = Number(formData.openingBalance);

    if (creditDays < 0) {
      errors.creditDays = "Credit days cannot be negative";
    }
    if (openingBalance < 0) {
      errors.openingBalance = "Opening balance cannot be negative";
    }
  }

  if (step === 4) {
    const gstNumber = normalizeUpperText(formData.gstNumber);
    const panNumber = normalizeUpperText(formData.panNumber);

    if (gstNumber && !GSTIN_REGEX.test(gstNumber)) {
      errors.gstNumber = "Invalid GSTIN format";
    }
    if (panNumber && !PAN_REGEX.test(panNumber)) {
      errors.panNumber = "Invalid PAN format";
    }
  }

  return errors;
};

const EditSupplierPage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    getSupplierById,
    updateSupplier,
    getSupplierStatus,
    updateSupplierStatus,
    clearCurrentSupplier,
    error: supplierError,
    clearError,
  } = useSupplier();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const isLoading = updateSupplierStatus === API_STATUS.LOADING;
  const isFetching = getSupplierStatus === API_STATUS.LOADING;

  const loadSupplierData = useCallback(async () => {
    if (!supplierId) return;
    try {
      const data = await getSupplierById(supplierId);
      if (data) {
        setFormData({
          businessName: data.businessName || "",
          supplierType: data.supplierType || "distributor",
          mobile: data.mobile || "",
          alternateMobile: data.alternateMobile || "",
          email: data.email || "",
          status: data.status || "active",

          billingAddressLine1: data.address?.addressLine1 || "",
          billingAddressLine2: data.address?.addressLine2 || "",
          billingCity: data.address?.city || "",
          billingDistrict: data.address?.district || "",
          billingState: data.address?.state || "",
          billingCountry: data.address?.country || "India",
          billingPincode: data.address?.pincode || "",

          creditDays: data.creditDays || 0,
          openingBalance: data.openingBalance || 0,
          openingBalanceType: data.openingBalanceType || "cr",

          gstNumber: data.gstNumber || "",
          panNumber: data.panNumber || "",
          drugLicenseNumber: data.drugLicenseNumber || "",
          notes: data.notes || "",
        });
      }
    } catch {
      setFormErrors({
        submit: "Unable to retrieve supplier record. Returning to supplier list.",
      });
      setTimeout(() => {
        navigate("/parties/suppliers");
      }, 2500);
    }
  }, [supplierId, getSupplierById, navigate]);

  useEffect(() => {
    loadSupplierData();
  }, [supplierId, loadSupplierData]);

  useEffect(() => {
    return () => {
      clearCurrentSupplier();
    };
  }, [clearCurrentSupplier]);

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

      if (supplierError) {
        clearError();
      }
    },
    [clearError, supplierError, formErrors],
  );

  const handleBackToSuppliers = useCallback(() => {
    navigate("/parties/suppliers");
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
      handleBackToSuppliers();
    }
  }, [currentStep, handleBackToSuppliers]);

  const handleSaveDraft = useCallback(() => {
    setFormErrors({});
    navigate("/parties/suppliers");
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
          structuralErrors.businessName ||
          structuralErrors.supplierType ||
          structuralErrors.mobile ||
          structuralErrors.email
        ) {
          setCurrentStep(1);
        } else if (structuralErrors.billingPincode) {
          setCurrentStep(2);
        } else if (
          structuralErrors.creditDays ||
          structuralErrors.openingBalance
        ) {
          setCurrentStep(3);
        } else {
          setCurrentStep(4);
        }
        return;
      }

      try {
        const payload = buildSupplierPayload(formData);
        await updateSupplier(supplierId, payload);
        navigate("/parties/suppliers", { replace: true });
      } catch (error) {
        setFormErrors({
          submit:
            typeof error === "string"
              ? error
              : "Unable to update supplier profile. Please try again.",
        });
      }
    },
    [supplierId, formData, navigate, updateSupplier],
  );

  const pageProps = useMemo(
    () => ({
      formData,
      formErrors,
      isLoading,
      isFetching,
      currentStep,

      supplierTypeOptions,
      statusOptions,
      balanceTypeOptions,

      handleChange: handleFieldChange,
      handleSubmit,
      handleBack: handleBackStep,
      handleContinue,
      handleStepChange,
      handleSaveDraft,
      handleCancel: handleBackToSuppliers,
      handleResetAndRefresh: loadSupplierData,
    }),
    [
      formData,
      formErrors,
      isLoading,
      isFetching,
      currentStep,
      handleFieldChange,
      handleSubmit,
      handleBackStep,
      handleContinue,
      handleStepChange,
      handleSaveDraft,
      handleBackToSuppliers,
      loadSupplierData,
    ],
  );

  return isMobile ? (
    <EditSupplierMobilePage {...pageProps} />
  ) : (
    <EditSupplierDesktopPage {...pageProps} />
  );
};

export default EditSupplierPage;

