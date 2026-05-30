// src/features/onboarding/pages/mobile/TrialActivatedMobilePage.jsx

import {
  FiArrowRight,
  FiBarChart2,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiFileText,
  FiHeadphones,
  FiHome,
  FiInfo,
  FiShield,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

const includedFeatures = [
  {
    icon: <FiBriefcase />,
    title: "5 Companies",
    text: "Create and manage up to 5 companies",
  },
  {
    icon: <FiHome />,
    title: "10 Branches",
    text: "Add and manage up to 10 branches",
  },
  {
    icon: <FiUsers />,
    title: "Up to 20 Users",
    text: "Invite your team and assign roles",
  },
  {
    icon: <FiFileText />,
    title: "Advanced Inventory",
    text: "Inventory, stock, expiry & batch management",
  },
  {
    icon: <FiShoppingCart />,
    title: "Purchases & Suppliers",
    text: "Manage purchases and suppliers",
  },
  {
    icon: <FiFileText />,
    title: "POS Billing",
    text: "Fast and easy billing system",
  },
  {
    icon: <FiBarChart2 />,
    title: "Reports & Analytics",
    text: "Insightful reports and dashboards",
  },
  {
    icon: <FiHeadphones />,
    title: "Priority Support",
    text: "Get priority email support",
  },
  {
    icon: <FiCalendar />,
    title: "Expiry & Batch",
    text: "Expiry alerts and batch tracking",
  },
];

const nextSteps = [
  {
    icon: <FiHome />,
    title: "Create Company",
    text: "Add your first company",
  },
  {
    icon: <FiHome />,
    title: "Create Branch",
    text: "Add your first branch or store",
  },
  {
    icon: <FiUsers />,
    title: "Add Staff",
    text: "Invite your team and assign roles",
  },
  {
    icon: <FiShield />,
    title: "Start Using ERP",
    text: "Explore and manage your business",
  },
];

const TrialActivatedMobilePage = ({ trialData, handleGoToDashboard }) => {
  const trialDays = trialData?.trialDays || 14;
  const trialEndsOn = getTrialEndDate(trialDays);

  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_7%,transparent),transparent_34%)]" />

      <AppBox sx={sectionSx}>
        <SuccessIcon />

        <AppHeading level={1} weight={750} align="center" sx={titleSx}>
          Your Trial is Now <span className="text-primary">Active!</span>
        </AppHeading>

        <AppText variant="body2" weight={500} align="center" sx={subtitleSx}>
          Great! Your {trialDays}-day free trial has been successfully
          activated. Explore all features and set up your pharmacy business.
        </AppText>

        <TrialSummaryCard trialData={trialData} trialEndsOn={trialEndsOn} />

        <AppHeading level={2} weight={750} sx={sectionTitleSx}>
          What&apos;s Included in Your Trial
        </AppHeading>

        <div className="grid grid-cols-2 gap-x-2.5 gap-y-3">
          {includedFeatures.map((feature) => (
            <FeatureItem key={feature.title} {...feature} />
          ))}
        </div>

        <NextStepsCard />

        <div className="mt-3 flex w-full justify-center">
          <AppButton
            type="button"
            variant="contained"
            colorVariant="primary"
            rounded="md"
            fullWidth
            endIcon={<FiArrowRight />}
            onClick={handleGoToDashboard}
            sx={dashboardButtonSx}
          >
            Go to Dashboard
          </AppButton>
        </div>

        <AppStack
          direction="row"
          align="center"
          justify="center"
          gap={0.55}
          sx={{ mt: 1.55 }}
        >
          <FiShield className="text-[13px] text-primary" />

          <AppText variant="body2" weight={600} sx={redirectTextSx}>
            You will be redirected to your dashboard in a few seconds...
          </AppText>
        </AppStack>
      </AppBox>
    </section>
  );
};

const TrialSummaryCard = ({ trialData, trialEndsOn }) => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={summaryCardSx}
  >
    <div className="grid grid-cols-2 gap-y-2">
      <SummaryItem
        icon={<FiCalendar />}
        label="Trial Plan"
        value={trialData?.planName || "Professional"}
        highlight
      />
      <SummaryItem
        icon={<FiCalendar />}
        label="Trial Period"
        value={`${trialData?.trialDays || 14} Days`}
      />
      <SummaryItem
        icon={<FiCalendar />}
        label="Trial Ends On"
        value={trialEndsOn}
        highlight
      />
      <SummaryItem
        icon={<FiShield />}
        label="Status"
        value={trialData?.trialStatus || "Active"}
        badge
      />
    </div>

    <AppBox sx={noticeSx}>
      <FiInfo className="shrink-0 text-[15px] text-primary" />

      <AppText variant="body2" weight={500} sx={noticeTextSx}>
        No payment required during trial. You can upgrade or continue with this
        plan anytime.
      </AppText>
    </AppBox>
  </AppCard>
);

const SummaryItem = ({ icon, label, value, highlight, badge }) => (
  <AppStack direction="row" align="center" gap={0.9} sx={summaryItemSx}>
    <AppBox sx={summaryIconSx}>{icon}</AppBox>

    <AppBox sx={{ minWidth: 0 }}>
      <AppText variant="body2" weight={500} sx={summaryLabelSx}>
        {label}
      </AppText>

      {badge ? (
        <AppBox sx={statusBadgeSx}>{value}</AppBox>
      ) : (
        <AppText
          variant="body2"
          weight={750}
          sx={{
            ...summaryValueSx,
            color: highlight
              ? "var(--app-color-primary)"
              : "var(--app-color-text)",
          }}
        >
          {value}
        </AppText>
      )}
    </AppBox>
  </AppStack>
);

