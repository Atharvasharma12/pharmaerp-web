import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankMaster from "../hooks/useBankMaster";

import BankMasterDesktopPage from "./desktop/BankMasterDesktopPage";
import BankMasterMobilePage from "./mobile/BankMasterMobilePage.jsx";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const mapBankForView = (bank) => {
  const name = bank?.name || "-";
  const website = bank?.website || "No website provided.";
  const isActive = bank?.isActive !== false;

  return {
    ...bank,
    displayName: name,
    displaySku: name,
    displayCategory: "Bank",
    displayManufacturer: website,
    displayDosageForm: bank?.logoUrl ? "Logo Available" : "No Logo",
    displayStrength: "-",
    displayStatus: isActive ? "active" : "inactive",
    displayAvailability: "Global",
  };
};

const BankMasterPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    manufacturer: "all",
    productForm: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    bankMasters,
    pagination,
    getBankMastersStatus,
    getBankMasterStatus,
    error,
    message,
    getBankMasters,
    clearError,
    clearMessage,
    clearCurrentBankMaster,
  } = useBankMaster();

  const isLoadingList = getBankMastersStatus === API_STATUS.LOADING;
  const isLoadingItem = getBankMasterStatus === API_STATUS.LOADING;
  const isLoading = isLoadingList || isLoadingItem;
  const hasError = getBankMastersStatus === API_STATUS.ERROR;

  const fetchBankCatalogData = useCallback(
    async (pageVal = currentPage, sizeVal = pageSize, filterVal = filters) => {
      try {
        const apiParams = {
          page: pageVal,
          limit: sizeVal,
        };

        if (filterVal.search) {
          apiParams.search = filterVal.search;
        }
        if (filterVal.status !== "all") {
          apiParams.isActive = filterVal.status;
        }

        await getBankMasters(apiParams);
      } catch {
        // Handled via Redux slice
      }
    },
    [getBankMasters],
  );

  useEffect(() => {
    clearError();
    clearCurrentBankMaster();

    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchBankCatalogData(currentPage, pageSize, filters);
    }

    return () => {
      clearError();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!message) return undefined;

    const timer = window.setTimeout(() => {
      clearMessage();
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [clearMessage, message]);

  const mappedRecords = useMemo(() => {
    return (Array.isArray(bankMasters) ? bankMasters : []).map(
      mapBankForView,
    );
  }, [bankMasters]);

  const filteredRecords = useMemo(() => {
    const searchToken = normalizeText(filters.search);

    return mappedRecords.filter((bank) => {
      const matchesSearch =
        !searchToken ||
        normalizeText(bank.displayName).includes(searchToken) ||
        normalizeText(bank.displayManufacturer).includes(searchToken);

      return matchesSearch;
    });
  }, [filters, mappedRecords]);

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label: `Status: ${filters.status === "true" ? "Active" : "Inactive"}`,
      });
    }

    return chips;
  }, [filters]);

  const dashboardStats = useMemo(() => {
    const totalItems = pagination?.total || filteredRecords.length;

    const activeCount = mappedRecords.filter(
      (bank) => bank.displayStatus === "active",
    ).length;

    return [
      {
        id: "total_products",
        title: "Total Banks",
        value: totalItems,
        description: "Across global catalog database",
        colorVariant: "success",
      },
      {
        id: "categories",
        title: "Active Banks",
        value: activeCount,
        description: "Currently usable records",
        colorVariant: "purple",
      },
      {
        id: "manufacturers",
        title: "Database Scope",
        value: "Global",
        description: "Central platform control",
        colorVariant: "info",
      },
    ];
  }, [pagination, filteredRecords, mappedRecords]);

  const handleFilterChange = useCallback(
    (eventOrValue) => {
      let updatedFilters = { ...filters };

      if (eventOrValue?.target) {
        const { name, value } = eventOrValue.target;
        updatedFilters = { ...filters, [name]: value };
      } else {
        updatedFilters = { ...filters, ...eventOrValue };
      }

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchBankCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchBankCatalogData],
  );

  const handleSearchChange = useCallback(
    (event) => {
      const value = event?.target?.value ?? event;
      const updatedFilters = { ...filters, search: value };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchBankCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchBankCatalogData],
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      const updatedFilters = { ...filters, [key]: "all" };

      setFilters(updatedFilters);
      setCurrentPage(1);
      fetchBankCatalogData(1, pageSize, updatedFilters);
    },
    [filters, pageSize, fetchBankCatalogData],
  );

  const handleClearFilters = useCallback(() => {
    const cleared = {
      search: "",
      category: "all",
      manufacturer: "all",
      productForm: "all",
      status: "all",
    };
    setFilters(cleared);
    setCurrentPage(1);
    fetchBankCatalogData(1, pageSize, cleared);
  }, [pageSize, fetchBankCatalogData]);

  const handleRefresh = useCallback(() => {
    fetchBankCatalogData(currentPage, pageSize, filters);
  }, [currentPage, pageSize, filters, fetchBankCatalogData]);
  const handleBackToCatalog = useCallback(() => {
    navigate('/catalog');
  }, [navigate]);

  const handlePageChange = useCallback(
    (newPage) => {
      const boundedPage = Math.max(1, newPage);
      setCurrentPage(boundedPage);
      fetchBankCatalogData(boundedPage, pageSize, filters);
    },
    [pageSize, filters, fetchBankCatalogData],
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      setPageSize(size);
      setCurrentPage(1);
      fetchBankCatalogData(1, size, filters);
    },
    [filters, fetchBankCatalogData],
  );

  const handleViewProductDetails = useCallback(
    (bank) => {
      if (!bank?._id) return;
      navigate(`/catalog/bank-master/${bank._id}`);
    },
    [navigate],
  );

  const handleExportCatalog = useCallback(() => {
    // Stub
  }, []);

  const pageProps = {
    products: filteredRecords,
    dashboardStats,
    filters,
    activeFilterChips,
    categoryOptions: [],
    dosageFormOptions: [{ label: "All Records", value: "all" }],

    isLoading,
    hasError,
    error,
    message,

    totalProducts: pagination?.total || filteredRecords.length,
    currentPage: pagination?.page || currentPage,
    totalPages: pagination?.totalPages || 1,
    pageSize,

    hasProducts: mappedRecords.length > 0,
    hasFilteredProducts: filteredRecords.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,
    handleRefresh,
    handleBackToCatalog,
    handlePageChange,
    handlePageSizeChange,
    handleViewProductDetails,
    handleExportCatalog,
    clearMessage,
  };

  return isMobile ? (
    <BankMasterMobilePage {...pageProps} />
  ) : (
    <BankMasterDesktopPage {...pageProps} />
  );
};

export default BankMasterPage;
