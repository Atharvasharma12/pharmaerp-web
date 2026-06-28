import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useJournalVoucher from "../hooks/useJournalVoucher";
import { JournalVoucherDetailsDesktopPage } from "./desktop";
import { JournalVoucherDetailsMobilePage } from "./mobile";

const JournalVoucherDetailsPage = () => {
  const navigate = useNavigate();
  const { voucherId } = useParams();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(null);

  const {
    managedJournalVoucher,
    getJournalVoucherById,
    getJournalVoucherStatus,
    postJournalVoucher,
    cancelJournalVoucher,
    submitJournalVoucherApproval,
    approveJournalVoucher,
    reverseJournalVoucher,
    postJournalVoucherStatus,
    cancelJournalVoucherStatus,
    submitJournalVoucherApprovalStatus,
    approveJournalVoucherStatus,
    reverseJournalVoucherStatus,
    error,
    clearError,
    clearManagedJournalVoucher,
  } = useJournalVoucher();

  const [localErrors, setLocalErrors] = useState({});

  const isLoading = getJournalVoucherStatus === API_STATUS.LOADING;
  const isActioning =
    postJournalVoucherStatus === API_STATUS.LOADING ||
    cancelJournalVoucherStatus === API_STATUS.LOADING ||
    submitJournalVoucherApprovalStatus === API_STATUS.LOADING ||
    approveJournalVoucherStatus === API_STATUS.LOADING ||
    reverseJournalVoucherStatus === API_STATUS.LOADING;

  const fetchDetails = useCallback(async () => {
    if (!voucherId) return;
    try {
      await getJournalVoucherById(voucherId);
    } catch (e) {
      console.error("Failed to load journal voucher details:", e);
    }
  }, [voucherId, getJournalVoucherById]);

  useEffect(() => {
    if (hasFetchedRef.current === voucherId) return;
    hasFetchedRef.current = voucherId;

    fetchDetails();

    return () => {
      clearError();
      clearManagedJournalVoucher();
    };
  }, [voucherId, fetchDetails, clearError, clearManagedJournalVoucher]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.JOURNAL_VOUCHERS);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    if (!voucherId) return;
    navigate(ROUTES.EDIT_JOURNAL_VOUCHER(voucherId));
  }, [voucherId, navigate]);

  const handleRefresh = useCallback(() => {
    clearError();
    setLocalErrors({});
    hasFetchedRef.current = null;
    fetchDetails();
  }, [clearError, fetchDetails]);

  // Action Triggers
  const handlePost = useCallback(async () => {
    if (
      !window.confirm(
        "Are you sure you want to post this voucher directly to the general ledger?",
      )
    )
      return;
    try {
      await postJournalVoucher(voucherId);
      fetchDetails();
    } catch (err) {
      setLocalErrors({
        post: typeof err === "string" ? err : "Failed to post voucher.",
      });
    }
  }, [voucherId, postJournalVoucher, fetchDetails]);

  const handleCancel = useCallback(async () => {
    if (
      !window.confirm(
        "Are you sure you want to void/cancel this journal voucher?",
      )
    )
      return;
    try {
      await cancelJournalVoucher(voucherId);
      fetchDetails();
    } catch (err) {
      setLocalErrors({
        cancel: typeof err === "string" ? err : "Failed to cancel voucher.",
      });
    }
  }, [voucherId, cancelJournalVoucher, fetchDetails]);

  const handleApprovalSubmit = useCallback(async () => {
    try {
      await submitJournalVoucherApproval(voucherId);
      fetchDetails();
    } catch (err) {
      setLocalErrors({
        approval:
          typeof err === "string" ? err : "Failed to submit for approval.",
      });
    }
  }, [voucherId, submitJournalVoucherApproval, fetchDetails]);

  const handleApprove = useCallback(async () => {
    try {
      await approveJournalVoucher(voucherId);
      fetchDetails();
    } catch (err) {
      setLocalErrors({
        approve: typeof err === "string" ? err : "Failed to approve voucher.",
      });
    }
  }, [voucherId, approveJournalVoucher, fetchDetails]);

  const handleReverse = useCallback(async () => {
    if (
      !window.confirm(
        "Are you sure you want to reverse this voucher? This creates offsetting ledger items.",
      )
    )
      return;
    try {
      await reverseJournalVoucher(voucherId);
      fetchDetails();
    } catch (err) {
      setLocalErrors({
        reverse: typeof err === "string" ? err : "Failed to reverse voucher.",
      });
    }
  }, [voucherId, reverseJournalVoucher, fetchDetails]);

  const pageProps = useMemo(
    () => ({
      voucher: managedJournalVoucher,
      isLoading,
      isActioning,
      error:
        error ||
        localErrors.post ||
        localErrors.cancel ||
        localErrors.approval ||
        localErrors.approve ||
        localErrors.reverse,
      handleBack,
      handleEdit,
      handleRefresh,
      handlePost,
      handleCancel,
      handleApprovalSubmit,
      handleApprove,
      handleReverse,
      clearLocalErrors: () => setLocalErrors({}),
    }),
    [
      managedJournalVoucher,
      isLoading,
      isActioning,
      error,
      localErrors,
      handleBack,
      handleEdit,
      handleRefresh,
      handlePost,
      handleCancel,
      handleApprovalSubmit,
      handleApprove,
      handleReverse,
    ],
  );

  return isMobile ? (
    <JournalVoucherDetailsMobilePage {...pageProps} />
  ) : (
    <JournalVoucherDetailsDesktopPage {...pageProps} />
  );
};

export default JournalVoucherDetailsPage;
