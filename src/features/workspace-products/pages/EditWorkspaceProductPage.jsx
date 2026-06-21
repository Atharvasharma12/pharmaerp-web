import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useHsnMaster from "@/features/hsn-master/hooks/useHsnMaster";
import useCategoryMaster from "@/features/category-master/hooks/useCategoryMaster";
import useManufacturerMaster from "@/features/manufacturer-master/hooks/useManufacturerMaster";
import useUomMaster from "@/features/uom-master/hooks/useUomMaster";
import useProductFormMaster from "@/features/product-form-master/hooks/useProductFormMaster";
import useSaltMaster from "@/features/salt-master/hooks/useSaltMaster";
import useWorkspaceProduct from "../hooks/useWorkspaceProduct";

import EditWorkspaceProductDesktopPage from "./desktop/EditWorkspaceProductDesktopPage";
import EditWorkspaceProductMobilePage from "./mobile/EditWorkspaceProductMobilePage";

const INITIAL_FORM_DATA = {
  // Immutable Core Properties (Display only during update)
  productType: "medicine",
  workspaceProductCode: "",

  // Mutable Fields (Allowed parameters per Joi Update Schema)
  name: "",
  manufacturer: "",
  category: "",
  pack: "",
  composition: [],
  uom: "",
  productForm: "",
  HsnMaster: "", // Mapped string identifier choice path
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
      errors.notes = "Notes layer cannot exceed 2000 characters";
    }
  }

  return errors;
};

const EditWorkspaceProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  // Persistent tracking reference to prevent circular network fetch loops
  const hsnFetchedRef = useRef(false);

  const {
    getWorkspaceProductById,
    updateWorkspaceProduct,
    updateWorkspaceProductStatus,
    getWorkspaceProductStatus,
    clearCurrentWorkspaceProduct,
    error: productError,
    clearError,
  } = useWorkspaceProduct();

  // Relational catalog lookup hooks mapping
  const { hsnMasters, getHsnMastersStatus, getHsnMasters, clearHsnMasters } =
    useHsnMaster();
  const { categoryMasters, getCategoryMasters, clearCategoryMasters } = useCategoryMaster();
  const { manufacturerMasters, getManufacturerMasters, clearManufacturerMasters } = useManufacturerMaster();
  const { uomMasters, getUomMasters, clearUomMasters } = useUomMaster();
  const { productFormMasters, getProductFormMasters, clearProductFormMasters } = useProductFormMaster();
  const { saltMasters, getSaltMasters, clearSaltMasters } = useSaltMaster();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const isLoading = updateWorkspaceProductStatus === API_STATUS.LOADING;
  const isFetching = getWorkspaceProductStatus === API_STATUS.LOADING;
  const isHsnLoading = getHsnMastersStatus === API_STATUS.LOADING;

  const step2FetchedRef = useRef(false);

  const loadWorkspaceProductData = useCallback(async () => {
    if (!productId) return;

    try {
      const data = await getWorkspaceProductById(productId);
      if (data) {
        setFormData({
          productType: data.productType || "medicine",
          workspaceProductCode: data.workspaceProductCode || "",
          name: data.name || "",
          manufacturer: data.manufacturer?._id || data.manufacturer || "",
          category: data.category?._id || data.category || "",
          pack: data.pack || "",
          composition: (data.composition || []).map((c) => ({
            salt: c.salt?._id || c.salt || "",
            strength: c.strength !== undefined && c.strength !== null ? c.strength : "",
            unit: c.unit || "mg",
          })),
          uom: data.uom?._id || data.uom || "",
          productForm: data.productForm?._id || data.productForm || "",
          HsnMaster: data.HsnMaster?._id || data.HsnMaster || "",
          notes: data.notes || "",
          status: data.status || "active",
        });
      }
    } catch {
      setFormErrors({
        submit:
          "Unable to retrieve database record files. Returning to summary catalog.",
      });
      setTimeout(() => {
        navigate("/catalog/workspace-products");
      }, 2500);
    }
  }, [productId, getWorkspaceProductById, navigate]);

  // Combined cleanup and initialization lifecycle run-once effect gate
  useEffect(() => {
    clearError();

    if (!hasFetchedRef.current && productId) {
      hasFetchedRef.current = true;
      loadWorkspaceProductData();
    }

    return () => {
      clearCurrentWorkspaceProduct();
      clearHsnMasters();
      clearCategoryMasters();
      clearManufacturerMasters();
      clearUomMasters();
      clearProductFormMasters();
      clearSaltMasters();
    };
    // Standard initialization rules enforce single initial invocation loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Controlled execution block fetching options cleanly once upon entering step 2
  useEffect(() => {
    if (currentStep === 2) {
      if (!step2FetchedRef.current) {
        step2FetchedRef.current = true;
        getCategoryMasters({ isActive: true, page: 1, limit: 100 });
        getManufacturerMasters({ isActive: true, page: 1, limit: 100 });
        getUomMasters({ isActive: true, page: 1, limit: 100 });
        getProductFormMasters({ isActive: true, page: 1, limit: 100 });
        getSaltMasters({ isActive: true, page: 1, limit: 100 });
      }
    } else {
      step2FetchedRef.current = false;
    }
  }, [currentStep, getCategoryMasters, getManufacturerMasters, getUomMasters, getProductFormMasters, getSaltMasters]);

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
      // Reset the fetch guard trail reference if the user steps away from step 3
      hsnFetchedRef.current = false;
    }
  }, [currentStep, getHsnMasters]);

  // Map raw HSN records into cleanly formatted select dropdown items
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

  // Options arrays for Step 2
  const formattedManufacturerOptions = useMemo(() => {
    const baseOptions = [{ label: "Select a Manufacturer...", value: "" }];
    if (!Array.isArray(manufacturerMasters)) return baseOptions;
    return [
      ...baseOptions,
      ...manufacturerMasters.map((m) => ({ label: m.name, value: m._id })),
    ];
  }, [manufacturerMasters]);

  const formattedCategoryOptions = useMemo(() => {
    const baseOptions = [{ label: "Select a Category...", value: "" }];
    if (!Array.isArray(categoryMasters)) return baseOptions;
    return [
      ...baseOptions,
      ...categoryMasters.map((c) => ({ label: `${c.name} (${c.level})`, value: c._id })),
    ];
  }, [categoryMasters]);

  const formattedUomOptions = useMemo(() => {
    const baseOptions = [{ label: "Select a Unit of Measure...", value: "" }];
    if (!Array.isArray(uomMasters)) return baseOptions;
    return [
      ...baseOptions,
      ...uomMasters.map((u) => ({ label: `${u.name} (${u.abbreviation})`, value: u._id })),
    ];
  }, [uomMasters]);

  const formattedProductFormOptions = useMemo(() => {
    const baseOptions = [{ label: "Select a Product Form...", value: "" }];
    if (!Array.isArray(productFormMasters)) return baseOptions;
    return [
      ...baseOptions,
      ...productFormMasters.map((f) => ({ label: f.name, value: f._id })),
    ];
  }, [productFormMasters]);

  const formattedSaltOptions = useMemo(() => {
    const baseOptions = [{ label: "Select a Salt...", value: "" }];
    if (!Array.isArray(saltMasters)) return baseOptions;
    return [
      ...baseOptions,
      ...saltMasters.map((s) => ({ label: s.name, value: s._id })),
    ];
  }, [saltMasters]);

  const selectedCompositionDetails = useMemo(() => {
    if (!Array.isArray(formData.composition) || !Array.isArray(saltMasters)) return [];
    return formData.composition.map((item) => {
      const saltObj = saltMasters.find((s) => s._id === item.salt);
      return {
        salt: item.salt,
        saltName: saltObj ? saltObj.name : "Unknown Salt",
        strength: item.strength,
        unit: item.unit,
      };
    });
  }, [formData.composition, saltMasters]);

  // Resolve selected active entity metadata details dynamically for step 5 card preview summary lookups
  const selectedHsnDetail = useMemo(() => {
    if (!formData.HsnMaster || !Array.isArray(hsnMasters)) return null;
    return hsnMasters.find((h) => h._id === formData.HsnMaster) || null;
  }, [formData.HsnMaster, hsnMasters]);

  const selectedManufacturerDetail = useMemo(() => {
    if (!formData.manufacturer || !Array.isArray(manufacturerMasters)) return null;
    return manufacturerMasters.find((m) => m._id === formData.manufacturer) || null;
  }, [formData.manufacturer, manufacturerMasters]);

  const selectedCategoryDetail = useMemo(() => {
    if (!formData.category || !Array.isArray(categoryMasters)) return null;
    return categoryMasters.find((c) => c._id === formData.category) || null;
  }, [formData.category, categoryMasters]);

  const selectedUomDetail = useMemo(() => {
    if (!formData.uom || !Array.isArray(uomMasters)) return null;
    return uomMasters.find((u) => u._id === formData.uom) || null;
  }, [formData.uom, uomMasters]);

  const selectedProductFormDetail = useMemo(() => {
    if (!formData.productForm || !Array.isArray(productFormMasters)) return null;
    return productFormMasters.find((f) => f._id === formData.productForm) || null;
  }, [formData.productForm, productFormMasters]);

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

  const handleContinue = useCallback(() => {
    const stepErrors = validateStepData(currentStep, formData);

    if (Object.keys(stepErrors).length > 0) {
      setFormErrors(stepErrors);
      return;
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, formData]);

  const handleBackStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      handleBackToCatalog();
    }
  }, [currentStep, handleBackToCatalog]);

  const handleSaveDraft = useCallback(() => {
    setFormErrors({});
    navigate("/catalog/workspace-products");
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
        if (structuralErrors.name) {
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
          name: normalizeText(formData.name),
          manufacturer: formData.manufacturer || null,
          category: formData.category || null,
          pack: normalizeText(formData.pack) || null,
          composition: (formData.composition || []).map((c) => ({
            salt: c.salt,
            strength: Number(c.strength),
            unit: c.unit,
          })),
          uom: formData.uom || null,
          productForm: formData.productForm || null,
          HsnMaster: formData.HsnMaster || null,
          notes: normalizeText(formData.notes) || null,
          status: formData.status || "active",
        };

        await updateWorkspaceProduct(productId, payload);
        navigate("/catalog/workspace-products", { replace: true });
      } catch (error) {
        setFormErrors({
          submit:
            typeof error === "string"
              ? error
              : "Unable to commit changes to the backend model layers. Retry.",
        });
      }
    },
    [productId, updateWorkspaceProduct, formData, navigate],
  );

  const pageProps = useMemo(
    () => ({
      formData,
      formErrors,
      isLoading: isLoading || isHsnLoading,
      isFetching,
      currentStep,
      hsnOptions: formattedHsnOptions,
      selectedHsnDetail,
      manufacturerOptions: formattedManufacturerOptions,
      categoryOptions: formattedCategoryOptions,
      uomOptions: formattedUomOptions,
      productFormOptions: formattedProductFormOptions,
      saltOptions: formattedSaltOptions,
      selectedManufacturerDetail,
      selectedCategoryDetail,
      selectedUomDetail,
      selectedProductFormDetail,
      selectedCompositionDetails,

      handleChange: handleFieldChange,
      handleSubmit,
      handleBack: handleBackStep,
      handleContinue,
      handleStepChange,
      handleSaveDraft,
      handleCancel: handleBackToCatalog,
      handleReload: loadWorkspaceProductData,
    }),
    [
      formData,
      formErrors,
      isLoading,
      isHsnLoading,
      isFetching,
      currentStep,
      formattedHsnOptions,
      selectedHsnDetail,
      formattedManufacturerOptions,
      formattedCategoryOptions,
      formattedUomOptions,
      formattedProductFormOptions,
      formattedSaltOptions,
      selectedManufacturerDetail,
      selectedCategoryDetail,
      selectedUomDetail,
      selectedProductFormDetail,
      selectedCompositionDetails,
      handleFieldChange,
      handleSubmit,
      handleBackStep,
      handleContinue,
      handleStepChange,
      handleSaveDraft,
      handleBackToCatalog,
      loadWorkspaceProductData,
    ],
  );

  return isMobile ? (
    <EditWorkspaceProductMobilePage {...pageProps} />
  ) : (
    <EditWorkspaceProductDesktopPage {...pageProps} />
  );
};

export default EditWorkspaceProductPage;
