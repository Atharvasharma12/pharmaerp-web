// src/features/branch/pages/BranchesPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppConfirmModal } from "@/components";

import useBranch from "../hooks/useBranch";

import BranchesDesktopPage from "./desktop/BranchesDesktopPage";
import BranchesMobilePage from "./mobile/BranchesMobilePage";

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const branchTypeOptions = [
  { label: "All Types", value: "all" },
  { label: "Retail", value: "retail" },
  { label: "Wholesale", value: "wholesale" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Clinic Pharmacy", value: "clinic_pharmacy" },
  { label: "Hospital Pharmacy", value: "hospital_pharmacy" },
  { label: "Online", value: "online" },
  { label: "Other", value: "other" },
];

const initialFilters = {
  search: "",
  status: "all",
  type: "all",
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatBranchType = (type) => {
  if (!type) return "-";

  return String(type)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatAddress = (address) => {
  if (!address) return "-";

  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
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

const getBranchDisplayName = (branch) => branch?.name || "Branch";

const mapBranchForView = (branch) => ({
  ...branch,
  displayName: branch?.name || "-",
  displayType: formatBranchType(branch?.type),
  displayAddress: formatAddress(branch?.address),
  displayCreatedAt: formatDate(branch?.createdAt),
  displayUpdatedAt: formatDate(branch?.updatedAt),
  displayPhone: branch?.phone ? `+91 ${branch.phone}` : "-",
  displayEmail: branch?.email || "-",
  displayGstin: branch?.gstin || "-",
  displayDrugLicenseNumber: branch?.drugLicenseNumber || "-",
  displayBillingType: branch?.billingSettings?.billingType || "-",
  displayInventoryMode: branch?.inventorySettings?.inventoryMode || "-",
  displayPriceMode: branch?.inventorySettings?.priceMode || "-",
});

const BranchesPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    branches,
    getCompanyBranches,
    deleteBranch,
    getCompanyBranchesStatus,
    deleteBranchStatus,
    error,
    message,
    clearError,
    clearMessage,
    setCurrentBranch,
  } = useBranch();

  const hasFetchedRef = useRef(false);

  const [filters, setFilters] = useState(initialFilters);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isLoading = getCompanyBranchesStatus === API_STATUS.LOADING;
  const isDeleting = deleteBranchStatus === API_STATUS.LOADING;
  const hasError = getCompanyBranchesStatus === API_STATUS.ERROR;

  const fetchBranches = useCallback(async () => {
    try {
      await getCompanyBranches();
    } catch {
      // Error is already stored in branch slice.
    }
  }, [getCompanyBranches]);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    fetchBranches();
  }, [fetchBranches]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [message, clearMessage]);

  const mappedBranches = useMemo(
    () => (Array.isArray(branches) ? branches : []).map(mapBranchForView),
    [branches],
  );

  const filteredBranches = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedBranches.filter((branch) => {
      const matchesSearch =
        !search ||
        normalizeText(branch.name).includes(search) ||
        normalizeText(branch.branchCode).includes(search) ||
        normalizeText(branch.email).includes(search) ||
        normalizeText(branch.phone).includes(search) ||
        normalizeText(branch.gstin).includes(search) ||
        normalizeText(branch.drugLicenseNumber).includes(search) ||
        normalizeText(branch.address?.city).includes(search) ||
        normalizeText(branch.address?.state).includes(search) ||
        normalizeText(branch.contactPerson?.name).includes(search) ||
        normalizeText(branch.contactPerson?.phone).includes(search) ||
        normalizeText(branch.contactPerson?.email).includes(search);

      const matchesStatus =
        filters.status === "all" || branch.status === filters.status;

      const matchesType =
        filters.type === "all" || branch.type === filters.type;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [mappedBranches, filters]);

  const stats = useMemo(() => {
    const total = mappedBranches.length;
    const active = mappedBranches.filter(
      (branch) => branch.status === "active",
    ).length;
    const inactive = mappedBranches.filter(
      (branch) => branch.status === "inactive",
    ).length;
    const suspended = mappedBranches.filter(
      (branch) => branch.status === "suspended",
    ).length;

    return [
      {
        id: "total",
        title: "Total",
        value: total,
        description: "Branches",
        colorVariant: "primary",
      },
      {
        id: "active",
        title: "Active",
        value: active,
        description: "Active now",
        colorVariant: "success",
      },
      {
        id: "inactive",
        title: "Inactive",
        value: inactive,
        description: "Inactive",
        colorVariant: "warning",
      },
      {
        id: "suspended",
        title: "Suspended",
        value: suspended,
        description: "Suspended",
        colorVariant: "error",
      },
    ];
  }, [mappedBranches]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({
        key: "search",
        label: `Search: ${filters.search}`,
        value: filters.search,
      });
    }

    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label:
          statusOptions.find((option) => option.value === filters.status)
            ?.label || filters.status,
        value: filters.status,
      });
    }

    if (filters.type !== "all") {
      chips.push({
        key: "type",
        label:
          branchTypeOptions.find((option) => option.value === filters.type)
            ?.label || filters.type,
        value: filters.type,
      });
    }

    return chips;
  }, [filters]);

  const handleFilterChange = useCallback((eventOrValue) => {
    if (eventOrValue?.target) {
      const { name, value } = eventOrValue.target;

      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));

      return;
    }

    setFilters((prev) => ({
      ...prev,
      ...eventOrValue,
    }));
  }, []);

  const handleSearchChange = useCallback((event) => {
    const value = event?.target?.value ?? event;

    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: initialFilters[key],
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const handleCreateBranch = useCallback(() => {
    navigate(ROUTES.CREATE_BRANCH);
  }, [navigate]);

  const handleViewBranch = useCallback(
    (branch) => {
      if (!branch?._id) return;

      setCurrentBranch(branch);
      navigate(`/branches/${branch._id}`);
    },
    [navigate, setCurrentBranch],
  );

  const handleEditBranch = useCallback(
    (branch) => {
      if (!branch?._id) return;

      setCurrentBranch(branch);
      navigate(`/branches/${branch._id}/edit`);
    },
    [navigate, setCurrentBranch],
  );

  const handleOpenSettings = useCallback(
    (branch) => {
      if (!branch?._id) return;

      setCurrentBranch(branch);
      navigate(`/branches/${branch._id}/settings`);
    },
    [navigate, setCurrentBranch],
  );

  const handleRequestDeleteBranch = useCallback((branch) => {
    setSelectedBranch(branch || null);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setSelectedBranch(null);
  }, [isDeleting]);

  const handleConfirmDeleteBranch = useCallback(async () => {
    if (!selectedBranch?._id) return;

    try {
      await deleteBranch(selectedBranch._id);

      setIsDeleteModalOpen(false);
      setSelectedBranch(null);

      await fetchBranches();
    } catch {
      // Error is already stored in branch slice.
    }
  }, [deleteBranch, fetchBranches, selectedBranch]);

  const handleRefresh = useCallback(async () => {
    if (isLoading) return;

    clearError();
    clearMessage();

    await fetchBranches();
  }, [isLoading, clearError, clearMessage, fetchBranches]);

  const pageProps = useMemo(
    () => ({
      branches: filteredBranches,
      allBranches: mappedBranches,
      stats,

      filters,
      activeFilterChips,
      statusOptions,
      branchTypeOptions,

      isLoading,
      isDeleting,
      hasError,
      error,
      message,

      totalBranches: mappedBranches.length,
      filteredBranchesCount: filteredBranches.length,
      hasBranches: mappedBranches.length > 0,
      hasFilteredBranches: filteredBranches.length > 0,

      handleFilterChange,
      handleSearchChange,
      handleRemoveFilter,
      handleClearFilters,

      handleCreateBranch,
      handleViewBranch,
      handleEditBranch,
      handleOpenSettings,
      handleDeleteBranch: handleRequestDeleteBranch,
      handleRefresh,

      clearError,
      clearMessage,
    }),
    [
      filteredBranches,
      mappedBranches,
      stats,
      filters,
      activeFilterChips,
      isLoading,
      isDeleting,
      hasError,
      error,
      message,
      handleFilterChange,
      handleSearchChange,
      handleRemoveFilter,
      handleClearFilters,
      handleCreateBranch,
      handleViewBranch,
      handleEditBranch,
      handleOpenSettings,
      handleRequestDeleteBranch,
      handleRefresh,
      clearError,
      clearMessage,
    ],
  );

  return (
    <>
      {isMobile ? (
        <BranchesMobilePage {...pageProps} />
      ) : (
        <BranchesDesktopPage {...pageProps} />
      )}

      <AppConfirmModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteBranch}
        title="Delete Branch"
        message={`Delete ${getBranchDisplayName(selectedBranch)}?`}
        description="This action will remove the branch from your active branch list. Primary branches cannot be deleted."
        variant="error"
        confirmLabel="Delete Branch"
        cancelLabel="Cancel"
        loading={isDeleting}
        confirmDisabled={isDeleting}
        cancelDisabled={isDeleting}
        closeOnBackdrop={false}
      />
    </>
  );
};

export default BranchesPage;
