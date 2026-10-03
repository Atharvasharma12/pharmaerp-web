// src/features/onboarding/pages/mobile/TrialActivatedMobilePage.jsx

import {
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiCheck,
  FiExternalLink,
  FiFileText,
  FiHome,
  FiInfo,
  FiShoppingCart,
  FiUserPlus,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

const stepIcons = {
  inventory: <FiUserPlus />,
  purchase: <FiShoppingCart />,
  billing: <FiFileText />,
  reports: <FiBarChart2 />,
};

const TrialActivatedMobilePage = ({
  trialData,
  nextSteps = [],
  handleGoToDashboard,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <AppBox sx={containerSx}>
        {/* Dynamic Status Success Indicator Section */}
        <AppBox sx={successHeroContainerSx}>
          <AppBox sx={animatedCelebrationWrapperSx}>
            <span className="absolute left-[15%] top-[25%] text-[14px] text-primary opacity-60">
              ✨
            </span>
            <span className="absolute right-[12%] top-[15%] text-[11px] text-warning">
              ●
            </span>
            <span className="absolute left-[8%] bottom-[20%] text-[15px] text-error opacity-40">
              ✨
            </span>
            <span className="absolute right-[20%] bottom-[12%] text-[14px] text-info">
              ✨
            </span>

            <AppBox sx={circleCheckTrackSx}>
              <FiCheck className="text-[34px] text-success" />
            </AppBox>
          </AppBox>

          <AppHeading level={1} weight={800} align="center" sx={successTitleSx}>
            Your {trialData.trialDays}-Day Free Trial is Active!
          </AppHeading>

          <AppText
            variant="body2"
            align="center"
            weight={600}
            sx={successSubtitleSx}
          >
            Congratulations! Your workspace is ready.
            <br />
            You can now explore all features of PharmaERP.
          </AppText>
        </AppBox>

        {/* Informative Trial & Plan Details Workspace Grid Section */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="none"
          padding="none"
          sx={detailsMainCardSx}
        >
          <AppHeading level={3} weight={800} sx={detailsSectionHeaderSx}>
            Trial & Plan Details
          </AppHeading>

          <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-3">
            {/* Cell 1: Workspace Title */}
            <AppStack direction="row" gap={0.8} sx={detailGridCellSx}>
              <AppBox sx={detailIconWrapperSx}>
                <FiHome />
              </AppBox>
              <AppBox sx={{ minWidth: 0 }}>
                <AppText variant="body2" weight={500} sx={metaLabelSx}>
                  Workspace Name
                </AppText>
                <AppText variant="body2" weight={750} sx={metaValueSx}>
                  {trialData.workspaceName}
                </AppText>
                <AppStack
                  direction="row"
                  align="center"
                  gap={0.25}
                  sx={inlineInteractiveLinkSx}
                >
                  <AppText variant="body2" weight={700} sx={linkTextSx}>
                    Go to Workspace
                  </AppText>
                  <FiExternalLink className="text-[9.5px]" />
                </AppStack>
              </AppBox>
            </AppStack>

            {/* Cell 2: Trial Tier Badge */}
            <AppStack direction="row" gap={0.8} sx={detailGridCellSx}>
              <AppBox sx={detailIconWrapperSx}>
                <FiCalendar />
              </AppBox>
              <AppBox sx={{ minWidth: 0 }}>
                <AppText variant="body2" weight={500} sx={metaLabelSx}>
                  Trial Plan
                </AppText>
                <AppText variant="body2" weight={750} sx={metaValueSx}>
                  {trialData.planName}
                </AppText>
                <span className="inline-block rounded bg-success-soft px-1.5 py-0.5 text-[8.5px] font-bold text-success uppercase mt-1">
                  {trialData.trialDays} Days Free Trial
                </span>
              </AppBox>
            </AppStack>

            {/* Cell 3: Due Expiry Calendar */}
            <AppStack direction="row" gap={0.8} sx={detailGridCellSx}>
              <AppBox sx={detailIconWrapperSx}>
                <FiCalendar />
              </AppBox>
              <AppBox sx={{ minWidth: 0 }}>
                <AppText variant="body2" weight={500} sx={metaLabelSx}>
                  Trial Ends On
                </AppText>
                <AppText variant="body2" weight={750} sx={metaValueSx}>
                  {trialData.trialEndsOn}
                </AppText>
                <span className="inline-block text-[10px] font-bold text-success mt-1">
                  {trialData.trialDays} Days Remaining
                </span>
              </AppBox>
            </AppStack>

            {/* Cell 4: Users Quota Profile */}
            <AppStack direction="row" gap={0.8} sx={detailGridCellSx}>
              <AppBox sx={detailIconWrapperSx}>
                <FiUserPlus />
              </AppBox>
              <AppBox sx={{ minWidth: 0 }}>
                <AppText variant="body2" weight={500} sx={metaLabelSx}>
                  Users
                </AppText>
                <AppText variant="body2" weight={750} sx={metaValueSx}>
                  {trialData.usersCount} Users Added
                </AppText>
                <AppText
                  variant="body2"
                  weight={700}
                  sx={{ ...linkTextSx, mt: 1 }}
                >
                  Manage Users
                </AppText>
              </AppBox>
            </AppStack>
          </div>
        </AppCard>

        {/* High Density Sequential Next Action List Steps */}
        <AppBox sx={{ mt: 2.2 }}>
          <AppHeading level={2} weight={800} sx={workflowHeaderSx}>
            What&apos;s Next?
          </AppHeading>
          <AppText variant="body2" weight={500} sx={workflowSubtitleSx}>
            Get the most out of PharmaERP with these next steps.
          </AppText>

          <AppStack direction="column" gap={0.85} sx={{ mt: 1.25 }}>
            {nextSteps.map((step) => {
              const ActionIcon = stepIcons[step.id] || <FiFileText />;

              return (
                <AppCard
                  key={step.id}
                  variant="default"
                  rounded="md"
                  bordered
                  shadow="none"
                  padding="none"
                  onClick={step.onClick}
                  sx={actionRowCardSx}
                >
                  <AppStack
                    direction="row"
                    align="center"
                    justify="space-between"
                    gap={1}
                  >
                    <AppStack
                      direction="row"
                      align="center"
                      gap={0.85}
                      sx={{ minWidth: 0, flex: 1 }}
                    >
                      <AppBox sx={actionIconWrapperSx}>{ActionIcon}</AppBox>
                      <AppBox sx={{ minWidth: 0 }}>
                        <AppHeading level={3} weight={750} sx={stepRowTitleSx}>
                          {step.title}
                        </AppHeading>
                        <AppText
                          variant="body2"
                          weight={500}
                          sx={stepRowDescSx}
                        >
                          {step.description}
                        </AppText>
                      </AppBox>
                    </AppStack>

                    <AppStack
                      direction="row"
                      align="center"
                      gap={0.2}
                      sx={rowActionTriggerSx}
                    >
                      <AppText variant="body2" weight={750} sx={actionLabelSx}>
                        {step.actionText || "Get Started"}
                      </AppText>
                      <FiArrowRight className="text-[11px]" />
                    </AppStack>
                  </AppStack>
                </AppCard>
              );
            })}
          </AppStack>
        </AppBox>

        {/* Core Primary Navigation Action Button */}
        <AppButton
          variant="contained"
          colorVariant="success"
          size="medium"
          rounded="md"
          fullWidth
          endIcon={<FiArrowRight />}
          onClick={handleGoToDashboard}
          sx={primaryDashboardBtnSx}
        >
          Go to Dashboard
        </AppButton>

        {/* Static Footnote Informational Advice Banner */}
        <AppBox sx={footnoteBannerSx}>
          <FiInfo className="text-sm text-warning mt-0.5 shrink-0" />
          <AppText variant="body2" weight={500} sx={footnoteTextSx}>
            You can always upgrade your plan anytime from Settings &gt;
            Subscription
          </AppText>
        </AppBox>
      </AppBox>
    </section>
  );
};

/* Architectural Structural Layout Configurations style dictionary */
const containerSx = {
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0, // 🔥 Standardized Zero Boundary Mobile Padding Blueprint Pattern
};

const successHeroContainerSx = {
  pt: 1,
  pb: 1,
};

const animatedCelebrationWrapperSx = {
  position: "relative",
  mx: "auto",
  width: 140,
  height: 80,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const circleCheckTrackSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 62,
  height: 62,
  borderRadius: "50%",
  bgcolor: "var(--app-color-success-soft, #e6f4ea)",
  border: "2px solid var(--app-color-surface)",
  boxShadow: "var(--app-shadow-sm, 0 2px 4px rgba(0,0,0,0.05))",
};

const successTitleSx = {
  m: 0,
  mt: 1,
  fontSize: "17.5px",
  lineHeight: 1.25,
  color: "var(--app-color-text, #0f172a)",
};

const successSubtitleSx = {
  mt: 0.45,
  fontSize: "11.5px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted, #64748b)",
};

const detailsMainCardSx = {
  mt: 1.5,
  p: 1.25,
  bgcolor: "var(--app-color-surface, #ffffff)",
  borderColor: "var(--app-color-border, #e2e8f0)",
};

const detailsSectionHeaderSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-text, #0f172a)",
  letterSpacing: "-0.15px",
};

const detailGridCellSx = {
  minWidth: 0,
  p: 0.5,
};

const detailIconWrapperSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "50%",
  bgcolor: "var(--app-color-success-soft, #e6f4ea)",
  color: "var(--app-color-success, #10b981)",
  fontSize: "14px",
  flexShrink: 0,
};

