import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import useBranch from "@/features/branch/hooks/useBranch";
import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";
import useCashAccount from "../hooks/useCashAccount";
import CreateCashAccountDesktopPage from "./desktop/CreateCashAccountDesktopPage";
import CreateCashAccountMobilePage from "./mobile/CreateCashAccountMobilePage";

const INITIAL_DENOMINATIONS = [
  { denomination: 500, quantity: 0 },
  { denomination: 200, quantity: 0 },
  { denomination: 100, quantity: 0 },
  { denomination: 50, quantity: 0 },
  { denomination: 20, quantity: 0 },
  { denomination: 10, quantity: 0 },
  { denomination: 5, quantity: 0 },
  { denomination: 2, quantity: 0 },
  { denomination: 1, quantity: 0 },
];

const INITIAL_FORM_DATA = {
  accountName: "",
  openingBalance: 0,
  openingBalanceType: "dr",
  description: "",
  isPrimary: false,
  branchId: "",
};

const CreateCashAccountPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    createCashAccount,
    createCashAccountStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = useCashAccount();

  const { branches = [], getCompanyBranches } = useBranch();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [denominations, setDenominations] = useState(INITIAL_DENOMINATIONS);
  const [formErrors, setFormErrors] = useState({});
  const hasFetchedBranchesRef = React.useRef(false);

  const handleQtyChange = useCallback((denomValue, qty) => {
    const cleanQty = Math.max(0, parseInt(qty) || 0);
    setDenominations((prev) =>
      prev.map((d) => (d.denomination === denomValue ? { ...d, quantity: cleanQty } : d))
    );
  }, []);

  const physicalTotal = useMemo(() => {
    return denominations.reduce((acc, curr) => acc + curr.denomination * curr.quantity, 0);
  }, [denominations]);

  useEffect(() => {
    if (hasFetchedBranchesRef.current) return;
    hasFetchedBranchesRef.current = true;
    getCompanyBranches().catch((err) =>
      console.error("Failed to load branches:", err)
    );
  }, [getCompanyBranches]);

  // Clean up notifications/errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading = createCashAccountStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
      clearError();
    },
    [formErrors, clearError]
  );

  const handleCancel = useCallback(() => {
    navigate(ROUTES.CASH_ACCOUNTS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};
      const accName = String(formData.accountName || "").trim();
      const openBal = Number(formData.openingBalance) || 0;
      const desc = String(formData.description || "").trim();

      if (!accName) {
        errors.accountName = "Cash account name is required";
      } else if (accName.length < 2) {
        errors.accountName = "Cash account name must be at least 2 characters";
      }

      if (openBal < 0) {
        errors.openingBalance = "Opening balance cannot be negative";
      }

      let filteredDenoms = [];
      if (openBal > 0) {
        filteredDenoms = denominations
          .filter((d) => d.quantity > 0)
          .map((d) => ({
            denomination: Number(d.denomination),
            quantity: Number(d.quantity),
          }));

        if (filteredDenoms.length > 0) {
          const totalDenom = filteredDenoms.reduce((sum, d) => sum + d.denomination * d.quantity, 0);
          if (totalDenom !== openBal) {
            errors.denominations = `Denomination total (₹${totalDenom}) does not match opening balance (₹${openBal})`;
          }
        }
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        accountName: accName,
        openingBalance: openBal,
        openingBalanceType: formData.openingBalanceType || "dr",
        denominations: filteredDenoms.length > 0 ? filteredDenoms : undefined,
        description: desc || null,
        isPrimary: Boolean(formData.isPrimary),
        branchId: formData.branchId || null,
      };

      try {
        await createCashAccount(payload);
        navigate(ROUTES.CASH_ACCOUNTS);
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to create cash account. Please try again.",
        });
      }
    },
    [formData, denominations, createCashAccount, navigate]
  );

  const branchOptions = useMemo(() => {
    return [
      { label: "None / Shared (Central Office)", value: "" },
      ...branches.map((b) => ({
        label: b.name || "Branch",
        value: b._id,
      })),
    ];
  }, [branches]);

  const pageProps = {
    formData,
    formErrors,
    denominations,
    physicalTotal,
    isLoading,
    branchOptions,
    handleFieldChange,
    handleQtyChange,
    handleCancel,
    handleSubmit,
    serverError,
    clearError,
  };

  return isMobile ? (
    <CreateCashAccountMobilePage {...pageProps} />
  ) : (
    <CreateCashAccountDesktopPage {...pageProps} />
  );
};

export default CreateCashAccountPage;
