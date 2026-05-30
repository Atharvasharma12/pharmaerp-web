// src/features/onboarding/pages/mobile/ChoosePlanMobilePage.jsx

import { useState } from "react";
import {
  FiArrowRight,
  FiBarChart2,
  FiBox,
  FiCheckCircle,
  FiCreditCard,
  FiHeadphones,
  FiHome,
  FiInfo,
  FiShield,
} from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";

import {
  AppBox,
  AppButton,
  AppCard,
  AppDialog,
  AppHeading,
  AppStack,
  AppSwitch,
  AppText,
} from "@/components";

const planIcons = {
  basic: <FiHome />,
  professional: <BsBuilding />,
  enterprise: <FiShield />,
};

const comparisonRows = [
  {
    label: "POS Billing",
    icon: <FiCreditCard />,
    values: ["Included", "Included", "Included"],
  },
  {
    label: "Inventory",
    icon: <FiBox />,
    values: ["Basic", "Advanced", "Advanced + Multi-store"],
  },
  {
    label: "Reports",
    icon: <FiBarChart2 />,
    values: ["Basic Reports", "Advanced Reports", "Advanced Analytics"],
  },
  {
    label: "Support",
    icon: <FiHeadphones />,
    values: ["Email", "Priority", "24/7 Premium"],
  },
];

const ChoosePlanMobilePage = ({
  plans,
  selectedPlan,
  selectedPlanData,
  billingCycle,
  isYearly,
  isLoading,
  handleToggleBillingCycle,
  handleSelectPlan,
  handleSubmit,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogPlan, setDialogPlan] = useState(selectedPlanData);

  const openConfirmDialog = (plan) => {
    handleSelectPlan(plan.id);
    setDialogPlan(plan);
    setConfirmOpen(true);
  };

  const closeConfirmDialog = () => {
    if (!isLoading) setConfirmOpen(false);
  };

  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_7%,transparent),transparent_34%)]" />

      <AppBox sx={sectionSx}>
        <AppHeading level={1} weight={750} align="center" sx={titleSx}>
          Choose Your Plan
        </AppHeading>

        <AppText variant="body2" weight={500} align="center" sx={subtitleSx}>
          Start a free 14-day trial. No credit card required.
        </AppText>

        <AppStack
          direction="row"
          align="center"
          justify="center"
          gap={1}
          sx={{ mt: 1.55 }}
        >
          <AppText variant="body2" weight={600} sx={billingTextSx}>
            Monthly
          </AppText>

          <AppSwitch
            checked={isYearly}
            onChange={handleToggleBillingCycle}
            colorVariant="primary"
            size="small"
          />

          <AppText variant="body2" weight={600} sx={billingTextSx}>
            Yearly <span className="text-primary">(Save 20%)</span>
          </AppText>
        </AppStack>

        <div className="mt-4 space-y-2.5">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              isYearly={isYearly}
              onSelect={() => handleSelectPlan(plan.id)}
              onStartTrial={() => openConfirmDialog(plan)}
            />
          ))}
        </div>

        <ComparisonTable plans={plans} selectedPlan={selectedPlan} />

        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="sm"
          padding="none"
          sx={trialCardSx}
        >
          <AppStack direction="row" align="center" gap={1.1}>
            <AppBox sx={trialIconSx}>
              <FiShield />
            </AppBox>

            <AppBox sx={{ minWidth: 0 }}>
              <AppHeading level={3} weight={700} sx={trialTitleSx}>
                Risk-Free Trial
              </AppHeading>

              <AppText variant="body2" weight={500} sx={trialTextSx}>
                Try all features for 14 days. Cancel anytime.
              </AppText>
            </AppBox>
          </AppStack>
        </AppCard>
      </AppBox>

      <PlanConfirmDialog
        open={confirmOpen}
        plan={dialogPlan}
        billingCycle={billingCycle}
        isYearly={isYearly}
        isLoading={isLoading}
        onClose={closeConfirmDialog}
        onConfirm={handleSubmit}
      />
    </section>
  );
};

