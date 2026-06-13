// src/features/access-control/pages/mobile/RoleDetailsMobilePage.jsx

import { useState } from "react";
import {
  FiArrowLeft,
  FiMoreHorizontal,
  FiShield,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiChevronRight,
  FiChevronDown,
  FiEye,
  FiEdit2,
  FiSettings,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppMenu,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
  AppPageLoader,
  AppErrorState,
} from "@/components";

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const RoleDetailsMobilePage = ({
  role,
  isLoading,
  hasError,
  error,
  handleBackToRoles,
  handleEditRole,
  handleRefresh,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading && !role) {
    return (
      <AppBox sx={loadingContainerSx}>
        <AppPageLoader text="Loading role details..." />
      </AppBox>
    );
  }

  if (hasError && !role) {
    return (
      <AppBox sx={loadingContainerSx}>
        <AppErrorState
          title="Extraction Failure"
          description={error || "Could not process role information."}
          actionText="Retry"
          onRetry={handleRefresh}
          size="medium"
        />
      </AppBox>
    );
  }

  const safeRole = role || {};

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* --- MOBILE HEADER STRIP --- */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
            sx={{ mb: 1.5 }}
          >
            <AppIconButton
              icon={<FiArrowLeft />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleBackToRoles}
              sx={backBtnSx}
            />
            <AppStack direction="row" align="center" gap={0.5}>
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleEditRole}
                disabled={!safeRole.canEdit}
                sx={headerActionBtnSx}
              >
                Edit
              </AppButton>
              <AppIconButton
                icon={<FiMoreHorizontal />}
                size="small"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                onClick={handleRefresh}
                sx={moreActionBtnSx}
              />
            </AppStack>
          </AppStack>

          <AppStack direction="column" gap={0.5}>
            <AppHeading level={1} weight={800} sx={roleTitleTextSx}>
              {safeRole.displayName}
            </AppHeading>
            <AppStack direction="row" align="center" gap={0.75}>
              <AppStatusBadge
                status={safeRole.displayStatus}
                label={safeRole.displayStatus}
                variant="soft"
                size="small"
                rounded="md"
                colorVariant={
                  statusColorMap[safeRole.displayStatus] || "success"
                }
                sx={statusBadgeOverrideSx}
              />
              <AppTag
                label={safeRole.displayType}
                variant="soft"
                colorVariant="purple"
                size="small"
                rounded="md"
                sx={roleTagOverrideSx}
              />
            </AppStack>
          </AppStack>
        </AppBox>

        {/* --- HORIZONTAL TAB NAVIGATION --- */}
        <AppBox sx={tabsLineTrackSx}>
          {["Overview", "Permissions", "Members"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`border-b-2 px-3.5 pb-2.5 text-[12px] font-bold transition whitespace-nowrap outline-none ${
                activeTab === tab.toLowerCase()
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted"
              }`}
            >
              {tab}
            </button>
          ))}
        </AppBox>

        {/* --- MAIN TAB CONTENT AREA --- */}
        <AppBox sx={mainBodyScrollContentWrapperSx}>
          <AppStack direction="column" gap={1.25}>
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              padding="none"
              sx={moduleCardContainerSx}
            >
              <AppBox sx={cardHeaderBannerSx}>
                <AppHeading level={3} weight={800} sx={cardHeaderTitleSx}>
                  Role Profile Data
                </AppHeading>
              </AppBox>
              <AppBox sx={{ p: 1.25, spaceY: 3 }}>
                <CompactLabelRow
                  label="Role Code"
                  value={
                    <span className="font-mono text-[11.5px] font-bold">
                      {safeRole.displayCode}
                    </span>
                  }
                />
                <CompactLabelRow
                  label="Created By"
                  value={safeRole.displayCreatedBy}
                />
                <CompactLabelRow
                  label="Created On"
                  value={safeRole.displayCreatedAt}
                />
                <CompactLabelRow
                  label="Last Updated"
                  value={safeRole.displayUpdatedAt}
                />
                <div className="w-full h-[1px] bg-divider" />
                <div className="text-[11.5px] text-text-muted leading-relaxed">
                  <span className="font-bold text-text block mb-1">
                    Description
                  </span>
                  {safeRole.displayDescription}
                </div>
              </AppBox>
            </AppCard>

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              padding="none"
              sx={moduleCardContainerSx}
            >
              <AppBox sx={cardHeaderBannerSx}>
                <AppHeading level={3} weight={800} sx={cardHeaderTitleSx}>
                  Workspace Scope
                </AppHeading>
              </AppBox>
              <AppBox sx={{ p: 1.25, spaceY: 3 }}>
                <CompactLabelRow
                  label="Workspace"
                  value={safeRole.workspaceName || "MedPlus Pharmacy"}
                />
                <CompactLabelRow label="Companies" value="All Companies" />
                <CompactLabelRow label="Branches" value="All Branches" />
              </AppBox>
            </AppCard>

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="none"
              padding="none"
              sx={moduleCardContainerSx}
            >
              <AppBox sx={cardHeaderBannerSx}>
                <AppHeading level={3} weight={800} sx={cardHeaderTitleSx}>
                  Security Access
                </AppHeading>
              </AppBox>
              <AppBox sx={{ p: 1.25 }}>
                <div className="flex items-center gap-3 bg-primary-soft/30 p-3 rounded-lg border border-primary-soft">
                  <FiShield className="text-primary text-[20px]" />
                  <div className="min-w-0">
                    <AppText
                      variant="body2"
                      weight={750}
                      sx={{ color: "var(--app-color-primary)" }}
                    >
                      {safeRole.permissionCount} /{" "}
                      {safeRole.totalPermissionCount}
                    </AppText>
                    <AppText
                      variant="body2"
                      sx={{
                        fontSize: "11px",
                        color: "var(--app-color-text-muted)",
                      }}
                    >
                      Total platform permissions active
                    </AppText>
                  </div>
                </div>
              </AppBox>
            </AppCard>
          </AppStack>
        </AppBox>
      </AppBox>
    </section>
  );
};

const CompactLabelRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-2 text-[11.5px]">
    <AppText
      variant="body2"
      weight={700}
      sx={{ color: "var(--app-color-text-muted)" }}
    >
      {label}
    </AppText>
    <div className="font-semibold text-text text-right">{value}</div>
  </div>
);

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

const headerWrapperSx = { pt: 1.5, pb: 1.25, px: 0.5 };
const backBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};
const headerActionBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 750,
  px: 1.3,
  borderColor: "var(--app-color-border-strong)",
  color: "var(--app-color-text)",
};
const moreActionBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border-strong)",
};

const roleTitleTextSx = {
  m: 0,
  fontSize: "18px",
  lineHeight: 1.2,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};
const statusBadgeOverrideSx = {
  height: 16,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 0.85,
  textTransform: "capitalize",
};
const roleTagOverrideSx = {
  height: 16,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 0.85,
};

const tabsLineTrackSx = {
  display: "flex",
  gap: 0.75,
  borderBottom: "1px solid var(--app-color-divider)",
  px: 0.5,
  overflowX: "auto",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
};

const mainBodyScrollContentWrapperSx = {
  px: 0.5,
  py: 1.25,
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 20%, transparent)",
};
const moduleCardContainerSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};
const cardHeaderBannerSx = {
  px: 1.2,
  py: 0.85,
  borderBottom: "1px solid var(--app-color-divider)",
  bgcolor: "var(--app-color-surface-alt)",
};
const cardHeaderTitleSx = {
  m: 0,
  fontSize: "12px",
  letterSpacing: "-0.1px",
  color: "var(--app-color-text)",
};
const cardFooterActionTriggerSx = {
  borderTop: "1px solid var(--app-color-divider)",
  py: 0.75,
  display: "flex",
  justifyContent: "center",
};
const loadingContainerSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "50vh",
};

export default RoleDetailsMobilePage;
