import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import useFinancialPeriod from "../hooks/useFinancialPeriod";
import CreateFinancialPeriodDesktopPage from "./desktop/CreateFinancialPeriodDesktopPage";
import CreateFinancialPeriodMobilePage from "./mobile/CreateFinancialPeriodMobilePage";

const getFutureDateString = (monthsAhead) => {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsAhead);
  return d.toISOString().split("T")[0];
};

const INITIAL_FORM_DATA = {
  startDate: new Date().toISOString().split("T")[0],
  endDate: getFutureDateString(12), // default end date is 12 months ahead
  periodType: "YEAR",
  periodCode: "",
  isCurrent: false,
  status: "OPEN",
};

const CreateFinancialPeriodPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    createFinancialPeriod,
    createFinancialPeriodStatus,
    error: serverError,
    clearError,
    clearMessage,
  } = useFinancialPeriod();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleFieldChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  }, []);

  const handleCancel = useCallback(() => {
    navigate(ROUTES.FINANCIAL_PERIODS);
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      const errors = {};

      if (!formData.startDate) {
        errors.startDate = "Select start date";
      }
      if (!formData.endDate) {
        errors.endDate = "Select end date";
      }

      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      if (start >= end) {
        errors.endDate = "End date must be after start date";
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      const payload = {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        periodType: formData.periodType,
        periodCode: String(formData.periodCode || "").trim() || undefined,
        isCurrent: formData.isCurrent,
        status: formData.status,
      };

      try {
        await createFinancialPeriod(payload);
        navigate(ROUTES.FINANCIAL_PERIODS);
      } catch (err) {
        setFormErrors({
          submit: typeof err === "string" ? err : "Failed to define new financial period.",
        });
      }
    },
    [formData, createFinancialPeriod, navigate]
  );

  const isLoading = createFinancialPeriodStatus === API_STATUS.LOADING;

  const pageProps = {
    formData,
    formErrors,
    isLoading,
    handleFieldChange,
    handleCancel,
    handleSubmit,
    serverError,
    clearError,
  };

  return isMobile ? (
    <CreateFinancialPeriodMobilePage {...pageProps} />
  ) : (
    <CreateFinancialPeriodDesktopPage {...pageProps} />
  );
};

export default CreateFinancialPeriodPage;
