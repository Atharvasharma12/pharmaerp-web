import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankSlip from "../hooks/useBankSlip";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import BankSlipsDesktopPage from "./desktop/BankSlipsDesktopPage";
import BankSlipsMobilePage from "./mobile/BankSlipsMobilePage";

const BankSlipsPage = () => {
  const isMobile = useIsMobile();
  const hasFetchedBanksRef = useRef(false);

  const {
    bankSlips,
    getBankSlips,
    getBankSlipsStatus,
    error,
    clearError,
  } = useBankSlip();

  const { bankAccounts, getBankAccounts } = useBankAccount();

  // Load banks list for filters once
  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;

    getBankAccounts({ all: true }).catch((err) =>
      console.error("Failed to load bank accounts for slip filtering:", err)
    );
  }, [getBankAccounts]);

  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "all",
    slipType: "all",
    bankAccountId: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch list when pagination or filters change
  useEffect(() => {
    const loadData = async () => {
      try {
        const query = {
          page: currentPage,
          limit: pageSize,
          search: searchParams.search || undefined,
          status: searchParams.status === "all" ? undefined : searchParams.status,
          slipType: searchParams.slipType === "all" ? undefined : searchParams.slipType,
          bankAccountId: searchParams.bankAccountId === "all" ? undefined : searchParams.bankAccountId,
        };
        await getBankSlips(query);
      } catch (err) {
        console.error("Failed to query bank slips list:", err);
      }
    };
    loadData();
    // getBankSlips is excluded from dependencies to prevent infinite dispatch rendering loops
  }, [currentPage, pageSize, searchParams]);

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

  const totalSlips = useMemo(() => {
    // If backend returns total, retrieve it. Otherwise calculate local count.
    return bankSlips?.length || 0;
  }, [bankSlips]);

  const isLoading = getBankSlipsStatus === API_STATUS.LOADING;

  const pageProps = {
    bankSlips: bankSlips || [],
    bankAccounts: bankAccounts || [],
    searchParams,
    currentPage,
    pageSize,
    totalSlips,
    isLoading,
    error,
    clearError,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  };

  return isMobile ? (
    <BankSlipsMobilePage {...pageProps} />
  ) : (
    <BankSlipsDesktopPage {...pageProps} />
  );
};

export default BankSlipsPage;
