// src/features/workspace/pages/mobile/AccessControlMobilePage.jsx

import { useMemo } from "react";
import {
  FiUsers,
  FiShield,
  FiSliders,
  FiArrowRight,
  FiRefreshCw,
  FiZap,
} from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { LuStore } from "react-icons/lu";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppTag,
  AppText,
} from "@/components";

const statIcons = {
  roles: <FiUsers />,
  members: <FiUsers />,
  companies: <HiOutlineBuildingOffice2 />,
  branches: <LuStore />,
  permissions: <FiShield />,
};

const overviewIcons = {
  roles: <FiUsers />,
  memberAccess: <FiUsers />,
  permissions: <FiShield />,
  accessSummary: <FiSliders />,
};

const activityIcons = {
  success: <FiUsers />,
  info: <FiUsers />,
  warning: <FiShield />,
};

const AccessControlMobilePage = ({
  dashboardStats = [],
  accessOverviewItems = [],
  recentAccessActivity = [],
  isLoading,
  handleRefresh,
}) => {
  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Expanded Width Page Title Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Access Control
              </AppHeading>
              <AppText variant="body2" weight={600} sx={pageSubtitleSx}>
                Manage workspace roles, members & permissions.
              </AppText>
            </AppBox>

            <AppIconButton
              icon={<FiRefreshCw />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleRefresh}
              loading={isLoading}
              disabled={isLoading}
              sx={actionHeaderIconBtnSx}
            />
          </AppStack>
        </AppBox>

        {/* High-Density Compact Horizontal Metrics Grid */}
        <AppBox sx={statsGridWrapperSx}>
          <div className="grid grid-cols-5 gap-1">
            {dashboardStats.map((stat) => (
              <AppCard
                key={stat.id}
                variant="default"
                rounded="md"
                bordered
                shadow="none"
                padding="none"
                sx={compactStatCardSx}
              >
                <AppStack
                  direction="column"
                  align="center"
                  justify="center"
                  gap={0.4}
                  sx={{ py: 0.75 }}
                >
                  <AppBox
                    sx={{
                      ...compactStatIconSx,
                      bgcolor: `var(--app-color-${stat.colorVariant}-soft)`,
                      color: `var(--app-color-${stat.colorVariant})`,
                    }}
                  >
                    {statIcons[stat.id] || <FiShield />}
                  </AppBox>
                  <AppHeading level={3} weight={800} sx={compactStatValueSx}>
                    {stat.value}
                  </AppHeading>
                  <AppText variant="body2" sx={compactStatTitleSx}>
                    {stat.title.split(" ")[0]}
                  </AppText>
                </AppStack>
              </AppCard>
            ))}
          </div>
        </AppBox>

        {/* Access Control Modules Directory Overview Menu */}
        <AppBox sx={sectionWrapperSx}>
          <AppHeading level={2} weight={800} sx={sectionTitleSx}>
            Access Modules
          </AppHeading>
          <AppText variant="body2" sx={sectionSubtitleSx}>
            Select a target profile block below to orchestrate rights.
          </AppText>

          <AppStack direction="column" gap={1} sx={{ mt: 1.25 }}>
            {accessOverviewItems.map((item) => (
              <AppCard
                key={item.id}
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                onClick={item.onClick}
                sx={overviewRowItemCardSx}
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
                    gap={1}
                    sx={{ minWidth: 0, flex: 1 }}
                  >
                    <AppBox
                      sx={{
                        ...moduleIconFrameSx,
                        bgcolor: `var(--app-color-${item.colorVariant}-soft)`,
                        color: `var(--app-color-${item.colorVariant})`,
                      }}
                    >
                      {overviewIcons[item.id] || <FiShield />}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading level={3} weight={750} sx={moduleTitleTextSx}>
                        {item.title}
                      </AppHeading>
                      <AppText variant="body2" sx={moduleDescTextSx}>
                        {item.description}
                      </AppText>
                    </AppBox>
                  </AppStack>

                  <FiArrowRight className="text-[14px] text-text-muted/60 shrink-0" />
                </AppStack>
              </AppCard>
            ))}
          </AppStack>
        </AppBox>

        {/* Recent Security Activity Stream Section */}
        <AppBox sx={activitySectionWrapperSx}>
          <AppHeading level={2} weight={800} sx={sectionTitleSx}>
            Recent Activity
          </AppHeading>

          <AppStack direction="column" gap={0.85} sx={{ mt: 1.25 }}>
            {recentAccessActivity.map((activity) => (
              <AppCard
                key={activity.id}
                variant="default"
                rounded="md"
                bordered
                shadow="none"
                padding="none"
                sx={activityRowCardSx}
              >
                <AppStack
                  direction="row"
                  align="center"
                  justify="space-between"
                  gap={1.15}
                >
                  <AppStack
                    direction="row"
                    align="center"
                    gap={1}
                    sx={{ minWidth: 0, flex: 1 }}
                  >
                    <AppBox
                      sx={{
                        ...activityIconFrameSx,
                        bgcolor: `var(--app-color-${activity.colorVariant}-soft)`,
                        color: `var(--app-color-${activity.colorVariant})`,
                      }}
                    >
                      {activityIcons[activity.colorVariant] || <FiShield />}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading
                        level={3}
                        weight={700}
                        sx={activityTitleTextSx}
                      >
                        {activity.title}
                      </AppHeading>
                      <AppText variant="body2" sx={activityDescTextSx}>
                        {activity.description}
                      </AppText>
                    </AppBox>
                  </AppStack>

                  <AppTag
                    label={activity.label}
                    variant="soft"
                    colorVariant={activity.colorVariant}
                    rounded="sm"
                    sx={activityTagOverrideSx}
                  />
                </AppStack>
              </AppCard>
            ))}
          </AppStack>
        </AppBox>
      </AppBox>
    </section>
  );
};

/* Architectural Layout Specifications Dictionary */
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1,
  px: 0.5,
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const statsGridWrapperSx = {
  px: 0.5,
  pb: 1.25,
};

const compactStatCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};

const compactStatIconSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  borderRadius: "6px",
  fontSize: "12px",
  flexShrink: 0,
};

const compactStatValueSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1,
  color: "var(--app-color-text)",
};

const compactStatTitleSx = {
  fontSize: "9px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
  lineHeight: 1,
  mt: 0.1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const sectionWrapperSx = {
  px: 0.5,
  pb: 1.25,
};

const sectionTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.05,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const overviewRowItemCardSx = {
  p: 1.1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  cursor: "pointer",
  transition: "background-color 0.1s ease",
  "&:active": {
    bgcolor: "var(--app-color-surface-hover)",
  },
};

const moduleIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  borderRadius: "8px",
  fontSize: "15px",
  flexShrink: 0,
};

const moduleTitleTextSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const moduleDescTextSx = {
  mt: 0.1,
  fontSize: "10.5px",
  lineHeight: "13.5px",
  color: "var(--app-color-text-muted)",
};

const activitySectionWrapperSx = {
  px: 0.5,
  py: 1.25,
  borderTop: "1px solid var(--app-color-divider)",
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 25%, transparent)",
};

const activityRowCardSx = {
  p: 1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};

const activityIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "50%",
  fontSize: "13px",
  flexShrink: 0,
};

const activityTitleTextSx = {
  m: 0,
  fontSize: "12px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
};

const activityDescTextSx = {
  mt: 0.15,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

const activityTagOverrideSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 0.85,
  flexShrink: 0,
};

export default AccessControlMobilePage;
