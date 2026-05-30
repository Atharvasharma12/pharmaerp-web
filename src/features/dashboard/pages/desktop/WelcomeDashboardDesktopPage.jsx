// src/features/dashboard/pages/desktop/WelcomeDashboardDesktopPage.jsx

import {
  FiArrowRight,
  FiBarChart2,
  FiBox,
  FiCheckCircle,
  FiChevronRight,
  FiCreditCard,
  FiFileText,
  FiHeadphones,
  FiHelpCircle,
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

const guideIcons = {
  "create-company": <FiHome />,
  "add-medicines": <FiFileText />,
  "pos-guide": <FiShoppingCart />,
  "user-guide": <FiUsers />,
};

const WelcomeDashboardDesktopPage = ({
  stats,
  setupSteps,
  quickGuides,
  progress = 0,
  handleExploreFeatures,
  handleContactSupport,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto max-w-[1500px]">
        <AppStack direction="row" align="flex-start" justify="space-between">
          <AppBox>
            <AppHeading level={1} weight={650} sx={pageTitleSx}>
              Welcome to PharmaERP! 👋
            </AppHeading>

            <AppText variant="body2" sx={pageSubtitleSx}>
              Complete the setup steps below to start using your pharmacy ERP.
            </AppText>
          </AppBox>

          <AppButton
            type="button"
            variant="outlined"
            colorVariant="primary"
            rounded="md"
            endIcon={<FiChevronRight />}
            onClick={handleExploreFeatures}
            sx={exploreButtonSx}
          >
            Explore Features
          </AppButton>
        </AppStack>

        <div className="mt-4 grid grid-cols-5 gap-3">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <ProgressCard progress={progress} />

        <div className="mt-3 grid grid-cols-[1.25fr_1fr] gap-3">
          <SetupCard setupSteps={setupSteps} />

          <GuidesCard
            quickGuides={quickGuides}
            onContactSupport={handleContactSupport}
          />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ stat }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={statCardSx}
  >
    <AppStack direction="row" align="flex-start" gap={1.1}>
      <IconBox
        icon={statIcons[stat.id] || <FiBarChart2 />}
        colorVariant={stat.colorVariant}
      />

      <AppBox>
        <AppText variant="body2" sx={statTitleSx}>
          {stat.title}
        </AppText>

        <AppHeading level={2} weight={650} sx={statValueSx}>
          {stat.value}
        </AppHeading>

        <AppText variant="body2" sx={statDescriptionSx}>
          {stat.description}
        </AppText>
      </AppBox>
    </AppStack>
  </AppCard>
);

const ProgressCard = ({ progress }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={progressCardSx}
  >
    <AppStack direction="row" align="center" gap={1.6}>
      <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border-[6px] border-border bg-surface">
        <span className="text-[12px] font-semibold text-text">{progress}%</span>
      </div>

      <AppBox sx={{ flex: 1 }}>
        <AppHeading level={2} weight={650} sx={progressTitleSx}>
          Your Setup Progress
        </AppHeading>

        <AppText variant="body2" sx={progressSubtitleSx}>
          Complete the steps to start using PharmaERP.
        </AppText>

        <div className="mt-3 h-1.5 w-full max-w-[760px] overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </AppBox>

      <div className="hidden h-[70px] w-[180px] items-end justify-center rounded-xl bg-primary-soft/40 lg:flex">
        <FiHome className="mb-4 text-[42px] text-primary" />
      </div>
    </AppStack>
  </AppCard>
);

const SetupCard = ({ setupSteps }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sectionCardSx}
  >
    <AppHeading level={2} weight={650} sx={sectionTitleSx}>
      Let&apos;s Set Up Your Workspace
    </AppHeading>

    <AppText variant="body2" sx={sectionSubtitleSx}>
      Complete these essential steps to get your pharmacy ready.
    </AppText>

    <div className="mt-3 space-y-0">
      {setupSteps.map((step) => (
        <SetupStep key={step.id} step={step} />
      ))}
    </div>

    <AppStack direction="row" align="center" gap={0.7} sx={{ mt: 2 }}>
      <FiStar className="text-[13px] text-primary" />

      <AppText variant="body2" sx={hintTextSx}>
        Complete all steps to unlock the full power of PharmaERP.
      </AppText>
    </AppStack>
  </AppCard>
);

