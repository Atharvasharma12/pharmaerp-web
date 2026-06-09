// src/features/onboarding/pages/ChoosePlanPage.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import usePlan from "@/features/subscription/plans/hooks/usePlan";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useSubscription from "@/features/subscription/subscriptions/hooks/useSubscription";

import ChoosePlanDesktopPage from "./desktop/ChoosePlanDesktopPage";
import ChoosePlanMobilePage from "./mobile/ChoosePlanMobilePage";

const DEFAULT_SEAT_QUANTITY = 5;
const DEFAULT_CURRENCY = "INR";

const formatCurrency = (amount = 0) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const titleCase = (value = "") =>
  String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getPlanGroupKey = (plan) =>
  plan.type || plan.slug || plan.name?.toLowerCase() || plan._id;

const getIncludedFeatureItems = (plan) =>
  Array.isArray(plan.featureItems)
    ? plan.featureItems
        .filter((item) => item.included !== false)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((item) => item.value || item.label)
        .filter(Boolean)
    : [];

const getBooleanFeatures = (plan) => {
  const features = plan.features || {};
  const items = [];

  if (features.companiesUnlimited) items.push("Unlimited Companies");
  if (features.branchesUnlimited) items.push("Unlimited Branches");
  if (features.customBranding) items.push("Custom Branding");
  if (features.prioritySupport) items.push("Priority Support");

  return items;
};

const getModuleFeatures = (plan) =>
  Array.isArray(plan.modules)
    ? plan.modules.map((module) => `${titleCase(module)} Module`)
    : [];

const normalizePlans = (plans = []) => {
  const groups = new Map();

  plans.forEach((plan) => {
    const key = getPlanGroupKey(plan);

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(plan);
  });

  return Array.from(groups.values()).map((group) => {
    const basePlan =
      group.find((plan) => plan.billingCycle === "monthly") ||
      group.find((plan) => plan.billingCycle === "yearly") ||
      group[0];

    const monthlyPlan =
      group.find((plan) => plan.billingCycle === "monthly") || basePlan;

    const yearlyPlan =
      group.find((plan) => plan.billingCycle === "yearly") || basePlan;

    const monthlyPrice = Number(monthlyPlan?.pricePerUser || 0);

    const yearlyPrice =
      yearlyPlan?.billingCycle === "yearly"
        ? Number(yearlyPlan?.pricePerUser || 0)
        : monthlyPrice * 12;

    const yearlyMonthlyPrice = yearlyPrice ? Math.round(yearlyPrice / 12) : 0;
    const yearlySavings = monthlyPrice * 12 - yearlyPrice;

    const features = [
      ...getIncludedFeatureItems(basePlan),
      ...getBooleanFeatures(basePlan),
      ...getModuleFeatures(basePlan),
    ];

    return {
      id: basePlan._id,
      planId: basePlan._id,
      planCode: basePlan.planCode,
      slug: basePlan.slug,
      type: basePlan.type,

      name: basePlan.name,
      subtitle: basePlan.description || `${titleCase(basePlan.type)} plan`,

      monthlyPrice,
      yearlyPrice,
      yearlyMonthlyPrice,

      monthlyText: `${formatCurrency(monthlyPrice)} / month`,
      yearlyText: `${formatCurrency(yearlyPrice)} / year`,
      savingsText:
        yearlySavings > 0
          ? `Save ${formatCurrency(yearlySavings)} yearly`
          : "Best value yearly billing",

      trialText:
        Number(basePlan.trialDays || 0) > 0
          ? `${basePlan.trialDays} days free trial`
          : "No free trial available",
      trialDays: Number(basePlan.trialDays || 0),

      popular: Boolean(basePlan.isPopular),
      features: features.length ? features : ["Core ERP features included"],

      raw: basePlan,
      monthlyPlan,
      yearlyPlan,
    };
  });
};

const getWorkspaceFromItem = (item) => item?.workspace || item || null;

const ChoosePlanPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasFetchedPlansRef = useRef(false);
  const hasFetchedSubscriptionRef = useRef(false);

  const {
    activePlans,
    getActivePlans,
    getActivePlansStatus,
    error: planError,
    clearError,
  } = usePlan();

  const {
    workspaces,
    currentWorkspace,
    getMyWorkspacesStatus,
    getMyWorkspaces,
  } = useWorkspace();

  const {
    startTrialSubscription,
    purchaseSubscription,

    getWorkspaceCurrentSubscription,
    currentWorkspaceSubscription,

    startTrialSubscriptionStatus,
    purchaseSubscriptionStatus,
    error: subscriptionError,
    clearError: clearSubscriptionError,
  } = useSubscription();

  const [billingCycle, setBillingCycle] = useState("yearly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const isYearly = billingCycle === "yearly";

  const workspace = useMemo(() => {
    if (currentWorkspace) return currentWorkspace;

    const firstWorkspaceItem = Array.isArray(workspaces) ? workspaces[0] : null;

    return getWorkspaceFromItem(firstWorkspaceItem);
  }, [currentWorkspace, workspaces]);

  const workspaceName = workspace?.name || "Your Workspace";
  const workspaceId = workspace?._id;

  const hasWorkspace = Boolean(workspaceId);
  const hasExistingSubscription = Boolean(currentWorkspaceSubscription?._id);

  const hasFetchedWorkspaces = getMyWorkspacesStatus === API_STATUS.SUCCESS;
  const isFetchingWorkspaces = getMyWorkspacesStatus === API_STATUS.LOADING;

  useEffect(() => {
    if (
      getMyWorkspacesStatus === API_STATUS.IDLE ||
      getMyWorkspacesStatus === API_STATUS.ERROR
    ) {
      getMyWorkspaces().catch(() => {});
    }
  }, [getMyWorkspacesStatus, getMyWorkspaces]);

  useEffect(() => {
    if (hasFetchedWorkspaces && !hasWorkspace) {
      navigate(ROUTES.CREATE_WORKSPACE, { replace: true });
    }
  }, [hasFetchedWorkspaces, hasWorkspace, navigate]);

  useEffect(() => {
    if (!workspaceId || hasFetchedSubscriptionRef.current) return;

    hasFetchedSubscriptionRef.current = true;
    getWorkspaceCurrentSubscription(workspaceId).catch(() => {});
  }, [workspaceId, getWorkspaceCurrentSubscription]);

  useEffect(() => {
    if (!hasExistingSubscription) return;

    navigate(ROUTES.SETUP_CENTER, { replace: true });
  }, [hasExistingSubscription, navigate]);

  useEffect(() => {
    if (
      !hasWorkspace ||
      hasExistingSubscription ||
      hasFetchedPlansRef.current
    ) {
      return;
    }

    hasFetchedPlansRef.current = true;
    clearError();
    clearSubscriptionError?.();
    getActivePlans().catch(() => {});
  }, [
    hasWorkspace,
    hasExistingSubscription,
    clearError,
    clearSubscriptionError,
    getActivePlans,
  ]);

  const plans = useMemo(() => normalizePlans(activePlans), [activePlans]);

  useEffect(() => {
    if (selectedPlan || !plans.length) return;

    const popularPlan = plans.find((plan) => plan.popular);
    setSelectedPlan((popularPlan || plans[0]).id);
  }, [plans, selectedPlan]);

  const selectedPlanData = useMemo(
    () => plans.find((plan) => plan.id === selectedPlan) || null,
    [plans, selectedPlan],
  );

  const isFetchingPlans = getActivePlansStatus === API_STATUS.LOADING;

  const isSubmitting =
    startTrialSubscriptionStatus === API_STATUS.LOADING ||
    purchaseSubscriptionStatus === API_STATUS.LOADING;

  const isLoading = isFetchingWorkspaces || isFetchingPlans || isSubmitting;

  const error = submitError || subscriptionError || planError;

  const shouldHideChoosePlanPage =
    isFetchingWorkspaces ||
    (hasFetchedWorkspaces && !hasWorkspace) ||
    hasExistingSubscription;

  const handleBillingCycleChange = (cycle) => {
    setBillingCycle(cycle);
  };

  const handleToggleBillingCycle = () => {
    setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"));
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setSubmitError(null);
    clearSubscriptionError?.();
  };

  const handleBack = () => {
    navigate(ROUTES.CREATE_WORKSPACE);
  };

  const handleStartTrial = async (planId = selectedPlan) => {
    const plan = plans.find((item) => item.id === planId);

    if (!plan || !workspaceId || hasExistingSubscription) return;

    if (!plan.trialDays || plan.trialDays <= 0) {
      setSubmitError("This plan does not have free trial days.");
      return;
    }

    const payload = {
      workspaceId,
      planId: plan.planId,
      seatQuantity: DEFAULT_SEAT_QUANTITY,
    };

    try {
      setSubmitError(null);
      clearSubscriptionError?.();

      const subscription = await startTrialSubscription(payload);

      navigate(ROUTES.TRIAL_ACTIVATED, {
        replace: true,
        state: {
          workspaceId,
          workspaceName,
          planId: plan.planId,
          planCode: plan.planCode,
          planName: plan.name,
          trialDays: plan.trialDays,
          subscription,
        },
      });
    } catch (err) {
      setSubmitError(
        typeof err === "string" ? err : "Failed to start free trial",
      );
    }
  };

  const handlePurchaseSubscription = async (planId = selectedPlan) => {
    const plan = plans.find((item) => item.id === planId);

    if (!plan || !workspaceId || hasExistingSubscription) return;

    const billingPlan = isYearly ? plan.yearlyPlan : plan.monthlyPlan;

    const payload = {
      workspaceId,
      planId: billingPlan?._id || plan.planId,
      billingCycle,
      seatQuantity: DEFAULT_SEAT_QUANTITY,
      currency: DEFAULT_CURRENCY,
    };

    try {
      setSubmitError(null);
      clearSubscriptionError?.();

      const subscription = await purchaseSubscription(payload);

      navigate(ROUTES.SETUP_CENTER, {
        replace: true,
        state: {
          subscriptionPurchased: true,
          workspaceId,
          workspaceName,
          planId: payload.planId,
          planName: plan.name,
          billingCycle,
          subscription,
        },
      });
    } catch (err) {
      setSubmitError(
        typeof err === "string" ? err : "Failed to purchase subscription",
      );
    }
  };

  const handleSubmit = () => {
    handleStartTrial(selectedPlan);
  };

  if (shouldHideChoosePlanPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-sm font-medium text-text-muted">
          Loading workspace...
        </div>
      </div>
    );
  }

  const pageProps = {
    workspace,
    workspaceId,
    workspaceName,

    plans,
    selectedPlan,
    selectedPlanData,
    billingCycle,
    isYearly,

    isLoading,
    isFetchingPlans,
    isFetchingWorkspaces,

    error,

    handleBillingCycleChange,
    handleToggleBillingCycle,
    handleSelectPlan,
    handleBack,
    handleSubmit,
    handleStartTrial,
    handlePurchaseSubscription,
  };

  return isMobile ? (
    <ChoosePlanMobilePage {...pageProps} />
  ) : (
    <ChoosePlanDesktopPage {...pageProps} />
  );
};

export default ChoosePlanPage;
