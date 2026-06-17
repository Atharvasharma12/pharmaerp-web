// src/features/workspace-products/pages/CreateWorkspaceProductPage.jsx

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useWorkspaceProduct from "../hooks/useWorkspaceProduct";
import { CreateWorkspaceProductMobilePage } from "./mobile";
import { CreateWorkspaceProductDesktopPage } from "./desktop";

const INITIAL_FORM_DATA = {
  // Step 1: Core Type and Name Identity Guard
  productType: "medicine",
  name: "",
  force: false,

  // Step 2: Packaging Metrics
  manufacturer: "",
  pack: "",
  qty: "",
  productForm: "",

  // Step 3: Statutory Parameters
  HsnMaster: null,

  // Step 4: Notes
  notes: "",
  status: "active",
};

const normalizeText = (value) => String(value || "").trim();

const validateStepData = (step, formData) => {
  const errors = {};

  if (step === 1) {
    const name = normalizeText(formData.name);
    if (!name) {
      errors.name = "Product name is required";
    } else if (name.length > 300) {
      errors.name = "Product name cannot exceed 300 characters";
    }

    if (!formData.productType) {
      errors.productType = "Product classification type is required";
    }
  }

  if (step === 2) {
    const manufacturer = normalizeText(formData.manufacturer);
    if (manufacturer && manufacturer.length > 300) {
      errors.manufacturer = "Manufacturer name cannot exceed 300 characters";
    }
  }

  if (step === 4) {
    const notes = normalizeText(formData.notes);
    if (notes && notes.length > 2000) {
      errors.notes = "Notes description layer cannot exceed 2000 characters";
    }
  }

  return errors;
};

const CreateWorkspaceProductPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    createWorkspaceProduct,
    searchBeforeCreateWorkspaceProduct,
    createWorkspaceProductStatus,
    searchBeforeCreateStatus,
    searchBeforeCreateResult,
    error: productError,
    clearError,
    clearSearchBeforeCreateResult,
  } = useWorkspaceProduct();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const isLoading = createWorkspaceProductStatus === API_STATUS.LOADING;
  const isSearching = searchBeforeCreateStatus === API_STATUS.LOADING;

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

      if (productError) {
        clearError();
      }
    },
    [clearError, productError, formErrors]
  );

  const handleBackToCatalog = useCallback(() => {
    navigate("/catalog/workspace-products");
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
    [currentStep, formData]
  );

  const handleContinue = useCallback(async () => {
    const stepErrors = validateStepData(currentStep, formData);

    if (Object.keys(stepErrors).length > 0) {
      setFormErrors(stepErrors);
      return;
    }

    setFormErrors({});

    // Step 1: Duplicate Search Interceptor Gate
    if (currentStep === 1 && !formData.force) {
      try {
        const result = await searchBeforeCreateWorkspaceProduct({
          name: normalizeText(formData.name),
          productType: formData.productType,
        });

        if (result?.matched && result?.productSource === "GLOBAL") {
          setDuplicateWarning({
            message: `A highly confident duplicate match (${result.confidence}%) exists in the Global Catalog: "${result.name}". Using master products keeps your ERP synced.`,
            globalProductId: result.productId,
            globalProductName: result.name,
            suggestions: result.suggestions || [],
          });
          // Direct step execution trajectory hold inside interceptor warning states
          return;
        }
      } catch {
        // Fallback execution tracking logic parameters
      }
    }

    setDuplicateWarning(null);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  }, [currentStep, formData, searchBeforeCreateWorkspaceProduct]);

  const handleBypassWarning = useCallback(() => {
    setFormData((prev) => ({ ...prev, force: true }));
    setDuplicateWarning(null);
    setCurrentStep(2);
  }, []);

  const handleBackStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setDuplicateWarning(null);
    } else {
      handleBackToCatalog();
    }
  }, [currentStep, handleBackToCatalog]);

  const handleResetAndRefresh = useCallback(() => {
    setCurrentStep(1);
    setFormErrors({});
    setDuplicateWarning(null);
    setFormData(INITIAL_FORM_DATA);
    clearError();
    clearSearchBeforeCreateResult();
  }, [clearError, clearSearchBeforeCreateResult]);

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
        if (structuralErrors.name || structuralErrors.productType) {
          setCurrentStep(1);
        } else if (structuralErrors.manufacturer) {
          setCurrentStep(2);
        } else if (structuralErrors.notes) {
          setCurrentStep(4);
        } else {
          setCurrentStep(3);
        }
        return;
      }

      try {
        const payload = {
          productType: formData.productType,
          name: normalizeText(formData.name),
          manufacturer: normalizeText(formData.manufacturer) || null,
          pack: normalizeText(formData.pack) || null,
          qty: normalizeText(formData.qty) || null,
          productForm: normalizeText(formData.productForm) || null,
          HsnMaster: formData.HsnMaster || null,
          notes: normalizeText(formData.notes) || null,
          status: formData.status || "active",
          force: formData.force,
        };

        await createWorkspaceProduct(payload);
        navigate("/catalog/workspace-products", { replace: true });
      } catch (error) {
        setFormErrors({
          submit:
            typeof error === "string"
              ? error
              : "Unable to create custom product. Please verify Joi parameters and retry.",
        });
      }
    },
    [createWorkspaceProduct, formData, navigate]
  );

  const pageProps = useMemo(
    () => ({
      formData,
      formErrors,
      isLoading: isLoading || isSearching,
      currentStep,
      duplicateWarning,

      handleChange: handleFieldChange,
      handleSubmit,
      handleBack: handleBackStep,
      handleContinue,
      handleStepChange,
      handleCancel: handleBackToCatalog,
      handleResetAndRefresh,
      handleBypassWarning,
    }),
    [
      formData,
      formErrors,
      isLoading,
      isSearching,
      currentStep,
      duplicateWarning,
      handleFieldChange,
      handleSubmit,
      handleBackStep,
      handleContinue,
      handleStepChange,
      handleBackToCatalog,
      handleResetAndRefresh,
      handleBypassWarning,
    ]
  );

  return isMobile ? (
    <CreateWorkspaceProductMobilePage {...pageProps} />
  ) : (
    <CreateWorkspaceProductDesktopPage {...pageProps} />
  );
};

export default CreateWorkspaceProductPage;