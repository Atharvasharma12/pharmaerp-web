import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCustomer from "../customers/hooks/useCustomer";
import useSupplier from "../suppliers/hooks/useSupplier";

import PartiesDesktopPage from "./desktop/PartiesDesktopPage";
import PartiesMobilePage from "./mobile/PartiesMobilePage";

const PartiesPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const {
    customers,
    getCustomers,
    getCustomersStatus,
  } = useCustomer();

  const {
    suppliers,
    getSuppliers,
    getSuppliersStatus,
  } = useSupplier();

  const isLoading =
    getCustomersStatus === API_STATUS.LOADING ||
    getSuppliersStatus === API_STATUS.LOADING;

  const hasError =
    getCustomersStatus === API_STATUS.ERROR ||
    getSuppliersStatus === API_STATUS.ERROR;

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([getCustomers(), getSuppliers()]);
    } catch {
      // Handled by Redux slices
    }
  }, [getCustomers, getSuppliers]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleViewCustomers = () => {
    navigate(ROUTES.CUSTOMERS);
  };

  const handleViewSuppliers = () => {
    navigate(ROUTES.SUPPLIERS);
  };

  const getRecentAddedCount = useCallback((items) => {
    if (!Array.isArray(items)) return "+0 this month";
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const count = items.filter((item) => {
      if (!item?.createdAt) return false;
      const d = new Date(item.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
    return `+${count} this month`;
  }, []);

  const partiesData = useMemo(() => {
    const customerList = Array.isArray(customers) ? customers : [];
    const supplierList = Array.isArray(suppliers) ? suppliers : [];

    const activeCustomers = customerList.filter(
      (c) => c?.status?.toLowerCase() === "active",
    ).length;
    const inactiveCustomers = customerList.filter(
      (c) =>
        c?.status?.toLowerCase() === "inactive" ||
        c?.status?.toLowerCase() === "blocked",
    ).length;

    const activeSuppliers = supplierList.filter(
      (s) => s?.status?.toLowerCase() === "active",
    ).length;
    const inactiveSuppliers = supplierList.filter(
      (s) =>
        s?.status?.toLowerCase() === "inactive" ||
        s?.status?.toLowerCase() === "blocked",
    ).length;

    return {
      customers: {
        total: customerList.length,
        active: activeCustomers,
        inactive: inactiveCustomers,
        recent: getRecentAddedCount(customerList),
      },
      suppliers: {
        total: supplierList.length,
        active: activeSuppliers,
        inactive: inactiveSuppliers,
        recent: getRecentAddedCount(supplierList),
      },
    };
  }, [customers, suppliers, getRecentAddedCount]);

  const pageProps = {
    partiesData,
    isLoading,
    hasError,
    handleRefresh,
    handleViewCustomers,
    handleViewSuppliers,
  };

  return isMobile ? (
    <PartiesMobilePage {...pageProps} />
  ) : (
    <PartiesDesktopPage {...pageProps} />
  );
};

export default PartiesPage;

