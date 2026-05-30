// src/features/onboarding/pages/desktop/ChoosePlanDesktopPage.jsx

import { useState } from "react";
import {
  FiArrowLeft,
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
    values: ["Basic", "Advanced", "Advanced + Multi-warehouse"],
  },
  {
    label: "Reports",
    icon: <FiBarChart2 />,
    values: ["Basic", "Advanced", "Analytics"],
  },
  {
    label: "Support",
    icon: <FiHeadphones />,
    values: ["Email", "Priority", "24/7 Premium"],
  },
];

const ChoosePlanDesktopPage = ({
  plans,
  selectedPlan,
  selectedPlanData,
  billingCycle,
  isYearly,
  isLoading,
  handleToggleBillingCycle,
  handleSelectPlan,
  handleBack,
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

  const confirmPlan = async () => {
    await handleSubmit();
  };

  return (
    <section className="relative -mx-6 -my-8 min-h-[calc(100vh-58px)] bg-bg">
      <div className="mx-auto max-w-7xl px-8 py-5">
        <div className="text-center">
          <AppHeading level={1} weight={750} sx={pageTitleSx}>
            Choose Your Plan
          </AppHeading>

          <AppText variant="body2" sx={pageSubtitleSx}>
            Start a free 14-day trial. No credit card required.
          </AppText>

          <AppStack
            direction="row"
            align="center"
            justify="center"
            gap={1}
            sx={{ mt: 1.5 }}
          >
            <AppText variant="body2" sx={billingTextSx}>
              Monthly
            </AppText>

            <AppSwitch
              checked={isYearly}
              onChange={handleToggleBillingCycle}
              colorVariant="primary"
              size="small"
            />

            <AppText variant="body2" sx={billingTextSx}>
              Yearly{" "}
              <span className="font-semibold text-primary">(Save 20%)</span>
            </AppText>
          </AppStack>
        </div>

        <div className="mt-5 grid items-center gap-4 lg:grid-cols-[1fr_1fr_1fr_180px]">
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

          <SideHelpCard />
        </div>

        <ComparisonTable plans={plans} selectedPlan={selectedPlan} />

        <div className="mt-5 flex items-center justify-between">
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            sx={backButtonSx}
          >
            Back
          </AppButton>

          <AppText variant="body2" sx={termsTextSx}>
            Proceeding, you agree to our{" "}
            <span className="font-semibold text-primary">Terms</span> and{" "}
            <span className="font-semibold text-primary">Privacy Policy</span>.
          </AppText>
        </div>
      </div>

      <PlanConfirmDialog
        open={confirmOpen}
        plan={dialogPlan}
        billingCycle={billingCycle}
        isYearly={isYearly}
        isLoading={isLoading}
        onClose={closeConfirmDialog}
        onConfirm={confirmPlan}
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
      sx={{
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
        minHeight: 330,
        px: 2.2,
        pt: plan.popular ? 3.5 : 2.3,
        pb: 2,
        bgcolor: "var(--app-color-surface)",
        borderWidth: selected ? 2 : 1,
        borderColor: selected
          ? "var(--app-color-primary)"
          : "var(--app-color-border)",
        boxShadow: selected ? "var(--app-shadow-md)" : "var(--app-shadow-sm)",
      }}
    >
      {plan.popular && <AppBox sx={popularSx}>MOST POPULAR</AppBox>}

      <AppStack direction="row" align="flex-start" gap={1.3}>
        <IconBox icon={planIcons[plan.id] || <FiShield />} />

        <AppBox>
          <AppHeading level={2} weight={700} sx={planNameSx}>
            {plan.name}
          </AppHeading>

          <AppText variant="body2" sx={planSubtitleSx}>
            {plan.subtitle}
          </AppText>
        </AppBox>
      </AppStack>

      <AppBox sx={{ mt: 1.6 }}>
        <AppStack direction="row" align="flex-end" gap={0.6}>
          <AppHeading level={3} weight={750} sx={priceSx(selected)}>
            ₹{price.toLocaleString("en-IN")}
          </AppHeading>

          <AppText variant="body2" sx={perMonthSx}>
            /month
          </AppText>
        </AppStack>

        <AppText variant="body2" sx={billedTextSx}>
          {billedText}
        </AppText>
      </AppBox>

      <AppBox sx={dividerSx} />

      <AppStack direction="column" gap={0.7}>
        {plan.features.slice(0, 7).map((feature) => (
          <AppStack key={feature} direction="row" align="center" gap={0.8}>
            <FiCheckCircle className="shrink-0 text-[13px] text-primary" />
            <AppText variant="body2" sx={featureTextSx}>
              {cleanFeature(feature)}
            </AppText>
          </AppStack>
        ))}
      </AppStack>

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
      maxWidth="sm"
      fullWidth
      showClose
      title="Confirm Your Trial"
      subtitle="Review your selected plan before activating your free trial."
      showActions
      actions={
        <AppStack direction="row" justify="flex-end" gap={1.2}>
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            disabled={isLoading}
            onClick={onClose}
            sx={{ height: 40, fontSize: "13px", fontWeight: 600 }}
          >
            Cancel
          </AppButton>

          <AppButton
            type="button"
            variant="contained"
            colorVariant="primary"
            rounded="md"
            loading={isLoading}
            disabled={isLoading}
            endIcon={<FiArrowRight />}
            onClick={onConfirm}
            sx={{ height: 40, px: 2.6, fontSize: "13px", fontWeight: 700 }}
          >
            Continue
          </AppButton>
        </AppStack>
      }
    >
      <AppCard
        variant="soft"
        rounded="lg"
        bordered
        padding="none"
        sx={{
          px: 2,
          py: 1.8,
          bgcolor: "var(--app-color-primary-soft)",
          borderColor: "var(--app-color-border)",
        }}
      >
        <AppStack direction="row" align="flex-start" gap={1.4}>
          <IconBox icon={planIcons[plan.id] || <FiShield />} />

          <AppBox sx={{ flex: 1 }}>
            <AppHeading level={3} weight={700} sx={{ m: 0, fontSize: "18px" }}>
              {plan.name}
            </AppHeading>

            <AppText
              variant="body2"
              sx={{
                mt: 0.4,
                fontSize: "12.5px",
                color: "var(--app-color-text-muted)",
              }}
            >
              {plan.subtitle}
            </AppText>
          </AppBox>

          {plan.popular && <AppBox sx={dialogBadgeSx}>Popular</AppBox>}
        </AppStack>
      </AppCard>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <DialogInfo label="Billing Cycle" value={billingCycle} />
        <DialogInfo label="Trial Period" value="14 Days" />
        <DialogInfo label="Plan Price" value={displayPrice} />
        <DialogInfo
          label={isYearly ? "Yearly Amount" : "Monthly Amount"}
          value={`₹${amount.toLocaleString("en-IN")}`}
        />
      </div>

      <AppBox sx={dialogNoticeSx}>
        <FiInfo className="shrink-0 text-[16px] text-primary" />
        <AppText
          variant="body2"
          sx={{
            fontSize: "12.5px",
            lineHeight: "20px",
            color: "var(--app-color-text)",
          }}
        >
          No payment is required during the trial. You can upgrade, continue or
          cancel anytime before billing starts.
        </AppText>
      </AppBox>

      <AppStack direction="column" gap={0.8} sx={{ mt: 3 }}>
        {plan.features.slice(0, 6).map((feature) => (
          <AppStack key={feature} direction="row" align="center" gap={0.8}>
            <FiCheckCircle className="text-[13px] text-primary" />
            <AppText variant="body2" sx={featureTextSx}>
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
    <AppText variant="body2" sx={dialogLabelSx}>
      {label}
    </AppText>
    <AppText variant="body2" sx={dialogValueSx}>
      {value}
    </AppText>
  </AppBox>
);

const SideHelpCard = () => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={{
      px: 2,
      py: 2.1,
      bgcolor: "var(--app-color-surface-alt)",
      borderColor: "var(--app-color-border)",
    }}
  >
    <SideHelpItem
      icon={<FiShield />}
      title="Risk-Free Trial"
      text="Try all features for 14 days. Cancel anytime."
    />

    <AppBox sx={sideDividerSx} />

    <SideHelpItem
      icon={<FiHeadphones />}
      title="Need Help?"
      text="Our team can help you choose the right plan."
      link="Contact Support"
    />
  </AppCard>
);

const SideHelpItem = ({ icon, title, text, link }) => (
  <AppBox>
    <AppStack direction="row" align="center" gap={0.8}>
      <span className="text-[15px] text-primary">{icon}</span>
      <AppHeading level={3} weight={650} sx={sideTitleSx}>
        {title}
      </AppHeading>
    </AppStack>

    <AppText variant="body2" sx={sideTextSx}>
      {text}
    </AppText>

    {link && (
      <AppText variant="body2" weight={650} sx={sideLinkSx}>
        {link} <FiArrowRight className="inline text-[12px]" />
      </AppText>
    )}
  </AppBox>
);

const ComparisonTable = ({ plans, selectedPlan }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={{
      mt: 3,
      overflow: "hidden",
      bgcolor: "var(--app-color-surface)",
      borderColor: "var(--app-color-border)",
    }}
  >
    {comparisonRows.map((row) => (
      <div
        key={row.label}
        className="grid min-h-[36px] grid-cols-[170px_repeat(3,1fr)] border-b border-border last:border-b-0"
      >
        <TableCell muted>
          <span className="text-[13px] text-text-muted">{row.icon}</span>
          {row.label}
        </TableCell>

        {plans.map((plan, index) => (
          <TableCell key={plan.id} active={selectedPlan === plan.id}>
            <FiCheckCircle className="text-[12px] text-primary" />
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
      "flex items-center gap-2 border-r border-border px-4 text-[11.8px] last:border-r-0",
      active ? "bg-primary-soft/40" : "",
      muted ? "font-medium text-text" : "text-text",
    ].join(" ")}
  >
    {children}
  </div>
);

const IconBox = ({ icon }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: 42,
      height: 42,
      minWidth: 42,
      borderRadius: "999px",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: "20px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const cleanFeature = (feature) =>
  feature
    .replace("Sales & Billing (GST Ready)", "POS Billing")
    .replace("Reports & Analytics", "Basic Reports")
    .replace("Multi-User Access (Up to 3 Users)", "Up to 3 Users")
    .replace("Multi-Store Management", "Multi-store")
    .replace("Everything in Basic", "5 Companies")
    .replace("Everything in Professional", "Unlimited Companies")
    .replace("Customer Management (CRM)", "Unlimited Branches")
    .replace("Role-Based Access Control", "All Professional Features")
    .replace("Advanced Analytics Dashboard", "Advanced Analytics");

const pageTitleSx = {
  m: 0,
  fontSize: { xs: "28px", lg: "32px" },
  lineHeight: 1.1,
  letterSpacing: "-0.7px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.6,
  fontSize: "13.5px",
  color: "var(--app-color-text-muted)",
};

const billingTextSx = {
  fontSize: "12.5px",
  color: "var(--app-color-text-muted)",
};

const popularSx = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: 22,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
  fontSize: "10px",
  fontWeight: 750,
};

const planNameSx = {
  m: 0,
  fontSize: "18px",
  color: "var(--app-color-text)",
};

const planSubtitleSx = {
  mt: 0.3,
  fontSize: "11.8px",
  color: "var(--app-color-text-muted)",
};

const priceSx = (selected) => ({
  m: 0,
  fontSize: "26px",
  lineHeight: 1,
  color: selected ? "var(--app-color-primary)" : "var(--app-color-text)",
});

const perMonthSx = {
  mb: 0.3,
  fontSize: "11.8px",
  color: "var(--app-color-text-muted)",
};

const billedTextSx = {
  mt: 0.5,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const dividerSx = {
  my: 1.5,
  height: 1,
  bgcolor: "var(--app-color-border)",
};

const featureTextSx = {
  fontSize: "11.8px",
  lineHeight: "18px",
  color: "var(--app-color-text)",
};

const planButtonSx = {
  mt: 1.7,
  height: 36,
  fontSize: "12.3px",
  fontWeight: 650,
};

const sideDividerSx = {
  my: 1.7,
  height: 1,
  bgcolor: "var(--app-color-border)",
};

const sideTitleSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const sideTextSx = {
  mt: 1,
  fontSize: "11.8px",
  lineHeight: "19px",
  color: "var(--app-color-text-muted)",
};

const sideLinkSx = {
  mt: 1.2,
  fontSize: "11.8px",
  color: "var(--app-color-primary)",
};

const backButtonSx = {
  height: 38,
  minWidth: 90,
  fontSize: "12.5px",
  fontWeight: 600,
  bgcolor: "var(--app-color-surface)",
};

const termsTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const dialogBadgeSx = {
  px: 1,
  py: 0.35,
  borderRadius: "999px",
  bgcolor: "var(--app-color-primary)",
  color: "var(--app-color-primary-contrast)",
  fontSize: "10.5px",
  fontWeight: 700,
};

const dialogNoticeSx = {
  mt: 3,
  display: "flex",
  gap: 1,
  px: 1.5,
  py: 1.3,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface-alt)",
};

const dialogInfoSx = {
  px: 1.5,
  py: 1.2,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const dialogLabelSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
  textTransform: "capitalize",
};

const dialogValueSx = {
  mt: 0.3,
  fontSize: "13px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  textTransform: "capitalize",
};

export default ChoosePlanDesktopPage;
