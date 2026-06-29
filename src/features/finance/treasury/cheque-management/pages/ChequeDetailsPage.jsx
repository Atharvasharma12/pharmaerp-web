import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useCheque from "../hooks/useCheque";
import ChequeDetailsDesktopPage from "./desktop/ChequeDetailsDesktopPage";
import ChequeDetailsMobilePage from "./mobile/ChequeDetailsMobilePage";

const ChequeDetailsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { chequeId } = useParams();

  const {
    managedCheque,
    getChequeById,
    getChequeStatus,
    depositCheque,
    depositChequeStatus,
    clearCheque,
    clearChequeStatus,
    bounceCheque,
    bounceChequeStatus,
    cancelCheque,
    cancelChequeStatus,
    error,
    clearError,
    message,
    clearMessage,
  } = useCheque();

  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const fetchDetails = useCallback(async () => {
    if (!chequeId) return;
    try {
      await getChequeById(chequeId);
    } catch (err) {
      console.error("Failed to load cheque details:", err);
    }
  }, [chequeId, getChequeById]);

  useEffect(() => {
    fetchDetails();
  }, [chequeId]); // Only trigger when chequeId changes to prevent infinite loops

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleDeposit = useCallback(async () => {
    if (!chequeId) return;
    setActionError("");
    setActionMessage("");
    try {
      await depositCheque(chequeId);
      setActionMessage("Cheque deposited to bank successfully.");
      fetchDetails();
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Failed to deposit cheque.");
    }
  }, [chequeId, depositCheque, fetchDetails]);

  const handleClear = useCallback(async (clearDate = "") => {
    if (!chequeId) return;
    setActionError("");
    setActionMessage("");
    try {
      await clearCheque(chequeId, { clearDate: clearDate || undefined });
      setActionMessage("Cheque cleared by the bank successfully.");
      fetchDetails();
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Failed to clear cheque.");
    }
  }, [chequeId, clearCheque, fetchDetails]);

  const handleBounce = useCallback(async (reason, bounceCharges = 0) => {
    if (!chequeId) return;
    setActionError("");
    setActionMessage("");
    try {
      await bounceCheque(chequeId, { reason, bounceCharges: Number(bounceCharges) || 0 });
      setActionMessage("Cheque marked as bounced successfully.");
      fetchDetails();
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Failed to bounce cheque.");
    }
  }, [chequeId, bounceCheque, fetchDetails]);

  const handleCancel = useCallback(async (reason = "") => {
    if (!chequeId) return;
    setActionError("");
    setActionMessage("");
    try {
      await cancelCheque(chequeId, { reason });
      setActionMessage("Cheque transaction cancelled successfully.");
      fetchDetails();
    } catch (err) {
      setActionError(typeof err === "string" ? err : "Failed to cancel cheque.");
    }
  }, [chequeId, cancelCheque, fetchDetails]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.CHEQUES);
  }, [navigate]);

  const isLoading = getChequeStatus === API_STATUS.LOADING;
  const isTransitioning =
    depositChequeStatus === API_STATUS.LOADING ||
    clearChequeStatus === API_STATUS.LOADING ||
    bounceChequeStatus === API_STATUS.LOADING ||
    cancelChequeStatus === API_STATUS.LOADING;

  const pageProps = {
    chequeDetails: managedCheque,
    isLoading,
    isTransitioning,
    error: error || actionError,
    message: message || actionMessage,
    clearFeedback: () => {
      clearError();
      clearMessage();
      setActionError("");
      setActionMessage("");
    },
    handleDeposit,
    handleClear,
    handleBounce,
    handleCancel,
    handleBack,
  };

  return isMobile ? (
    <ChequeDetailsMobilePage {...pageProps} />
  ) : (
    <ChequeDetailsDesktopPage {...pageProps} />
  );
};

export default ChequeDetailsPage;