const metaLabelSx = {
  fontSize: "10px",
  color: "var(--app-color-text-muted, #94a3b8)",
  lineHeight: 1.1,
};

const metaValueSx = {
  fontSize: "11.5px",
  color: "var(--app-color-text, #1e293b)",
  mt: 0.15,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const inlineInteractiveLinkSx = {
  mt: 0.5,
  color: "var(--app-color-success, #10b981)",
  cursor: "pointer",
};

const linkTextSx = {
  fontSize: "10px",
  color: "var(--app-color-success, #10b981)",
  lineHeight: 1,
};

const workflowHeaderSx = {
  m: 0,
  fontSize: "13.5px",
  color: "var(--app-color-text, #0f172a)",
};

const workflowSubtitleSx = {
  mt: 0.1,
  fontSize: "11px",
  color: "var(--app-color-text-muted, #64748b)",
};

const actionRowCardSx = {
  p: 1,
  bgcolor: "var(--app-color-surface, #ffffff)",
  borderColor: "var(--app-color-border, #e2e8f0)",
  cursor: "pointer",
  "&:active": {
    bgcolor: "var(--app-color-surface-alt, #f8fafc)",
  },
};

const actionIconWrapperSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: "6px",
  bgcolor: "var(--app-color-success-soft, #e6f4ea)",
  color: "var(--app-color-success, #10b981)",
  fontSize: "15px",
  flexShrink: 0,
};

const stepRowTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text, #0f172a)",
};

const stepRowDescSx = {
  mt: 0.1,
  fontSize: "10.2px",
  color: "var(--app-color-text-muted, #64748b)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rowActionTriggerSx = {
  flexShrink: 0,
  color: "var(--app-color-success, #10b981)",
};

const actionLabelSx = {
  fontSize: "10.5px",
};

const primaryDashboardBtnSx = {
  mt: 2,
  height: 38,
  fontSize: "12.5px",
  fontWeight: 750,
  textTransform: "none",
  boxShadow: "none",
};

const footnoteBannerSx = {
  mt: 1.5,
  p: 1,
  display: "flex",
  justifyContent: "center",
  gap: 0.75,
  bgcolor: "var(--app-color-readonly-bg, #f8fafc)",
  borderRadius: "8px",
  border: "1px dashed var(--app-color-border)",
};

const footnoteTextSx = {
  fontSize: "10.5px",
  color: "var(--app-color-text-muted, #64748b)",
  lineHeight: 1.3,
  textAlign: "center",
};

export default TrialActivatedMobilePage;
