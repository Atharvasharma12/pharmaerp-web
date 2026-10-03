import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountGroup from "../hooks/useAccountGroup";
import CreateAccountGroupDesktopPage from "./desktop/CreateAccountGroupDesktopPage";
import CreateAccountGroupMobilePage from "./mobile/CreateAccountGroupMobilePage";

const INITIAL_FORM_DATA = {
  groupName: "",
  groupCode: "",
  parentGroupId: "",
  nature: "",
  description: "",
  status: "active",
};

const natureOptions = [
  { label: "Select Nature", value: "" },
  { label: "Asset", value: "ASSET" },
  { label: "Liability", value: "LIABILITY" },
  { label: "Income", value: "INCOME" },
  { label: "Expense", value: "EXPENSE" },
  { label: "Equity", value: "EQUITY" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const normalizeText = (val) => String(val || "").trim();

const CreateAccountGroupPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    accountGroups = [],
    getAccountGroups,
    createAccountGroup,
    createAccountGroupStatus,
    error,
    message,
    clearError,
    clearMessage,
  } = useAccountGroup();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    getAccountGroups().catch((err) => {
      console.error("Failed to load account groups for select options:", err);
    });
  }, [getAccountGroups]);

  // Clean up messages/errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, []);

  const isLoading = createAccountGroupStatus === API_STATUS.LOADING;

  // Auto calculate the level based on the selected parent group
  const computedLevel = useMemo(() => {
    if (!formData.parentGroupId) return 1;
    const parent = accountGroups.find((g) => g._id === formData.parentGroupId);
    return parent ? (Number(parent.level) || 1) + 1 : 1;
  }, [formData.parentGroupId, accountGroups]);

  const handleFieldChange = useCallback(
    (name, value) => {
      setFormData((prev) => {
        const nextData = { ...prev, [name]: value };

        // If parent group changes, auto pre-fill its level and nature
        if (name === "parentGroupId") {
          if (value) {
            const parent = accountGroups.find((g) => g._id === value);
            if (parent) {
              nextData.nature = parent.nature || prev.nature;
            }
          }
        }
        return nextData;
      });

      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }));
      }
      clearError();
    },
    [accountGroups, formErrors, clearError]
  );

  const handleCancel = useCallback(() => {
    navigate(ROUTES.ACCOUNT_GROUPS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};
      const name = normalizeText(formData.groupName);
      const code = normalizeText(formData.groupCode);
      const nature = formData.nature;

      if (!name) {
        errors.groupName = "Group name is required";
      } else if (name.length < 2) {
        errors.groupName = "Group name must be at least 2 characters";
      }

      if (!code) {
        errors.groupCode = "Group code is required";
      }

      if (!nature) {
        errors.nature = "Nature is required";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        groupName: name,
        groupCode: code,
        parentGroupId: formData.parentGroupId || null,
        level: computedLevel,
        nature: nature,
        description: normalizeText(formData.description),
        status: formData.status || "active",
      };

      try {
        await createAccountGroup(payload);
        navigate(ROUTES.ACCOUNT_GROUPS, { replace: true });
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to create account group. Please try again.",
        });
      }
    },
    [formData, computedLevel, createAccountGroup, navigate]
  );

  const parentGroupOptions = useMemo(() => {
    const opts = [{ label: "Select parent group (optional)", value: "" }];
    accountGroups.forEach((g) => {
      opts.push({ label: g.groupName, value: g._id });
    });
    return opts;
  }, [accountGroups]);

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    computedLevel,
    parentGroupOptions,
    natureOptions,
    statusOptions,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError: error,
    serverMessage: message,
    clearError,
    clearMessage,
  };

  return isMobile ? (
    <CreateAccountGroupMobilePage {...pageProps} />
  ) : (
    <CreateAccountGroupDesktopPage {...pageProps} />
  );
};

export default CreateAccountGroupPage;
