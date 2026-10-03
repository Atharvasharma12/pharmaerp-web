// src/features/parties/customers/pages/CustomerDetailsPage.jsx

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCustomer from "../hooks/useCustomer";
import CustomerDetailsDesktopPage from "./desktop/CustomerDetailsDesktopPage";
import CustomerDetailsMobilePage from "./mobile/CustomerDetailsMobilePage";

const CustomerDetailsPage = () => {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  // Tab state synced with search param
  const currentTab = searchParams.get("tab") || "overview";

  const {
    currentCustomer,
    ledger,
    outstanding,
    sales,
    payments,
    getCustomerStatus,
    error,
    getCustomerById,
    getCustomerOutstanding,
    getCustomerSales,
    getCustomerPayments,
    getCustomerLedger,
    clearError,
    clearCurrentCustomer,
    clearCustomerLedger,
    clearCustomerOutstanding,
    clearCustomerSales,
    clearCustomerPayments,
  } = useCustomer();

  const isLoading = getCustomerStatus === API_STATUS.LOADING;
  const hasError = getCustomerStatus === API_STATUS.ERROR;

  const fetchCustomer = useCallback(async () => {
    if (!customerId) return;
    try {
      await getCustomerById(customerId);
    } catch (e) {
      console.error("Error fetching core customer details:", e);
    }

    try {
      await getCustomerOutstanding(customerId);
    } catch (e) {
      console.error("Error fetching customer outstanding:", e);
    }

    try {
      await getCustomerSales({ customerId, params: { page: 1, limit: 5 } });
    } catch (e) {
      console.error("Error fetching customer sales:", e);
    }

    try {
      await getCustomerPayments(customerId);
    } catch (e) {
      console.error("Error fetching customer payments:", e);
    }

    try {
      await getCustomerLedger({ customerId, params: { page: 1, limit: 5 } });
    } catch (e) {
      console.error("Error fetching customer ledger:", e);
    }
  }, [
    customerId,
    getCustomerById,
    getCustomerOutstanding,
    getCustomerSales,
    getCustomerPayments,
    getCustomerLedger,
  ]);

  useEffect(() => {
    if (hasFetchedRef.current === customerId) return;
    hasFetchedRef.current = customerId;

    fetchCustomer();

    return () => {
      clearError();
      clearCurrentCustomer();
      clearCustomerLedger();
      clearCustomerOutstanding();
      clearCustomerSales();
      clearCustomerPayments();
    };
  }, [
    customerId,
    fetchCustomer,
    clearError,
    clearCurrentCustomer,
    clearCustomerLedger,
    clearCustomerOutstanding,
    clearCustomerSales,
    clearCustomerPayments,
  ]);

  const handleTabChange = useCallback(
    (tabValue) => {
      setSearchParams({ tab: tabValue });
    },
    [setSearchParams],
  );

  const handleBack = useCallback(() => {
    navigate("/parties/customers");
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!customerId) return;
    navigate(ROUTES.EDIT_CUSTOMER(customerId));
  }, [customerId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    fetchCustomer();
  }, [clearError, fetchCustomer]);

  const pageProps = useMemo(
    () => ({
      customer: currentCustomer,
      ledger,
      outstanding,
      sales,
      payments,
      customerId,
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
      currentCustomer,
      ledger,
      outstanding,
      sales,
      payments,
      customerId,
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
    <CustomerDetailsMobilePage {...pageProps} />
  ) : (
    <CustomerDetailsDesktopPage {...pageProps} />
  );
};

export default CustomerDetailsPage;
