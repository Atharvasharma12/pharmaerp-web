import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import usePaymentQr from "../hooks/usePaymentQr";
import useBankAccount from "@/features/finance/treasury/bank-management/bank-accounts/hooks/useBankAccount";
import CreatePaymentQrDesktopPage from "./desktop/CreatePaymentQrDesktopPage";
import CreatePaymentQrMobilePage from "./mobile/CreatePaymentQrMobilePage";

const INITIAL_FORM_DATA = {
  bankAccountId: "",
  upiId: "",
  label: "",
  provider: "OTHER",
  qrImageUrl: "",
  isPrimary: false,
};

const CreatePaymentQrPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    createPaymentQr,
    createPaymentQrStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = usePaymentQr();

  const { bankAccounts, getBankAccounts } = useBankAccount();
  const hasFetchedRef = useRef(false);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Fetch all active bank accounts to populate selection dropdown
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchBanks = async () => {
      try {
        await getBankAccounts({ all: true });
      } catch (err) {
        console.error("Failed to load bank accounts for selection:", err);
      }
    };
    fetchBanks();
  }, [getBankAccounts]);

  // Clean up notifications/errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading = createPaymentQrStatus === API_STATUS.LOADING;

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
    navigate(ROUTES.PAYMENT_QRS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};
      const upiId = String(formData.upiId || "").trim();
      const label = String(formData.label || "").trim();
      const qrUrl = String(formData.qrImageUrl || "").trim();

      if (!formData.bankAccountId) {
        errors.bankAccountId = "Linked bank account is required";
      }

      if (!upiId) {
        errors.upiId = "UPI ID address is required";
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(upiId)) {
        errors.upiId = "Invalid UPI ID format (e.g. merchant@oksbi or pay@upi)";
      }

      if (qrUrl && !/^https?:\/\/.+/.test(qrUrl)) {
        errors.qrImageUrl = "QR image URL must be a valid URL starting with http/https";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        bankAccountId: formData.bankAccountId,
        upiId: upiId.toLowerCase(),
        label: label || null,
        provider: formData.provider,
        qrImageUrl: qrUrl || null,
        isPrimary: Boolean(formData.isPrimary),
      };

      try {
        await createPaymentQr(payload);
        navigate(ROUTES.PAYMENT_QRS);
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to create Payment QR. Please try again.",
        });
      }
    },
    [formData, createPaymentQr, navigate]
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
    <CreatePaymentQrMobilePage {...pageProps} />
  ) : (
    <CreatePaymentQrDesktopPage {...pageProps} />
  );
};

export default CreatePaymentQrPage;
