// src/features/parties/suppliers/pages/SupplierDetailsPage.jsx

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useSupplier from "../hooks/useSupplier";
import SupplierDetailsDesktopPage from "./desktop/SupplierDetailsDesktopPage";
import SupplierDetailsMobilePage from "./mobile/SupplierDetailsMobilePage";

const SupplierDetailsPage = () => {
  const navigate = useNavigate();
  const { supplierId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  // Tab state synced with search param
  const currentTab = searchParams.get("tab") || "overview";

  const {
    currentSupplier,
    ledger,
    outstanding,
    purchases,
    payments,
    getSupplierStatus,
    error,
    getSupplierById,
    getSupplierOutstanding,
    getSupplierPurchases,
    getSupplierPayments,
    getSupplierLedger,
    clearError,
    clearCurrentSupplier,
    clearSupplierLedger,
    clearSupplierOutstanding,
    clearSupplierPurchases,
    clearSupplierPayments,
  } = useSupplier();

  const isLoading = getSupplierStatus === API_STATUS.LOADING;
  const hasError = getSupplierStatus === API_STATUS.ERROR;

  const fetchSupplier = useCallback(async () => {
    if (!supplierId) return;
    try {
      await getSupplierById(supplierId);
    } catch (e) {
      console.error("Error fetching core supplier details:", e);
    }

    try {
      await getSupplierOutstanding(supplierId);
    } catch (e) {
      console.error("Error fetching supplier outstanding:", e);
    }

    try {
      await getSupplierPurchases(supplierId);
    } catch (e) {
      console.error("Error fetching supplier purchases:", e);
    }

    try {
      await getSupplierPayments(supplierId);
    } catch (e) {
      console.error("Error fetching supplier payments:", e);
    }

    try {
      await getSupplierLedger(supplierId);
    } catch (e) {
      console.error("Error fetching supplier ledger:", e);
    }
  }, [
    supplierId,
    getSupplierById,
    getSupplierOutstanding,
    getSupplierPurchases,
    getSupplierPayments,
    getSupplierLedger,
  ]);

  useEffect(() => {
    if (hasFetchedRef.current === supplierId) return;
    hasFetchedRef.current = supplierId;

    fetchSupplier();

    return () => {
      clearError();
      clearCurrentSupplier();
      clearSupplierLedger();
      clearSupplierOutstanding();
      clearSupplierPurchases();
      clearSupplierPayments();
    };
  }, [
    supplierId,
    fetchSupplier,
    clearError,
    clearCurrentSupplier,
    clearSupplierLedger,
    clearSupplierOutstanding,
    clearSupplierPurchases,
    clearSupplierPayments,
  ]);

  const handleTabChange = useCallback(
    (tabValue) => {
      setSearchParams({ tab: tabValue });
    },
    [setSearchParams],
  );

  const handleBack = useCallback(() => {
    navigate("/parties/suppliers");
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!supplierId) return;
    navigate(ROUTES.EDIT_SUPPLIER(supplierId));
  }, [supplierId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    fetchSupplier();
  }, [clearError, fetchSupplier]);

  const pageProps = useMemo(
    () => ({
      supplier: currentSupplier,
      ledger,
      outstanding,
      purchases,
      payments,
      supplierId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleEdit,
      handleRefresh,
    }),
    [
      currentSupplier,
      ledger,
      outstanding,
      purchases,
      payments,
      supplierId,
      currentTab,
      isLoading,
      hasError,
      error,
      handleTabChange,
      handleBack,
      handleEdit,
      handleRefresh,
    ],
  );

  return isMobile ? (
    <SupplierDetailsMobilePage {...pageProps} />
  ) : (
    <SupplierDetailsDesktopPage {...pageProps} />
  );
};

export default SupplierDetailsPage;
