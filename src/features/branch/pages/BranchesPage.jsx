// src/features/branch/pages/BranchesPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppConfirmModal } from "@/components";

import useBranch from "../hooks/useBranch";
import useCompany from "@/features/company/hooks/useCompany";
import { BranchesMobilePage } from "./mobile";
import { BranchesDesktopPage } from "./desktop";

const statusOptions = [
  { label: "Status: All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const initialFilters = {
  search: "",
  status: "all",
  company: "all",
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const slugify = (value) =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatBranchAddress = (address) => {
  if (!address) return { line1: "", summary: "" };

  const line1Parts = [address.addressLine1, address.addressLine2].filter(
    Boolean,
  );
  const line1 = line1Parts.join(", ") || "";

  const cityStr = address.city || "";
  const pinStr = address.pincode ? ` ${address.pincode}` : "";
  const summary = `${cityStr}${pinStr}`.trim();

  return { line1, summary };
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

const mapBranchForView = (branch) => {
  const addressBlock = formatBranchAddress(branch?.address);
  // Safely fallback to database populated fields without injecting placeholder names
  const companyNameStr = branch?.companyId?.name || branch?.companyName || "";

  return {
    ...branch,
    displayName: branch?.name || "",
    displayCompany: companyNameStr,
    companySlug: slugify(companyNameStr),
    displayCode: branch?.branchCode || "",
    addressLine1: addressBlock.line1,
    locationSummary: addressBlock.summary,
    displayManager: branch?.pharmacist?.name || "",
    displayManagerRole: branch?.pharmacist?.name ? "Pharmacist" : "",
    displayStatus: branch?.status || "active",
    staffCount: branch?.staffCount || branch?.membersCount || 0,
    displayCreatedAt: formatDate(branch?.createdAt),
  };
};

const BranchesPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  // Read the active workspace company context driving the application layout tree
  const { currentCompany } = useCompany();

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
  } = useBranch();

  const [filters, setFilters] = useState(initialFilters);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Standardize loading status flags across UI frames safely
  const isLoading =
    getCompanyBranchesStatus === API_STATUS.LOADING || !currentCompany?._id;
  const isDeleting = deleteBranchStatus === API_STATUS.LOADING;
  const hasError = getCompanyBranchesStatus === API_STATUS.ERROR;

  const fetchBranches = useCallback(async () => {
    if (!currentCompany?._id) return;

    try {
      await getCompanyBranches();
    } catch {
      // Regulated by store selectors
    }
  }, [getCompanyBranches, currentCompany?._id]);

  // Re-evaluate layout fetches whenever companyId settles from core refresh waterfalls
  useEffect(() => {
    if (!currentCompany?._id) return;
    if (hasFetchedRef.current === currentCompany._id) return;

    hasFetchedRef.current = currentCompany._id;
    fetchBranches();
  }, [currentCompany?._id, fetchBranches]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [message, clearMessage]);

  const mappedBranches = useMemo(
    () => (Array.isArray(branches) ? branches : []).map(mapBranchForView),
    [branches],
  );

  // Dynamically derive company selection options from actual loaded branches instead of using hardcoded lists
  const companyOptions = useMemo(() => {
    const options = [{ label: "Company: All", value: "all" }];
    const uniqueCompanies = new Map();

    mappedBranches.forEach((branch) => {
      if (branch.displayCompany && branch.companySlug) {
        uniqueCompanies.set(branch.companySlug, branch.displayCompany);
      }
    });

    uniqueCompanies.forEach((name, slug) => {
      options.push({ label: name, value: slug });
    });

    return options;
  }, [mappedBranches]);

  const filteredBranches = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedBranches.filter((branch) => {
      const matchesSearch =
        !search ||
        normalizeText(branch.displayName).includes(search) ||
        normalizeText(branch.displayCode).includes(search) ||
        normalizeText(branch.displayManager).includes(search) ||
        normalizeText(branch.addressLine1).includes(search) ||
        normalizeText(branch.locationSummary).includes(search);

      const matchesStatus =
        filters.status === "all" || branch.displayStatus === filters.status;

      const matchesCompany =
        filters.company === "all" || branch.companySlug === filters.company;

      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [mappedBranches, filters]);

  const stats = useMemo(() => {
    const total = mappedBranches.length;
    const active = mappedBranches.filter(
      (b) => b.displayStatus === "active",
    ).length;
    const inactive = mappedBranches.filter(
      (b) => b.displayStatus === "inactive",
    ).length;
    const suspended = mappedBranches.filter(
      (b) => b.displayStatus === "suspended",
    ).length;

    return [
      {
        id: "total",
        title: "Total Branches",
        value: total,
        description: "All Locations",
        colorVariant: "primary",
      },
      {
        id: "active",
        title: "Active Locations",
        value: active,
        description: "Operational units",
        colorVariant: "success",
      },
      {
        id: "inactive",
        title: "Inactive Units",
        value: inactive,
        description: "Temporarily closed",
        colorVariant: "warning",
      },
      {
        id: "suspended",
        title: "Suspended",
        value: suspended,
        description: "Compliance hold",
        colorVariant: "danger",
      },
    ];
  }, [mappedBranches]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label:
          statusOptions.find((o) => o.value === filters.status)?.label ||
          filters.status,
      });
    }
    if (filters.company !== "all") {
      chips.push({
        key: "company",
        label:
          companyOptions.find((o) => o.value === filters.company)?.label ||
          filters.company,
      });
    }

    return chips;
  }, [filters, companyOptions]);

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

  const handleCreateBranch = useCallback(() => {
    navigate("/branches/create");
  }, [navigate]);

  const handleViewBranch = useCallback(
    (branch) => {
      if (!branch?._id) return;
      navigate(`/branches/${branch._id}`);
    },
    [navigate],
  );

  const handleEditBranch = useCallback(
    (branch) => {
      if (!branch?._id) return;
      navigate(`/branches/${branch._id}/edit`);
    },
    [navigate],
  );

  const handleOpenSettings = useCallback(
    (branch) => {
      if (!branch?._id) return;
      navigate(`/branches/${branch._id}/settings`);
    },
    [navigate],
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
      fetchBranches();
    } catch {
      // Errors managed via base thunks
    }
  }, [deleteBranch, fetchBranches, selectedBranch]);

  const handleRefresh = useCallback(() => {
    hasFetchedRef.current = false;
    clearError();
    clearMessage();
    fetchBranches();
  }, [clearError, clearMessage, fetchBranches]);

  const pageProps = {
    branches: filteredBranches,
    allBranches: mappedBranches,
    stats,

    filters,
    activeFilterChips,
    statusOptions,
    companyOptions,

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

    clearMessage,
  };

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
        title="Delete Branch Location"
        message={
          selectedBranch
            ? `Delete ${getBranchDisplayName(selectedBranch)}?`
            : "Delete Branch?"
        }
        description="This action removes the retail site record from operational modules. Active stocks will be locked."
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
