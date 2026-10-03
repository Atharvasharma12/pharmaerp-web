import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashExchange from "../hooks/useCashExchange";
import CashExchangesDesktopPage from "./desktop/CashExchangesDesktopPage";
import CashExchangesMobilePage from "./mobile/CashExchangesMobilePage";

const CashExchangesPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    cashExchanges,
    getCashExchanges,
    getCashExchangesStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useCashExchange();

  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const buildQuery = useCallback(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: searchParams.search || undefined,
      status: searchParams.status === "all" ? undefined : searchParams.status,
    }),
    [currentPage, pageSize, searchParams],
  );

  const fetchData = useCallback(() => {
    getCashExchanges(buildQuery()).catch((err) =>
      console.error("Failed to load cash exchanges:", err),
    );
  }, [getCashExchanges, buildQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => fetchData(), [fetchData]);

  const handleSearchChange = useCallback((value) => {
    setSearchParams((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => setCurrentPage(page), []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);


  const handleViewDetails = useCallback(
    (cashExchangeId) => navigate(ROUTES.CASH_EXCHANGE_DETAILS(cashExchangeId)),
    [navigate],
  );

  const handleCreateNew = useCallback(
    () => navigate(ROUTES.CREATE_CASH_EXCHANGE),
    [navigate],
  );

  const isLoading = getCashExchangesStatus === API_STATUS.LOADING;

  const totalExchanges = useMemo(
    () => cashExchanges?.length || 0,
    [cashExchanges],
  );

  const pageProps = {
    cashExchanges: cashExchanges || [],
    searchParams,
    currentPage,
    pageSize,
    totalExchanges,
    isLoading,
    error: error || actionError,
    message: message || actionMessage,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
      setActionMessage("");
    },
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleViewDetails,
    handleCreateNew,
    handleRefresh,
  };

  return isMobile ? (
    <CashExchangesMobilePage {...pageProps} />
  ) : (
    <CashExchangesDesktopPage {...pageProps} />
  );
};

export default CashExchangesPage;
