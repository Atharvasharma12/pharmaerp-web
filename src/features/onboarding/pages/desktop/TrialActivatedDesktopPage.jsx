// src/features/onboarding/pages/desktop/TrialActivatedDesktopPage.jsx

import React from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiInfo,
  FiShield,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

const nextSteps = [
  {
    title: "Create Company",
    text: "Add your first company to get started",
  },
  {
    title: "Create Branch",
    text: "Add your first branch or store",
  },
  {
    title: "Add Staff",
    text: "Invite your team and assign roles",
  },
  {
    title: "Start Using ERP",
    text: "Explore and manage your business",
  },
];

const TrialActivatedDesktopPage = ({
  trialData,
  includedFeatures = [],
  handleGoToDashboard,
}) => {
  return (
    <section className="relative -mx-6 -my-8 min-h-[calc(100vh-58px)] bg-bg px-8 py-5">
      <AppCard
        variant="default"
        rounded="xl"
        bordered
        shadow="md"
        padding="none"
        sx={pageCardSx}
      >
        <AppBox sx={{ textAlign: "center" }}>
          <SuccessIcon />

          <AppHeading level={1} weight={750} sx={titleSx}>
            Your Trial is Now <span className="text-primary">Active!</span>
          </AppHeading>

          <AppText variant="body2" sx={subtitleSx}>
            Great! Your {trialData?.trialDays || 7}-day free trial has been
            successfully activated.
            <br />
            Explore all features and set up your pharmacy business.
          </AppText>
        </AppBox>

        <TrialSummaryCard trialData={trialData} />

        <SectionTitle title="What You Get in Trial" />

        <div className="grid grid-cols-4 gap-x-8 gap-y-5">
          {includedFeatures.map((feature) => (
            <FeatureItem
              key={feature.id || feature.title}
              icon={feature.icon}
              title={feature.title}
              text={feature.text}
            />
          ))}
        </div>

        <NextStepsCard />

        <AppStack direction="column" align="center" gap={1} sx={{ mt: 4 }}>
          <AppButton
            type="button"
            variant="contained"
            colorVariant="primary"
            rounded="md"
            endIcon={<FiArrowRight />}
            onClick={handleGoToDashboard}
            sx={dashboardButtonSx}
          >
            Go to Dashboard
          </AppButton>

          <AppText variant="body2" sx={redirectTextSx}>
            You will be redirected to your dashboard in a few seconds...
          </AppText>
        </AppStack>
      </AppCard>
    </section>
  );
};

const TrialSummaryCard = ({ trialData }) => (
  <AppCard
    variant="soft"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={summaryCardSx}
  >
    <div className="grid grid-cols-4">
      <SummaryItem
        icon={<FiCalendar />}
        label="Trial Plan"
        value={trialData?.planName || "Professional Plan"}
        highlight
      />
      <SummaryItem
        icon={<FiCalendar />}
        label="Trial Period"
        value={`${trialData?.trialDays || 7} Days`}
      />
      <SummaryItem
        icon={<FiCalendar />}
        label="Trial Ends On"
        value={trialData?.trialEndsOn}
        highlight
      />
      <SummaryItem icon={<FiShield />} label="Status" value="Active" badge />
    </div>

    <AppBox sx={noticeSx}>
      <FiInfo className="shrink-0 text-[16px] text-info" />
      <AppText variant="body2" sx={noticeTextSx}>
        No payment required during trial. You can upgrade or continue with this
        plan anytime.
      </AppText>
    </AppBox>
  </AppCard>
);

