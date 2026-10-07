// src/features/finance/treasury/cash-management/exchange-cash/pages/CashExchangesPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useBranch from "@/features/branch/hooks/useBranch";
import useActiveShift from "@/features/operations/shifts/hooks/useActiveShift";
import useCashExchange from "../hooks/useCashExchange";

import CashExchangesDesktopPage from "./desktop/CashExchangesDesktopPage";
import CashExchangesMobilePage from "./mobile/CashExchangesMobilePage";
import { CreateCashExchangeModal, ViewCashExchangeModal } from "../components";

export const CashExchangesPage = ({ initialOpenCreate = false, initialExchangeId = null }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentBranch } = useBranch();
  const { activeShift } = useActiveShift(currentBranch?._id);
  const isShiftActive = Boolean(activeShift);

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
    partition: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(
    initialOpenCreate || Boolean(location.state?.openCreateModal)
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(Boolean(initialExchangeId));
  const [selectedExchangeId, setSelectedExchangeId] = useState(initialExchangeId || null);

  const buildQuery = useCallback(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: searchParams.search || undefined,
      status: searchParams.status === "all" ? undefined : searchParams.status,
      branchId: currentBranch?._id || undefined,
    }),
    [currentPage, pageSize, searchParams, currentBranch?._id]
  );

  const fetchData = useCallback(() => {
    getCashExchanges(buildQuery()).catch((err) =>
      console.error("Failed to load cash exchanges:", err)
    );
  }, [getCashExchanges, buildQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle direct open if state has it
  useEffect(() => {
    if (location.state?.openCreateModal && isShiftActive) {
      setIsCreateModalOpen(true);
    }
  }, [location.state, isShiftActive]);

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

  // Modal Triggers
  const handleViewDetails = useCallback((cashExchangeId) => {
    setSelectedExchangeId(cashExchangeId);
    setIsViewModalOpen(true);
  }, []);

  const handleCreateNew = useCallback(() => {
    if (!isShiftActive) return;
    setIsCreateModalOpen(true);
  }, [isShiftActive]);

  const isLoading = getCashExchangesStatus === API_STATUS.LOADING;
  const totalExchanges = useMemo(() => cashExchanges?.length || 0, [cashExchanges]);

  const pageProps = {
    cashExchanges: cashExchanges || [],
    searchParams,
    currentPage,
    pageSize,
    totalExchanges,
    isLoading,
    isShiftActive,
    activeShift,
    currentBranch,
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

  return (
    <>
      {isMobile ? (
        <CashExchangesMobilePage {...pageProps} />
      ) : (
        <CashExchangesDesktopPage {...pageProps} />
      )}

      {/* ── In-Place Modals (Replaces Separate Create & View Pages) ── */}
      <CreateCashExchangeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleRefresh}
      />

      <ViewCashExchangeModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedExchangeId(null);
        }}
        exchangeId={selectedExchangeId}
      />
    </>
  );
};

export default CashExchangesPage;
