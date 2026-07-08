// src/features/onboarding/pages/ChoosePlanPage.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import usePlan from "@/features/subscription/plans/hooks/usePlan";
import useSubscription from "@/features/subscription/subscriptions/hooks/useSubscription";
import useAuth from "@/features/auth/hooks/useAuth";
import { clearSignupData } from "@/features/auth/store/authSlice";
import { setCurrentWorkspace } from "@/features/workspace/store/workspaceSlice";
import { setCurrentSubscription } from "@/features/subscription/subscriptions/store/subscriptionSlice";

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

      monthlyText: `${formatCurrency(monthlyPrice)}`,
      yearlyText: `${formatCurrency(yearlyMonthlyPrice)}`,
      savingsText:
        yearlySavings > 0
          ? `Save ${formatCurrency(Math.round(yearlySavings / 12))}`
          : "Best Value",

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
  const dispatch = useDispatch();

  const { register } = useAuth();
  const signupData = useSelector((state) => state.auth.signupData) || {};

  // Security guard: Send back to Step 1 if account details are empty
  useEffect(() => {
    if (!signupData.fullName) {
      navigate(ROUTES.REGISTER, { replace: true });
    }
  }, [signupData.fullName, navigate]);

  const {
    activePlans,
    getActivePlans,
    getActivePlansStatus,
    error: planError,
    clearError,
  } = usePlan();

  const {
    error: subscriptionError,
    clearError: clearSubscriptionError,
  } = useSubscription();

  const [billingCycle, setBillingCycle] = useState("yearly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const isYearly = billingCycle === "yearly";

  useEffect(() => {
    clearError();
    clearSubscriptionError?.();
    getActivePlans().catch(() => {});
  }, []);

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
  const isSubmitting = getActivePlansStatus === API_STATUS.LOADING; // temporary mapping

  const isLoading = isFetchingPlans || isSubmitting;
  const error = submitError || subscriptionError || planError;

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

  const handleStartTrial = async (planId) => {
    const targetId = planId || selectedPlan;
    const plan = plans.find((item) => item.id === targetId);

    // Build the consolidated registration payload
    const payload = {
      fullName: signupData.fullName,
      email: signupData.email,
      phone: signupData.phone,
      password: signupData.password,
      workspaceName: signupData.workspaceName,
      workspaceType: signupData.workspaceType || "pharmacy",
    };

    // If a plan is selected, add it to the payload
    if (plan && plan.planId) {
      payload.planId = plan.planId;
    }

    if (!payload.phone) {
      delete payload.phone;
    }

    try {
      setSubmitError(null);
      clearSubscriptionError?.();

      const result = await register(payload);

      if (result?.workspace) {
        dispatch(setCurrentWorkspace(result.workspace));
      }
      if (result?.subscription) {
        dispatch(setCurrentSubscription(result.subscription));
      }

      // Clear the temporary signupData state
      dispatch(clearSignupData());

      navigate(ROUTES.DASHBOARD, {
        replace: true,
        state: { showWelcomeToast: true },
      });
    } catch (err) {
      setSubmitError(
        typeof err === "string" ? err : "Registration failed. Please try again."
      );
    }
  };

  const pageProps = {
    workspace: { name: signupData.workspaceName },
    workspaceId: null,
    workspaceName: signupData.workspaceName || "Your Workspace",
    plans,
    selectedPlan,
    selectedPlanData,
    billingCycle,
    isYearly,
    isLoading,
    isFetchingPlans,
    error,
    handleBillingCycleChange,
    handleToggleBillingCycle,
    handleSelectPlan,
    handleBack,
    handleStartTrial,
    handlePurchaseSubscription: handleStartTrial, // both map to registration
  };

  return isMobile ? (
    <ChoosePlanMobilePage {...pageProps} />
  ) : (
    <ChoosePlanDesktopPage {...pageProps} />
  );
};

export default ChoosePlanPage;
