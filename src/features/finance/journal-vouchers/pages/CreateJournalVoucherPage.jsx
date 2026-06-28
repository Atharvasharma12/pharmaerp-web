import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useJournalVoucher from "../hooks/useJournalVoucher";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";
import CreateJournalVoucherDesktopPage from "./desktop/CreateJournalVoucherDesktopPage";
import CreateJournalVoucherMobilePage from "./mobile/CreateJournalVoucherMobilePage";

const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const INITIAL_LINE_ITEM = {
  accountId: "",
  debit: 0,
  credit: 0,
  narration: "",
};

const INITIAL_FORM_DATA = {
  voucherDate: getTodayString(),
  voucherType: "JOURNAL",
  referenceNumber: "",
  narration: "",
  status: "DRAFT",
  lines: [
    { ...INITIAL_LINE_ITEM },
    { ...INITIAL_LINE_ITEM },
  ],
};

const CreateJournalVoucherPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedAccountsRef = useRef(false);

  const {
    createJournalVoucher,
    createJournalVoucherStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = useJournalVoucher();

  const { accounts, getAccounts } = useAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Pre-load ledger accounts list for form selects
  useEffect(() => {
    if (hasFetchedAccountsRef.current) return;
    hasFetchedAccountsRef.current = true;

    getAccounts({ all: true }).catch((err) =>
      console.error("Failed to load accounts list for journal voucher:", err)
    );
  }, [getAccounts]);

  // Clean up notices on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading = createJournalVoucherStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  }, []);

  const handleLineChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedLines = prev.lines.map((line, idx) => {
        if (idx !== index) return line;

        // If setting debit, set credit to 0 (and vice versa)
        if (field === "debit") {
          const debVal = parseFloat(value) || 0;
          return { ...line, debit: debVal, credit: debVal > 0 ? 0 : line.credit };
        }
        if (field === "credit") {
          const credVal = parseFloat(value) || 0;
          return { ...line, credit: credVal, debit: credVal > 0 ? 0 : line.debit };
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
      lines: [...prev.lines, { ...INITIAL_LINE_ITEM }],
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

      if (!formData.voucherType) {
        errors.voucherType = "Select the voucher type";
      }

      // Lines Validation
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
          errors.lines = `Imbalanced entry: Total debits (${formatCurrency(totalDebits)}) must equal credits (${formatCurrency(totalCredits)})`;
        }
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        voucherDate: new Date(formData.voucherDate).toISOString(),
        voucherType: formData.voucherType,
        referenceNumber: String(formData.referenceNumber || "").trim() || null,
        narration: String(formData.narration || "").trim() || null,
        status: formData.status,
        lines: verifiedLines,
      };

      try {
        await createJournalVoucher(payload);
        navigate(ROUTES.JOURNAL_VOUCHERS);
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to create Journal Voucher. Verify input rows.",
        });
      }
    },
    [formData, createJournalVoucher, navigate]
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
  };

  return isMobile ? (
    <CreateJournalVoucherMobilePage {...pageProps} />
  ) : (
    <CreateJournalVoucherDesktopPage {...pageProps} />
  );
};

export default CreateJournalVoucherPage;