const PlanCard = ({ plan, selected, isYearly, onSelect, onStartTrial }) => {
  const price = isYearly ? plan.yearlyMonthlyPrice : plan.monthlyPrice;
  const billedText = isYearly
    ? `Billed annually ₹${plan.yearlyPrice.toLocaleString("en-IN")}`
    : "Billed monthly";

  return (
    <AppCard
      variant="default"
      rounded="xl"
      bordered
      shadow={selected ? "md" : "sm"}
      padding="none"
      onClick={onSelect}
      sx={planCardSx(selected, plan.popular)}
    >
      {plan.popular && <AppBox sx={popularSx}>MOST POPULAR</AppBox>}

      <div className="grid grid-cols-[44px_1fr_auto] items-start gap-2.5">
        <AppBox sx={planIconSx}>{planIcons[plan.id] || <FiShield />}</AppBox>

        <div className="min-w-0">
          <AppHeading level={2} weight={750} sx={planNameSx}>
            {plan.name}
          </AppHeading>

          <AppText variant="body2" weight={500} sx={planSubtitleSx}>
            {plan.subtitle}
          </AppText>
        </div>

        <div className="text-right">
          <AppStack
            direction="row"
            align="flex-end"
            justify="flex-end"
            gap={0.25}
          >
            <AppHeading level={3} weight={800} sx={priceSx(selected)}>
              ₹{price.toLocaleString("en-IN")}
            </AppHeading>

            <AppText variant="body2" weight={600} sx={perMonthSx}>
              /mo
            </AppText>
          </AppStack>

          <AppText variant="body2" weight={600} sx={billedTextSx}>
            {billedText}
          </AppText>
        </div>
      </div>

      <AppBox sx={dividerSx} />

      <div className="grid grid-cols-2 gap-x-2.5 gap-y-1.35">
        {plan.features.slice(0, 8).map((feature) => (
          <AppStack key={feature} direction="row" align="flex-start" gap={0.55}>
            <FiCheckCircle className="mt-[2px] shrink-0 text-[11.5px] text-primary" />
            <AppText variant="body2" weight={600} sx={featureTextSx}>
              {cleanFeature(feature)}
            </AppText>
          </AppStack>
        ))}
      </div>

      <AppButton
        type="button"
        variant={selected ? "contained" : "outlined"}
        colorVariant="primary"
        rounded="md"
        fullWidth
        onClick={(event) => {
          event.stopPropagation();
          onStartTrial();
        }}
        sx={planButtonSx}
      >
        Start 14-Day Free Trial
      </AppButton>
    </AppCard>
  );
};

const PlanConfirmDialog = ({
  open,
  plan,
  billingCycle,
  isYearly,
  isLoading,
  onClose,
  onConfirm,
}) => {
  if (!plan) return null;

  const amount = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const displayPrice = isYearly
    ? `₹${plan.yearlyMonthlyPrice.toLocaleString("en-IN")} / month`
    : `₹${plan.monthlyPrice.toLocaleString("en-IN")} / month`;

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      showClose
      title="Confirm Your Trial"
      subtitle="Review your selected plan before activating your free trial."
      showActions
      paperSx={dialogPaperSx}
      titleSx={dialogTitleSx}
      subtitleSx={dialogSubtitleSx}
      actions={
        <AppStack direction="column" gap={1} sx={{ width: "100%" }}>
          <AppButton
            type="button"
            variant="contained"
            colorVariant="primary"
            rounded="md"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            endIcon={<FiArrowRight />}
            onClick={onConfirm}
            sx={dialogContinueButtonSx}
          >
            Continue
          </AppButton>

          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            fullWidth
            disabled={isLoading}
            onClick={onClose}
            sx={dialogCancelButtonSx}
          >
            Cancel
          </AppButton>
        </AppStack>
      }
    >
      <AppCard
        variant="soft"
        rounded="lg"
        bordered
        padding="none"
        sx={dialogPlanCardSx}
      >
        <AppStack direction="row" align="center" gap={1.1}>
          <AppBox sx={dialogIconSx}>
            {planIcons[plan.id] || <FiShield />}
          </AppBox>

          <AppBox sx={{ minWidth: 0, flex: 1 }}>
            <AppHeading level={3} weight={750} sx={dialogPlanNameSx}>
              {plan.name}
            </AppHeading>

            <AppText variant="body2" weight={500} sx={dialogPlanSubtitleSx}>
              {plan.subtitle}
            </AppText>
          </AppBox>

          {plan.popular && <AppBox sx={dialogBadgeSx}>Popular</AppBox>}
        </AppStack>
      </AppCard>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <DialogInfo label="Billing" value={billingCycle} />
        <DialogInfo label="Trial" value="14 Days" />
        <DialogInfo label="Price" value={displayPrice} />
        <DialogInfo
          label={isYearly ? "Yearly" : "Monthly"}
          value={`₹${amount.toLocaleString("en-IN")}`}
        />
      </div>

      <AppBox sx={dialogNoticeSx}>
        <FiInfo className="shrink-0 text-[14px] text-primary" />

        <AppText variant="body2" weight={500} sx={dialogNoticeTextSx}>
          No payment is required during the trial. You can cancel anytime before
          billing starts.
        </AppText>
      </AppBox>

      <AppStack direction="column" gap={0.7} sx={{ mt: 2 }}>
        {plan.features.slice(0, 6).map((feature) => (
          <AppStack key={feature} direction="row" align="flex-start" gap={0.65}>
            <FiCheckCircle className="mt-[2px] shrink-0 text-[12px] text-primary" />

            <AppText variant="body2" weight={600} sx={dialogFeatureTextSx}>
              {cleanFeature(feature)}
            </AppText>
          </AppStack>
        ))}
      </AppStack>
    </AppDialog>
  );
};

