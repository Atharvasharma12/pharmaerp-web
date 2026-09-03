// src/features/parties/suppliers/pages/SuppliersPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppConfirmModal } from "@/components";

import useSupplier from "../hooks/useSupplier";
import useCompany from "@/features/company/hooks/useCompany";
import SuppliersMobilePage from "./mobile/SuppliersMobilePage";
import SuppliersDesktopPage from "./desktop/SuppliersDesktopPage";

const initialFilters = {
  search: "",
  status: "all",
  type: "all",
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatSupplierType = (type) => {
  if (!type) return "Distributor";
  return String(type)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const mapSupplierForView = (supplier) => {
  return {
    ...supplier,
    id: supplier?._id,
    displayName: supplier?.businessName || "",
    displayCode: supplier?.supplierCode || "",
    displayType: formatSupplierType(supplier?.supplierType || supplier?.type),
    displayMobile: supplier?.mobile || "",
    displayEmail: supplier?.email || "",
    displayStatus: supplier?.status || "Active",
    displayCreatedAt: formatDate(supplier?.createdAt),
    displayUpdatedAt: formatDate(supplier?.updatedAt),
  };
};

const SuppliersPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { currentCompany } = useCompany();
  const companyId = currentCompany?._id;

  const {
    suppliers,
    getSuppliers,
    deleteSupplier,
    getSuppliersStatus,
    deleteSupplierStatus,
    error,
    message,
    clearError,
    clearMessage,
  } = useSupplier();

  const [filters, setFilters] = useState(initialFilters);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const isLoading = getSuppliersStatus === API_STATUS.LOADING;
  const isDeleting = deleteSupplierStatus === API_STATUS.LOADING;
  const hasError = getSuppliersStatus === API_STATUS.ERROR;

  const fetchSuppliers = useCallback(async () => {
    try {
      await getSuppliers();
    } catch {
      // Regulated by store selectors
    }
  }, [getSuppliers]);

  useEffect(() => {
    if (!companyId) return;
    fetchSuppliers();
  }, [fetchSuppliers, companyId]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [message, clearMessage]);

  const mappedSuppliers = useMemo(
    () => (Array.isArray(suppliers) ? suppliers : []).map(mapSupplierForView),
    [suppliers],
  );

  const filteredSuppliers = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedSuppliers.filter((supplier) => {
      const matchesSearch =
        !search ||
        normalizeText(supplier.displayName).includes(search) ||
        normalizeText(supplier.displayCode).includes(search) ||
        normalizeText(supplier.displayEmail).includes(search) ||
        normalizeText(supplier.displayMobile).includes(search);

      const matchesStatus =
        filters.status === "all" || normalizeText(supplier.status) === normalizeText(filters.status);

      const matchesType =
        filters.type === "all" || normalizeText(supplier.supplierType || supplier.type) === normalizeText(filters.type);

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [mappedSuppliers, filters]);

  const stats = useMemo(() => {
    const total = mappedSuppliers.length;
    const active = mappedSuppliers.filter((c) => normalizeText(c.status) === "active").length;
    const inactive = mappedSuppliers.filter((c) => normalizeText(c.status) === "inactive").length;
    const blocked = mappedSuppliers.filter((c) => normalizeText(c.status) === "blocked").length;

    return {
      total,
      active,
      inactive,
      blocked,
    };
  }, [mappedSuppliers]);

  const typeDistribution = useMemo(() => {
    const total = mappedSuppliers.length || 1;
    const counts = {
      manufacturer: 0,
      distributor: 0,
      wholesaler: 0,
      local_vendor: 0,
      other: 0,
    };

    mappedSuppliers.forEach((sup) => {
      const t = normalizeText(sup.supplierType || sup.type);
      if (counts[t] !== undefined) {
        counts[t] += 1;
      } else {
        counts.other += 1;
      }
    });

    return [
      { name: "Manufacturer", count: counts.manufacturer, color: "#a855f7", percent: Math.round((counts.manufacturer / total) * 100) },
      { name: "Distributor", count: counts.distributor, color: "#16a34a", percent: Math.round((counts.distributor / total) * 100) },
      { name: "Wholesaler", count: counts.wholesaler, color: "#2563eb", percent: Math.round((counts.wholesaler / total) * 100) },
      { name: "Local Vendor", count: counts.local_vendor, color: "#eab308", percent: Math.round((counts.local_vendor / total) * 100) },
      { name: "Other", count: counts.other, color: "#6b7280", percent: Math.round((counts.other / total) * 100) },
    ];
  }, [mappedSuppliers]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label: `Status: ${filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}`,
      });
    }
    if (filters.type !== "all") {
      chips.push({
        key: "type",
        label: `Type: ${filters.type.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`,
      });
    }

    return chips;
  }, [filters]);

  const handleFilterChange = useCallback((eventOrValue) => {
    if (eventOrValue?.target) {
      const { name, value } = eventOrValue.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
      return;
    }
    setFilters((prev) => ({ ...prev, ...eventOrValue }));
  }, []);

  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? event;
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handleCreateSupplier = useCallback(() => {
    navigate(ROUTES.CREATE_SUPPLIER);
  }, [navigate]);

  const handleViewSupplier = useCallback(
    (supplier) => {
      if (!supplier?._id) return;
      if (typeof ROUTES.SUPPLIER_DETAILS === "function") {
        navigate(ROUTES.SUPPLIER_DETAILS(supplier._id));
      }
    },
    [navigate],
  );

  const handleEditSupplier = useCallback(
    (supplier) => {
      if (!supplier?._id) return;
      if (typeof ROUTES.EDIT_SUPPLIER === "function") {
        navigate(ROUTES.EDIT_SUPPLIER(supplier._id));
      }
    },
    [navigate],
  );

  const handleRequestDeleteSupplier = useCallback((supplier) => {
    setSelectedSupplier(supplier || null);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setSelectedSupplier(null);
  }, [isDeleting]);

  const handleConfirmDeleteSupplier = useCallback(async () => {
    if (!selectedSupplier?._id) return;
    try {
      await deleteSupplier(selectedSupplier._id);
      setIsDeleteModalOpen(false);
      setSelectedSupplier(null);
    } catch {
      // Managed gracefully by standard slice errors
    }
  }, [deleteSupplier, selectedSupplier]);

  const handleRefresh = useCallback(() => {
    clearError();
    clearMessage();
    fetchSuppliers();
  }, [clearError, clearMessage, fetchSuppliers]);

  const pageProps = {
    suppliers: filteredSuppliers,
    allSuppliers: mappedSuppliers,
    stats,
    typeDistribution,

    filters,
    activeFilterChips,
    viewMode,
    onViewModeChange: setViewMode,

    isLoading,
    isDeleting,
    hasError,
    error,
    message,

    totalSuppliers: mappedSuppliers.length,
    filteredSuppliersCount: filteredSuppliers.length,
    hasSuppliers: mappedSuppliers.length > 0,
    hasFilteredSuppliers: filteredSuppliers.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,

    handleCreateSupplier,
    handleViewSupplier,
    handleEditSupplier,
    handleDeleteSupplier: handleRequestDeleteSupplier,
    handleRefresh,

    clearMessage,
  };

  return (
    <>
      {isMobile ? (
        <SuppliersMobilePage {...pageProps} />
      ) : (
        <SuppliersDesktopPage {...pageProps} />
      )}

      <AppConfirmModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteSupplier}
        title="Delete Supplier Record"
        message={
          selectedSupplier
            ? `Delete ${selectedSupplier.displayName}?`
            : "Delete Supplier?"
        }
        description="This will execute a soft-delete process on your workspace supplier profile. Connected invoice/purchase records will remain preserved."
        variant="error"
        confirmLabel="Delete Supplier"
        cancelLabel="Keep Profile"
        loading={isDeleting}
        confirmDisabled={isDeleting}
        cancelDisabled={isDeleting}
        closeOnBackdrop={!isDeleting}
      />
    </>
  );
};

export default SuppliersPage;
