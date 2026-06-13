// src/features/setup/pages/mobile/SetupCenterMobilePage.jsx

import {
  FiBriefcase,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiHeadphones,
  FiHome,
  FiLock,
  FiPackage,
  FiShoppingCart,
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

const setupIcons = {
  workspace: <FiHome />,
  plan: <FiCreditCard />,
  company: <FiBriefcase />,
  branch: <FiTruck />,
  team: <FiUsers />,
  products: <FiPackage />,
  suppliers: <FiTruck />,
  purchase: <FiShoppingCart />,
};

const SetupCenterMobilePage = ({
  mappedSetupSteps = [],
  completedStepsCount = 0,
  progress = 0,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <AppBox sx={containerSx}>
        {/* Compact Page Header */}
        <AppBox sx={headerContainerSx}>
          <AppHeading level={1} weight={800} sx={pageTitleSx}>
            Setup Center
          </AppHeading>
          <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
            Complete these steps to get the most out of PharmaERP.
          </AppText>
        </AppBox>

        {/* High Density Progress Banner */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={progressCardSx}
        >
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1.25}
          >
            <AppBox sx={circleWrapperSx}>
              <AppBox sx={circleTrackSx}>
                <AppText variant="body2" weight={800} sx={circleTextSx}>
                  {completedStepsCount}/{mappedSetupSteps.length}
                </AppText>
              </AppBox>
            </AppBox>

            <AppBox sx={{ flex: 1, minWidth: 0 }}>
              <AppHeading level={2} weight={700} sx={progressTitleSx}>
                Setup Progress
              </AppHeading>
              <AppText variant="body2" weight={500} sx={progressSubtitleSx}>
                Complete the essential setup steps
              </AppText>

              <AppStack
                direction="row"
                align="center"
                gap={0.8}
                sx={{ mt: 0.85 }}
              >
                <AppBox sx={progressBarTrackSx}>
                  <AppBox
                    sx={{
                      ...progressBarFillSx,
                      width: `${progress}%`,
                    }}
                  />
                </AppBox>
                <AppText
                  variant="body2"
                  weight={750}
                  sx={progressPercentTextSx}
                >
                  {progress}%
                </AppText>
              </AppStack>
            </AppBox>

            <AppBox sx={illustrationBoxSx}>
              <div className="text-[28px] opacity-20">📋</div>
            </AppBox>
          </AppStack>
        </AppCard>

        {/* Dense Action Steps Stack */}
        <AppStack direction="column" gap={0.85} sx={{ mt: 1.5 }}>
          {mappedSetupSteps.map((step) => {
            const IconComponent = setupIcons[step.id] || <FiBriefcase />;

            return (
              <AppCard
                key={step.id}
                variant="default"
                rounded="md"
                bordered
                shadow="none"
                padding="none"
                onClick={step.locked ? undefined : step.onClick}
                sx={{
                  ...stepRowCardSx,
                  opacity: step.locked ? 0.55 : 1,
                  cursor: step.locked ? "not-allowed" : "pointer",
                }}
              >
                <AppStack
                  direction="row"
                  align="center"
                  justify="space-between"
                  gap={1.15}
                >
                  {/* Status Indicator Icon Box */}
                  <AppBox
                    sx={{
                      ...iconContainerSx,
                      bgcolor: step.completed
                        ? "var(--app-color-success-soft)"
                        : step.locked
                          ? "var(--app-color-surface-alt)"
                          : `var(--app-color-${step.colorVariant}-soft, var(--app-color-primary-soft))`,
                      color: step.completed
                        ? "var(--app-color-success)"
                        : step.locked
                          ? "var(--app-color-text-muted)"
                          : `var(--app-color-${step.colorVariant}, var(--app-color-primary))`,
                    }}
                  >
                    {IconComponent}
                  </AppBox>

                  {/* Main Text Content */}
                  <AppBox sx={{ flex: 1, minWidth: 0 }}>
                    <AppHeading level={3} weight={700} sx={stepTitleSx}>
                      {step.title}
                    </AppHeading>
                    <AppText variant="body2" weight={500} sx={stepDescSx}>
                      {step.description}
                    </AppText>
                  </AppBox>

                  {/* Context Action Area */}
                  <AppStack
                    direction="row"
                    align="center"
                    gap={0.4}
                    sx={{ flexShrink: 0 }}
                  >
                    {step.completed ? (
                      <AppStack
                        direction="row"
                        align="center"
                        gap={0.25}
                        sx={completedBadgeSx}
                      >
                        <FiCheckCircle className="text-[11px]" />
                        <AppText variant="body2" weight={700} sx={badgeTextSx}>
                          Completed
                        </AppText>
                      </AppStack>
                    ) : step.locked ? (
                      <AppStack
                        direction="row"
                        align="center"
                        gap={0.2}
                        sx={lockedBadgeSx}
                      >
                        <FiLock className="text-[10px]" />
                        <AppText variant="body2" weight={600} sx={badgeTextSx}>
                          Locked
                        </AppText>
                      </AppStack>
                    ) : (
                      <AppButton
                        variant="outlined"
                        colorVariant="success"
                        size="small"
                        rounded="md"
                        onClick={(e) => {
                          e.stopPropagation();
                          step.onClick();
                        }}
                        sx={getStartedButtonSx}
                      >
                        {step.actionText || "Get Started"}
                      </AppButton>
                    )}
                    <FiChevronRight className="text-[14px] text-text-muted/40" />
                  </AppStack>
                </AppStack>
              </AppCard>
            );
          })}
        </AppStack>

        {/* Compact Help Section */}
        <AppCard
          variant="default"
          rounded="md"
          bordered
          shadow="none"
          padding="none"
          sx={helpCardSx}
        >
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppStack direction="row" align="center" gap={0.75}>
              <AppBox sx={helpIconBoxSx}>
                <FiHeadphones />
              </AppBox>
              <AppBox>
                <AppHeading level={3} weight={700} sx={helpTitleSx}>
                  Need Help?
                </AppHeading>
                <AppText variant="body2" weight={500} sx={helpDescSx}>
                  Our support team is here to help you set up.
                </AppText>
              </AppBox>
            </AppStack>

            <AppButton
              variant="text"
              colorVariant="success"
              size="small"
              sx={helpActionSx}
            >
              Contact Support
            </AppButton>
          </AppStack>
        </AppCard>
      </AppBox>
    </section>
  );
};

/* Micro Padding Structural Layout Config Blocks */
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0, // Removed horizontal padding
  pt: 0, // 🔥 Removed top padding
  pb: 0, // 🔥 Removed bottom padding
};

