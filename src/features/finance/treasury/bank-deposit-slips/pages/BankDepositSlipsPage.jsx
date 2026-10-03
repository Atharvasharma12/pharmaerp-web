import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBranch from "@/features/branch/hooks/useBranch";

import useBankDepositSlip from "../hooks/useBankDepositSlip";
import BankDepositSlipsDesktopPage from "./desktop/BankDepositSlipsDesktopPage";
import BankDepositSlipsMobilePage from "./mobile/BankDepositSlipsMobilePage";

const BankDepositSlipsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { currentBranch } = useBranch();

  const {
    bankDepositSlips,
    getBankDepositSlips,
    getBankDepositSlipsStatus,
    confirmDeposit,
    confirmDepositStatus,
    cancelBankDepositSlip,
    cancelBankDepositSlipStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useBankDepositSlip();

  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchSlipsData = useCallback(async () => {
    try {
      const query = {
        page: currentPage,
        limit: pageSize,
        search: searchParams.search || undefined,
        status: searchParams.status === "all" ? undefined : searchParams.status,
        branchId: currentBranch?._id || undefined,
      };
      await getBankDepositSlips(query);
    } catch (err) {
      console.error("Failed to load bank deposit slips:", err);
    }
  }, [currentPage, pageSize, searchParams, currentBranch?._id, getBankDepositSlips]);

  useEffect(() => {
    fetchSlipsData();
  }, [fetchSlipsData]);

  const handleRefresh = useCallback(() => {
    fetchSlipsData();
  }, [fetchSlipsData]);

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

  const handleConfirmDeposit = useCallback(
    async (slipId, payload = {}) => {
      setActionError("");
      setActionMessage("");
      try {
        await confirmDeposit(slipId, payload);
        setActionMessage("Bank deposit slip confirmed successfully.");
        fetchSlipsData();
      } catch (err) {
        setActionError(
          typeof err === "string" ? err : "Failed to confirm bank deposit slip."
        );
      }
    },
    [confirmDeposit, fetchSlipsData]
  );

  const handleCancelSlip = useCallback(
    async (slipId, payload = {}) => {
      setActionError("");
      setActionMessage("");
      try {
        await cancelBankDepositSlip(slipId, payload);
        setActionMessage("Bank deposit slip cancelled successfully.");
        fetchSlipsData();
      } catch (err) {
        setActionError(
          typeof err === "string" ? err : "Failed to cancel bank deposit slip."
        );
      }
    },
    [cancelBankDepositSlip, fetchSlipsData]
  );

  const handleViewDetails = useCallback(
    (slipId) => {
      navigate(ROUTES.BANK_DEPOSIT_SLIP_DETAILS(slipId));
    },
    [navigate]
  );

  const handleCreateNew = useCallback(() => {
    navigate(ROUTES.CREATE_BANK_DEPOSIT_SLIP);
  }, [navigate]);

  const isLoading = getBankDepositSlipsStatus === API_STATUS.LOADING;
  const isTransitioning =
    confirmDepositStatus === API_STATUS.LOADING ||
    cancelBankDepositSlipStatus === API_STATUS.LOADING;

  const totalSlips = useMemo(() => {
    return bankDepositSlips?.length || 0;
  }, [bankDepositSlips]);

  const pageProps = {
    bankDepositSlips: bankDepositSlips || [],
    searchParams,
    currentPage,
    pageSize,
    totalSlips,
    isLoading,
    isTransitioning,
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
    handleConfirmDeposit,
    handleCancelSlip,
    handleViewDetails,
    handleCreateNew,
    handleRefresh,
  };

  return isMobile ? (
    <BankDepositSlipsMobilePage {...pageProps} />
  ) : (
    <BankDepositSlipsDesktopPage {...pageProps} />
  );
};

export default BankDepositSlipsPage;
