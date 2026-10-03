import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useBankAccount from "../hooks/useBankAccount";
import useBankMaster from "@/features/bank-master/hooks/useBankMaster";

import EditBankAccountDesktopPage from "./desktop/EditBankAccountDesktopPage";
import EditBankAccountMobilePage from "./mobile/EditBankAccountMobilePage";

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
  bankMasterName: "",
  isPrimary: false,
  isActive: true,
};

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const EditBankAccountPage = () => {
  const { bankAccountId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    getBankAccountById,
    updateBankAccount,
    getBankAccountStatus,
    updateBankAccountStatus,
    error: serverError,
    message: serverMessage,
    clearError,
    clearMessage,
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

    const fetchInitData = async () => {
      try {
        // Fetch bank masters directory first
        const mastersRes = await getBankMasters({ page: 1, limit: 100 });
        const list = mastersRes?.bankMasters || [];

        // Load the bank account record
        const data = await getBankAccountById(bankAccountId);
        if (data) {
          // Resolve bank master name
          const bmId = typeof data.bankMasterId === "object" ? data.bankMasterId?._id : (data.bankMasterId || "");
          const bmName = typeof data.bankMasterId === "object" ? data.bankMasterId?.name : "";
          const foundMaster = list.find((m) => m._id === bmId);

          setFormData({
            accountName: data.accountName || "",
            accountHolderName: data.accountHolderName || "",
            accountNumber: data.accountNumber || "",
            ifscCode: data.ifscCode || "",
            branchName: data.branchName || "",
            branchAddress: data.branchAddress || "",
            registeredMobile: data.registeredMobile || "",
            accountType: data.accountType || "CURRENT",
            bankMasterId: bmId,
            bankMasterName: foundMaster?.name || bmName || "Bank",
            isPrimary: Boolean(data.isPrimary),
            isActive: data.isActive !== false,
          });
        }
      } catch (err) {
        console.error("Failed to load bank account details:", err);
        setFormErrors({ submit: "Failed to load bank account details. Returning to list." });
        setTimeout(() => navigate(ROUTES.BANK_ACCOUNTS), 2000);
      }
    };

    fetchInitData();
  }, [bankAccountId, getBankAccountById, getBankMasters, navigate]);

  // Clean up notifications/errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const isLoading = updateBankAccountStatus === API_STATUS.LOADING;
  const isFetching = getBankAccountStatus === API_STATUS.LOADING;

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
    navigate(ROUTES.BANK_ACCOUNTS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};
      const accName = String(formData.accountName || "").trim();
      const holderName = String(formData.accountHolderName || "").trim();
      const ifsc = String(formData.ifscCode || "").trim().toUpperCase();
      const branch = String(formData.branchName || "").trim();
      const branchAddr = String(formData.branchAddress || "").trim();
      const regMobile = String(formData.registeredMobile || "").trim();
      const accType = formData.accountType;

      if (!accName) {
        errors.accountName = "Account name is required";
      }
      if (!holderName) {
        errors.accountHolderName = "Account holder name is required";
      }
      if (!ifsc) {
        errors.ifscCode = "IFSC code is required";
      } else if (!IFSC_REGEX.test(ifsc)) {
        errors.ifscCode = "Invalid IFSC code format (e.g. HDFC0001234)";
      }
      if (!branch) {
        errors.branchName = "Branch name is required";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        accountName: accName,
        accountHolderName: holderName,
        ifscCode: ifsc,
        branchName: branch,
        branchAddress: branchAddr || null,
        registeredMobile: regMobile || null,
        accountType: accType,
        isPrimary: Boolean(formData.isPrimary),
        isActive: Boolean(formData.isActive),
      };

      try {
        await updateBankAccount(bankAccountId, payload);
        navigate(ROUTES.BANK_ACCOUNTS, { replace: true });
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to update bank account. Please try again.",
        });
      }
    },
    [formData, bankAccountId, updateBankAccount, navigate]
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
    serverMessage,
    clearError,
    clearMessage,
  };

  return isMobile ? (
    <EditBankAccountMobilePage {...pageProps} />
  ) : (
    <EditBankAccountDesktopPage {...pageProps} />
  );
};

export default EditBankAccountPage;
