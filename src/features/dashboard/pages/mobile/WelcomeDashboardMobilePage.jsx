// src/features/dashboard/pages/mobile/WelcomeDashboardMobilePage.jsx

import {
  FiBarChart2,
  FiBox,
  FiCheckCircle,
  FiCreditCard,
  FiFileText,
  FiHeadphones,
  FiHome,
  FiShoppingCart,
  FiStar,
  FiTrendingUp,
  FiTruck,
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

const statIcons = {
  sales: <FiShoppingCart />,
  orders: <FiFileText />,
  revenue: <FiTrendingUp />,
  customers: <FiUsers />,
  lowStock: <FiBox />,
};

const setupIcons = {
  company: <FiHome />,
  branch: <FiShoppingCart />,
  staff: <FiHeadphones />,
  medicines: <FiCreditCard />,
  supplier: <FiTruck />,
  sale: <FiShoppingCart />,
};

const WelcomeDashboardMobilePage = ({ stats, setupSteps, progress = 0 }) => {
  const compactStats = [
    ...stats,
    {
      id: "setup",
      title: "Setup",
      value: `${progress}%`,
      description: "Progress",
      colorVariant: "primary",
    },
  ];

  return (
    <section className="w-full bg-bg">
      <AppBox sx={sectionSx}>
        <AppHeading level={1} weight={750} sx={pageTitleSx}>
          Welcome back, Admin! 👋
        </AppHeading>

        <AppText variant="body2" weight={500} sx={pageSubtitleSx}>
          Here&apos;s what&apos;s happening with your business today.
        </AppText>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {compactStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <ProgressCard progress={progress} />

        <SetupCard setupSteps={setupSteps} />
      </AppBox>
    </section>
  );
};

const StatCard = ({ stat }) => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={statCardSx}
  >
    <div className="pl-1">
      <IconBox
        icon={statIcons[stat.id] || <FiBarChart2 />}
        colorVariant={stat.colorVariant}
        compact
      />

      <AppText variant="body2" weight={650} sx={statTitleSx}>
        {stat.title}
      </AppText>

      <AppHeading level={3} weight={800} sx={statValueSx}>
        {stat.value}
      </AppHeading>

      <AppText variant="body2" weight={500} sx={statDescriptionSx}>
        {stat.description}
      </AppText>
    </div>
  </AppCard>
);

const ProgressCard = ({ progress }) => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={progressCardSx}
  >
    <AppStack direction="row" align="center" gap={1.05}>
      <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full border-[6px] border-border bg-surface">
        <span className="text-[12px] font-bold text-text">{progress}%</span>
      </div>

      <AppBox sx={{ minWidth: 0, flex: 1 }}>
        <AppHeading level={2} weight={750} sx={progressTitleSx}>
          Your Setup Progress
        </AppHeading>

        <AppText variant="body2" weight={500} sx={progressSubtitleSx}>
          Complete the steps to start using PharmaERP
        </AppText>

        <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </AppBox>
    </AppStack>
  </AppCard>
);

const SetupCard = ({ setupSteps }) => (
  <AppCard
    variant="default"
    rounded="xl"
    bordered
    shadow="sm"
    padding="none"
    sx={setupCardSx}
  >
    <AppBox sx={setupHeaderSx}>
      <AppHeading level={2} weight={750} sx={sectionTitleSx}>
        Let&apos;s Set Up Your Workspace
      </AppHeading>

      <AppText variant="body2" weight={500} sx={sectionSubtitleSx}>
        Complete these essential steps to get your pharmacy ready.
      </AppText>
    </AppBox>

    <div className="mt-2.5 space-y-2">
      {setupSteps.map((step) => (
        <SetupStep key={step.id} step={step} />
      ))}
    </div>

    <AppStack direction="row" align="center" gap={0.75} sx={hintSx}>
      <FiStar className="shrink-0 text-[15px] text-primary" />

      <AppText variant="body2" weight={500} sx={hintTextSx}>
        Complete all steps to unlock the full power of PharmaERP.
      </AppText>
    </AppStack>
  </AppCard>
);

