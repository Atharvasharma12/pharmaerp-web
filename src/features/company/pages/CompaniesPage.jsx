// src/features/company/pages/CompaniesPage.jsx

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";
import { AppConfirmModal } from "@/components";

import useCompany from "../hooks/useCompany";

import CompaniesDesktopPage from "./desktop/CompaniesDesktopPage";
import CompaniesMobilePage from "./mobile/CompaniesMobilePage";

const statusOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const companyTypeOptions = [
  { label: "All Types", value: "all" },
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

const formatPhone = (phones) => {
  if (phones?.mobile) return `+91 ${phones.mobile}`;
  if (phones?.whatsapp) return `+91 ${phones.whatsapp}`;
  if (phones?.landline) return phones.landline;

  return "-";
};

const getCompanyDisplayName = (company) => company?.name || "Company";

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
  displayOwnerName: company?.owner?.name || "-",
  displayPharmacistName: company?.pharmacist?.name || "-",
  displayGstType: company?.taxSettings?.gstType || "-",
});

const CompaniesPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    setCurrentCompany,
  } = useCompany();

  const hasFetchedRef = useRef(false);

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
      // Error is already stored in company slice.
    }
  }, [getWorkspaceCompanies]);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    if (!message) return;

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
        normalizeText(company.website).includes(search) ||
        normalizeText(company.phones?.mobile).includes(search) ||
        normalizeText(company.phones?.whatsapp).includes(search) ||
        normalizeText(company.phones?.landline).includes(search) ||
        normalizeText(company.gstin).includes(search) ||
        normalizeText(company.pan).includes(search) ||
        normalizeText(company.owner?.name).includes(search) ||
        normalizeText(company.owner?.mobile).includes(search) ||
        normalizeText(company.pharmacist?.name).includes(search) ||
        normalizeText(company.license?.drugLicenseNumber).includes(search) ||
        normalizeText(company.license?.retailLicenseNumber).includes(search) ||
        normalizeText(company.license?.wholesaleLicenseNumber).includes(
          search,
        ) ||
        normalizeText(company.license?.fssaiNumber).includes(search) ||
        normalizeText(company.address?.city).includes(search) ||
        normalizeText(company.address?.district).includes(search) ||
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
    const active = mappedCompanies.filter(
      (company) => company.status === "active",
    ).length;
    const inactive = mappedCompanies.filter(
      (company) => company.status === "inactive",
    ).length;
    const suspended = mappedCompanies.filter(
      (company) => company.status === "suspended",
    ).length;

    return [
      {
        id: "total",
        title: "Total",
        value: total,
        description: "Companies",
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
  }, [mappedCompanies]);

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
          companyTypeOptions.find((option) => option.value === filters.type)
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

  const handleCreateCompany = useCallback(() => {
    navigate("/companies/create");
  }, [navigate]);

  const handleViewCompany = useCallback(
    (company) => {
      if (!company?._id) return;

      setCurrentCompany(company);
      navigate(`/companies/${company._id}`);
    },
    [navigate, setCurrentCompany],
  );

  const handleEditCompany = useCallback(
    (company) => {
      if (!company?._id) return;

      setCurrentCompany(company);
      navigate(`/companies/${company._id}/edit`);
    },
    [navigate, setCurrentCompany],
  );

  const handleOpenSettings = useCallback(
    (company) => {
      if (!company?._id) return;

      setCurrentCompany(company);
      navigate(`/companies/${company._id}/settings`);
    },
    [navigate, setCurrentCompany],
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
      // Error is already stored in company slice.
    }
  }, [deleteCompany, selectedCompany]);

  const handleRefresh = useCallback(async () => {
    if (isLoading) return;

    clearError();
    clearMessage();

    await fetchCompanies();
  }, [isLoading, clearError, clearMessage, fetchCompanies]);

  const pageProps = useMemo(
    () => ({
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

      clearError,
      clearMessage,
    }),
    [
      filteredCompanies,
      mappedCompanies,
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
      handleCreateCompany,
      handleViewCompany,
      handleEditCompany,
      handleOpenSettings,
      handleRequestDeleteCompany,
      handleRefresh,
      clearError,
      clearMessage,
    ],
  );

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
        title="Delete Company"
        message={`Delete ${getCompanyDisplayName(selectedCompany)}?`}
        description="This action will remove the company from your workspace. You cannot see it in the active company list after deletion."
        variant="error"
        confirmLabel="Delete Company"
        cancelLabel="Cancel"
        loading={isDeleting}
        confirmDisabled={isDeleting}
        cancelDisabled={isDeleting}
        closeOnBackdrop={false}
      />
    </>
  );
};

export default CompaniesPage;
