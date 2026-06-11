// src/features/company/pages/CompaniesPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppConfirmModal } from "@/components";

import useCompany from "../hooks/useCompany";
import { CompaniesMobilePage } from "./mobile";
import { CompaniesDesktopPage } from "./desktop";

const statusOptions = [
  { label: "Status: All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const companyTypeOptions = [
  { label: "Type: All", value: "all" },
  { label: "Proprietorship", value: "proprietorship" },
  { label: "Partnership", value: "partnership" },
  { label: "LLP", value: "llp" },
  { label: "Private Limited", value: "private_limited" },
  { label: "Public Limited", value: "public_limited" },
  { label: "OPC", value: "opc" },
  { label: "Trust", value: "trust" },
  { label: "Society", value: "society" },
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

const formatCompanyType = (type) => {
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
    address.district,
    address.state,
    address.pincode,
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

const formatPhone = (phones) => {
  if (phones?.mobile) return `+91 ${phones.mobile}`;
  if (phones?.whatsapp) return `+91 ${phones.whatsapp}`;
  if (phones?.landline) return phones.landline;
  return "-";
};

const mapCompanyForView = (company) => ({
  ...company,
  displayName: company?.name || "-",
  displayType: formatCompanyType(company?.type),
  displayAddress: formatAddress(company?.address),
  displayCreatedAt: formatDate(company?.createdAt),
  displayUpdatedAt: formatDate(company?.updatedAt),
  displayPhone: formatPhone(company?.phones),
  displayEmail: company?.email || "-",
  displayWebsite: company?.website || "-",
  displayGstin: company?.gstin || "-",
  displayPan: company?.pan || "-",
  displayOwnerName: company?.owner?.name || company?.ownerName || "-",
  displayPharmacistName:
    company?.pharmacist?.name || company?.pharmacistName || "-",
  displayGstType:
    company?.taxSettings?.gstType || company?.gstType || "Regular",
});

const CompaniesPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  // CLEANED: Removed setCurrentCompany dependency completely
  const {
    companies,
    getWorkspaceCompanies,
    deleteCompany,
    getWorkspaceCompaniesStatus,
    deleteCompanyStatus,
    error,
    message,
    clearError,
    clearMessage,
  } = useCompany();

  const [filters, setFilters] = useState(initialFilters);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isLoading = getWorkspaceCompaniesStatus === API_STATUS.LOADING;
  const isDeleting = deleteCompanyStatus === API_STATUS.LOADING;
  const hasError = getWorkspaceCompaniesStatus === API_STATUS.ERROR;

  const fetchCompanies = useCallback(async () => {
    try {
      await getWorkspaceCompanies();
    } catch {
      // Regulated by store selectors
    }
  }, [getWorkspaceCompanies]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [message, clearMessage]);

  const mappedCompanies = useMemo(
    () => (Array.isArray(companies) ? companies : []).map(mapCompanyForView),
    [companies],
  );

  const filteredCompanies = useMemo(() => {
    const search = normalizeText(filters.search);

    return mappedCompanies.filter((company) => {
      const matchesSearch =
        !search ||
        normalizeText(company.name).includes(search) ||
        normalizeText(company.companyCode).includes(search) ||
        normalizeText(company.email).includes(search) ||
        normalizeText(company.gstin).includes(search) ||
        normalizeText(company.pan).includes(search) ||
        normalizeText(company.displayOwnerName).includes(search) ||
        normalizeText(company.address?.city).includes(search) ||
        normalizeText(company.address?.state).includes(search);

      const matchesStatus =
        filters.status === "all" || company.status === filters.status;

      const matchesType =
        filters.type === "all" || company.type === filters.type;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [mappedCompanies, filters]);

  const stats = useMemo(() => {
    const total = mappedCompanies.length;
    const active = mappedCompanies.filter((c) => c.status === "active").length;
    const inactive = mappedCompanies.filter(
      (c) => c.status === "inactive",
    ).length;
    const suspended = mappedCompanies.filter(
      (c) => c.status === "suspended",
    ).length;

    return [
      {
        id: "total",
        title: "Total Companies",
        value: total,
        description: "Registered profiles",
        colorVariant: "primary",
      },
      {
        id: "active",
        title: "Active Profiles",
        value: active,
        description: "Live operational states",
        colorVariant: "success",
      },
      {
        id: "inactive",
        title: "Inactive Profiles",
        value: inactive,
        description: "Disabled modules",
        colorVariant: "warning",
      },
      {
        id: "suspended",
        title: "Suspended",
        value: suspended,
        description: "Compliance locks",
        colorVariant: "danger",
      },
    ];
  }, [mappedCompanies]);

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
    if (filters.type !== "all") {
      chips.push({
        key: "type",
        label:
          companyTypeOptions.find((o) => o.value === filters.type)?.label ||
          filters.type,
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

  const handleCreateCompany = useCallback(() => {
    navigate("/companies/create");
  }, [navigate]);

  // FIXED: Removed global active context updates during internal route switching
  const handleViewCompany = useCallback(
    (company) => {
      if (!company?._id) return;
      navigate(`/companies/${company._id}`);
    },
    [navigate],
  );

  const handleEditCompany = useCallback(
    (company) => {
      if (!company?._id) return;
      navigate(`/companies/${company._id}/edit`);
    },
    [navigate],
  );

  const handleOpenSettings = useCallback(
    (company) => {
      if (!company?._id) return;
      navigate(`/companies/${company._id}/settings`);
    },
    [navigate],
  );

  const handleRequestDeleteCompany = useCallback((company) => {
    setSelectedCompany(company || null);
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setSelectedCompany(null);
  }, [isDeleting]);

  const handleConfirmDeleteCompany = useCallback(async () => {
    if (!selectedCompany?._id) return;
    try {
      await deleteCompany(selectedCompany._id);
      setIsDeleteModalOpen(false);
      setSelectedCompany(null);
    } catch {
      // Managed gracefully by standard slice errors
    }
  }, [deleteCompany, selectedCompany]);

  const handleRefresh = useCallback(() => {
    hasFetchedRef.current = false;
    clearError();
    clearMessage();
    fetchCompanies();
  }, [clearError, clearMessage, fetchCompanies]);

  const pageProps = {
    companies: filteredCompanies,
    allCompanies: mappedCompanies,
    stats,

    filters,
    activeFilterChips,
    statusOptions,
    companyTypeOptions,

    isLoading,
    isDeleting,
    hasError,
    error,
    message,

    totalCompanies: mappedCompanies.length,
    filteredCompaniesCount: filteredCompanies.length,
    hasCompanies: mappedCompanies.length > 0,
    hasFilteredCompanies: filteredCompanies.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,

    handleCreateCompany,
    handleViewCompany,
    handleEditCompany,
    handleOpenSettings,
    handleDeleteCompany: handleRequestDeleteCompany,
    handleRefresh,

    clearMessage,
  };

  return (
    <>
      {isMobile ? (
        <CompaniesMobilePage {...pageProps} />
      ) : (
        <CompaniesDesktopPage {...pageProps} />
      )}

      <AppConfirmModal
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDeleteCompany}
        title="Delete Company Record"
        message={`Delete ${selectedCompany?.displayName || "this company profile"}?`}
        description="This will execute a soft-delete process on your workspace asset profile. Connected branches will remain suspended until remapped."
        variant="error"
        confirmLabel="Delete Company"
        cancelLabel="Keep Profile"
        loading={isDeleting}
        confirmDisabled={isDeleting}
        cancelDisabled={isDeleting}
        closeOnBackdrop={!isDeleting}
      />
    </>
  );
};

export default CompaniesPage;
