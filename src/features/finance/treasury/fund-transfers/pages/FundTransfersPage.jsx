import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useFundTransfer from "../hooks/useFundTransfer";
import FundTransfersDesktopPage from "./desktop/FundTransfersDesktopPage";
import FundTransfersMobilePage from "./mobile/FundTransfersMobilePage";

const FundTransfersPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    fundTransfers,
    getFundTransfers,
    getFundTransfersStatus,
    cancelFundTransfer,
    cancelFundTransferStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useFundTransfer();

  const [searchParams, setSearchParams] = useState({
    search: "",
    transferType: "all",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchTransfersData = useCallback(() => {
    const query = {
      page: currentPage,
      limit: pageSize,
      search: searchParams.search || undefined,
      transferType: searchParams.transferType === "all" ? undefined : searchParams.transferType,
      status: searchParams.status === "all" ? undefined : searchParams.status,
    };
    getFundTransfers(query).catch((err) =>
      console.error("Failed to load fund transfers:", err)
    );
  }, [currentPage, pageSize, searchParams, getFundTransfers]);

  useEffect(() => {
    fetchTransfersData();
  }, [fetchTransfersData]);

  const handleRefresh = useCallback(() => {
    fetchTransfersData();
  }, [fetchTransfersData]);

  const handleSearchChange = useCallback((value) => {
    setSearchParams((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleCancelTransfer = useCallback(
    async (fundTransferId, reason = "") => {
      setActionError("");
      setActionMessage("");
      try {
        await cancelFundTransfer(fundTransferId, { reason });
        setActionMessage("Fund transfer cancelled successfully.");
        const query = {
          page: currentPage,
          limit: pageSize,
          search: searchParams.search || undefined,
          transferType: searchParams.transferType === "all" ? undefined : searchParams.transferType,
          status: searchParams.status === "all" ? undefined : searchParams.status,
        };
        getFundTransfers(query).catch(() => {});
      } catch (err) {
        setActionError(typeof err === "string" ? err : "Failed to cancel fund transfer.");
      }
    },
    [cancelFundTransfer, currentPage, pageSize, searchParams, getFundTransfers]
  );

  const handleViewDetails = useCallback(
    (fundTransferId) => {
      navigate(ROUTES.FUND_TRANSFER_DETAILS(fundTransferId));
    },
    [navigate]
  );

  const handleCreateNew = useCallback(() => {
    navigate(ROUTES.CREATE_FUND_TRANSFER);
  }, [navigate]);

  const isLoading = getFundTransfersStatus === API_STATUS.LOADING;
  const isCancelling = cancelFundTransferStatus === API_STATUS.LOADING;

  const totalTransfers = useMemo(() => {
    return fundTransfers?.length || 0;
  }, [fundTransfers]);

  const pageProps = {
    fundTransfers: fundTransfers || [],
    searchParams,
    currentPage,
    pageSize,
    totalTransfers,
    isLoading,
    isCancelling,
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
    handleCancelTransfer,
    handleViewDetails,
    handleCreateNew,
    handleRefresh,
  };

  return isMobile ? (
    <FundTransfersMobilePage {...pageProps} />
  ) : (
    <FundTransfersDesktopPage {...pageProps} />
  );
};

export default FundTransfersPage;
