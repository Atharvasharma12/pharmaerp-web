// src/features/parties/customers/pages/CreateCustomerPage.jsx

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCustomer from "../hooks/useCustomer";
import CreateCustomerDesktopPage from "./desktop/CreateCustomerDesktopPage";
import CreateCustomerMobilePage from "./mobile/CreateCustomerMobilePage";

const INITIAL_FORM_DATA = {
  // Step 1: Customer Profile
  name: "",
  customerType: "retail",
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
  
  sameAsBilling: false,

  shippingAddressLine1: "",
  shippingAddressLine2: "",
  shippingCity: "",
  shippingDistrict: "",
  shippingState: "",
  shippingCountry: "India",
  shippingPincode: "",

  // Step 3: Financial & Credit
  creditLimit: 0,
  creditDays: 0,
  openingBalance: 0,
  openingBalanceType: "dr",

  // Step 4: Identity & Notes
  gstNumber: "",
  panNumber: "",
  drugLicenseNumber: "",
  notes: "",
};

const customerTypeOptions = [
  { label: "Retail", value: "retail" },
  { label: "Wholesale", value: "wholesale" },
  { label: "Hospital", value: "hospital" },
  { label: "Clinic", value: "clinic" },
  { label: "Corporate", value: "corporate" },
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

const buildCustomerPayload = (formData) => {
  const billing = {
    addressLine1: normalizeText(formData.billingAddressLine1) || null,
    addressLine2: normalizeText(formData.billingAddressLine2) || null,
    city: normalizeText(formData.billingCity) || null,
    district: normalizeText(formData.billingDistrict) || null,
    state: normalizeText(formData.billingState) || null,
    country: normalizeText(formData.billingCountry) || "India",
    pincode: normalizeText(formData.billingPincode) || null,
  };

  const shipping = formData.sameAsBilling
    ? { ...billing }
    : {
        addressLine1: normalizeText(formData.shippingAddressLine1) || null,
        addressLine2: normalizeText(formData.shippingAddressLine2) || null,
        city: normalizeText(formData.shippingCity) || null,
        district: normalizeText(formData.shippingDistrict) || null,
        state: normalizeText(formData.shippingState) || null,
        country: normalizeText(formData.shippingCountry) || "India",
        pincode: normalizeText(formData.shippingPincode) || null,
      };

  return {
    name: normalizeText(formData.name),
    customerType: formData.customerType || "retail",
    mobile: normalizePhone(formData.mobile) || null,
    alternateMobile: normalizePhone(formData.alternateMobile) || null,
    email: normalizeLowerText(formData.email) || null,
    status: formData.status || "active",
    
    billingAddress: billing,
    shippingAddress: shipping,

    creditLimit: Number(formData.creditLimit) || 0,
    creditDays: Number(formData.creditDays) || 0,
    openingBalance: Number(formData.openingBalance) || 0,
    openingBalanceType: formData.openingBalanceType || "dr",

    gstNumber: normalizeUpperText(formData.gstNumber) || null,
    panNumber: normalizeUpperText(formData.panNumber) || null,
    drugLicenseNumber: normalizeUpperText(formData.drugLicenseNumber) || null,
    notes: normalizeText(formData.notes) || null,
  };
};

const validateStepData = (step, formData) => {
  const errors = {};

  if (step === 1) {
    const name = normalizeText(formData.name);
    const email = normalizeLowerText(formData.email);
    const mobile = normalizePhone(formData.mobile);
    const alternateMobile = normalizePhone(formData.alternateMobile);

    if (!name) {
      errors.name = "Customer name is required";
    } else if (name.length < 2) {
      errors.name = "Customer name must be at least 2 characters";
    } else if (name.length > 160) {
      errors.name = "Customer name cannot exceed 160 characters";
    }

    if (!formData.customerType) {
      errors.customerType = "Customer type is required";
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
    const shippingPincode = normalizeText(formData.shippingPincode);

    if (billingPincode && billingPincode.length !== 6) {
      errors.billingPincode = "Pincode must be exactly 6 digits";
    }
    if (!formData.sameAsBilling && shippingPincode && shippingPincode.length !== 6) {
      errors.shippingPincode = "Pincode must be exactly 6 digits";
    }
  }

  if (step === 3) {
    const creditLimit = Number(formData.creditLimit);
    const creditDays = Number(formData.creditDays);
    const openingBalance = Number(formData.openingBalance);

    if (creditLimit < 0) {
      errors.creditLimit = "Credit limit cannot be negative";
    }
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

const CreateCustomerPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    createCustomer,
    createCustomerStatus,
    error: customerError,
    clearError,
  } = useCustomer();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const isLoading = createCustomerStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback(
    (nameOrEvent, maybeValue) => {
      const isEvent = Boolean(nameOrEvent?.target);
      const name = isEvent ? nameOrEvent.target.name : nameOrEvent;
      const value = isEvent ? nameOrEvent.target.value : maybeValue;

      setFormData((prev) => {
        const nextData = { ...prev, [name]: value };

        // Auto copy if sameAsBilling is toggled
        if (name === "sameAsBilling" && value === true) {
          nextData.shippingAddressLine1 = prev.billingAddressLine1;
          nextData.shippingAddressLine2 = prev.billingAddressLine2;
          nextData.shippingCity = prev.billingCity;
          nextData.shippingDistrict = prev.billingDistrict;
          nextData.shippingState = prev.billingState;
          nextData.shippingCountry = prev.billingCountry;
          nextData.shippingPincode = prev.billingPincode;
        }

        return nextData;
      });

      if (formErrors[name] || formErrors.submit) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
          submit: "",
        }));
      }

      if (customerError) {
        clearError();
      }
    },
    [clearError, customerError, formErrors],
  );

  const handleBackToCustomers = useCallback(() => {
    navigate("/parties/customers");
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
      handleBackToCustomers();
    }
  }, [currentStep, handleBackToCustomers]);

  const handleSaveDraft = useCallback(() => {
    setFormErrors({});
    navigate("/parties/customers");
  }, [navigate]);

  const handleResetAndRefresh = useCallback(() => {
    setCurrentStep(1);
    setFormErrors({});
    setFormData(INITIAL_FORM_DATA);
    clearError();
  }, [clearError]);

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
          structuralErrors.name ||
          structuralErrors.customerType ||
          structuralErrors.mobile ||
          structuralErrors.email
        ) {
          setCurrentStep(1);
        } else if (structuralErrors.billingPincode || structuralErrors.shippingPincode) {
          setCurrentStep(2);
        } else if (
          structuralErrors.creditLimit ||
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
        const payload = buildCustomerPayload(formData);
        await createCustomer(payload);
        navigate("/parties/customers", { replace: true });
      } catch (error) {
        setFormErrors({
          submit:
            typeof error === "string"
              ? error
              : "Unable to create customer profile. Please try again.",
        });
      }
    },
    [createCustomer, formData, navigate],
  );

  const pageProps = useMemo(
    () => ({
      formData,
      formErrors,
      isLoading,
      currentStep,

      customerTypeOptions,
      statusOptions,
      balanceTypeOptions,

      handleChange: handleFieldChange,
      handleSubmit,
      handleBack: handleBackStep,
      handleContinue,
      handleStepChange,
      handleSaveDraft,
      handleCancel: handleBackToCustomers,
      handleResetAndRefresh,
    }),
    [
      formData,
      formErrors,
      isLoading,
      currentStep,
      handleFieldChange,
      handleSubmit,
      handleBackStep,
      handleContinue,
      handleStepChange,
      handleSaveDraft,
      handleBackToCustomers,
      handleResetAndRefresh,
    ],
  );

  return isMobile ? (
    <CreateCustomerMobilePage {...pageProps} />
  ) : (
    <CreateCustomerDesktopPage {...pageProps} />
  );
};

export default CreateCustomerPage;
