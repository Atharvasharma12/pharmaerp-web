// src/features/onboarding/pages/ChoosePlanPage.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiCreditCard, FiX } from "react-icons/fi";

import { API_STATUS, ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";
import usePlan from "@/features/subscription/plans/hooks/usePlan";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import useSubscription from "@/features/subscription/subscriptions/hooks/useSubscription";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

import ChoosePlanDesktopPage from "./desktop/ChoosePlanDesktopPage";
import ChoosePlanMobilePage from "./mobile/ChoosePlanMobilePage";

const DEFAULT_SEAT_QUANTITY = 1;
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
    startTrialSubscriptionStatus,
    purchaseSubscriptionStatus,
    error: subscriptionError,
    clearError: clearSubscriptionError,
  } = useSubscription();

  const [billingCycle, setBillingCycle] = useState("yearly");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [dialogPlanId, setDialogPlanId] = useState(null);
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
    if (!hasWorkspace || hasFetchedPlansRef.current) return;

    hasFetchedPlansRef.current = true;
    clearError();
    clearSubscriptionError?.();
    getActivePlans().catch(() => {});
  }, [hasWorkspace, clearError, clearSubscriptionError, getActivePlans]);

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

  const dialogPlanData = useMemo(
    () => plans.find((plan) => plan.id === dialogPlanId) || selectedPlanData,
    [plans, dialogPlanId, selectedPlanData],
  );

  const selectedBillingPlan = useMemo(() => {
    if (!dialogPlanData) return null;

    return isYearly ? dialogPlanData.yearlyPlan : dialogPlanData.monthlyPlan;
  }, [dialogPlanData, isYearly]);

  const selectedPriceText = useMemo(() => {
    if (!dialogPlanData) return "";

    return isYearly ? dialogPlanData.yearlyText : dialogPlanData.monthlyText;
  }, [dialogPlanData, isYearly]);

  const isFetchingPlans = getActivePlansStatus === API_STATUS.LOADING;

  const isSubmitting =
    startTrialSubscriptionStatus === API_STATUS.LOADING ||
    purchaseSubscriptionStatus === API_STATUS.LOADING;

  const isLoading = isFetchingWorkspaces || isFetchingPlans || isSubmitting;

  const error = submitError || subscriptionError || planError;

  const shouldHideChoosePlanPage =
    isFetchingWorkspaces || (hasFetchedWorkspaces && !hasWorkspace);

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
    navigate(ROUTES.DASHBOARD, { replace: true });
  };

  const closeDialog = () => {
    if (isSubmitting) return;

    setDialogType(null);
    setDialogPlanId(null);
    setSubmitError(null);
  };

  const openTrialDialog = (planId = selectedPlan) => {
    const plan = plans.find((item) => item.id === planId);

    if (!plan || !workspaceId) return;

    setSelectedPlan(plan.id);
    setDialogPlanId(plan.id);
    setDialogType("trial");
    setSubmitError(null);
    clearSubscriptionError?.();
  };

  const openPurchaseDialog = (planId = selectedPlan) => {
    const plan = plans.find((item) => item.id === planId);

    if (!plan || !workspaceId) return;

    setSelectedPlan(plan.id);
    setDialogPlanId(plan.id);
    setDialogType("purchase");
    setSubmitError(null);
    clearSubscriptionError?.();
  };

  const handleSubmit = () => {
    openTrialDialog(selectedPlan);
  };

  const handleConfirmTrial = async () => {
    if (!dialogPlanData || !workspaceId) return;

    if (!dialogPlanData.trialDays || dialogPlanData.trialDays <= 0) {
      setSubmitError("This plan does not have free trial days.");
      return;
    }

    const payload = {
      workspaceId,
      planId: dialogPlanData.planId,
      seatQuantity: DEFAULT_SEAT_QUANTITY,
    };

    try {
      setSubmitError(null);

      const subscription = await startTrialSubscription(payload);

      navigate(ROUTES.TRIAL_ACTIVATED, {
        replace: true,
        state: {
          workspaceId,
          workspaceName,
          planId: dialogPlanData.planId,
          planCode: dialogPlanData.planCode,
          planName: dialogPlanData.name,
          trialDays: dialogPlanData.trialDays,
          subscription,
        },
      });
    } catch (err) {
      setSubmitError(
        typeof err === "string" ? err : "Failed to start free trial",
      );
    }
  };

  const handleConfirmPurchase = async () => {
    if (!dialogPlanData || !workspaceId) return;

    const payload = {
      workspaceId,
      planId: selectedBillingPlan?._id || dialogPlanData.planId,
      billingCycle,
      seatQuantity: DEFAULT_SEAT_QUANTITY,
      currency: DEFAULT_CURRENCY,
    };

    try {
      setSubmitError(null);

      const subscription = await purchaseSubscription(payload);

      navigate(ROUTES.DASHBOARD, {
        replace: true,
        state: {
          subscriptionPurchased: true,
          workspaceId,
          workspaceName,
          planId: payload.planId,
          planName: dialogPlanData.name,
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

  const handleConfirmDialog = () => {
    if (dialogType === "trial") {
      handleConfirmTrial();
      return;
    }

    if (dialogType === "purchase") {
      handleConfirmPurchase();
    }
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

    // Use these two props in desktop/mobile cards for per-plan buttons.
    handleStartTrial: openTrialDialog,
    handlePurchaseSubscription: openPurchaseDialog,
  };

  return (
    <>
      {isMobile ? (
        <ChoosePlanMobilePage {...pageProps} />
      ) : (
        <ChoosePlanDesktopPage {...pageProps} />
      )}

      <SubscriptionConfirmDialog
        open={Boolean(dialogType)}
        type={dialogType}
        plan={dialogPlanData}
        workspaceName={workspaceName}
        billingCycle={billingCycle}
        priceText={selectedPriceText}
        isSubmitting={isSubmitting}
        error={submitError || subscriptionError}
        onClose={closeDialog}
        onConfirm={handleConfirmDialog}
      />
    </>
  );
};

const SubscriptionConfirmDialog = ({
  open,
  type,
  plan,
  workspaceName,
  billingCycle,
  priceText,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}) => {
  if (!open || !plan) return null;

  const isTrial = type === "trial";

  const title = isTrial ? "Start Free Trial" : "Purchase Subscription";

  const description = isTrial
    ? `Start ${plan.trialDays || 0} days free trial for ${workspaceName}.`
    : `Activate ${plan.name} subscription for ${workspaceName}.`;

  const confirmLabel = isTrial ? "Continue & Start Free Trial" : "Continue";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4">
      <AppCard
        variant="default"
        rounded="xl"
        bordered
        shadow="lg"
        padding="none"
        sx={dialogCardSx}
      >
        <AppStack direction="row" align="flex-start" justify="space-between">
          <AppStack direction="row" align="center" gap={1}>
            <AppBox sx={dialogIconSx}>
              {isTrial ? <FiCheckCircle /> : <FiCreditCard />}
            </AppBox>

            <AppBox>
              <AppHeading level={2} weight={740} sx={dialogTitleSx}>
                {title}
              </AppHeading>

              <AppText variant="body2" sx={dialogSubtitleSx}>
                {description}
              </AppText>
            </AppBox>
          </AppStack>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-full p-1.5 text-text-muted transition hover:bg-surface-alt hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiX />
          </button>
        </AppStack>

        <AppCard
          variant="soft"
          rounded="lg"
          bordered
          padding="none"
          sx={dialogInfoCardSx}
        >
          <DialogInfoRow label="Workspace" value={workspaceName} />
          <DialogInfoRow label="Plan" value={plan.name} />

          {isTrial ? (
            <DialogInfoRow
              label="Trial"
              value={`${plan.trialDays || 0} days free`}
            />
          ) : (
            <>
              <DialogInfoRow label="Billing" value={titleCase(billingCycle)} />
              <DialogInfoRow label="Amount" value={priceText} />
            </>
          )}

          <DialogInfoRow label="Seats" value="1 user" />
        </AppCard>

        <AppBox sx={dialogNoteSx}>
          {isTrial
            ? "Your workspace trial will start immediately. You can purchase or upgrade later."
            : "Payment gateway will be connected with Razorpay later. For now, this will create a paid subscription directly."}
        </AppBox>

        {error ? (
          <AppCard
            variant="soft"
            rounded="md"
            bordered
            padding="none"
            sx={dialogErrorSx}
          >
            <AppText variant="body2" weight={650} sx={dialogErrorTextSx}>
              {error}
            </AppText>
          </AppCard>
        ) : null}

        <AppStack direction="row" align="center" justify="flex-end" gap={1}>
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            disabled={isSubmitting}
            onClick={onClose}
            sx={dialogCancelButtonSx}
          >
            Cancel
          </AppButton>

          <AppButton
            type="button"
            variant="contained"
            colorVariant="primary"
            rounded="md"
            loading={isSubmitting}
            disabled={
              isSubmitting ||
              (isTrial && (!plan.trialDays || plan.trialDays <= 0))
            }
            onClick={onConfirm}
            sx={dialogConfirmButtonSx}
          >
            {confirmLabel}
          </AppButton>
        </AppStack>
      </AppCard>
    </div>
  );
};

const DialogInfoRow = ({ label, value }) => (
  <AppStack direction="row" align="center" justify="space-between" gap={2}>
    <AppText variant="body2" sx={dialogInfoLabelSx}>
      {label}
    </AppText>

    <AppText variant="body2" weight={700} sx={dialogInfoValueSx}>
      {value}
    </AppText>
  </AppStack>
);

const dialogCardSx = {
  width: "100%",
  maxWidth: 470,
  px: 1.6,
  py: 1.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const dialogIconSx = {
  width: 42,
  height: 42,
  minWidth: 42,
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "21px",
  lineHeight: 0,
};

const dialogTitleSx = {
  m: 0,
  fontSize: "20px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const dialogSubtitleSx = {
  mt: 0.3,
  fontSize: "12.5px",
  lineHeight: "19px",
  color: "var(--app-color-text-muted)",
};

const dialogInfoCardSx = {
  mt: 1.4,
  display: "flex",
  flexDirection: "column",
  gap: 0.85,
  px: 1.2,
  py: 1.05,
  bgcolor: "var(--app-color-surface-alt)",
  borderColor: "var(--app-color-border)",
};

const dialogInfoLabelSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const dialogInfoValueSx = {
  maxWidth: 250,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textAlign: "right",
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const dialogNoteSx = {
  mt: 1,
  mb: 1.2,
  px: 1,
  py: 0.85,
  borderRadius: "10px",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "12px",
  lineHeight: "18px",
};

const dialogErrorSx = {
  mb: 1.2,
  px: 1,
  py: 0.8,
  bgcolor: "var(--app-color-error-soft)",
  borderColor: "var(--app-color-error)",
};

const dialogErrorTextSx = {
  fontSize: "12px",
  color: "var(--app-color-error)",
};

const dialogCancelButtonSx = {
  height: 38,
  px: 1.6,
  fontSize: "12.5px",
  fontWeight: 650,
};

const dialogConfirmButtonSx = {
  height: 38,
  px: 1.8,
  fontSize: "12.5px",
  fontWeight: 700,
};

export default ChoosePlanPage;