const DialogInfo = ({ label, value }) => (
  <AppBox sx={dialogInfoSx}>
    <AppText variant="body2" weight={600} sx={dialogLabelSx}>
      {label}
    </AppText>

    <AppText variant="body2" weight={750} sx={dialogValueSx}>
      {value}
    </AppText>
  </AppBox>
);

const ComparisonTable = ({ plans, selectedPlan }) => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={comparisonCardSx}
  >
    {comparisonRows.map((row) => (
      <div
        key={row.label}
        className="grid min-h-[48px] grid-cols-[108px_repeat(3,1fr)] border-b border-border last:border-b-0"
      >
        <TableCell muted>
          <span className="text-[13px] text-text-muted">{row.icon}</span>
          {row.label}
        </TableCell>

        {plans.map((plan, index) => (
          <TableCell key={plan.id} active={selectedPlan === plan.id}>
            <FiCheckCircle className="shrink-0 text-[11px] text-primary" />
            {row.values[index]}
          </TableCell>
        ))}
      </div>
    ))}
  </AppCard>
);

const TableCell = ({ children, active, muted }) => (
  <div
    className={[
      "flex items-center gap-1.5 border-r border-border px-1.8 text-[9.3px] leading-tight last:border-r-0",
      active ? "bg-primary-soft/35" : "",
      muted ? "font-semibold text-text" : "font-medium text-text",
    ].join(" ")}
  >
    {children}
  </div>
);

const cleanFeature = (feature) =>
  feature
    .replace("Sales & Billing (GST Ready)", "POS Billing")
    .replace("Reports & Analytics", "Basic Reports")
    .replace("Multi-User Access (Up to 3 Users)", "Up to 3 Users")
    .replace("Multi-Store Management", "Multi-store")
    .replace("Everything in Basic", "5 Companies")
    .replace("Everything in Professional", "Unlimited Companies")
    .replace("Customer Management (CRM)", "10 Branches")
    .replace("Advanced Reports & Analytics", "Advanced Reports")
    .replace("Role-Based Access Control", "All Professional Features")
    .replace("Advanced Analytics Dashboard", "Advanced Analytics");

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: { xs: 0.8, sm: 1.2 },
  pt: { xs: 2.2, sm: 2.7 },
  pb: { xs: 1.8, sm: 2.2 },
};

