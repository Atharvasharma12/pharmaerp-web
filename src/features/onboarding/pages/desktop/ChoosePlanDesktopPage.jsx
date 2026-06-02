// src/features/onboarding/pages/desktop/ChoosePlanDesktopPage.jsx

import {
  FiArrowLeft,
  FiCheck,
  FiCreditCard,
  FiRefreshCcw,
  FiShield,
  FiStar,
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

const ChoosePlanDesktopPage = ({
  workspaceName = "Your Workspace",
  plans = [],
  selectedPlan,
  selectedPlanData,
  billingCycle,
  isYearly,
  isLoading = false,
  isFetchingPlans = false,
  error,
  handleToggleBillingCycle,
  handleSelectPlan,
  handleBack,
  handleStartTrial,
  handlePurchaseSubscription,
}) => {
  const hasPlans = plans.length > 0;

  return (
    <section className="relative -mx-6 -my-8 overflow-hidden bg-bg lg:-mx-6">
      <div className="min-h-[calc(100vh-58px)] px-6 py-5">
        <AppBox sx={pageSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={2}
            sx={headerSx}
          >
            <AppStack direction="row" align="center" gap={1.1}>
              <IconBox icon={<FiCreditCard />} />

              <AppBox>
                <AppHeading level={1} weight={720} sx={titleSx}>
                  Choose Plan
                </AppHeading>

                <AppText variant="body2" sx={subtitleSx}>
                  Select a plan for{" "}
                  <span className="font-semibold text-primary">
                    {workspaceName}
                  </span>
                  .
                </AppText>
              </AppBox>
            </AppStack>

            <AppCard
              variant="soft"
              rounded="lg"
              bordered
              padding="none"
              sx={workspaceCardSx}
            >
              <AppText variant="body2" weight={650} sx={workspaceLabelSx}>
                Workspace
              </AppText>

              <AppText variant="body2" weight={700} sx={workspaceNameSx}>
                {workspaceName}
              </AppText>
            </AppCard>
          </AppStack>

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="xs"
            padding="none"
            sx={billingCardSx}
          >
            <AppStack direction="row" align="center" justify="center" gap={1.4}>
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

              <AppText variant="body2" weight={650} sx={saveTextSx}>
                Save more yearly
              </AppText>
            </AppStack>
          </AppCard>

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
              <FiRefreshCcw className="animate-spin text-[20px] text-primary" />

              <AppText variant="body2" weight={650} sx={loadingTextSx}>
                Loading plans...
              </AppText>
            </AppCard>
          ) : null}

          {!isFetchingPlans && !hasPlans ? (
            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="sm"
              padding="none"
              sx={emptyCardSx}
            >
              <IconBox icon={<FiShield />} large />

              <AppHeading level={2} weight={720} sx={emptyTitleSx}>
                No active plans available
              </AppHeading>

              <AppText variant="body2" sx={emptyTextSx}>
                Please contact support or try again later.
              </AppText>
            </AppCard>
          ) : null}

          {!isFetchingPlans && hasPlans ? (
            <div className="grid gap-3 lg:grid-cols-3">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                const priceText = isYearly ? plan.yearlyText : plan.monthlyText;
                const monthlyEquivalent = isYearly
                  ? `≈ ₹${Number(plan.yearlyMonthlyPrice || 0).toLocaleString(
                      "en-IN",
                    )} / month`
                  : plan.trialText;

                const hasTrial = Number(plan.trialDays || 0) > 0;

                return (
                  <AppCard
                    key={plan.id}
                    variant="default"
                    rounded="xl"
                    bordered
                    shadow={isSelected ? "md" : "xs"}
                    padding="none"
                    sx={{
                      ...planCardSx,
                      ...(isSelected ? selectedPlanCardSx : {}),
                    }}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.popular ? (
                      <div className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-primary-contrast">
                        Popular
                      </div>
                    ) : null}

                    <AppStack direction="row" align="center" gap={1}>
                      <PlanIcon active={isSelected} />

                      <AppBox sx={{ minWidth: 0 }}>
                        <AppHeading level={2} weight={720} sx={planNameSx}>
                          {plan.name}
                        </AppHeading>

                        <AppText variant="body2" sx={planSubtitleSx}>
                          {plan.subtitle}
                        </AppText>
                      </AppBox>
                    </AppStack>

                    <AppBox sx={priceWrapSx}>
                      <AppHeading level={3} weight={740} sx={priceSx}>
                        {priceText}
                      </AppHeading>

                      <AppText variant="body2" weight={600} sx={savingSx}>
                        {monthlyEquivalent}
                      </AppText>

                      {isYearly ? (
                        <AppText variant="body2" weight={600} sx={savingSx}>
                          {plan.savingsText}
                        </AppText>
                      ) : null}
                    </AppBox>

                    <AppBox sx={featureListSx}>
                      {plan.features.slice(0, 6).map((feature) => (
                        <FeatureItem key={feature} text={feature} />
                      ))}
                    </AppBox>

                    <AppStack
                      direction="row"
                      align="center"
                      gap={0.8}
                      sx={{ mt: 1.5 }}
                    >
                      <AppButton
                        type="button"
                        variant="outlined"
                        colorVariant="primary"
                        rounded="md"
                        fullWidth
                        disabled={isLoading || !hasTrial}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleStartTrial(plan.id);
                        }}
                        sx={selectButtonSx}
                      >
                        Free Trial
                      </AppButton>

                      <AppButton
                        type="button"
                        variant={isSelected ? "contained" : "outlined"}
                        colorVariant={isSelected ? "primary" : "neutral"}
                        rounded="md"
                        fullWidth
                        disabled={isLoading}
                        onClick={(event) => {
                          event.stopPropagation();
                          handlePurchaseSubscription(plan.id);
                        }}
                        sx={selectButtonSx}
                      >
                        Subscribe
                      </AppButton>
                    </AppStack>
                  </AppCard>
                );
              })}
            </div>
          ) : null}

          <AppCard
            variant="default"
            rounded="xl"
            bordered
            shadow="sm"
            padding="none"
            sx={summaryCardSx}
          >
            <AppStack
              direction="row"
              align="center"
              justify="space-between"
              gap={2}
            >
              <AppBox sx={summaryInfoSx}>
                <AppText variant="body2" weight={650} sx={summaryLabelSx}>
                  Selected for {workspaceName}
                </AppText>

                <AppStack
                  direction="row"
                  align="center"
                  gap={1}
                  sx={{ mt: 0.45 }}
                >
                  <AppHeading level={2} weight={720} sx={summaryTitleSx}>
                    {selectedPlanData ? selectedPlanData.name : "No plan"}
                  </AppHeading>

                  {selectedPlanData ? (
                    <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {isYearly ? "Yearly" : "Monthly"}
                    </span>
                  ) : null}
                </AppStack>

                <AppText variant="body2" sx={summaryTextSx}>
                  {selectedPlanData
                    ? isYearly
                      ? selectedPlanData.yearlyText
                      : selectedPlanData.monthlyText
                    : "Please select a plan to continue."}
                </AppText>
              </AppBox>

              <AppStack direction="row" align="center" gap={1}>
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  startIcon={<FiArrowLeft />}
                  disabled={isLoading}
                  onClick={handleBack}
                  sx={backButtonSx}
                >
                  Dashboard
                </AppButton>

                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="primary"
                  rounded="md"
                  startIcon={<FiZap />}
                  disabled={
                    isLoading ||
                    !selectedPlanData ||
                    !Number(selectedPlanData.trialDays || 0)
                  }
                  onClick={() => handleStartTrial(selectedPlan)}
                  sx={trialButtonSx}
                >
                  Free Trial
                </AppButton>

                <AppButton
                  type="button"
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  loading={isLoading}
                  disabled={isLoading || !selectedPlanData}
                  onClick={() => handlePurchaseSubscription(selectedPlan)}
                  sx={continueButtonSx}
                >
                  Subscribe
                </AppButton>
              </AppStack>
            </AppStack>
          </AppCard>
        </AppBox>
      </div>
    </section>
  );
};

