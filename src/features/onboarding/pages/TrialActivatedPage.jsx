// src/features/onboarding/pages/TrialActivatedPage.jsx

import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import TrialActivatedDesktopPage from "./desktop/TrialActivatedDesktopPage";
import TrialActivatedMobilePage from "./mobile/TrialActivatedMobilePage";

const TrialActivatedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const selectedPlan = location.state || {};

  const trialData = useMemo(() => {
    const planName = selectedPlan.planName || "Professional";
    const billingCycle = selectedPlan.billingCycle || "yearly";
    const amount = selectedPlan.amount || 23988;

    return {
      planId: selectedPlan.planId || "professional",
      planName,
      billingCycle,
      amount,
      trialDays: 7,
      trialStatus: "active",
      activatedAt: new Date().toISOString(),
      title: "Your Free Trial is Activated!",
      description:
        "Your PharmaERP workspace is ready. Start exploring billing, inventory, reports and pharmacy management tools.",
      nextBillingText:
        billingCycle === "yearly"
          ? "Your yearly billing will start after the free trial."
          : "Your monthly billing will start after the free trial.",
    };
  }, [selectedPlan]);

  const quickActions = useMemo(
    () => [
      {
        id: "dashboard",
        title: "Go to Dashboard",
        description: "Start managing your pharmacy workspace.",
        actionText: "Open Dashboard",
        primary: true,
        onClick: () => navigate(ROUTES.DASHBOARD, { replace: true }),
      },
      {
        id: "billing",
        title: "Create First Bill",
        description: "Try quick GST-ready sales billing.",
        actionText: "Start Billing",
        onClick: () => navigate(ROUTES.DASHBOARD, { replace: true }),
      },
      {
        id: "inventory",
        title: "Add Inventory",
        description: "Add medicines, batches, stock and expiry dates.",
        actionText: "Add Stock",
        onClick: () => navigate(ROUTES.DASHBOARD, { replace: true }),
      },
    ],
    [navigate],
  );

  const checklist = useMemo(
    () => [
      {
        id: "workspace",
        label: "Workspace created",
        completed: true,
      },
      {
        id: "plan",
        label: `${trialData.planName} plan selected`,
        completed: true,
      },
      {
        id: "trial",
        label: `${trialData.trialDays} days free trial activated`,
        completed: true,
      },
      {
        id: "setup",
        label: "Complete pharmacy setup from dashboard",
        completed: false,
      },
    ],
    [trialData.planName, trialData.trialDays],
  );

  const handleGoToDashboard = () => {
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  const handleBackToPlans = () => {
    navigate(ROUTES.CHOOSE_PLAN);
  };

  const pageProps = {
    trialData,
    quickActions,
    checklist,
    handleGoToDashboard,
    handleBackToPlans,
  };

  return isMobile ? (
    <TrialActivatedMobilePage {...pageProps} />
  ) : (
    <TrialActivatedDesktopPage {...pageProps} />
  );
};

export default TrialActivatedPage;
