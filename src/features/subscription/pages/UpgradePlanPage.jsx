import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks";
import { ROUTES } from "@/constants";
import usePlan from "@/features/subscription/plans/hooks/usePlan";
import useSubscription from "@/features/subscription/subscriptions/hooks/useSubscription";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import { UpgradePlanDesktopPage } from "./desktop";
import { UpgradePlanMobilePage } from "./mobile";

const PLAN_TIER_ORDER = {
  free: 1,
  starter: 2,
  business: 3,
  enterprise: 4,
};

const UpgradePlanPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { activePlans, getActivePlans, getActivePlansStatus } = usePlan();
  const { currentWorkspaceSubscription } = useSubscription();
  const { currentWorkspace } = useWorkspace();

  const [billingCycle, setBillingCycle] = useState("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  // Fetch active plans on mount
  useEffect(() => {
    getActivePlans().catch((err) => {
      console.error("Failed to load active plans:", err);
    });
  }, [getActivePlans]);

  // Determine current active plan type (e.g. "free", "starter", etc.)
  const currentPlanType = currentWorkspaceSubscription?.currentPlanSnapshot?.type || "free";
  const currentWeight = PLAN_TIER_ORDER[currentPlanType] || 1;

  // Filter visible plans to only show current and higher level plans
  const visiblePlans = activePlans.filter(
    (p) => (PLAN_TIER_ORDER[p.type] || 1) >= currentWeight
  );

  // Auto-select a plan for checkout: defaults to one level above current plan
  useEffect(() => {
    if (activePlans?.length > 0) {
      const targetWeight = Math.min(currentWeight + 1, 4);
      const targetPlan = activePlans.find((p) => (PLAN_TIER_ORDER[p.type] || 1) === targetWeight);

      const currentlySelectedPlan = activePlans.find((p) => p._id === selectedPlanId);
      const currentSelectedWeight = currentlySelectedPlan ? PLAN_TIER_ORDER[currentlySelectedPlan.type] : 0;

      if (!selectedPlanId || currentSelectedWeight <= currentWeight) {
        if (targetPlan) {
          setSelectedPlanId(targetPlan._id);
        }
      }
    }
  }, [activePlans, selectedPlanId, currentWeight]);

  const handleProceedToCheckout = () => {
    if (!selectedPlanId) return;
    navigate(ROUTES.CHECKOUT, {
      state: {
        planId: selectedPlanId,
        billingCycle,
      },
    });
  };

  const pageProps = {
    activePlans: visiblePlans,
    loading: getActivePlansStatus === "loading",
    currentWorkspaceSubscription,
    currentPlanType,
    billingCycle,
    setBillingCycle,
    selectedPlanId,
    setSelectedPlanId,
    onProceedToCheckout: handleProceedToCheckout,
  };

  return isMobile ? (
    <UpgradePlanMobilePage {...pageProps} />
  ) : (
    <UpgradePlanDesktopPage {...pageProps} />
  );
};

export default UpgradePlanPage;
