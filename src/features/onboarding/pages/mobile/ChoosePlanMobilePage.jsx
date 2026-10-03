// src/features/onboarding/pages/mobile/ChoosePlanMobilePage.jsx

import { useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiAward,
  FiBox,
  FiCalendar,
  FiCheck,
  FiClock,
  FiHome,
  FiInfo,
  FiLock,
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

const planGroupIcons = {
  starter: <FiSend />,
  professional: <FiBox />,
  enterprise: <FiAward />,
};

const ChoosePlanMobilePage = ({
  workspaceName = "Your Workspace",
  plans = [],
  selectedPlan,
  billingCycle,
  isYearly,
  isLoading = false,
  error,
  handleToggleBillingCycle,
  handleSelectPlan,
  handleBack,
  handleStartTrial,
}) => {
  const [trialPlan, setTrialPlan] = useState(null);

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
    if (isLoading) return;
    handleSelectPlan?.(plan.id);
    setTrialPlan(plan);
  };

  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <AppBox sx={containerSx}>
        <AppBox sx={headerContainerSx}>
          <AppHeading level={1} weight={800} sx={pageTitleSx}>
            Choose Your Plan
          </AppHeading>
          <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
            Start your free trial. No credit card required.
          </AppText>
        </AppBox>

        {/* Centered Billing Switch matching Desktop Logic */}
        <AppBox sx={billingToggleWrapperSx}>
          <AppStack direction="row" align="center" justify="center" gap={1.2}>
            <AppText
              variant="body2"
              weight={!isYearly ? 750 : 500}
              sx={cycleLabelSx}
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
              weight={isYearly ? 750 : 500}
              sx={cycleLabelSx}
            >
              Yearly
            </AppText>
            <AppText variant="body2" weight={800} sx={saveLabelSx}>
              (Save 20%)
            </AppText>
          </AppStack>
        </AppBox>

        {error && (
          <AppCard
            variant="soft"
            rounded="md"
            bordered
            padding="none"
            sx={errorCardSx}
          >
            <AppText variant="body2" weight={650} sx={errorTextSx}>
              {error}
            </AppText>
          </AppCard>
        )}

        <AppStack direction="column" gap={1.25} sx={{ mt: 1 }}>
          {plans.map((plan) => {
            const planTypeKey = String(
              plan.slug || plan.type || "",
            ).toLowerCase();
            const IconElement = planGroupIcons[planTypeKey] || <FiZap />;
            const priceDisplay = isYearly
              ? plan.yearlyMonthlyPrice
              : plan.monthlyPrice;

            return (
              <AppCard
                key={plan.id}
                variant="default"
                rounded="lg"
                bordered
                shadow={plan.popular ? "sm" : "none"}
                padding="none"
                onClick={() => handleSelectPlan(plan.id)}
                sx={{
                  ...planTierCardSx,
                  borderColor: plan.popular
                    ? "var(--app-color-success)"
                    : "var(--app-color-border)",
                }}
              >
                {plan.popular && (
                  <AppBox sx={popularBadgeSx}>Most Popular</AppBox>
                )}

                <AppStack
                  direction="row"
                  align="flex-start"
                  justify="space-between"
                  gap={1}
                  sx={{ mt: plan.popular ? 1.6 : 0 }}
                >
                  <AppStack direction="row" align="center" gap={0.85}>
                    <AppBox sx={iconWrapperSx}>{IconElement}</AppBox>
                    <AppBox>
                      <AppHeading level={2} weight={800} sx={tierTitleSx}>
                        {plan.name}
                      </AppHeading>
                      <AppText variant="body2" weight={500} sx={tierSubtitleSx}>
                        {plan.subtitle}
                      </AppText>
                    </AppBox>
                  </AppStack>

                  <AppBox sx={{ textAlign: "right" }}>
                    <AppStack
                      direction="row"
                      align="baseline"
                      justify="flex-end"
                      gap={0.15}
                    >
                      <AppHeading level={3} weight={800} sx={priceTextSx}>
                        ₹{Number(priceDisplay || 0).toLocaleString("en-IN")}
                      </AppHeading>
                      <AppText variant="body2" weight={600} sx={monthLabelSx}>
                        /month
                      </AppText>
                    </AppStack>
                    <AppText variant="body2" weight={700} sx={savingsTextSx}>
                      {plan.savingsText}
                    </AppText>
                  </AppBox>
                </AppStack>

                <div className="my-2.5 h-[1px] w-full bg-divider" />

                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {plan.features.slice(0, 8).map((f) => (
                    <AppStack key={f} direction="row" align="center" gap={0.4}>
                      <FiCheck className="text-[10.5px] text-success flex-shrink-0" />
                      <AppText variant="body2" weight={500} sx={featureTextSx}>
                        {f}
                      </AppText>
                    </AppStack>
                  ))}
                </div>

                <AppButton
                  variant={plan.popular ? "contained" : "outlined"}
                  colorVariant="success"
                  size="small"
                  fullWidth
                  sx={actionButtonSx}
                  onClick={(e) => {
                    e.stopPropagation();
                    openTrialDialog(plan);
                  }}
                >
                  Start Free Trial
                </AppButton>
              </AppCard>
            );
          })}
        </AppStack>

        <AppStack
          direction="row"
          align="center"
          justify="space-between"
          sx={{ mt: 2.5 }}
        >
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            onClick={handleBack}
            sx={footerBackSx}
          >
            Back
          </AppButton>
          <AppStack direction="row" align="center" gap={0.4}>
            <FiLock className="text-[11px] text-text-muted" />
            <AppText variant="body2" sx={footerNoteSx}>
              Change plan anytime later
            </AppText>
          </AppStack>
        </AppStack>
      </AppBox>

      {/* High Fidelity Ultra-Compact Non-Scrollable Mobile Trial Dialog */}
      {trialPlan && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
          <AppCard
            variant="default"
            rounded="xl"
            padding="none"
            sx={dialogOverlaySx}
          >
            <AppBox sx={dialogContentSx}>
              <button
                onClick={() => setTrialPlan(null)}
                className="absolute right-3 top-3 h-7 w-7 rounded-full bg-surface-alt flex items-center justify-center border-0 z-10"
              >
                <FiX className="text-sm" />
              </button>

              <div className="flex flex-col items-center">
                <div className="relative mb-2">
                  <FiCalendar className="text-[52px] text-success-soft" />
                  <span className="absolute inset-0 flex items-center justify-center pt-0.5 text-lg font-black text-success">
                    {trialPlan.trialDays}
                  </span>
                  <FiClock className="absolute bottom-0 right-0 text-sm text-success" />
                </div>

                <AppHeading
                  level={1}
                  weight={850}
                  align="center"
                  sx={dialogMainTitleSx}
                >
                  Start Your {trialPlan.trialDays}-Day
                  <br />
                  <span className="text-success">Free Trial</span>
                </AppHeading>
                <AppText
                  variant="body2"
                  align="center"
                  weight={500}
                  sx={dialogMainSubtitleSx}
                >
                  Explore all features of your selected plan. No card required.
                </AppText>
              </div>

              <AppBox sx={dialogInfoBannerSx}>
                <FiInfo className="mt-0.5 text-sm text-info flex-shrink-0" />
                <AppText variant="body2" weight={500} sx={dialogBannerTextSx}>
                  Your trial includes all features of the{" "}
                  <strong>{trialPlan.name} plan</strong>.
                </AppText>
              </AppBox>

              <AppBox sx={infoGridSx}>
                <InfoRow
                  icon={<FiHome />}
                  label="Workspace"
                  value={workspaceName}
                />
                <InfoRow
                  icon={<FiAward />}
                  label="Plan"
                  value={trialPlan.name}
                  badge={`${trialPlan.trialDays} Days`}
                />
                <InfoRow
                  icon={<FiCalendar />}
                  label="Duration"
                  value={`${trialPlan.trialDays} Days`}
                />
                <InfoRow
                  icon={<FiCalendar />}
                  label="Ends On"
                  value={trialEndsOn}
                />
              </AppBox>

              <AppBox sx={dialogWarningBannerSx}>
                <FiAlertCircle className="mt-0.5 text-sm text-warning flex-shrink-0" />
                <AppText variant="body2" weight={500} sx={dialogWarningTextSx}>
                  After trial ends, upgrade to keep active records or downgrade.
                </AppText>
              </AppBox>

              <AppButton
                variant="contained"
                colorVariant="success"
                fullWidth
                size="small"
                loading={isLoading}
                onClick={() => handleStartTrial(trialPlan.id)}
                sx={dialogSubmitBtnSx}
              >
                Start Free Trial
              </AppButton>

              <AppStack
                direction="row"
                align="center"
                justify="center"
                gap={0.4}
                sx={{ mt: 1.15 }}
              >
                <FiShield className="text-[11px] text-text-muted" />
                <AppText variant="body2" weight={650} sx={noCardLabelSx}>
                  No credit card required
                </AppText>
              </AppStack>

              <AppBox sx={safeDataBannerSx}>
                <FiShield className="text-sm text-success flex-shrink-0" />
                <div className="min-w-0">
                  <AppText variant="body2" weight={750} sx={safeTitleSx}>
                    Your data is safe with us
                  </AppText>
                  <AppText variant="body2" sx={safeDescSx}>
                    100% encrypted profile context data.
                  </AppText>
                </div>
              </AppBox>
            </AppBox>
          </AppCard>
        </div>
      )}
    </section>
  );
};

