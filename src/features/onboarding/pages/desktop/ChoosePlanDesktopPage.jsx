// src/features/onboarding/pages/desktop/ChoosePlanDesktopPage.jsx

import { useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiAward,
  FiBox,
  FiCalendar,
  FiCheck,
  FiClock,
  FiHeadphones,
  FiHome,
  FiInfo,
  FiPaperclip,
  FiSend,
  FiShield,
  FiX,
  FiZap,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppSwitch,
  AppText,
} from "@/components";

const fallbackPlans = [
  {
    id: "starter",
    name: "Starter",
    subtitle: "Perfect for single pharmacy",
    monthlyText: "₹999 /month",
    yearlyText: "₹11,988 /year",
    yearlyMonthlyPrice: 999,
    trialDays: 14,
    popular: false,
    features: [
      "1 Company",
      "1 Branch",
      "Up to 3 Users",
      "Inventory Management",
      "POS Billing",
      "Basic Reports",
      "Email Support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    subtitle: "Best for growing pharmacy business",
    monthlyText: "₹1,999 /month",
    yearlyText: "₹23,988 /year",
    yearlyMonthlyPrice: 1999,
    trialDays: 14,
    popular: true,
    features: [
      "5 Companies",
      "10 Branches",
      "Up to 20 Users",
      "Advanced Inventory",
      "Purchases & Suppliers",
      "Advanced Reports",
      "Expiry & Batch Management",
      "Priority Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    subtitle: "For large pharmacy chains",
    monthlyText: "₹3,999 /month",
    yearlyText: "₹47,988 /year",
    yearlyMonthlyPrice: 3999,
    trialDays: 14,
    popular: false,
    features: [
      "Unlimited Companies",
      "Unlimited Branches",
      "Unlimited Users",
      "All Professional Features",
      "Multi-warehouse",
      "Advanced Analytics",
      "Dedicated Account Manager",
      "24/7 Premium Support",
    ],
  },
];

const comparisonRows = [
  {
    label: "POS Billing",
    icon: <FiPaperclip />,
    values: ["Included", "Included", "Included"],
  },
  {
    label: "Inventory Management",
    icon: <FiBox />,
    values: ["Basic", "Advanced", "Advanced + Multi-warehouse"],
  },
  {
    label: "Reports",
    icon: <FiZap />,
    values: ["Basic Reports", "Advanced Reports", "Advanced Analytics"],
  },
  {
    label: "Support",
    icon: <FiHeadphones />,
    values: ["Email Support", "Priority Support", "24/7 Premium Support"],
  },
];

const ChoosePlanDesktopPage = ({
  workspaceName = "Your Workspace",
  plans = [],
  selectedPlan,
  selectedPlanData,
  isYearly,
  isLoading = false,
  isFetchingPlans = false,
  error,
  handleToggleBillingCycle,
  handleSelectPlan,
  handleStartTrial,
}) => {
  const [trialPlan, setTrialPlan] = useState(null);

  const visiblePlans = plans.length ? plans : fallbackPlans;
  const activeSelectedPlan = selectedPlan || selectedPlanData?.id;
  const hasPlans = visiblePlans.length > 0;

  const trialEndsOn = useMemo(() => {
    const trialDays = Number(trialPlan?.trialDays || 14);
    const date = new Date();
    date.setDate(date.getDate() + trialDays);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [trialPlan]);

  const openTrialDialog = (plan) => {
    if (!plan || isLoading) return;

    handleSelectPlan?.(plan.id);
    setTrialPlan(plan);
  };

  const closeTrialDialog = () => {
    if (isLoading) return;
    setTrialPlan(null);
  };

  const confirmTrial = async () => {
    if (!trialPlan || isLoading) return;

    await handleStartTrial?.(trialPlan.id);
  };

  return (
    <section className="min-h-[calc(100vh-122px)] bg-bg px-4 py-4">
      <AppBox sx={pageSx}>
        <AppBox sx={heroSx}>
          <AppHeading level={1} weight={750} sx={titleSx}>
            Choose Your Plan
          </AppHeading>

          <AppText variant="body2" sx={subtitleSx}>
            Start a free 14-day trial. No credit card required.
          </AppText>

          <div className="mt-4 flex w-full justify-center">
            <AppStack
              direction="row"
              align="center"
              justify="center"
              gap={1.2}
              sx={billingToggleSx}
            >
              <AppText
                variant="body2"
                weight={!isYearly ? 700 : 500}
                sx={cycleTextSx}
              >
                Monthly
              </AppText>

              <AppSwitch
                checked={isYearly}
                onChange={handleToggleBillingCycle}
                disabled={isLoading}
                colorVariant="primary"
                size="small"
              />

              <AppText
                variant="body2"
                weight={isYearly ? 700 : 500}
                sx={cycleTextSx}
              >
                Yearly
              </AppText>

              <AppText variant="body2" weight={700} sx={saveTextSx}>
                (Save 20%)
              </AppText>
            </AppStack>
          </div>
        </AppBox>

        {error ? (
          <AppCard
            variant="soft"
            rounded="lg"
            bordered
            padding="none"
            sx={errorCardSx}
          >
            <AppText variant="body2" weight={650} sx={errorTextSx}>
              {error}
            </AppText>
          </AppCard>
        ) : null}

        {isFetchingPlans ? (
          <AppCard
            variant="default"
            rounded="xl"
            bordered
            shadow="sm"
            padding="none"
            sx={loadingCardSx}
          >
            <AppText variant="body2" weight={650} sx={loadingTextSx}>
              Loading plans...
            </AppText>
          </AppCard>
        ) : null}

        {!isFetchingPlans && hasPlans ? (
          <div className="grid grid-cols-[minmax(0,1fr)_180px] gap-3">
            <div>
              <div className="grid grid-cols-3 items-center gap-4">
                {visiblePlans.map((plan, index) => {
                  const isSelected =
                    activeSelectedPlan === plan.id ||
                    (!activeSelectedPlan && plan.popular);

                  const priceText = isYearly
                    ? plan.yearlyText
                    : plan.monthlyText;

                  const monthlyAmount = isYearly
                    ? plan.yearlyMonthlyPrice
                    : Number(String(priceText).replace(/[^\d]/g, "") || 0);

                  return (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      index={index}
                      isSelected={isSelected}
                      priceText={priceText}
                      monthlyAmount={monthlyAmount}
                      isLoading={isLoading}
                      onSelect={() => handleSelectPlan?.(plan.id)}
                      onStartTrial={(event) => {
                        event.stopPropagation();
                        openTrialDialog(plan);
                      }}
                    />
                  );
                })}
              </div>

              <ComparisonTable />
            </div>

            <RightHelpPanel />
          </div>
        ) : null}
      </AppBox>

      <TrialDialog
        open={Boolean(trialPlan)}
        plan={trialPlan}
        workspaceName={workspaceName}
        trialEndsOn={trialEndsOn}
        isLoading={isLoading}
        error={error}
        onClose={closeTrialDialog}
        onConfirm={confirmTrial}
      />
    </section>
  );
};

const PlanCard = ({
  plan,
  index,
  isSelected,
  priceText,
  monthlyAmount,
  isLoading,
  onSelect,
  onStartTrial,
}) => {
  const icons = [<FiSend />, <FiBox />, <FiAward />];

  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow={isSelected ? "md" : "xs"}
      padding="none"
      sx={{
        ...planCardSx,
        ...(plan.popular ? popularPlanCardSx : {}),
        ...(isSelected ? selectedPlanCardSx : {}),
      }}
      onClick={onSelect}
    >
      {plan.popular ? (
        <div className="absolute left-0 right-0 top-0 rounded-t-xl bg-primary py-1 text-center text-[10px] font-bold uppercase tracking-wide text-primary-contrast">
          Most Popular
        </div>
      ) : null}

      <AppStack direction="row" align="center" gap={1.2} sx={planHeaderSx}>
        <PlanIcon icon={icons[index] || <FiZap />} />
        <AppBox>
          <AppHeading level={2} weight={720} sx={planNameSx}>
            {plan.name}
          </AppHeading>

          <AppText variant="body2" sx={planSubtitleSx}>
            {plan.subtitle}
          </AppText>
        </AppBox>
      </AppStack>

      <AppBox sx={priceWrapSx}>
        <AppStack direction="row" align="flex-end" gap={0.5}>
          <AppHeading level={3} weight={760} sx={priceSx}>
            ₹{Number(monthlyAmount || 0).toLocaleString("en-IN")}
          </AppHeading>

          <AppText variant="body2" sx={perMonthSx}>
            /month
          </AppText>
        </AppStack>

        <AppText variant="body2" sx={billingTextSx}>
          Billed annually {priceText}
        </AppText>
      </AppBox>

      <AppBox sx={featureListSx}>
        {(plan.features || []).slice(0, 8).map((feature) => (
          <FeatureItem key={feature} text={feature} />
        ))}
      </AppBox>

      <AppButton
        type="button"
        variant={isSelected ? "contained" : "outlined"}
        colorVariant="primary"
        rounded="md"
        fullWidth
        disabled={isLoading || !Number(plan.trialDays || 0)}
        onClick={onStartTrial}
        sx={trialButtonSx}
      >
        Start 14-Day Free Trial
      </AppButton>
    </AppCard>
  );
};

const TrialDialog = ({
  open,
  plan,
  workspaceName,
  trialEndsOn,
  isLoading,
  error,
  onClose,
  onConfirm,
}) => {
  if (!open || !plan) return null;

  const trialDays = Number(plan.trialDays || 14);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 backdrop-blur-[2px]">
      <AppCard
        variant="default"
        rounded="xl"
        bordered
        shadow="xl"
        padding="none"
        sx={dialogCardSx}
      >
        <div className="grid min-h-[560px] grid-cols-[320px_1fr] overflow-hidden">
          <div className="border-r border-divider bg-surface-alt px-6 py-7">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-5 flex justify-center">
                  <div className="relative flex h-[94px] w-[94px] items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <FiCalendar className="text-[52px]" />

                    <span className="absolute text-[30px] font-bold leading-none text-primary">
                      {trialDays}
                    </span>

                    <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-primary-soft text-primary">
                      <FiClock className="text-[19px]" />
                    </span>
                  </div>
                </div>

                <AppHeading level={2} weight={750} sx={dialogLeftTitleSx}>
                  Start Your {trialDays}-Day
                  <br />
                  <span className="text-primary">Free Trial</span>
                </AppHeading>

                <AppText variant="body2" sx={dialogLeftTextSx}>
                  Explore all features of your selected plan. No credit card
                  required.
                </AppText>

                <div className="mt-7 space-y-3.5">
                  {[
                    "Full access to all features",
                    "Cancel anytime",
                    "No credit card required",
                  ].map((item) => (
                    <AppStack key={item} direction="row" align="center" gap={1}>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-soft text-[11px] text-success">
                        <FiCheck />
                      </span>

                      <AppText variant="body2" sx={dialogBenefitTextSx}>
                        {item}
                      </AppText>
                    </AppStack>
                  ))}
                </div>
              </div>

              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={safeCardSx}
              >
                <AppStack direction="row" align="flex-start" gap={1}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <FiShield />
                  </span>

                  <AppBox>
                    <AppText variant="body2" weight={700} sx={safeTitleSx}>
                      Your data is safe with us
                    </AppText>

                    <AppText variant="body2" sx={safeTextSx}>
                      We never share your information with anyone.
                    </AppText>
                  </AppBox>
                </AppStack>
              </AppCard>
            </div>
          </div>

          <div className="px-7 py-7">
            <div className="flex items-start justify-between gap-4">
              <AppBox>
                <AppHeading level={2} weight={750} sx={dialogTitleSx}>
                  Start Free Trial
                </AppHeading>

                <AppText variant="body2" sx={dialogSubtitleSx}>
                  You’re just one step away from exploring all the powerful
                  features of PharmaERP.
                </AppText>
              </AppBox>

              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="rounded-full p-1.5 text-text-muted transition hover:bg-surface-alt hover:text-text disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiX className="text-[23px]" />
              </button>
            </div>

            <AppCard
              variant="soft"
              rounded="lg"
              bordered
              padding="none"
              sx={infoBannerSx}
            >
              <AppStack direction="row" align="center" gap={1}>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-info text-[12px] text-text-inverse">
                  <FiInfo />
                </span>

                <AppText variant="body2" sx={bannerTextSx}>
                  Your trial includes all features of the {plan.name} plan for{" "}
                  {trialDays} days.
                </AppText>
              </AppStack>
            </AppCard>

            <div className="mt-4 divide-y divide-divider">
              <TrialInfoRow
                icon={<FiHome />}
                label="Workspace"
                value={workspaceName}
              />

              <TrialInfoRow
                icon={<FiAward />}
                label="Plan"
                value={plan.name}
                badge={`${trialDays} Days Free Trial`}
              />

              <TrialInfoRow
                icon={<FiCalendar />}
                label="Trial Duration"
                value={`${trialDays} Days`}
              />

              <TrialInfoRow
                icon={<FiCalendar />}
                label="Trial Ends On"
                value={trialEndsOn}
              />
            </div>

            <AppCard
              variant="soft"
              rounded="lg"
              bordered
              padding="none"
              sx={warningBannerSx}
            >
              <AppStack direction="row" align="flex-start" gap={1}>
                <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-warning text-[11px] text-text-inverse">
                  <FiAlertCircle />
                </span>

                <AppText variant="body2" sx={warningTextSx}>
                  After your trial ends, you can upgrade to continue using the
                  features or downgrade to a lower plan.
                </AppText>
              </AppStack>
            </AppCard>

            {error ? (
              <AppCard
                variant="soft"
                rounded="lg"
                bordered
                padding="none"
                sx={dialogErrorSx}
              >
                <AppText variant="body2" weight={650} sx={dialogErrorTextSx}>
                  {error}
                </AppText>
              </AppCard>
            ) : null}

            <AppButton
              type="button"
              variant="contained"
              colorVariant="primary"
              rounded="md"
              fullWidth
              loading={isLoading}
              disabled={isLoading || !Number(plan.trialDays || 0)}
              onClick={onConfirm}
              sx={dialogStartButtonSx}
            >
              Start Free Trial
            </AppButton>

            <AppStack direction="row" align="center" justify="center" gap={0.8}>
              <FiShield className="text-[14px] text-text-muted" />

              <AppText variant="body2" sx={noCardTextSx}>
                No credit card required
              </AppText>
            </AppStack>
          </div>
        </div>
      </AppCard>
    </div>
  );
};

const TrialInfoRow = ({ icon, label, value, badge }) => (
  <div className="grid grid-cols-[46px_160px_1fr] items-center py-3">
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-[17px] text-primary">
      {icon}
    </span>

    <AppText variant="body2" weight={700} sx={trialInfoLabelSx}>
      {label}
    </AppText>

    <AppStack direction="row" align="center" gap={0.8}>
      <AppText variant="body2" weight={650} sx={trialInfoValueSx}>
        {value}
      </AppText>

      {badge ? (
        <span className="rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success">
          {badge}
        </span>
      ) : null}
    </AppStack>
  </div>
);

const RightHelpPanel = () => (
  <div className="flex items-center">
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow="xs"
      padding="none"
      sx={sideCardSx}
    >
      <SideBlock icon={<FiShield />} title="Risk-Free Trial">
        Try all features for 14 days. Cancel anytime.
      </SideBlock>

      <div className="my-3 border-t border-divider" />

      <SideBlock icon={<FiHeadphones />} title="Need Help?">
        Our team is here to help you choose the right plan.
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary"
        >
          Contact Support
        </button>
      </SideBlock>
    </AppCard>
  </div>
);

const SideBlock = ({ icon, title, children }) => (
  <AppStack direction="row" align="flex-start" gap={0.9}>
    <AppBox sx={sideIconSx}>{icon}</AppBox>

    <AppBox>
      <AppHeading level={3} weight={650} sx={sideTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={sideTextSx}>
        {children}
      </AppText>
    </AppBox>
  </AppStack>
);

const ComparisonTable = () => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="xs"
    padding="none"
    sx={tableSx}
  >
    {comparisonRows.map((row, rowIndex) => (
      <div
        key={row.label}
        className={`grid grid-cols-[210px_1fr_1.2fr_1.3fr] ${
          rowIndex === comparisonRows.length - 1
            ? ""
            : "border-b border-divider"
        }`}
      >
        <div className="flex items-center gap-2 border-r border-divider px-4 py-2">
          <span className="text-[14px] text-text-muted">{row.icon}</span>

          <AppText variant="body2" sx={tableLabelSx}>
            {row.label}
          </AppText>
        </div>

        {row.values.map((value) => (
          <div
            key={value}
            className="flex items-center gap-2 border-r border-divider px-5 py-2 last:border-r-0"
          >
            <FiCheck className="text-[13px] text-primary" />

            <AppText variant="body2" sx={tableValueSx}>
              {value}
            </AppText>
          </div>
        ))}
      </div>
    ))}
  </AppCard>
);

const PlanIcon = ({ icon }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: 46,
      height: 46,
      minWidth: 46,
      borderRadius: "50%",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: "21px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const FeatureItem = ({ text }) => (
  <AppStack direction="row" align="center" gap={0.85}>
    <AppBox sx={checkIconSx}>
      <FiCheck />
    </AppBox>

    <AppText variant="body2" sx={featureTextSx}>
      {text}
    </AppText>
  </AppStack>
);

const pageSx = {
  width: "100%",
  maxWidth: 1220,
  mx: "auto",
};

const heroSx = {
  textAlign: "center",
  mb: 2,
};

const titleSx = {
  m: 0,
  fontSize: "30px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.7,
  fontSize: "15px",
  color: "var(--app-color-text-muted)",
};

const billingToggleSx = {
  width: "fit-content",
  mx: "auto",
};

const cycleTextSx = {
  fontSize: "13px",
  color: "var(--app-color-text-muted)",
};

const saveTextSx = {
  fontSize: "13px",
  color: "var(--app-color-primary)",
};

const errorCardSx = {
  mb: 1.5,
  px: 1.3,
  py: 0.9,
  bgcolor: "var(--app-color-error-soft)",
  borderColor: "var(--app-color-error)",
};

const errorTextSx = {
  fontSize: "12px",
  color: "var(--app-color-error)",
};

const loadingCardSx = {
  minHeight: 220,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-surface)",
};

