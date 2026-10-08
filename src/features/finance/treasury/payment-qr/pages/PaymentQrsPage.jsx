import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import usePaymentQr from "../hooks/usePaymentQr";
import PaymentQrsDesktopPage from "./desktop/PaymentQrsDesktopPage";
import PaymentQrsMobilePage from "./mobile/PaymentQrsMobilePage";


import PaymentQrDialog from "../components/PaymentQrDialog";
import { UIConfirmDialog } from "@/components/ui";

const INITIAL_FILTERS = {
  search: "",
  status: "all",
  provider: "all",
  page: 1,
  limit: 10,
};

const PaymentQrsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    paymentQrs,
    getPaymentQrsStatus,
    deletePaymentQrStatus,
    setPrimaryPaymentQrStatus,
    error: serverError,
    message: serverMessage,
    getPaymentQrs,
    deletePaymentQr,
    setPrimaryPaymentQr,
    clearError,
    clearMessage,
  } = usePaymentQr();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [totalQrs, setTotalQrs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPaymentQrs = useCallback(
    async (params = {}) => {
      try {
        const queryParams = {
          page: params.page || filters.page,
          limit: params.limit || filters.limit,
          search: params.search !== undefined ? params.search : filters.search,
        };

        if (params.status !== undefined) {
          if (params.status !== "all") queryParams.status = params.status.toUpperCase();
        } else if (filters.status !== "all") {
          queryParams.status = filters.status.toUpperCase();
        }

        if (params.provider !== undefined) {
          if (params.provider !== "all") queryParams.provider = params.provider.toUpperCase();
        } else if (filters.provider !== "all") {
          queryParams.provider = filters.provider.toUpperCase();
        }

        const response = await getPaymentQrs(queryParams);
        if (response) {
          setTotalQrs(response.total || 0);
          setTotalPages(Math.ceil((response.total || 0) / queryParams.limit));
        }
      } catch (err) {
        console.error("Failed to load payment QR database:", err);
      }
    },
    [getPaymentQrs, filters]
  );

  // Initial load & filter changes
  useEffect(() => {
    fetchPaymentQrs();
  }, [filters.page, filters.limit, filters.status, filters.provider]);

  // Handle Search Input (debounce if necessary, or trigger on filter update)
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, page: 1 }));
      fetchPaymentQrs({ page: 1 });
    }, 450);

    return () => clearTimeout(handler);
  }, [filters.search]);

  // Clean up notifications on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name !== "page" ? { page: 1 } : {}),
    }));
    clearError();
    clearMessage();
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    clearError();
    clearMessage();
  }, []);

  const handleRemoveChip = useCallback((key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: INITIAL_FILTERS[key],
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    handleFilterChange("page", newPage);
  }, [handleFilterChange]);

  const handlePageSizeChange = useCallback((newSize) => {
    setFilters((prev) => ({
      ...prev,
      limit: newSize,
      page: 1,
    }));
  }, []);

  const handleRefresh = useCallback(() => {
    clearError();
    clearMessage();
    fetchPaymentQrs();
  }, [fetchPaymentQrs]);

  const handleCreateQr = useCallback(() => {
    navigate(ROUTES.CREATE_PAYMENT_QR);
  }, [navigate]);

  const handleEditQr = useCallback((id) => {
    navigate(ROUTES.EDIT_PAYMENT_QR(id));
  }, [navigate]);

  const handleViewDetails = useCallback((id) => {
    navigate(ROUTES.PAYMENT_QR_DETAILS(id));
  }, [navigate]);

  const handleDeleteQr = useCallback(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this UPI QR account?")) {
        try {
          await deletePaymentQr(id);
          fetchPaymentQrs();
        } catch (err) {
          console.error("Failed to delete QR register:", err);
        }
      }
    },
    [deletePaymentQr, fetchPaymentQrs]
  );

  const handleSetPrimary = useCallback(
    async (id) => {
      try {
        await setPrimaryPaymentQr(id);
        fetchPaymentQrs();
      } catch (err) {
        console.error("Failed to set primary QR register:", err);
      }
    },
    [setPrimaryPaymentQr, fetchPaymentQrs]
  );

  const isLoading =
    getPaymentQrsStatus === API_STATUS.LOADING ||
    deletePaymentQrStatus === API_STATUS.LOADING ||
    setPrimaryPaymentQrStatus === API_STATUS.LOADING;

  // Active filter chips mapper
  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.status !== "all") {
      chips.push({ key: "status", label: `Status: ${filters.status}` });
    }
    if (filters.provider !== "all") {
      chips.push({ key: "provider", label: `Provider: ${filters.provider}` });
    }
    return chips;
  }, [filters.status, filters.provider]);

  // Statistics
  const stats = useMemo(() => {
    const list = paymentQrs || [];
    return {
      totalCount: totalQrs,
      activeCount: list.filter((q) => q.status === "ACTIVE").length,
      primaryCount: list.filter((q) => q.isPrimary).length,
    };
  }, [paymentQrs, totalQrs]);

  const pageProps = {
    filters,
    stats,
    pagedQrs: paymentQrs || [],
    totalQrs,
    currentPage: filters.page,
    totalPages,
    pageSize: filters.limit,
    activeFilterChips,
    isLoading,
    serverError,
    serverMessage,
    handleFilterChange,
    handleRemoveChip,
    handleClearFilters,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    handleCreateQr,
    handleEditQr,
    handleViewDetails,
    handleDeleteQr,
    handleSetPrimary,
    clearError,
    clearMessage,
  };

  return isMobile ? (
    <PaymentQrsMobilePage {...pageProps} />
  ) : (
    <PaymentQrsDesktopPage {...pageProps} />
  );
};

export default PaymentQrsPage;