const InfoRow = ({ icon, label, value, badge }) => (
  <div className="flex items-center gap-2 py-1.6 border-b border-divider/40 last:border-0">
    <AppBox sx={rowIconSx}>{icon}</AppBox>
    <AppText variant="body2" weight={700} sx={rowLabelSx}>
      {label}
    </AppText>
    <div className="ml-auto flex items-center gap-1">
      <AppText variant="body2" weight={650} sx={rowValueSx}>
        {value}
      </AppText>
      {badge && (
        <span className="rounded bg-success-soft px-1 py-0.25 text-[8.5px] font-bold text-success uppercase">
          {badge}
        </span>
      )}
    </div>
  </div>
);

/* Compact High Density Architectural Styles tokens */
const containerSx = {
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const headerContainerSx = { mb: 1.15 };

const pageTitleSx = { fontSize: "19px", color: "var(--app-color-text)" };

const pageSubtitleSx = {
  mt: 0.15,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const billingToggleWrapperSx = {
  display: "flex",
  justifyContent: "center",
  mb: 1.5,
  mt: 0.25,
};

const cycleLabelSx = { fontSize: "12px", color: "var(--app-color-text)" };

const saveLabelSx = { fontSize: "11.5px", color: "var(--app-color-primary)" };

const errorCardSx = {
  mb: 1.25,
  p: 0.85,
  bgcolor: "var(--app-color-error-soft)",
  borderColor: "var(--app-color-error)",
};

const errorTextSx = { fontSize: "11px", color: "var(--app-color-error)" };

const planTierCardSx = {
  position: "relative",
  p: 1.2,
  bgcolor: "var(--app-color-surface)",
};

const popularBadgeSx = {
  position: "absolute",
  top: 0,
  right: 0,
  bgcolor: "var(--app-color-success)",
  color: "#fff",
  px: 0.85,
  py: 0.3,
  fontSize: "8.5px",
  fontWeight: 800,
  textTransform: "uppercase",
  borderRadius: "0 0 0 8px",
  zIndex: 4,
};

const iconWrapperSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: "50%",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "16px",
};

const tierTitleSx = { m: 0, fontSize: "13.5px" };

const tierSubtitleSx = {
  mt: 0.05,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

const priceTextSx = { fontSize: "18px", letterSpacing: "-0.3px" };

const monthLabelSx = {
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
  pb: 0.15,
};

const savingsTextSx = {
  mt: 0.05,
  fontSize: "10px",
  color: "var(--app-color-success)",
};

const featureTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const actionButtonSx = {
  mt: 1.5,
  height: 30,
  fontWeight: 750,
  fontSize: "11.5px",
};

const footerBackSx = {
  height: 28,
  px: 1.25,
  fontSize: "11px",
  fontWeight: 700,
};

const footerNoteSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

/* Centered Ultra-Compact Fixed Height Overlap Layer Design System Rules */
const dialogOverlaySx = {
  width: "calc(100% - 24px)",
  maxWidth: 380,
  borderRadius: "16px",
  boxShadow: "var(--app-shadow-xl)",
  overflow: "hidden",
};

const dialogContentSx = { p: 1.5, pt: 2, position: "relative" };

const dialogMainTitleSx = { fontSize: "18px", lineHeight: 1.15 };

const dialogMainSubtitleSx = {
  mt: 0.5,
  px: 1,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const dialogInfoBannerSx = {
  mt: 1.5,
  p: 0.85,
  display: "flex",
  gap: 0.75,
  bgcolor: "var(--app-color-info-soft)",
  borderRadius: "8px",
};

const dialogBannerTextSx = {
  fontSize: "11px",
  color: "var(--app-color-text)",
  lineHeight: 1.3,
};

const infoGridSx = { mt: 1, px: 0.25 };

const rowIconSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 26,
  height: 26,
  borderRadius: "6px",
  bgcolor: "var(--app-color-surface-alt)",
  color: "var(--app-color-success)",
  fontSize: "13px",
};

const rowLabelSx = { fontSize: "12px", color: "var(--app-color-text-muted)" };

const rowValueSx = { fontSize: "12px", color: "var(--app-color-text)" };

const dialogWarningBannerSx = {
  mt: 1,
  p: 0.85,
  display: "flex",
  gap: 0.75,
  bgcolor: "var(--app-color-warning-soft)",
  borderRadius: "8px",
};

const dialogWarningTextSx = {
  fontSize: "11px",
  color: "var(--app-color-text)",
  lineHeight: 1.3,
};

const dialogSubmitBtnSx = {
  mt: 1.75,
  height: 38,
  fontSize: "13.5px",
  fontWeight: 800,
};

const noCardLabelSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const safeDataBannerSx = {
  mt: 1.75,
  mb: 0.25,
  p: 0.75,
  display: "flex",
  align: "center",
  gap: 0.85,
  bgcolor: "var(--app-color-readonly-bg)",
  borderRadius: "8px",
};

const safeTitleSx = { fontSize: "11.5px", color: "var(--app-color-text)" };

const safeDescSx = {
  mt: 0.05,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

export default ChoosePlanMobilePage;