const SetupStep = ({ step }) => (
  <div className="grid grid-cols-[20px_1fr_136px] items-center gap-2.5 border-b border-border py-2 last:border-b-0">
    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-border-strong">
      {step.completed && <FiCheckCircle className="text-[11px] text-primary" />}
    </span>

    <AppStack direction="row" align="center" gap={1}>
      <IconBox
        icon={setupIcons[step.id] || <FiCheckCircle />}
        colorVariant={step.colorVariant}
        small
      />

      <AppBox>
        <AppHeading level={3} weight={600} sx={itemTitleSx}>
          {step.title}
        </AppHeading>

        <AppText variant="body2" sx={itemSubtitleSx}>
          {step.description}
        </AppText>
      </AppBox>
    </AppStack>

    <AppButton
      type="button"
      variant="outlined"
      colorVariant={step.disabled ? "neutral" : "primary"}
      rounded="md"
      disabled={step.disabled}
      onClick={step.onClick}
      sx={stepButtonSx}
    >
      {step.actionText}
    </AppButton>
  </div>
);

const GuidesCard = ({ quickGuides, onContactSupport }) => (
  <AppCard
    variant="default"
    rounded="lg"
    bordered
    shadow="sm"
    padding="none"
    sx={sectionCardSx}
  >
    <AppHeading level={2} weight={650} sx={sectionTitleSx}>
      Get Started with PharmaERP
    </AppHeading>

    <AppText variant="body2" sx={sectionSubtitleSx}>
      Helpful resources to get you started quickly.
    </AppText>

    <div className="mt-3 space-y-1.5">
      {quickGuides.map((guide) => (
        <GuideItem key={guide.id} guide={guide} />
      ))}
    </div>

    <AppCard
      variant="soft"
      rounded="lg"
      bordered
      shadow="none"
      padding="none"
      sx={supportCardSx}
    >
      <AppStack direction="row" align="center" gap={1.2}>
        <IconBox icon={<FiHelpCircle />} colorVariant="primary" />

        <AppBox>
          <AppHeading level={3} weight={600} sx={itemTitleSx}>
            Need Help?
          </AppHeading>

          <AppText variant="body2" sx={itemSubtitleSx}>
            Our support team is here to help you at every step.
          </AppText>

          <button
            type="button"
            onClick={onContactSupport}
            className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-primary"
          >
            Contact Support <FiArrowRight />
          </button>
        </AppBox>
      </AppStack>
    </AppCard>
  </AppCard>
);

const GuideItem = ({ guide }) => (
  <button
    type="button"
    onClick={guide.onClick}
    className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-surface px-2.5 py-2 text-left transition hover:bg-surface-hover"
  >
    <IconBox
      icon={guideIcons[guide.id] || <FiFileText />}
      colorVariant={guide.colorVariant}
      small
    />

    <span className="min-w-0 flex-1">
      <span className="block text-[12px] font-medium text-text">
        {guide.title}
      </span>
      <span className="mt-0.5 block text-[11px] text-text-muted">
        {guide.description}
      </span>
    </span>

    <FiChevronRight className="text-[15px] text-text-muted" />
  </button>
);

const IconBox = ({ icon, colorVariant = "primary", small = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: small ? 32 : 38,
      height: small ? 32 : 38,
      minWidth: small ? 32 : 38,
      borderRadius: small ? "9px" : "11px",
      bgcolor: `var(--app-color-${colorVariant}-soft, var(--app-color-primary-soft))`,
      color: `var(--app-color-${colorVariant}, var(--app-color-primary))`,
      fontSize: small ? "16px" : "19px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const pageTitleSx = {
  m: 0,
  fontSize: "20px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.5,
  fontSize: "12.5px",
  color: "var(--app-color-text-muted)",
};

const exploreButtonSx = {
  height: 34,
  px: 1.7,
  fontSize: "12px",
  fontWeight: 600,
};

const statCardSx = {
  px: 1.5,
  py: 1.35,
  minHeight: 88,
  bgcolor: "var(--app-color-surface)",
};

const statTitleSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const statValueSx = {
  mt: 0.45,
  mb: 0,
  fontSize: "18px",
  color: "var(--app-color-text)",
};

const statDescriptionSx = {
  mt: 0.65,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const progressCardSx = {
  mt: 3,
  px: 2.2,
  py: 1.45,
  bgcolor: "var(--app-color-surface)",
};

const progressTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

const progressSubtitleSx = {
  mt: 0.35,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const sectionCardSx = {
  px: 2,
  py: 1.7,
  bgcolor: "var(--app-color-surface)",
};

const sectionTitleSx = {
  m: 0,
  fontSize: "14.5px",
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.45,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const itemTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const itemSubtitleSx = {
  mt: 0.25,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const stepButtonSx = {
  height: 30,
  width: 128,
  px: 1,
  whiteSpace: "nowrap",
  fontSize: "11.3px",
  fontWeight: 600,
};

const hintTextSx = {
  fontSize: "11.3px",
  color: "var(--app-color-text-muted)",
};

const supportCardSx = {
  mt: 2,
  px: 1.6,
  py: 1.5,
  bgcolor: "var(--app-color-primary-soft)",
  borderColor: "var(--app-color-border)",
};

export default WelcomeDashboardDesktopPage;
