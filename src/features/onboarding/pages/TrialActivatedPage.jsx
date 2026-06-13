// src/features/onboarding/pages/TrialActivatedPage.jsx

import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiBarChart2,
  FiBriefcase,
  FiFileText,
  FiHeadphones,
  FiHome,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import { TrialActivatedDesktopPage } from "./desktop";
import TrialActivatedMobilePage from "./mobile/TrialActivatedMobilePage";

const getWorkspaceFromItem = (item) => item?.workspace || item || null;

const TrialActivatedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { workspaces, currentWorkspace } = useWorkspace();

  const selectedPlan = location.state || {};

  const workspaceName = useMemo(() => {
    if (currentWorkspace?.name) return currentWorkspace.name;
    const resolved = getWorkspaceFromItem(
      Array.isArray(workspaces) ? workspaces[0] : null,
    );
    return resolved?.name || "MedPlus Pharmacy";
  }, [currentWorkspace, workspaces]);

  const trialData = useMemo(() => {
    const planName = selectedPlan.planName || "Professional";
    const trialDays = selectedPlan.trialDays || 7;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + Number(trialDays));
    const formattedEndsOn = endDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return {
      workspaceName,
      planName: planName.includes("Plan") ? planName : `${planName} Plan`,
      trialDays,
      trialEndsOn: formattedEndsOn,
      usersCount: 5,
    };
  }, [selectedPlan, workspaceName]);

  // Centralized features included in the trial plan
  const includedFeatures = useMemo(
    () => [
      {
        id: "companies",
        icon: <FiBriefcase />,
        title: "5 Companies",
        text: "Create and manage up to 5 companies",
      },
      {
        id: "branches",
        icon: <FiHome />,
        title: "10 Branches",
        text: "Add and manage up to 10 branches",
      },
      {
        id: "users",
        icon: <FiUsers />,
        title: "Up to 20 Users",
        text: "Invite your team and assign roles",
      },
      {
        id: "inventory",
        icon: <FiFileText />,
        title: "Advanced Inventory",
        text: "Inventory, stock, expiry & batch management",
      },
      {
        id: "purchases",
        icon: <FiShoppingCart />,
        title: "Purchases & Suppliers",
        text: "Manage purchases and suppliers",
      },
      {
        id: "billing",
        icon: <FiFileText />,
        title: "POS Billing",
        text: "Fast and easy billing system",
      },
      {
        id: "reports",
        icon: <FiBarChart2 />,
        title: "Reports & Analytics",
        text: "Insightful reports and dashboards",
      },
      {
        id: "support",
        icon: <FiHeadphones />,
        title: "Priority Support",
        text: "Get priority email support",
      },
    ],
    [],
  );

  const nextSteps = useMemo(
    () => [
      {
        id: "inventory",
        title: "Add Inventory",
        description: "Add your medicines & manage stock",
        actionText: "Go to Inventory",
        onClick: () => navigate("/inventory/products/create"),
      },
      {
        id: "purchase",
        title: "Create Purchase",
        description: "Add your suppliers and create purchase bills",
        actionText: "Go to Purchase",
        onClick: () => navigate("/purchases/create"),
      },
      {
        id: "billing",
        title: "Start Billing",
        description: "Create invoices and bill your customers",
        actionText: "Go to POS",
        onClick: () => navigate("/billing/settings"),
      },
      {
        id: "reports",
        title: "Explore Reports",
        description: "View business insights and analytics",
        actionText: "Go to Reports",
        onClick: () => navigate("/reports/dashboard"),
      },
    ],
    [navigate],
  );

  const handleGoToDashboard = () => {
    navigate(ROUTES.SETUP_CENTER, { replace: true });
  };

  const pageProps = {
    trialData,
    includedFeatures,
    nextSteps,
    handleGoToDashboard,
  };

  return isMobile ? (
    <TrialActivatedMobilePage {...pageProps} />
  ) : (
    <TrialActivatedDesktopPage {...pageProps} />
  );
};

export default TrialActivatedPage;