const SetupStep = ({ step }) => (
  <div className="grid grid-cols-[40px_1fr_auto] items-center gap-2.5 rounded-xl border border-border bg-bg/60 px-2.5 py-2.5">
    <IconBox
      icon={setupIcons[step.id] || <FiCheckCircle />}
      colorVariant={step.colorVariant}
      small
    />

    <AppBox sx={{ minWidth: 0, pr: 0.8 }}>
      <AppHeading level={3} weight={700} sx={itemTitleSx}>
        {step.title}
      </AppHeading>

      <AppText variant="body2" weight={500} sx={itemSubtitleSx}>
        {step.description}
      </AppText>
    </AppBox>

    <AppButton
      type="button"
      variant="outlined"
      colorVariant={step.disabled ? "neutral" : "primary"}
      rounded="md"
      disabled={step.disabled}
      onClick={step.onClick}
      sx={stepButtonSx(step.disabled)}
    >
      {compactActionText(step.actionText)}
    </AppButton>
  </div>
);

const IconBox = ({
  icon,
  colorVariant = "primary",
  small = false,
  compact = false,
}) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: compact ? 28 : small ? 36 : 42,
      height: compact ? 28 : small ? 36 : 42,
      minWidth: compact ? 28 : small ? 36 : 42,
      borderRadius: compact ? "10px" : small ? "11px" : "14px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: compact ? "15px" : small ? "18px" : "21px",
      lineHeight: 0,
      mb: compact ? 0.75 : 0,
    }}
  >
    {icon}
  </AppBox>
);

const compactActionText = (text) => {
  if (text === "Create Company") return "Create";
  if (text === "Create Branch") return "Create";
  if (text === "Add Staff") return "Add";
  if (text === "Add Medicines") return "Add";
  if (text === "Add Supplier") return "Add";
  return text;
};

const sectionSx = {
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: { xs: 0.35, sm: 0.75 },
  pt: { xs: 1.25, sm: 1.7 },
  pb: { xs: 2, sm: 2.5 },
};

const pageTitleSx = {
  m: 0,
  px: 0.35,
  fontSize: { xs: "22px", sm: "24px" },
  lineHeight: 1.14,
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.55,
  px: 0.35,
  fontSize: "12.4px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const statCardSx = {
  minHeight: 92,
  px: 1.05,
  py: 0.95,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const statTitleSx = {
  fontSize: "9.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text-muted)",
};

const statValueSx = {
  mt: 0.45,
  mb: 0,
  fontSize: "16px",
  lineHeight: 1,
  letterSpacing: "-0.35px",
  color: "var(--app-color-text)",
};

const statDescriptionSx = {
  mt: 0.55,
  fontSize: "8.9px",
  lineHeight: "12px",
  color: "var(--app-color-text-muted)",
};

const progressCardSx = {
  mt: 2.4,
  px: 1.15,
  py: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const progressTitleSx = {
  m: 0,
  fontSize: "14.2px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const progressSubtitleSx = {
  mt: 0.45,
  fontSize: "11.2px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const setupCardSx = {
  mt: 2.4,
  px: 1.15,
  py: 1.2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const setupHeaderSx = {
  px: 0.35,
};

const sectionTitleSx = {
  m: 0,
  fontSize: "15.2px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.55,
  fontSize: "11.5px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const itemTitleSx = {
  m: 0,
  fontSize: "12px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const itemSubtitleSx = {
  mt: 0.4,
  fontSize: "10.6px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const stepButtonSx = (disabled) => ({
  minWidth: disabled ? 96 : 72,
  height: 32,
  px: 1,
  fontSize: "10.8px",
  fontWeight: 750,
  bgcolor: disabled
    ? "var(--app-color-disabled-bg)"
    : "var(--app-color-surface)",
  color: disabled ? "var(--app-color-text-muted)" : "var(--app-color-primary)",
});

const hintSx = {
  mt: 2,
  px: 0.35,
};

const hintTextSx = {
  fontSize: "11.2px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

export default WelcomeDashboardMobilePage;
