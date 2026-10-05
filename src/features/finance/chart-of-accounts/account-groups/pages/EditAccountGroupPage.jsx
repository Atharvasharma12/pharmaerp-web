import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ROUTES, API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";

import useAccountGroup from "../hooks/useAccountGroup";
import EditAccountGroupDesktopPage from "./desktop/EditAccountGroupDesktopPage";
import EditAccountGroupMobilePage from "./mobile/EditAccountGroupMobilePage";

const INITIAL_FORM_DATA = {
  groupName: "",
  groupCode: "",
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

const EditAccountGroupPage = () => {
  const { groupId: accountGroupId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

  const {
    accountGroups = [],
    getAccountGroups,
    getAccountGroupById,
    updateAccountGroup,
    updateAccountGroupStatus,
    getAccountGroupStatus,
    error,
    message,
    clearError,
    clearMessage,
  } = useAccountGroup();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Stable initialization effect to prevent infinite calling loops
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchInitData = async () => {
      try {
        await getAccountGroups();
        const data = await getAccountGroupById(accountGroupId);
        if (data) {
          setFormData({
            groupName: data.groupName || "",
            groupCode: data.groupCode || "",
            nature: data.nature || "",
            description: data.description || "",
            status: data.status || "active",
          });
        }
      } catch (err) {
        console.error("Failed to load group details:", err);
        setFormErrors({ submit: "Failed to load account group details. Returning to list." });
        setTimeout(() => navigate(ROUTES.ACCOUNT_GROUPS), 2000);
      }
    };

    fetchInitData();
  }, [accountGroupId, navigate]);

  // Clean up messages/errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, []);

  const isLoading = updateAccountGroupStatus === API_STATUS.LOADING;
  const isFetching = getAccountGroupStatus === API_STATUS.LOADING;

  const handleFieldChange = useCallback(
    (name, value) => {
      setFormData((prev) => {
        return { ...prev, [name]: value };
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
        parentGroupId: null,
        level: 1,
        nature: nature,
        description: normalizeText(formData.description),
        status: formData.status || "active",
      };

      try {
        await updateAccountGroup(accountGroupId, payload);
        navigate(ROUTES.ACCOUNT_GROUPS, { replace: true });
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to update account group. Please try again.",
        });
      }
    },
    [formData, accountGroupId, updateAccountGroup, navigate]
  );

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    isFetching,
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
    <EditAccountGroupMobilePage {...pageProps} />
  ) : (
    <EditAccountGroupDesktopPage {...pageProps} />
  );
};

export default EditAccountGroupPage;
