import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import usePaymentQr from "../hooks/usePaymentQr";
import EditPaymentQrDesktopPage from "./desktop/EditPaymentQrDesktopPage";
import EditPaymentQrMobilePage from "./mobile/EditPaymentQrMobilePage";

const INITIAL_FORM_DATA = {
  bankAccountId: "",
  bankName: "",
  upiId: "",
  label: "",
  provider: "OTHER",
  qrImageUrl: "",
  isPrimary: false,
  status: "ACTIVE",
};

const EditPaymentQrPage = () => {
  const { paymentQrId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    getPaymentQrById,
    updatePaymentQr,
    getPaymentQrStatus,
    updatePaymentQrStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = usePaymentQr();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchInitData = async () => {
      try {
        const data = await getPaymentQrById(paymentQrId);
        if (data) {
          setFormData({
            bankAccountId: data.bankAccountId?._id || "",
            bankName: data.bankAccountId
              ? `${data.bankAccountId.bankName} - *${String(data.bankAccountId.accountNumber || "").slice(-4)}`
              : "",
            upiId: data.upiId || "",
            label: data.label || "",
            provider: data.provider || "OTHER",
            qrImageUrl: data.qrImageUrl || "",
            isPrimary: Boolean(data.isPrimary),
            status: data.status || "ACTIVE",
          });
        }
      } catch (err) {
        console.error("Failed to load payment QR details:", err);
        setFormErrors({ submit: "Failed to load payment QR. Returning to list." });
        setTimeout(() => navigate(ROUTES.PAYMENT_QRS), 2000);
      }
    };

    fetchInitData();
  }, [paymentQrId, getPaymentQrById, navigate]);

  // Clean up notifications/errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading = updatePaymentQrStatus === API_STATUS.LOADING;
  const isFetching = getPaymentQrStatus === API_STATUS.LOADING;

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
      const label = String(formData.label || "").trim();
      const qrUrl = String(formData.qrImageUrl || "").trim();

      if (qrUrl && !/^https?:\/\/.+/.test(qrUrl)) {
        errors.qrImageUrl = "QR image URL must be a valid URL starting with http/https";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        label: label || null,
        provider: formData.provider,
        qrImageUrl: qrUrl || null,
        status: formData.status,
        isPrimary: Boolean(formData.isPrimary),
      };

      try {
        await updatePaymentQr(paymentQrId, payload);
        navigate(ROUTES.PAYMENT_QRS, { replace: true });
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to update Payment QR. Please try again.",
        });
      }
    },
    [formData, paymentQrId, updatePaymentQr, navigate]
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
    <EditPaymentQrMobilePage {...pageProps} />
  ) : (
    <EditPaymentQrDesktopPage {...pageProps} />
  );
};

export default EditPaymentQrPage;
