import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useHsnMaster from "@/features/hsn-master/hooks/useHsnMaster";
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
  HsnMaster: "", // Stores selected HSN _id string matching select choices

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

  // Persistent tracking reference to prevent circular network fetch bursts
  const hsnFetchedRef = useRef(false);

  const {
    createWorkspaceProduct,
    searchBeforeCreateWorkspaceProduct,
    createWorkspaceProductStatus,
    searchBeforeCreateStatus,
    error: productError,
    clearError,
    clearSearchBeforeCreateResult,
  } = useWorkspaceProduct();

  // Relational catalog lookup hooks mapping
  const { hsnMasters, getHsnMastersStatus, getHsnMasters, clearHsnMasters } =
    useHsnMaster();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const isLoading = createWorkspaceProductStatus === API_STATUS.LOADING;
  const isSearching = searchBeforeCreateStatus === API_STATUS.LOADING;
  const isHsnLoading = getHsnMastersStatus === API_STATUS.LOADING;

  // Controlled execution block fetching options cleanly once upon entering step 3
  useEffect(() => {
    if (currentStep === 3) {
      if (!hsnFetchedRef.current) {
        hsnFetchedRef.current = true;
        getHsnMasters({
          isActive: true,
          page: 1,
          limit: 100,
        });
      }
    } else {
      // Reset the fetch guard trail reference if the user steps backward or forwards
      hsnFetchedRef.current = false;
    }
  }, [currentStep, getHsnMasters]);

  // Map raw HSN data records into cleanly formatted select dropdown items
  const formattedHsnOptions = useMemo(() => {
    const baseOptions = [
      { label: "Select an HSN / SAC Code rule...", value: "" },
    ];

    if (!Array.isArray(hsnMasters)) return baseOptions;

    const mapped = hsnMasters.map((hsn) => {
      const rateLabel = hsn.gstRate !== null ? `${hsn.gstRate}% GST` : "Exempt";
      const descLabel = hsn.description
        ? ` - ${hsn.description.substring(0, 45)}...`
        : "";
      return {
        label: `Code ${hsn.code} (${rateLabel})${descLabel}`,
        value: hsn._id,
      };
    });

    return [...baseOptions, ...mapped];
  }, [hsnMasters]);

  // Resolve selected active entity details dynamically for review preview indicators
  const selectedHsnDetail = useMemo(() => {
    if (!formData.HsnMaster || !Array.isArray(hsnMasters)) return null;
    return hsnMasters.find((h) => h._id === formData.HsnMaster) || null;
  }, [formData.HsnMaster, hsnMasters]);

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
    [clearError, productError, formErrors],
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
    [currentStep, formData],
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
          return;
        }
      } catch {
        // Fallback catch logs block
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
    hsnFetchedRef.current = false;
    setCurrentStep(1);
    setFormErrors({});
    setDuplicateWarning(null);
    setFormData(INITIAL_FORM_DATA);
    clearError();
    clearHsnMasters();
    clearSearchBeforeCreateResult();
  }, [clearError, clearHsnMasters, clearSearchBeforeCreateResult]);

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
              : "Unable to create custom product. Please verify parameters and retry.",
        });
      }
    },
    [createWorkspaceProduct, formData, navigate],
  );

  const pageProps = useMemo(
    () => ({
      formData,
      formErrors,
      isLoading: isLoading || isSearching || isHsnLoading,
      currentStep,
      duplicateWarning,
      hsnOptions: formattedHsnOptions,
      selectedHsnDetail,

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
      isHsnLoading,
      currentStep,
      duplicateWarning,
      formattedHsnOptions,
      selectedHsnDetail,
      handleFieldChange,
      handleSubmit,
      handleBackStep,
      handleContinue,
      handleStepChange,
      handleBackToCatalog,
      handleResetAndRefresh,
      handleBypassWarning,
    ],
  );

  return isMobile ? (
    <CreateWorkspaceProductMobilePage {...pageProps} />
  ) : (
    <CreateWorkspaceProductDesktopPage {...pageProps} />
  );
};

export default CreateWorkspaceProductPage;
