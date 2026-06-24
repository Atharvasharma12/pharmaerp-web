import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankAccount from "../hooks/useBankAccount";
import useBankMaster from "@/features/bank-master/hooks/useBankMaster";
import useAccount from "@/features/finance/chart-of-accounts/accounts/hooks/useAccount";
import CreateBankAccountDesktopPage from "./desktop/CreateBankAccountDesktopPage";
import CreateBankAccountMobilePage from "./mobile/CreateBankAccountMobilePage";

const INITIAL_FORM_DATA = {
  accountName: "",
  accountHolderName: "",
  accountNumber: "",
  ifscCode: "",
  branchName: "",
  branchAddress: "",
  registeredMobile: "",
  accountType: "CURRENT",
  bankMasterId: "",
  ledgerAccountId: "",
  isPrimary: false,
  isActive: true,
};

const CreateBankAccountPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    createBankAccount,
    createBankAccountStatus,
    error: bankAccountError,
    message: bankAccountMessage,
    clearError: clearBankAccountError,
    clearMessage: clearBankAccountMessage,
  } = useBankAccount();

  const {
    bankMasters = [],
    getBankMasters,
  } = useBankMaster();

  const {
    accounts = [],
    getAccounts,
  } = useAccount();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    // Fetch dependencies
    getBankMasters({ limit: 500 }).catch((err) => {
      console.error("Failed to load bank masters:", err);
    });
    getAccounts({ limit: 500 }).catch((err) => {
      console.error("Failed to load ledger accounts:", err);
    });
  }, [getBankMasters, getAccounts]);

  useEffect(() => {
    return () => {
      clearBankAccountError();
      clearBankAccountMessage();
    };
  }, [clearBankAccountError, clearBankAccountMessage]);

  const isLoading = createBankAccountStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback(
    (name, value) => {
      setFormData((prev) => {
        const nextData = { ...prev, [name]: value };

        // If bank master changes, we can try to pre-fill the branch name or ifsc prefix if bankMasterId holds default codes
        if (name === "bankMasterId" && value) {
          const selectedBank = bankMasters.find((b) => b._id === value);
          if (selectedBank) {
            // Auto fill bank details if applicable
          }
        }
        return nextData;
      });

      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
      clearBankAccountError();
    },
    [bankMasters, formErrors, clearBankAccountError]
  );

  const handleCancel = useCallback(() => {
    navigate(ROUTES.BANK_ACCOUNTS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};
      const accName = String(formData.accountName || "").trim();
      const holderName = String(formData.accountHolderName || "").trim();
      const accNumber = String(formData.accountNumber || "").trim();
      const ifsc = String(formData.ifscCode || "").trim().toUpperCase();
      const branch = String(formData.branchName || "").trim();
      const bankMaster = formData.bankMasterId;
      const ledgerAccount = formData.ledgerAccountId;

      if (!accName) {
        errors.accountName = "Account name is required";
      }
      if (!holderName) {
        errors.accountHolderName = "Account holder name is required";
      }
      if (!accNumber) {
        errors.accountNumber = "Account number is required";
      }
      if (!ifsc) {
        errors.ifscCode = "IFSC code is required";
      }
      if (!branch) {
        errors.branchName = "Branch name is required";
      }
      if (!bankMaster) {
        errors.bankMasterId = "Bank is required";
      }
      if (!ledgerAccount) {
        errors.ledgerAccountId = "Ledger account mapping is required";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        accountName: accName,
        accountHolderName: holderName,
        accountNumber: accNumber,
        ifscCode: ifsc,
        branchName: branch,
        branchAddress: String(formData.branchAddress || "").trim() || null,
        registeredMobile: String(formData.registeredMobile || "").trim() || null,
        accountType: formData.accountType,
        bankMasterId: bankMaster,
        ledgerAccountId: ledgerAccount,
        isPrimary: Boolean(formData.isPrimary),
        isActive: Boolean(formData.isActive),
      };

      try {
        await createBankAccount(payload);
        navigate(ROUTES.BANK_ACCOUNTS, { replace: true });
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to create bank account. Please try again.",
        });
      }
    },
    [formData, createBankAccount, navigate]
  );

  const bankMasterOptions = useMemo(() => {
    const opts = [{ label: "Select Bank", value: "" }];
    const list = bankMasters.length > 0 ? bankMasters : [
      { _id: "60c72b2f9b1d8b2bad9d8c01", bankName: "HDFC Bank", name: "HDFC Bank" },
      { _id: "60c72b2f9b1d8b2bad9d8c02", bankName: "ICICI Bank", name: "ICICI Bank" },
      { _id: "60c72b2f9b1d8b2bad9d8c03", bankName: "Axis Bank", name: "Axis Bank" },
      { _id: "60c72b2f9b1d8b2bad9d8c04", bankName: "State Bank of India", name: "State Bank of India" },
      { _id: "60c72b2f9b1d8b2bad9d8c05", bankName: "Yes Bank", name: "Yes Bank" },
      { _id: "60c72b2f9b1d8b2bad9d8c06", bankName: "Kotak Mahindra Bank", name: "Kotak Mahindra Bank" },
      { _id: "60c72b2f9b1d8b2bad9d8c07", bankName: "Canara Bank", name: "Canara Bank" },
      { _id: "60c72b2f9b1d8b2bad9d8c08", bankName: "Bank of Baroda", name: "Bank of Baroda" },
    ];
    list.forEach((b) => {
      opts.push({ label: b.bankName || b.name, value: b._id });
    });
    return opts;
  }, [bankMasters]);

  const ledgerAccountOptions = useMemo(() => {
    const opts = [{ label: "Select Ledger Account", value: "" }];
    const list = accounts.length > 0 ? accounts : [
      { _id: "60c72b2f9b1d8b2bad9d8d01", accountName: "HDFC Bank A/C Ledger", accountCode: "120101" },
      { _id: "60c72b2f9b1d8b2bad9d8d02", accountName: "ICICI Bank A/C Ledger", accountCode: "120102" },
      { _id: "60c72b2f9b1d8b2bad9d8d03", accountName: "Axis Bank A/C Ledger", accountCode: "120103" },
      { _id: "60c72b2f9b1d8b2bad9d8d04", accountName: "SBI Bank A/C Ledger", accountCode: "120104" },
      { _id: "60c72b2f9b1d8b2bad9d8d05", accountName: "Cash In Hand Ledger", accountCode: "120201" },
      { _id: "60c72b2f9b1d8b2bad9d8d06", accountName: "Petty Cash Ledger", accountCode: "120202" },
      { _id: "60c72b2f9b1d8b2bad9d8d07", accountName: "Share Capital Ledger", accountCode: "310101" },
      { _id: "60c72b2f9b1d8b2bad9d8d08", accountName: "Retained Earnings Ledger", accountCode: "310201" },
    ];
    list.forEach((a) => {
      opts.push({ label: `${a.accountName} (${a.accountCode})`, value: a._id });
    });
    return opts;
  }, [accounts]);

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    bankMasterOptions,
    ledgerAccountOptions,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError: bankAccountError,
    clearError: clearBankAccountError,
  };

  return isMobile ? (
    <CreateBankAccountMobilePage {...pageProps} />
  ) : (
    <CreateBankAccountDesktopPage {...pageProps} />
  );
};

export default CreateBankAccountPage;