const loadingTextSx = {
  fontSize: "12.5px",
  color: "var(--app-color-text-muted)",
};

const planCardSx = {
  position: "relative",
  cursor: "pointer",
  minHeight: 405,
  px: 1.7,
  py: 1.7,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "all 160ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "var(--app-shadow-sm)",
  },
};

const popularPlanCardSx = {
  minHeight: 445,
};

const selectedPlanCardSx = {
  borderColor: "var(--app-color-primary)",
  boxShadow: "var(--app-shadow-md)",
};

const planHeaderSx = {
  mt: 2.5,
  minHeight: 50,
};

const planNameSx = {
  m: 0,
  fontSize: "19px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const planSubtitleSx = {
  mt: 0.4,
  fontSize: "11.8px",
  color: "var(--app-color-text-muted)",
};

const priceWrapSx = {
  mt: 1.5,
  pb: 1.2,
  borderBottom: "1px solid var(--app-color-border)",
};

const priceSx = {
  m: 0,
  fontSize: "25px",
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const perMonthSx = {
  pb: 0.35,
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const billingTextSx = {
  mt: 0.6,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const featureListSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.75,
  mt: 1.15,
  minHeight: 150,
};

const checkIconSx = {
  width: 16,
  height: 16,
  minWidth: 16,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-success)",
  color: "var(--app-color-text-inverse)",
  fontSize: "9px",
};

const featureTextSx = {
  fontSize: "11.7px",
  color: "var(--app-color-text)",
};

const trialButtonSx = {
  mt: 1.4,
  height: 36,
  fontSize: "12px",
  fontWeight: 700,
};

const sideCardSx = {
  width: 180,
  px: 1.2,
  py: 1.35,
  bgcolor: "var(--app-color-surface-alt)",
};

const sideIconSx = {
  width: 22,
  height: 22,
  minWidth: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--app-color-primary)",
  fontSize: "15px",
};

const sideTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const sideTextSx = {
  mt: 0.6,
  fontSize: "11px",
  lineHeight: 1.5,
  color: "var(--app-color-text-muted)",
};

const tableSx = {
  mt: 1.5,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
};

const tableLabelSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text)",
};

const tableValueSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text)",
};

const dialogCardSx = {
  width: "100%",
  maxWidth: 900,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const dialogLeftTitleSx = {
  m: 0,
  textAlign: "center",
  fontSize: "25px",
  lineHeight: 1.25,
  color: "var(--app-color-text)",
};

const dialogLeftTextSx = {
  mt: 1.4,
  textAlign: "center",
  fontSize: "13px",
  lineHeight: 1.6,
  color: "var(--app-color-text-muted)",
};

const dialogBenefitTextSx = {
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const safeCardSx = {
  px: 1.2,
  py: 1.1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const safeTitleSx = {
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const safeTextSx = {
  mt: 0.35,
  fontSize: "10.8px",
  lineHeight: 1.45,
  color: "var(--app-color-text-muted)",
};

const dialogTitleSx = {
  m: 0,
  fontSize: "26px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const dialogSubtitleSx = {
  mt: 0.6,
  maxWidth: 450,
  fontSize: "13px",
  lineHeight: 1.55,
  color: "var(--app-color-text-muted)",
};

const infoBannerSx = {
  mt: 2.2,
  px: 1.2,
  py: 1.05,
  bgcolor: "var(--app-color-info-soft)",
  borderColor: "var(--app-color-border)",
};

const bannerTextSx = {
  fontSize: "12.2px",
  color: "var(--app-color-text)",
};

const trialInfoLabelSx = {
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const trialInfoValueSx = {
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const warningBannerSx = {
  mt: 2,
  px: 1.2,
  py: 1.05,
  bgcolor: "var(--app-color-warning-soft)",
  borderColor: "var(--app-color-border)",
};

const warningTextSx = {
  fontSize: "12px",
  lineHeight: 1.5,
  color: "var(--app-color-text)",
};

const dialogErrorSx = {
  mt: 1.2,
  px: 1.2,
  py: 0.95,
  bgcolor: "var(--app-color-error-soft)",
  borderColor: "var(--app-color-error)",
};

const dialogErrorTextSx = {
  fontSize: "12px",
  color: "var(--app-color-error)",
};

const dialogStartButtonSx = {
  mt: 2,
  height: 44,
  fontSize: "14px",
  fontWeight: 750,
};

const noCardTextSx = {
  mt: 1.1,
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

export default ChoosePlanDesktopPage;