const titleSx = {
  m: 0,
  fontSize: { xs: "23px", sm: "25px" },
  lineHeight: 1.14,
  letterSpacing: "-0.55px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.7,
  fontSize: "12.1px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const billingTextSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const planCardSx = (selected, popular) => ({
  position: "relative",
  width: "100%",
  cursor: "pointer",
  overflow: "hidden",
  px: 1.15,
  pt: popular ? 3.45 : 1.25,
  pb: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderWidth: selected ? 2 : 1,
  borderColor: selected
    ? "var(--app-color-primary)"
    : "var(--app-color-border)",
  boxShadow: selected ? "var(--app-shadow-md)" : "var(--app-shadow-sm)",
});

const popularSx = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 21,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
  fontSize: "9.5px",
  fontWeight: 800,
};

const planIconSx = {
  width: 40,
  height: 40,
  minWidth: 40,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "21px",
};

const planNameSx = {
  m: 0,
  fontSize: "15.2px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const planSubtitleSx = {
  mt: 0.45,
  fontSize: "10.5px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const priceSx = (selected) => ({
  m: 0,
  fontSize: "19px",
  lineHeight: 1,
  letterSpacing: "-0.45px",
  color: selected ? "var(--app-color-primary)" : "var(--app-color-text)",
});

const perMonthSx = {
  mb: 0.15,
  fontSize: "9.3px",
  color: "var(--app-color-text-muted)",
};

const billedTextSx = {
  mt: 0.45,
  maxWidth: 96,
  fontSize: "9px",
  lineHeight: "12.5px",
  color: "var(--app-color-text-muted)",
};

const dividerSx = {
  my: 1.1,
  height: 1,
  bgcolor: "var(--app-color-border)",
};

const featureTextSx = {
  fontSize: "9.8px",
  lineHeight: "13.8px",
  color: "var(--app-color-text)",
};

const planButtonSx = {
  mt: 1.2,
  height: 33,
  fontSize: "10.7px",
  fontWeight: 750,
};

const comparisonCardSx = {
  mt: 2.2,
  overflow: "hidden",
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const trialCardSx = {
  mt: 1.8,
  px: 1.1,
  py: 1.15,
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-primary-soft)",
};

const trialIconSx = {
  width: 39,
  height: 39,
  minWidth: 39,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-primary)",
  fontSize: "21px",
};

const trialTitleSx = {
  m: 0,
  fontSize: "12.7px",
  color: "var(--app-color-text)",
};

const trialTextSx = {
  mt: 0.35,
  fontSize: "10.6px",
  lineHeight: "15.5px",
  color: "var(--app-color-text-muted)",
};

const dialogPaperSx = {
  m: 1.5,
  borderRadius: "18px",
};

const dialogTitleSx = {
  fontSize: "17px",
  fontWeight: 800,
};

const dialogSubtitleSx = {
  fontSize: "11.5px",
  lineHeight: "17px",
};

const dialogPlanCardSx = {
  px: 1.2,
  py: 1.1,
  bgcolor: "var(--app-color-primary-soft)",
  borderColor: "var(--app-color-border)",
};

const dialogIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-primary)",
  fontSize: "20px",
};

const dialogPlanNameSx = {
  m: 0,
  fontSize: "14.5px",
  color: "var(--app-color-text)",
};

const dialogPlanSubtitleSx = {
  mt: 0.3,
  fontSize: "10.5px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const dialogBadgeSx = {
  px: 0.9,
  py: 0.3,
  borderRadius: "999px",
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
  fontSize: "9.5px",
  fontWeight: 750,
};

const dialogInfoSx = {
  px: 1,
  py: 0.85,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const dialogLabelSx = {
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
  textTransform: "capitalize",
};

const dialogValueSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text)",
  textTransform: "capitalize",
};

const dialogNoticeSx = {
  mt: 2,
  display: "flex",
  gap: 0.8,
  px: 1.1,
  py: 1,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const dialogNoticeTextSx = {
  fontSize: "10.7px",
  lineHeight: "16px",
  color: "var(--app-color-text)",
};

const dialogFeatureTextSx = {
  fontSize: "10.6px",
  lineHeight: "15.5px",
  color: "var(--app-color-text)",
};

const dialogContinueButtonSx = {
  height: 40,
  fontSize: "12.5px",
  fontWeight: 750,
};

const dialogCancelButtonSx = {
  height: 38,
  fontSize: "12px",
  fontWeight: 650,
};

export default ChoosePlanMobilePage;