const FeatureItem = ({ icon, title, text }) => (
  <AppStack direction="row" align="flex-start" gap={0.9}>
    <AppBox sx={featureIconSx}>{icon}</AppBox>

    <AppBox sx={{ minWidth: 0 }}>
      <AppHeading level={3} weight={700} sx={featureTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" weight={500} sx={featureTextSx}>
        {text}
      </AppText>
    </AppBox>
  </AppStack>
);

const NextStepsCard = () => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={nextCardSx}
  >
    <AppHeading level={2} weight={750} sx={nextTitleSx}>
      What&apos;s Next?
    </AppHeading>

    <AppText variant="body2" weight={500} sx={nextSubtitleSx}>
      Complete these steps to get your pharmacy business up and running.
    </AppText>

    <div className="mt-3 space-y-2">
      {nextSteps.map((step, index) => (
        <div key={step.title} className="flex items-center gap-2">
          <NextStep {...step} />

          {index < nextSteps.length - 1 && (
            <FiArrowRight className="shrink-0 text-[15px] text-primary" />
          )}
        </div>
      ))}
    </div>
  </AppCard>
);

const NextStep = ({ icon, title, text }) => (
  <AppStack
    direction="row"
    align="center"
    gap={0.75}
    sx={{ minWidth: 0, flex: 1 }}
  >
    <AppBox sx={nextIconSx}>{icon}</AppBox>

    <AppBox sx={{ minWidth: 0 }}>
      <AppHeading level={3} weight={700} sx={nextStepTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" weight={500} sx={nextStepTextSx}>
        {text}
      </AppText>
    </AppBox>
  </AppStack>
);

const SuccessIcon = () => (
  <div className="relative mx-auto mb-3 flex h-[102px] w-[180px] items-center justify-center">
    <span className="absolute left-2 top-10 text-[15px] font-black text-primary opacity-60">
      +
    </span>
    <span className="absolute left-12 top-2 text-[8px] text-info">●</span>
    <span className="absolute right-8 top-1 text-[13px] font-black text-warning">
      +
    </span>
    <span className="absolute right-0 top-11 text-[15px] font-black text-info opacity-60">
      +
    </span>
    <span className="absolute bottom-1 left-8 text-[13px] font-black text-info">
      +
    </span>
    <span className="absolute bottom-2 right-7 text-[14px] font-black text-primary opacity-50">
      +
    </span>

    <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-primary-soft">
      <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-primary text-primary-contrast shadow-md">
        <FiCheck className="text-[38px]" />
      </div>
    </div>
  </div>
);

const getTrialEndDate = (trialDays) => {
  const date = new Date();
  date.setDate(date.getDate() + Number(trialDays || 14));

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: { xs: 0.9, sm: 1.3 },
  pt: { xs: 2.1, sm: 2.6 },
  pb: { xs: 2, sm: 2.4 },
};

const titleSx = {
  m: 0,
  fontSize: { xs: "23px", sm: "25px" },
  lineHeight: 1.14,
  letterSpacing: "-0.55px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mx: "auto",
  mt: 0.8,
  maxWidth: 340,
  fontSize: "12.2px",
  lineHeight: "19px",
  color: "var(--app-color-text-muted)",
};

const summaryCardSx = {
  mt: 2.6,
  px: 1.15,
  py: 1.2,
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-primary-soft)",
};

const summaryItemSx = {
  minWidth: 0,
  px: 0.6,
  py: 0.55,
};

const summaryIconSx = {
  width: 30,
  height: 30,
  minWidth: 30,
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--app-color-primary)",
  fontSize: "17px",
};

const summaryLabelSx = {
  fontSize: "10.2px",
  lineHeight: 1.1,
  color: "var(--app-color-text-muted)",
};

const summaryValueSx = {
  mt: 0.35,
  fontSize: "11.5px",
  lineHeight: 1.2,
  textTransform: "capitalize",
};

const statusBadgeSx = {
  mt: 0.25,
  width: "fit-content",
  px: 0.9,
  py: 0.3,
  borderRadius: "999px",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "10.5px",
  fontWeight: 750,
  textTransform: "capitalize",
};

const noticeSx = {
  mt: 1.2,
  display: "flex",
  alignItems: "flex-start",
  gap: 0.8,
  px: 1,
  py: 0.9,
  borderRadius: "10px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};
const noticeTextSx = {
  fontSize: "11px",
  lineHeight: "17px",
  color: "var(--app-color-text)",
};

const sectionTitleSx = {
  mt: 2.6,
  mb: 1.5,
  fontSize: "15.5px",
  color: "var(--app-color-text)",
};

const featureIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "20px",
};

const featureTitleSx = {
  m: 0,
  fontSize: "11.4px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const featureTextSx = {
  mt: 0.35,
  fontSize: "10.4px",
  lineHeight: "15.5px",
  color: "var(--app-color-text-muted)",
};

const nextCardSx = {
  mt: 2.4,
  px: 1.2,
  py: 1.25,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const nextTitleSx = {
  m: 0,
  fontSize: "15px",
  color: "var(--app-color-text)",
};

const nextSubtitleSx = {
  mt: 0.5,
  fontSize: "11px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const nextIconSx = {
  width: 34,
  height: 34,
  minWidth: 34,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "17px",
};

const nextStepTitleSx = {
  m: 0,
  fontSize: "9.8px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const nextStepTextSx = {
  mt: 0.25,
  fontSize: "9.2px",
  lineHeight: "13px",
  color: "var(--app-color-text-muted)",
};

const dashboardButtonSx = {
  mx: "auto",
  width: "100%",
  maxWidth: 260,
  height: 44,
  fontSize: "14px",
  fontWeight: 750,
  boxShadow: "var(--app-shadow-sm)",
};

const redirectTextSx = {
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
};

export default TrialActivatedMobilePage;