const SummaryItem = ({ icon, label, value, highlight, badge }) => (
  <AppStack
    direction="row"
    align="center"
    gap={1.3}
    sx={{
      px: 2.5,
      py: 1,
      borderRight: "1px solid var(--app-color-border)",
      "&:last-child": { borderRight: 0 },
    }}
  >
    <IconBox icon={icon} />

    <AppBox>
      <AppText variant="body2" sx={summaryLabelSx}>
        {label}
      </AppText>

      {badge ? (
        <AppBox sx={statusBadgeSx}>{value}</AppBox>
      ) : (
        <AppText
          variant="body2"
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
  <AppStack direction="row" align="flex-start" gap={1.2}>
    <IconBox icon={icon} soft />

    <AppBox>
      <AppHeading level={3} weight={650} sx={featureTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={featureTextSx}>
        {text}
      </AppText>
    </AppBox>
  </AppStack>
);

const NextStepsCard = () => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="none"
    padding="none"
    sx={nextCardSx}
  >
    <AppHeading level={2} weight={700} sx={nextTitleSx}>
      What&apos;s Next?
    </AppHeading>

    <AppText variant="body2" sx={nextSubtitleSx}>
      Complete these steps to get your pharmacy business up and running.
    </AppText>

    <div className="mt-6 grid grid-cols-[1fr_28px_1fr_28px_1fr_28px_1fr] items-start gap-3">
      {nextSteps.map((step, index) => (
        <React.Fragment key={step.title}>
          <NextStep title={step.title} text={step.text} />

          {index < nextSteps.length - 1 && (
            <div className="mt-8 flex justify-center text-[20px] text-primary">
              <FiArrowRight />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  </AppCard>
);

const NextStep = ({ title, text }) => (
  <AppStack direction="row" align="flex-start" gap={1.2}>
    <IconBox icon={<FiCheck />} large />

    <AppBox>
      <AppHeading level={3} weight={650} sx={featureTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" sx={featureTextSx}>
        {text}
      </AppText>
    </AppBox>
  </AppStack>
);

const SectionTitle = ({ title }) => (
  <AppHeading level={2} weight={700} sx={sectionTitleSx}>
    {title}
  </AppHeading>
);

const SuccessIcon = () => (
  <div className="relative mx-auto mb-5 flex h-[112px] w-[190px] items-center justify-center">
    <span className="absolute left-2 top-10 text-[18px] font-bold text-primary opacity-70">
      +
    </span>
    <span className="absolute left-12 top-2 text-[10px] text-info">●</span>
    <span className="absolute right-8 top-1 text-[16px] font-bold text-warning">
      +
    </span>
    <span className="absolute right-0 top-11 text-[18px] font-bold text-error opacity-60">
      +
    </span>
    <span className="absolute bottom-1 left-8 text-[15px] font-bold text-info">
      +
    </span>
    <span className="absolute bottom-2 right-7 text-[16px] font-bold text-primary opacity-50">
      +
    </span>

    <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-primary-soft">
      <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-primary text-primary-contrast shadow-md">
        <FiCheck className="text-[42px]" />
      </div>
    </div>
  </div>
);

const IconBox = ({ icon, soft = false, large = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: large ? 48 : 42,
      height: large ? 48 : 42,
      minWidth: large ? 48 : 42,
      borderRadius: large ? "999px" : "12px",
      bgcolor: soft || large ? "var(--app-color-primary-soft)" : "transparent",
      color: "var(--app-color-primary)",
      fontSize: large ? "22px" : "20px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

/* Styles Dictionary Tokens Mapping */
const pageCardSx = {
  mx: "auto",
  maxWidth: 1180,
  px: 3.5,
  py: 4,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const titleSx = {
  m: 0,
  fontSize: { xs: "28px", lg: "34px" },
  lineHeight: 1.12,
  letterSpacing: "-0.7px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 1.1,
  fontSize: "14px",
  lineHeight: "24px",
  color: "var(--app-color-text-muted)",
};

const summaryCardSx = {
  mt: 4,
  px: 2.5,
  py: 2.2,
  bgcolor:
    "color-mix(in srgb, var(--app-color-primary) 5%, var(--app-color-surface))",
  borderColor: "var(--app-color-border)",
};

const summaryLabelSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const summaryValueSx = {
  mt: 0.3,
  fontSize: "13.5px",
  fontWeight: 700,
  textTransform: "capitalize",
};

const statusBadgeSx = {
  mt: 0.4,
  width: "fit-content",
  px: 1,
  py: 0.25,
  borderRadius: "999px",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "capitalize",
};

const noticeSx = {
  mt: 2.2,
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 1.5,
  py: 1.2,
  borderRadius: "8px",
  border: "1px solid var(--app-color-border)",
  bgcolor: "var(--app-color-info-soft)",
};

const noticeTextSx = {
  fontSize: "12.8px",
  color: "var(--app-color-text)",
};

const sectionTitleSx = {
  mt: 4,
  mb: 2.5,
  fontSize: "18px",
  color: "var(--app-color-text)",
};

const featureTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const featureTextSx = {
  mt: 0.45,
  maxWidth: 180,
  fontSize: "12px",
  lineHeight: "20px",
  color: "var(--app-color-text-muted)",
};

const nextCardSx = {
  mt: 4,
  px: 2,
  py: 2.4,
  bgcolor:
    "color-mix(in srgb, var(--app-color-warning) 6%, var(--app-color-surface))",
  borderColor: "var(--app-color-border)",
};

const nextTitleSx = {
  m: 0,
  fontSize: "17px",
  color: "var(--app-color-text)",
};

const nextSubtitleSx = {
  mt: 0.7,
  fontSize: "12.8px",
  color: "var(--app-color-text-muted)",
};

const dashboardButtonSx = {
  height: 46,
  minWidth: 360,
  fontSize: "15px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

const redirectTextSx = {
  fontSize: "12.8px",
  color: "var(--app-color-text-muted)",
};

export default TrialActivatedDesktopPage;
