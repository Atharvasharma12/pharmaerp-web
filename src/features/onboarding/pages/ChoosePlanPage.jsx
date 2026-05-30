// src/features/onboarding/pages/ChoosePlanPage.jsx

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import ChoosePlanDesktopPage from "./desktop/ChoosePlanDesktopPage";
import ChoosePlanMobilePage from "./mobile/ChoosePlanMobilePage";

const ChoosePlanPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [billingCycle, setBillingCycle] = useState("yearly");
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);

  const isYearly = billingCycle === "yearly";

  const plans = useMemo(
    () => [
      {
        id: "basic",
        name: "Basic",
        subtitle: "Perfect for small pharmacies",
        monthlyPrice: 999,
        yearlyPrice: 11988,
        yearlyMonthlyPrice: 999,
        monthlyText: "₹999 / month",
        yearlyText: "₹11,988 / year",
        savingsText: "Save ₹2,388 yearly",
        trialText: "7 days free trial",
        popular: false,
        features: [
          "Sales & Billing (GST Ready)",
          "Inventory Management",
          "Purchase Management",
          "Expiry & Batch Tracking",
          "Reports & Analytics",
          "1 Store / 1 User",
          "Cloud Backup (5 GB)",
          "Email Support",
        ],
      },
      {
        id: "professional",
        name: "Professional",
        subtitle: "Best for growing pharmacies",
        monthlyPrice: 1999,
        yearlyPrice: 23988,
        yearlyMonthlyPrice: 1999,
        monthlyText: "₹1,999 / month",
        yearlyText: "₹23,988 / year",
        savingsText: "Save ₹4,000 yearly",
        trialText: "7 days free trial",
        popular: true,
        features: [
          "Everything in Basic",
          "Customer Management (CRM)",
          "Advanced Reports & Analytics",
          "Barcode Scanning Support",
          "Offers & Schemes Management",
          "Low Stock & Expiry Alerts",
          "Multi-User Access (Up to 3 Users)",
          "Multi-Store Management",
          "Cloud Backup (20 GB)",
          "WhatsApp Integration",
          "Priority Support",
          "Data Export (Excel/PDF)",
          "GSTR-1 & E-Invoicing",
        ],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        subtitle: "For large & multi-store pharmacies",
        monthlyPrice: 3999,
        yearlyPrice: 47988,
        yearlyMonthlyPrice: 3999,
        monthlyText: "₹3,999 / month",
        yearlyText: "₹47,988 / year",
        savingsText: "Save ₹8,000 yearly",
        trialText: "7 days free trial",
        popular: false,
        features: [
          "Everything in Professional",
          "Unlimited Users",
          "Advanced Analytics Dashboard",
          "Role-Based Access Control",
          "Dedicated Account Manager",
          "API Access",
          "Custom Training & Onboarding",
          "Cloud Backup (100 GB)",
          "Data Backup & Restore",
          "24/7 Premium Support",
          "SLA & Uptime Guarantee",
          "Priority Feature Requests",
        ],
      },
    ],
    [],
  );

  const selectedPlanData = useMemo(
    () => plans.find((plan) => plan.id === selectedPlan),
    [plans, selectedPlan],
  );

  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
  };

  const handleToggleBillingCycle = () => {
    setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"));
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
  };

  const handleBack = () => {
    navigate(ROUTES.CREATE_WORKSPACE);
  };

  const handleSubmit = async () => {
    if (!selectedPlanData) return;

    const payload = {
      planId: selectedPlanData.id,
      planName: selectedPlanData.name,
      billingCycle,
      amount: isYearly
        ? selectedPlanData.yearlyPrice
        : selectedPlanData.monthlyPrice,
    };

    try {
      setIsLoading(true);

      // TODO: Replace with select plan / start trial API call
      // await choosePlan(payload);

      navigate(ROUTES.TRIAL_ACTIVATED, {
        replace: true,
        state: payload,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pageProps = {
    plans,
    selectedPlan,
    selectedPlanData,
    billingCycle,
    isYearly,
    isLoading,
    handleBillingCycleChange,
    handleToggleBillingCycle,
    handleSelectPlan,
    handleBack,
    handleSubmit,
  };

  return isMobile ? (
    <ChoosePlanMobilePage {...pageProps} />
  ) : (
    <ChoosePlanDesktopPage {...pageProps} />
  );
};

export default ChoosePlanPage;
