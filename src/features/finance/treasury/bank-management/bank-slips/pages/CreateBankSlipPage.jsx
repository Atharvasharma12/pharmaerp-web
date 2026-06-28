import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankSlip from "../hooks/useBankSlip";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import CreateBankSlipDesktopPage from "./desktop/CreateBankSlipDesktopPage";
import CreateBankSlipMobilePage from "./mobile/CreateBankSlipMobilePage";

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const INITIAL_FORM_DATA = {
  bankAccountId: "",
  slipType: "CASH_DEPOSIT",
  bankSlipReference: "",
  slipDate: getTodayString(),
  amount: "",
  narration: "",
};

const CreateBankSlipPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedBanksRef = useRef(false);

  const {
    createBankSlip,
    createBankSlipStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = useBankSlip();

  const { bankAccounts, getBankAccounts } = useBankAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Fetch active bank accounts list for selection dropdown
  useEffect(() => {
    if (hasFetchedBanksRef.current) return;
    hasFetchedBanksRef.current = true;

    getBankAccounts({ all: true }).catch((err) =>
      console.error("Failed to load bank accounts list for slips:", err)
    );
  }, [getBankAccounts]);

  // Cleanup notifications on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading = createBankSlipStatus === API_STATUS.LOADING;

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
    navigate(ROUTES.BANK_SLIPS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};
      const amount = parseFloat(formData.amount);
      const ref = String(formData.bankSlipReference || "").trim();
      const narr = String(formData.narration || "").trim();

      if (!formData.bankAccountId) {
        errors.bankAccountId = "Select a linked bank account";
      }

      if (!formData.slipDate) {
        errors.slipDate = "Select the slip date";
      }

      if (isNaN(amount) || amount <= 0) {
        errors.amount = "Enter a valid amount greater than zero";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        bankAccountId: formData.bankAccountId,
        slipType: formData.slipType,
        bankSlipReference: ref || null,
        slipDate: new Date(formData.slipDate).toISOString(),
        amount,
        narration: narr || null,
      };

      try {
        await createBankSlip(payload);
        navigate(ROUTES.BANK_SLIPS);
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to create Bank Slip. Please try again.",
        });
      }
    },
    [formData, createBankSlip, navigate]
  );

  const pageProps = {
    formData,
    formErrors,
    bankAccounts: bankAccounts || [],
    isLoading,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError,
    clearError,
  };

  return isMobile ? (
    <CreateBankSlipMobilePage {...pageProps} />
  ) : (
    <CreateBankSlipDesktopPage {...pageProps} />
  );
};

export default CreateBankSlipPage;
