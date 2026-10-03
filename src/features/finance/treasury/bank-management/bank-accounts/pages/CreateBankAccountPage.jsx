import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankAccount from "../hooks/useBankAccount";
import useBankMaster from "@/features/bank-master/hooks/useBankMaster";

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
  isPrimary: false,
  isActive: true,
  openingBalance: 0,
  openingBalanceType: "dr",
};

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const CreateBankAccountPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    createBankAccount,
    createBankAccountStatus,
    error: serverError,
    clearError,
  } = useBankAccount();

  const {
    bankMasters = [],
    getBankMasters,
  } = useBankMaster();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    
    // Fetch bank masters for dropdown list
    getBankMasters({ page: 1, limit: 100 }).catch((err) => {
      console.error("Failed to load bank masters:", err);
    });
  }, [getBankMasters]);

  // Clean up errors on unmount
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const isLoading = createBankAccountStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback(
    (name, value) => {
      setFormData((prev) => {
        const nextData = { ...prev, [name]: value };

        // If bank master changes, autofill account name if it's empty
        if (name === "bankMasterId" && value) {
          const selectedBank = bankMasters.find((b) => b._id === value);
          if (selectedBank && !prev.accountName) {
            nextData.accountName = `${selectedBank.name} Account`;
          }
        }
        return nextData;
      });

      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
      clearError();
    },
    [bankMasters, formErrors, clearError]
  );

  const handleCancel = useCallback(() => {
    navigate(ROUTES.BANK_ACCOUNTS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      console.log("[CreateBankAccountPage] handleSubmit triggered. Current formData:", formData);

      const errors = {};
      const accName = String(formData.accountName || "").trim();
      const holderName = String(formData.accountHolderName || "").trim();
      const accNumber = String(formData.accountNumber || "").trim();
      const ifsc = String(formData.ifscCode || "").trim().toUpperCase();
      const branch = String(formData.branchName || "").trim();
      const branchAddr = String(formData.branchAddress || "").trim();
      const regMobile = String(formData.registeredMobile || "").trim();
      const accType = formData.accountType;
      const bankId = formData.bankMasterId;

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
      } else if (!IFSC_REGEX.test(ifsc)) {
        errors.ifscCode = "Invalid IFSC code format (e.g. HDFC0001234)";
      }
      if (!branch) {
        errors.branchName = "Branch name is required";
      }
      if (!bankId) {
        errors.bankMasterId = "Bank selection is required";
      }

      const openingBalance = Number(formData.openingBalance);
      if (isNaN(openingBalance) || openingBalance < 0) {
        errors.openingBalance = "Opening balance must be a non-negative number";
      }

      if (Object.keys(errors).length > 0) {
        console.warn("[CreateBankAccountPage] Validation failed with errors:", errors);
        setFormErrors(errors);
        return;
      }

      const payload = {
        bankMasterId: bankId,
        accountName: accName,
        accountHolderName: holderName,
        accountNumber: accNumber,
        ifscCode: ifsc,
        branchName: branch,
        branchAddress: branchAddr || null,
        registeredMobile: regMobile || null,
        accountType: accType,
        isPrimary: Boolean(formData.isPrimary),
        isActive: Boolean(formData.isActive),
        openingBalance: openingBalance || 0,
        openingBalanceType: formData.openingBalanceType || "dr",
      };

      console.log("[CreateBankAccountPage] Validation passed. Dispatching createBankAccount thunk with payload:", payload);

      try {
        const result = await createBankAccount(payload);
        console.log("[CreateBankAccountPage] Thunk succeeded. Result:", result);
        navigate(ROUTES.BANK_ACCOUNTS, { replace: true });
      } catch (err) {
        console.error("[CreateBankAccountPage] Thunk failed with error:", err);
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to create bank account. Please try again.",
        });
      }
    },
    [formData, createBankAccount, navigate]
  );

  const bankOptions = useMemo(() => {
    const opts = [{ label: "Select Bank", value: "" }];
    bankMasters.forEach((bm) => {
      if (bm.isActive !== false) {
        opts.push({ label: bm.name, value: bm._id });
      }
    });
    return opts;
  }, [bankMasters]);

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    bankOptions,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError,
    clearError,
  };

  return isMobile ? (
    <CreateBankAccountMobilePage {...pageProps} />
  ) : (
    <CreateBankAccountDesktopPage {...pageProps} />
  );
};

export default CreateBankAccountPage;