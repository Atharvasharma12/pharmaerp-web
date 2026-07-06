import React, { useState, useEffect, useCallback, useMemo } from "react";

import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useJournalVoucher from "../hooks/useJournalVoucher";
import JournalVouchersDesktopPage from "./desktop/JournalVouchersDesktopPage";
import JournalVouchersMobilePage from "./mobile/JournalVouchersMobilePage";

const JournalVouchersPage = () => {
  const isMobile = useIsMobile();

  const {
    journalVouchers,
    getJournalVouchers,
    getJournalVouchersStatus,
    error,
    clearError,
  } = useJournalVoucher();

  const [searchParams, setSearchParams] = useState({
    search: "",
    status: "all",
    voucherType: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Trigger query load when dependencies alter
  useEffect(() => {
    const loadVouchers = async () => {
      try {
        const query = {
          page: currentPage,
          limit: pageSize,
          search: searchParams.search || undefined,
          status: searchParams.status === "all" ? undefined : searchParams.status,
          voucherType: searchParams.voucherType === "all" ? undefined : searchParams.voucherType,
        };
        await getJournalVouchers(query);
      } catch (err) {
        console.error("Failed to query journal vouchers list:", err);
      }
    };
    loadVouchers();
    // Exclude getJournalVouchers from dependency array to avoid infinite loops
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

  const handleRefresh = useCallback(async () => {
    try {
      const query = {
        page: currentPage,
        limit: pageSize,
        search: searchParams.search || undefined,
        status: searchParams.status === "all" ? undefined : searchParams.status,
        voucherType: searchParams.voucherType === "all" ? undefined : searchParams.voucherType,
      };
      await getJournalVouchers(query);
    } catch (err) {
      console.error("Failed to refresh journal vouchers:", err);
    }
  }, [getJournalVouchers, currentPage, pageSize, searchParams]);

  const totalVouchers = useMemo(() => {
    return journalVouchers?.length || 0;
  }, [journalVouchers]);

  const isLoading = getJournalVouchersStatus === API_STATUS.LOADING;

  const pageProps = {
    journalVouchers: journalVouchers || [],
    searchParams,
    currentPage,
    pageSize,
    totalVouchers,
    isLoading,
    error,
    clearError,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
  };

  return isMobile ? (
    <JournalVouchersMobilePage {...pageProps} />
  ) : (
    <JournalVouchersDesktopPage {...pageProps} />
  );
};

export default JournalVouchersPage;
