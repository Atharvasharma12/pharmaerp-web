import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCashAccount from "../hooks/useCashAccount";
import EditCashAccountDesktopPage from "./desktop/EditCashAccountDesktopPage";
import EditCashAccountMobilePage from "./mobile/EditCashAccountMobilePage";

const INITIAL_FORM_DATA = {
  accountName: "",
  openingBalance: 0,
  description: "",
  isPrimary: false,
  status: "active",
};

const EditCashAccountPage = () => {
  const { cashAccountId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    getCashAccountById,
    updateCashAccount,
    getCashAccountStatus,
    updateCashAccountStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = useCashAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchInitData = async () => {
      try {
        const data = await getCashAccountById(cashAccountId);
        if (data) {
          setFormData({
            accountName: data.accountName || "",
            openingBalance: data.openingBalance || 0,
            description: data.description || "",
            isPrimary: Boolean(data.isPrimary),
            status: data.status || "active",
          });
        }
      } catch (err) {
        console.error("Failed to load cash account details:", err);
        setFormErrors({ submit: "Failed to load cash account details. Returning to list." });
        setTimeout(() => navigate(ROUTES.CASH_ACCOUNTS), 2000);
      }
    };

    fetchInitData();
  }, [cashAccountId, getCashAccountById, navigate]);

  // Clean up notifications/errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading = updateCashAccountStatus === API_STATUS.LOADING;
  const isFetching = getCashAccountStatus === API_STATUS.LOADING;

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
      const desc = String(formData.description || "").trim();

      if (!accName) {
        errors.accountName = "Cash account name is required";
      } else if (accName.length < 2) {
        errors.accountName = "Cash account name must be at least 2 characters";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        accountName: accName,
        description: desc || null,
        status: formData.status,
        isPrimary: Boolean(formData.isPrimary),
      };

      try {
        await updateCashAccount(cashAccountId, payload);
        navigate(ROUTES.CASH_ACCOUNTS, { replace: true });
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to update cash account. Please try again.",
        });
      }
    },
    [formData, cashAccountId, updateCashAccount, navigate]
  );

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    isFetching,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError,
    clearError,
  };

  return isMobile ? (
    <EditCashAccountMobilePage {...pageProps} />
  ) : (
    <EditCashAccountDesktopPage {...pageProps} />
  );
};

export default EditCashAccountPage;
