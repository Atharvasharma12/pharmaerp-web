import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useJournalVoucher from "../hooks/useJournalVoucher";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";
import EditJournalVoucherDesktopPage from "./desktop/EditJournalVoucherDesktopPage";
import EditJournalVoucherMobilePage from "./mobile/EditJournalVoucherMobilePage";

const INITIAL_FORM_DATA = {
  voucherDate: "",
  voucherType: "JOURNAL",
  referenceNumber: "",
  narration: "",
  status: "DRAFT",
  lines: [],
};

const EditJournalVoucherPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { voucherId } = useParams();
  const hasFetchedRef = useRef(null);
  const hasFetchedAccountsRef = useRef(false);

  const {
    managedJournalVoucher,
    getJournalVoucherById,
    getJournalVoucherStatus,
    updateJournalVoucher,
    updateJournalVoucherStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = useJournalVoucher();

  const { accounts, getAccounts } = useAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Fetch accounts list for selection inputs
  useEffect(() => {
    if (hasFetchedAccountsRef.current) return;
    hasFetchedAccountsRef.current = true;

    getAccounts({ all: true }).catch((err) =>
      console.error("Failed to load accounts list for edit view:", err),
    );
  }, [getAccounts]);

  // Fetch existing details
  useEffect(() => {
    if (hasFetchedRef.current === voucherId) return;
    hasFetchedRef.current = voucherId;

    getJournalVoucherById(voucherId).catch((err) =>
      console.error("Failed to load voucher details for edit view:", err),
    );
  }, [voucherId, getJournalVoucherById]);

  // Populate form with loaded data
  useEffect(() => {
    if (managedJournalVoucher && managedJournalVoucher._id === voucherId) {
      const formattedDate = managedJournalVoucher.voucherDate
        ? new Date(managedJournalVoucher.voucherDate)
            .toISOString()
            .split("T")[0]
        : "";

      setFormData({
        voucherDate: formattedDate,
        voucherType: managedJournalVoucher.voucherType || "JOURNAL",
        referenceNumber: managedJournalVoucher.referenceNumber || "",
        narration: managedJournalVoucher.narration || "",
        status: managedJournalVoucher.status || "DRAFT",
        lines:
          managedJournalVoucher.lines?.map((line) => ({
            accountId: line.accountId?._id || line.accountId || "",
            debit: line.debit || 0,
            credit: line.credit || 0,
            narration: line.narration || "",
          })) || [],
      });
    }
  }, [managedJournalVoucher, voucherId]);

  // Clean up notices on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading =
    getJournalVoucherStatus === API_STATUS.LOADING ||
    updateJournalVoucherStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  }, []);

  const handleLineChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedLines = prev.lines.map((line, idx) => {
        if (idx !== index) return line;

        if (field === "debit") {
          const debVal = parseFloat(value) || 0;
          return {
            ...line,
            debit: debVal,
            credit: debVal > 0 ? 0 : line.credit,
          };
        }
        if (field === "credit") {
          const credVal = parseFloat(value) || 0;
          return {
            ...line,
            credit: credVal,
            debit: credVal > 0 ? 0 : line.debit,
          };
        }

        return { ...line, [field]: value };
      });
      return { ...prev, lines: updatedLines };
    });
    setFormErrors((prev) => ({ ...prev, lines: "", submit: "" }));
  }, []);

  const handleAddLine = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      lines: [
        ...prev.lines,
        { accountId: "", debit: 0, credit: 0, narration: "" },
      ],
    }));
  }, []);

  const handleRemoveLine = useCallback((index) => {
    setFormData((prev) => {
      if (prev.lines.length <= 2) return prev;
      return {
        ...prev,
        lines: prev.lines.filter((_, idx) => idx !== index),
      };
    });
  }, []);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.JOURNAL_VOUCHERS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};

      if (!formData.voucherDate) {
        errors.voucherDate = "Select the voucher date";
      }

      let totalDebits = 0;
      let totalCredits = 0;
      const verifiedLines = [];

      formData.lines.forEach((line, idx) => {
        if (!line.accountId) {
          errors.lines = `Account selection is missing on line ${idx + 1}`;
        }

        const debitAmount = parseFloat(line.debit) || 0;
        const creditAmount = parseFloat(line.credit) || 0;

        if (debitAmount < 0 || creditAmount < 0) {
          errors.lines = `Amount values cannot be negative on line ${idx + 1}`;
        }
        if (debitAmount === 0 && creditAmount === 0) {
          errors.lines = `Row ${idx + 1} must contain either a debit or a credit amount`;
        }
        if (debitAmount > 0 && creditAmount > 0) {
          errors.lines = `Row ${idx + 1} cannot contain both debit and credit amounts`;
        }

        totalDebits += debitAmount;
        totalCredits += creditAmount;

        verifiedLines.push({
          accountId: line.accountId,
          debit: debitAmount,
          credit: creditAmount,
          narration: String(line.narration || "").trim() || undefined,
        });
      });

      if (!errors.lines) {
        if (totalDebits === 0) {
          errors.lines = "Total debit amount must be greater than zero";
        } else if (Math.abs(totalDebits - totalCredits) > 0.009) {
          errors.lines = `Imbalanced entry: Debits and Credits must balance`;
        }
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        voucherDate: new Date(formData.voucherDate).toISOString(),
        referenceNumber: String(formData.referenceNumber || "").trim() || null,
        narration: String(formData.narration || "").trim() || null,
        status: formData.status,
        lines: verifiedLines,
      };

      try {
        await updateJournalVoucher(voucherId, payload);
        navigate(ROUTES.JOURNAL_VOUCHERS);
      } catch (err) {
        setFormErrors({
          submit:
            typeof err === "string" ? err : "Failed to update Journal Voucher.",
        });
      }
    },
    [formData, voucherId, updateJournalVoucher, navigate],
  );

  const pageProps = {
    formData,
    formErrors,
    accounts: accounts || [],
    isLoading,
    handleFieldChange,
    handleLineChange,
    handleAddLine,
    handleRemoveLine,
    handleCancel,
    handleSubmit,
    serverError,
    clearError,
    originalVoucher: managedJournalVoucher,
  };

  return isMobile ? (
    <EditJournalVoucherMobilePage {...pageProps} />
  ) : (
    <EditJournalVoucherDesktopPage {...pageProps} />
  );
};

export default EditJournalVoucherPage;