const headerContainerSx = {
  mb: 1.5,
  px: 0.35,
};

const pageTitleSx = {
  m: 0,
  fontSize: "18px",
  letterSpacing: "-0.25px",
  color: "var(--app-color-text, #0f172a)",
};

const pageSubtitleSx = {
  mt: 0.25,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted, #64748b)",
};

const progressCardSx = {
  p: 1.25,
  bgcolor: "var(--app-color-surface, #ffffff)",
  borderColor: "var(--app-color-border, #e2e8f0)",
};

const circleWrapperSx = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: "50%",
  background:
    "conic-gradient(var(--app-color-success) 0deg, var(--app-color-success) 180deg, var(--app-color-border) 180deg, var(--app-color-border) 360deg)",
};

const circleTrackSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 38,
  height: 38,
  borderRadius: "50%",
  bgcolor: "var(--app-color-surface, #ffffff)",
};

const circleTextSx = {
  fontSize: "11px",
  fontWeight: 750,
  color: "var(--app-color-text, #0f172a)",
};

const progressTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text, #0f172a)",
};

const progressSubtitleSx = {
  mt: 0.1,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted, #64748b)",
};

const progressBarTrackSx = {
  flex: 1,
  height: 4,
  borderRadius: 99,
  bgcolor: "var(--app-color-border, #e2e8f0)",
  overflow: "hidden",
};

const progressBarFillSx = {
  height: "100%",
  borderRadius: 99,
  bgcolor: "var(--app-color-success, #10b981)",
  transition: "width 0.3s ease",
};

const progressPercentTextSx = {
  fontSize: "11px",
  color: "var(--app-color-success, #10b981)",
};

const illustrationBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pr: 0.25,
};

const stepRowCardSx = {
  p: 1, // Compact row sizing
  bgcolor: "var(--app-color-surface, #ffffff)",
  borderColor: "var(--app-color-border, #e2e8f0)",
  transition: "background-color 0.15s ease",
  "&:active": {
    bgcolor: "var(--app-color-surface-alt, #f8fafc)",
  },
};

const iconContainerSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  borderRadius: "50%",
  fontSize: "15px",
  flexShrink: 0,
};

const stepTitleSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
  color: "var(--app-color-text, #0f172a)",
};

const stepDescSx = {
  mt: 0.15,
  fontSize: "10.5px",
  lineHeight: "13px",
  color: "var(--app-color-text-muted, #64748b)",
};

const completedBadgeSx = {
  color: "var(--app-color-success, #10b981)",
  px: 0.7,
  py: 0.25,
  borderRadius: "4deg",
};

const lockedBadgeSx = {
  color: "var(--app-color-text-muted, #64748b)",
  px: 0.5,
  py: 0.25,
};

const badgeTextSx = {
  fontSize: "10.5px",
  whiteSpace: "nowrap",
};

const getStartedButtonSx = {
  height: 25,
  px: 0.9,
  fontSize: "10.5px",
  fontWeight: 700,
  borderColor: "var(--app-color-border-strong)",
  color: "var(--app-color-success)",
  textTransform: "none",
  whiteSpace: "nowrap",
  minWidth: "auto",
};

const helpCardSx = {
  mt: 1.75,
  p: 1,
  bgcolor: "var(--app-color-readonly-bg, #f8fafc)",
  borderColor: "transparent",
};

const helpIconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "50%",
  bgcolor: "var(--app-color-success-soft)",
  color: "var(--app-color-success, #10b981)",
  fontSize: "13px",
  flexShrink: 0,
};

const helpTitleSx = {
  m: 0,
  fontSize: "11.5px",
  color: "var(--app-color-text, #0f172a)",
};

const helpDescSx = {
  mt: 0.1,
  fontSize: "10px",
  color: "var(--app-color-text-muted, #64748b)",
};

const helpActionSx = {
  fontSize: "11px",
  fontWeight: 750,
  textTransform: "none",
  p: 0,
  minWidth: "auto",
};

export default SetupCenterMobilePage;
