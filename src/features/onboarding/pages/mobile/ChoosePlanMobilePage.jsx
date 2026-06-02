// src/features/onboarding/pages/mobile/ChoosePlanMobilePage.jsx

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

const ChoosePlanMobilePage = ({
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
    <section className="relative w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_7%,transparent),transparent_34%)]" />

      <AppBox sx={sectionSx}>
        <AppStack direction="row" align="center" gap={1.05}>
          <IconBox icon={<FiCreditCard />} />

          <AppBox sx={{ minWidth: 0 }}>
            <AppHeading level={1} weight={720} sx={titleSx}>
              Choose Plan
            </AppHeading>

            <AppText variant="body2" sx={subtitleSx}>
              Plan for{" "}
              <span className="font-semibold text-primary">
                {workspaceName}
              </span>
            </AppText>
          </AppBox>
        </AppStack>

        <AppCard
          variant="soft"
          rounded="lg"
          bordered
          shadow="xs"
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

        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="xs"
          padding="none"
          sx={billingCardSx}
        >
          <AppStack direction="row" align="center" justify="center" gap={1.1}>
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
          </AppStack>

          <AppText variant="body2" weight={650} sx={saveTextSx}>
            {billingCycle === "yearly"
              ? "Yearly billing selected"
              : "Switch yearly to save more"}
          </AppText>
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
            <FiRefreshCcw className="animate-spin text-[19px] text-primary" />

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
              No active plans
            </AppHeading>

            <AppText variant="body2" sx={emptyTextSx}>
              Please contact support or try again later.
            </AppText>
          </AppCard>
        ) : null}

        {!isFetchingPlans && hasPlans ? (
          <AppStack direction="column" gap={1.2} sx={{ mt: 1.25 }}>
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
                  <AppStack direction="row" align="flex-start" gap={1}>
                    <PlanIcon active={isSelected} />

                    <AppBox sx={{ minWidth: 0, flex: 1 }}>
                      <AppStack
                        direction="row"
                        align="center"
                        justify="space-between"
                        gap={1}
                      >
                        <AppHeading level={2} weight={720} sx={planNameSx}>
                          {plan.name}
                        </AppHeading>

                        {plan.popular ? (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-contrast">
                            Popular
                          </span>
                        ) : null}
                      </AppStack>

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
                    {plan.features.slice(0, 5).map((feature) => (
                      <FeatureItem key={feature} text={feature} />
                    ))}
                  </AppBox>

                  <AppStack
                    direction="row"
                    align="center"
                    gap={0.75}
                    sx={{ mt: 1.15 }}
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
                      sx={actionButtonSx}
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
                      sx={actionButtonSx}
                    >
                      Subscribe
                    </AppButton>
                  </AppStack>
                </AppCard>
              );
            })}
          </AppStack>
        ) : null}

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={summaryCardSx}
        >
          <AppText variant="body2" weight={650} sx={summaryLabelSx}>
            Selected for {workspaceName}
          </AppText>

          <AppStack direction="row" align="center" gap={0.7} sx={{ mt: 0.45 }}>
            <AppHeading level={2} weight={720} sx={summaryTitleSx}>
              {selectedPlanData ? selectedPlanData.name : "No plan"}
            </AppHeading>

            {selectedPlanData ? (
              <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10.5px] font-semibold text-primary">
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

          <AppStack direction="row" align="center" gap={0.75} sx={{ mt: 1.15 }}>
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              startIcon={<FiArrowLeft />}
              disabled={isLoading}
              onClick={handleBack}
              sx={backButtonSx}
            />

            <AppButton
              type="button"
              variant="outlined"
              colorVariant="primary"
              rounded="md"
              fullWidth
              startIcon={<FiZap />}
              disabled={
                isLoading ||
                !selectedPlanData ||
                !Number(selectedPlanData.trialDays || 0)
              }
              onClick={() => handleStartTrial(selectedPlan)}
              sx={bottomButtonSx}
            >
              Trial
            </AppButton>

            <AppButton
              type="button"
              variant="contained"
              colorVariant="primary"
              rounded="md"
              fullWidth
              loading={isLoading}
              disabled={isLoading || !selectedPlanData}
              onClick={() => handlePurchaseSubscription(selectedPlan)}
              sx={bottomButtonSx}
            >
              Subscribe
            </AppButton>
          </AppStack>
        </AppCard>
      </AppBox>
    </section>
  );
};

const IconBox = ({ icon, large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 48 : 40,
      height: large ? 48 : 40,
      minWidth: large ? 48 : 40,
      borderRadius: large ? "15px" : "13px",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: large ? "24px" : "20px",
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
      width: 36,
      height: 36,
      minWidth: 36,
      borderRadius: "12px",
      bgcolor: active
        ? "var(--app-color-primary)"
        : "var(--app-color-primary-soft)",
      color: active
        ? "var(--app-color-primary-contrast)"
        : "var(--app-color-primary)",
      fontSize: "17px",
      lineHeight: 0,
    }}
  >
    <FiStar />
  </AppBox>
);