const IconBox = ({ icon, large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 52 : 42,
      height: large ? 52 : 42,
      minWidth: large ? 52 : 42,
      borderRadius: large ? "16px" : "13px",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: large ? "25px" : "21px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const PlanIcon = ({ active }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: 38,
      height: 38,
      minWidth: 38,
      borderRadius: "13px",
      bgcolor: active
        ? "var(--app-color-primary)"
        : "var(--app-color-primary-soft)",
      color: active
        ? "var(--app-color-primary-contrast)"
        : "var(--app-color-primary)",
      fontSize: "18px",
      lineHeight: 0,
    }}
  >
    <FiStar />
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
  maxWidth: 1080,
  mx: "auto",
};

const headerSx = {
  mb: 1.5,
};

const titleSx = {
  m: 0,
  fontSize: { xs: "24px", lg: "28px" },
  lineHeight: 1.15,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.3,
  fontSize: "12.8px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const workspaceCardSx = {
  minWidth: 210,
  px: 1.4,
  py: 0.9,
  bgcolor: "var(--app-color-primary-soft)",
  borderColor: "var(--app-color-border)",
};

const workspaceLabelSx = {
  fontSize: "10px",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "var(--app-color-text-muted)",
};

const workspaceNameSx = {
  mt: 0.15,
  maxWidth: 230,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const billingCardSx = {
  width: "fit-content",
  mx: "auto",
  mb: 1.7,
  px: 1.5,
  py: 0.8,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const cycleTextSx = {
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const saveTextSx = {
  ml: 0.4,
  px: 1,
  py: 0.35,
  borderRadius: "999px",
  fontSize: "11px",
  color: "var(--app-color-primary)",
  bgcolor: "var(--app-color-primary-soft)",
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
  gap: 1,
  bgcolor: "var(--app-color-surface)",
};

const loadingTextSx = {
  fontSize: "12.5px",
  color: "var(--app-color-text-muted)",
};

const emptyCardSx = {
  minHeight: 240,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  px: 3,
  py: 3.5,
  textAlign: "center",
  bgcolor: "var(--app-color-surface)",
};

const emptyTitleSx = {
  mt: 1.2,
  mb: 0,
  fontSize: "20px",
  color: "var(--app-color-text)",
};

const emptyTextSx = {
  mt: 0.45,
  fontSize: "12.5px",
  color: "var(--app-color-text-muted)",
};

const planCardSx = {
  position: "relative",
  cursor: "pointer",
  minHeight: 382,
  px: 1.7,
  py: 1.6,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "all 160ms ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "var(--app-shadow-sm)",
  },
};

const selectedPlanCardSx = {
  borderColor: "var(--app-color-primary)",
  boxShadow: "var(--app-shadow-md)",
};

const planNameSx = {
  m: 0,
  maxWidth: 190,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "17px",
  color: "var(--app-color-text)",
};

const planSubtitleSx = {
  mt: 0.25,
  maxWidth: 230,
  fontSize: "11.8px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const priceWrapSx = {
  mt: 1.5,
  pb: 1.2,
  borderBottom: "1px solid var(--app-color-border)",
};

const priceSx = {
  m: 0,
  fontSize: "20px",
  letterSpacing: "-0.35px",
  color: "var(--app-color-text)",
};

const savingSx = {
  mt: 0.3,
  fontSize: "11.4px",
  color: "var(--app-color-primary)",
};

const featureListSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.8,
  mt: 1.25,
  minHeight: 125,
};

const checkIconSx = {
  width: 19,
  height: 19,
  minWidth: 19,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-success-soft)",
  color: "var(--app-color-success)",
  fontSize: "11px",
};

const featureTextSx = {
  fontSize: "12px",
  lineHeight: "17px",
  color: "var(--app-color-text)",
};

const selectButtonSx = {
  height: 36,
  fontSize: "12.2px",
  fontWeight: 700,
};

const summaryCardSx = {
  mt: 1.7,
  px: 1.5,
  py: 1.15,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const summaryInfoSx = {
  minWidth: 0,
};

const summaryLabelSx = {
  fontSize: "10.8px",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "var(--app-color-text-muted)",
};

const summaryTitleSx = {
  m: 0,
  fontSize: "17px",
  color: "var(--app-color-text)",
};

const summaryTextSx = {
  mt: 0.4,
  fontSize: "12.5px",
  color: "var(--app-color-text-muted)",
};

const backButtonSx = {
  height: 38,
  px: 1.8,
  fontSize: "12.8px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface-alt)",
};

const trialButtonSx = {
  height: 38,
  px: 1.8,
  fontSize: "12.8px",
  fontWeight: 700,
};

const continueButtonSx = {
  height: 38,
  px: 2.2,
  fontSize: "13px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

export default ChoosePlanDesktopPage;
