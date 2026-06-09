// src/features/onboarding/pages/SubscriptionSuccessPage.jsx

import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import SubscriptionSuccessDesktopPage from "./desktop/SubscriptionSuccessDesktopPage";
import SubscriptionSuccessMobilePage from "./mobile/SubscriptionSuccessMobilePage";

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const subscriptionState = location.state || {};

  const subscriptionData = useMemo(() => {
    const planName = subscriptionState.planName || "Professional";
    const billingCycle = subscriptionState.billingCycle || "yearly";
    const amount = subscriptionState.amount || 23988;

    return {
      planId: subscriptionState.planId || "professional",
      planName,
      billingCycle,
      amount,
      status: "active",
      paymentStatus: "paid",
      transactionId:
        subscriptionState.transactionId ||
        `TXN-${Date.now().toString().slice(-8)}`,
      invoiceId:
        subscriptionState.invoiceId || `INV-${Date.now().toString().slice(-8)}`,
      activatedAt: new Date().toISOString(),
      title: "Subscription Activated Successfully!",
      description:
        "Your PharmaERP subscription is active. You now have full access to your selected plan features.",
      billingText:
        billingCycle === "yearly"
          ? "Your yearly subscription is active."
          : "Your monthly subscription is active.",
    };
  }, [subscriptionState]);

  const summaryItems = useMemo(
    () => [
      {
        id: "plan",
        label: "Selected Plan",
        value: subscriptionData.planName,
      },
      {
        id: "billing",
        label: "Billing Cycle",
        value:
          subscriptionData.billingCycle === "yearly" ? "Yearly" : "Monthly",
      },
      {
        id: "amount",
        label: "Amount Paid",
        value: `₹${Number(subscriptionData.amount).toLocaleString("en-IN")}`,
      },
      {
        id: "status",
        label: "Subscription Status",
        value: "Active",
        status: "active",
      },
      {
        id: "payment",
        label: "Payment Status",
        value: "Paid",
        status: "completed",
      },
      {
        id: "transaction",
        label: "Transaction ID",
        value: subscriptionData.transactionId,
      },
      {
        id: "invoice",
        label: "Invoice ID",
        value: subscriptionData.invoiceId,
      },
    ],
    [subscriptionData],
  );

  const quickActions = useMemo(
    () => [
      {
        id: "dashboard",
        title: "Go to Dashboard",
        description: "Start using your activated PharmaERP workspace.",
        actionText: "Open Dashboard",
        primary: true,
        onClick: () => navigate(ROUTES.SETUP_CENTER, { replace: true }),
      },
      {
        id: "invoice",
        title: "View Invoice",
        description: "Check your subscription payment invoice.",
        actionText: "View Invoice",
        onClick: () => navigate(ROUTES.SETUP_CENTER, { replace: true }),
      },
      {
        id: "settings",
        title: "Manage Subscription",
        description: "Upgrade, downgrade or manage billing details.",
        actionText: "Manage Plan",
        onClick: () => navigate(ROUTES.SETUP_CENTER, { replace: true }),
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
        label: `${subscriptionData.planName} plan selected`,
        completed: true,
      },
      {
        id: "payment",
        label: "Payment completed",
        completed: true,
      },
      {
        id: "subscription",
        label: "Subscription activated",
        completed: true,
      },
      {
        id: "dashboard",
        label: "Start managing pharmacy from dashboard",
        completed: false,
      },
    ],
    [subscriptionData.planName],
  );

  const handleGoToDashboard = () => {
    navigate(ROUTES.SETUP_CENTER, { replace: true });
  };

  const handleViewInvoice = () => {
    // TODO: Replace with invoice route or download invoice action
    navigate(ROUTES.SETUP_CENTER, { replace: true });
  };

  const handleManageSubscription = () => {
    // TODO: Replace with subscription/settings route
    navigate(ROUTES.SETUP_CENTER, { replace: true });
  };

  const pageProps = {
    subscriptionData,
    summaryItems,
    quickActions,
    checklist,
    handleGoToDashboard,
    handleViewInvoice,
    handleManageSubscription,
  };

  return isMobile ? (
    <SubscriptionSuccessMobilePage {...pageProps} />
  ) : (
    <SubscriptionSuccessDesktopPage {...pageProps} />
  );
};

export default SubscriptionSuccessPage;