const FeatureItem = ({ text }) => (
  <AppStack direction="row" align="center" gap={0.8}>
    <AppBox sx={checkIconSx}>
      <FiCheck />
    </AppBox>

    <AppText variant="body2" sx={featureTextSx}>
      {text}
    </AppText>
  </AppStack>
);

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: { xs: 1.45, sm: 1.8 },
  pt: { xs: 1.75, sm: 2.2 },
  pb: { xs: 1.6, sm: 2 },
};

const titleSx = {
  m: 0,
  fontSize: { xs: "22px", sm: "24px" },
  lineHeight: 1.15,
  letterSpacing: "-0.45px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.25,
  maxWidth: 280,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const workspaceCardSx = {
  mt: 1.2,
  px: 1.2,
  py: 0.8,
  bgcolor: "var(--app-color-primary-soft)",
  borderColor: "var(--app-color-border)",
};

const workspaceLabelSx = {
  fontSize: "9.8px",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "var(--app-color-text-muted)",
};

const workspaceNameSx = {
  mt: 0.15,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "12.8px",
  color: "var(--app-color-text)",
};

const billingCardSx = {
  mt: 1.1,
  px: 1.2,
  py: 0.85,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const cycleTextSx = {
  fontSize: "12.2px",
  color: "var(--app-color-text)",
};

const saveTextSx = {
  mt: 0.4,
  textAlign: "center",
  fontSize: "10.8px",
  color: "var(--app-color-primary)",
};

const errorCardSx = {
  mt: 1.1,
  px: 1.2,
  py: 0.85,
  bgcolor: "var(--app-color-error-soft)",
  borderColor: "var(--app-color-error)",
};

const errorTextSx = {
  fontSize: "11.5px",
  color: "var(--app-color-error)",
};

const loadingCardSx = {
  mt: 1.2,
  minHeight: 190,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.9,
  bgcolor: "var(--app-color-surface)",
};

const loadingTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const emptyCardSx = {
  mt: 1.2,
  minHeight: 210,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  px: 2.4,
  py: 3,
  textAlign: "center",
  bgcolor: "var(--app-color-surface)",
};

const emptyTitleSx = {
  mt: 1,
  mb: 0,
  fontSize: "18px",
  color: "var(--app-color-text)",
};

const emptyTextSx = {
  mt: 0.4,
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const planCardSx = {
  cursor: "pointer",
  px: 1.25,
  py: 1.25,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "all 160ms ease",
};

const selectedPlanCardSx = {
  borderColor: "var(--app-color-primary)",
  boxShadow: "var(--app-shadow-md)",
};

const planNameSx = {
  m: 0,
  maxWidth: 185,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "15.5px",
  color: "var(--app-color-text)",
};

const planSubtitleSx = {
  mt: 0.25,
  fontSize: "11.2px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const priceWrapSx = {
  mt: 1.1,
  pb: 0.95,
  borderBottom: "1px solid var(--app-color-border)",
};

const priceSx = {
  m: 0,
  fontSize: "18px",
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const savingSx = {
  mt: 0.25,
  fontSize: "10.8px",
  color: "var(--app-color-primary)",
};

const featureListSx = {
  display: "flex",
  flexDirection: "column",
  gap: 0.65,
  mt: 1,
};

const checkIconSx = {
  width: 18,
  height: 18,
  minWidth: 18,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-success-soft)",
  color: "var(--app-color-success)",
  fontSize: "10px",
};

const featureTextSx = {
  fontSize: "11.5px",
  lineHeight: "16px",
  color: "var(--app-color-text)",
};

const actionButtonSx = {
  height: 35,
  fontSize: "12px",
  fontWeight: 700,
};

const summaryCardSx = {
  position: "sticky",
  bottom: 10,
  zIndex: 5,
  mt: 1.3,
  px: 1.2,
  py: 1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-md)",
};

const summaryLabelSx = {
  fontSize: "10.4px",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  color: "var(--app-color-text-muted)",
};

const summaryTitleSx = {
  m: 0,
  fontSize: "15.5px",
  color: "var(--app-color-text)",
};

const summaryTextSx = {
  mt: 0.35,
  fontSize: "11.8px",
  color: "var(--app-color-text-muted)",
};

const backButtonSx = {
  width: 42,
  minWidth: 42,
  height: 38,
  px: 0,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface-alt)",
};

const bottomButtonSx = {
  height: 38,
  fontSize: "12.3px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

export default ChoosePlanMobilePage;
