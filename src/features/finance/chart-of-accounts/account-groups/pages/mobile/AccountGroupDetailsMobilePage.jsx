// src/features/finance/chart-of-accounts/account-groups/pages/mobile/AccountGroupDetailsMobilePage.jsx

import {
  FiArrowLeft,
  FiEdit3,
  FiMoreHorizontal,
  FiCalendar,
  FiLayers,
  FiGitBranch,
  FiCheckCircle,
  FiInfo,
  FiRefreshCw,
  FiTag,
} from "react-icons/fi";
import { HiOutlineRectangleStack } from "react-icons/hi2";

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

import { formatDate } from "@/utils";

const AccountGroupDetailsMobilePage = ({
  group,
  groupId,
  currentTab,
  isLoading,
  hasError,
  error,
  handleTabChange,
  handleBack,
  handleEdit,
  handleRefresh,
}) => {
  if (isLoading && !group) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppPageLoader text="Loading group details..." />
      </AppBox>
    );
  }

  if (hasError && !group) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppErrorState
          title="Group Fetch Failed"
          description={error || "Unable to load account group details."}
          actionText="Retry"
          onRetry={handleRefresh}
          size="medium"
        />
      </AppBox>
    );
  }

  const safeGroup = group || {};

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "timeline", label: "Timeline" },
  ];

  return (
    <section className="w-full bg-bg min-h-[calc(100vh-58px)] pb-16">
      <AppBox sx={containerSx}>
        {/* Mobile Header Row */}
        <AppBox sx={jumbotronHeaderSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1} sx={{ mb: 1.5 }}>
            <AppIconButton
              icon={<FiArrowLeft />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleBack}
              sx={backBtnSx}
            />
            <AppStack direction="row" align="center" gap={0.5}>
              <AppIconButton
                icon={<FiEdit3 />}
                size="small"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                onClick={handleEdit}
                sx={headerActionBtnSx}
              />
              <AppMenu
                trigger={
                  <AppIconButton
                    icon={<FiMoreHorizontal />}
                    size="small"
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    sx={moreActionBtnSx}
                  />
                }
                items={[
                  {
                    id: "refresh",
                    label: "Refresh",
                    icon: <FiRefreshCw />,
                    onClick: handleRefresh,
                  },
                ]}
                dense
              />
            </AppStack>
          </AppStack>

          <AppStack direction="row" align="center" gap={1}>
            <AppBox sx={iconFrameSx}>
              <HiOutlineRectangleStack />
            </AppBox>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppStack direction="row" align="center" gap={0.5} wrap="wrap">
                <AppHeading level={1} weight={800} sx={groupTitleTextSx}>
                  {safeGroup.groupName || "—"}
                </AppHeading>
                <AppStatusBadge
                  status={safeGroup.status || "active"}
                  variant="soft"
                  rounded="md"
                  size="small"
                  sx={statusBadgeOverrideSx}
                />
              </AppStack>
              <AppText variant="body2" sx={groupMetadataTextSx}>
                {safeGroup.groupCode || "—"} &bull;{" "}
                <span className="capitalize">{safeGroup.nature || "—"} Group</span>
              </AppText>
            </AppBox>
          </AppStack>

          {/* Ribbon */}
          <AppBox sx={metaPillsRibbonSx}>
            <span className="flex items-center gap-1">
              <FiCalendar className="text-primary" /> Created on{" "}
              {safeGroup.createdAt ? formatDate(safeGroup.createdAt) : "—"}
            </span>
            <span className="flex items-center gap-1">
              <FiLayers className="text-warning" /> Level {safeGroup.level || 1}
            </span>
          </AppBox>
        </AppBox>

        {/* Tab Selection */}
        <AppBox sx={tabsLineTrackSx}>
          {tabs.map((tab) => {
            const isTabActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-3 pb-2 text-[12px] font-bold transition whitespace-nowrap outline-none ${
                  isTabActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </AppBox>

        {/* Tab Body */}
        <AppBox sx={mainBodyScrollContentWrapperSx}>
          {currentTab === "overview" && (
            <AppStack direction="column" gap={1.25}>
              {/* Group Info Card */}
              <AppCard variant="default" rounded="lg" bordered shadow="none" padding="none" sx={moduleCardContainerSx}>
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                    Group Information
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2 }}>
                  <CompactRow label="Code" value={safeGroup.groupCode} />
                  <CompactRow label="Name" value={safeGroup.groupName} />
                  <CompactRow label="Nature" value={safeGroup.nature} />
                  <CompactRow label="Level" value={`Level ${safeGroup.level || 1}`} />
                  <CompactRow
                    label="Parent Group"
                    value={
                      safeGroup.parentGroupId
                        ? typeof safeGroup.parentGroupId === "object"
                          ? safeGroup.parentGroupId?.groupName
                          : "Parent Group"
                        : "Root Group"
                    }
                  />
                  <CompactRow label="Status" value={safeGroup.status} />
                  <CompactRow label="Description" value={safeGroup.description} />
                </AppBox>
              </AppCard>

              {/* Summary Metrics */}
              <AppBox sx={highlightsHeaderSpacingBoxSx}>
                <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                  Group Summary
                </AppHeading>
              </AppBox>
              <div className="grid grid-cols-2 gap-2">
                <CompactMetricCard title="Nature" value={safeGroup.nature || "—"} color="primary" />
                <CompactMetricCard title="Level" value={`Level ${safeGroup.level || 1}`} color="warning" />
                <div className="col-span-2">
                  <CompactMetricCard title="Status" value={safeGroup.status || "active"} color="success" />
                </div>
              </div>

              {/* Timestamps */}
              <AppCard variant="default" rounded="lg" bordered shadow="none" padding="none" sx={moduleCardContainerSx}>
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                    Audit Timestamps
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2 }}>
                  <CompactRow label="Created" value={safeGroup.createdAt ? formatDate(safeGroup.createdAt) : "—"} />
                  <CompactRow label="Updated" value={safeGroup.updatedAt ? formatDate(safeGroup.updatedAt) : "—"} />
                </AppBox>
              </AppCard>
            </AppStack>
          )}

          {currentTab === "timeline" && (
            <AppCard variant="default" rounded="md" bordered shadow="none" sx={moduleCardContainerSx}>
              <AppBox sx={cardHeaderBannerSx}>
                <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                  Audit Timeline
                </AppHeading>
              </AppBox>
              <AppBox sx={{ p: 1.5 }}>
                <div className="space-y-4">
                  <MobileTimelineItem
                    title="Group Created"
                    desc={`"${safeGroup.groupName || "—"}" registered in chart of accounts.`}
                    time={safeGroup.createdAt ? formatDate(safeGroup.createdAt) : "—"}
                    active
                  />
                  {safeGroup.updatedAt && safeGroup.updatedAt !== safeGroup.createdAt && (
                    <MobileTimelineItem
                      title="Group Updated"
                      desc="Group details were modified."
                      time={formatDate(safeGroup.updatedAt)}
                    />
                  )}
                </div>
              </AppBox>
            </AppCard>
          )}
        </AppBox>
      </AppBox>
    </section>
  );
};

/* Components */
const CompactRow = ({ label, value }) => (
  <div className="grid grid-cols-[120px_1fr] gap-2 py-0.5 text-[11px] items-start border-b border-divider/40 pb-1.5 last:border-0 last:pb-0">
    <span className="font-bold text-text-muted">{label}</span>
    <span className="font-semibold text-text break-words capitalize">{value || "—"}</span>
  </div>
);

const CompactMetricCard = ({ title, value, color }) => (
  <AppCard variant="default" rounded="md" bordered shadow="none" sx={{ p: 1.5, bgcolor: "var(--app-color-surface)" }}>
    <span className="block text-[9.5px] font-bold text-text-muted leading-tight">{title}</span>
    <span className={`block text-[15px] font-black mt-1 leading-tight capitalize ${color === "danger" ? "text-danger" : color === "success" ? "text-success" : color === "warning" ? "text-warning" : "text-primary"}`}>
      {value}
    </span>
  </AppCard>
);

const MobileTimelineItem = ({ title, desc, time, active = false }) => (
  <div className="flex gap-3">
    <div className="flex flex-col items-center shrink-0">
      <div className={`h-4 w-4 rounded-full border-2 ${active ? "border-primary bg-primary-soft" : "border-border bg-surface"}`} />
      <div className="w-[1.5px] flex-1 bg-border my-1" />
    </div>
    <div className="pb-3 min-w-0">
      <span className="block text-[12px] font-bold text-text leading-tight">{title}</span>
      <span className="block text-[10.5px] text-text-muted mt-0.5 leading-relaxed">{desc}</span>
      <span className="block text-[10px] text-text-muted/80 mt-1 font-semibold">{time}</span>
    </div>
  </div>
);

/* Styles */
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

const loadingErrorWrapperSx = {
  width: "100%",
  minHeight: 320,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 1.5,
};

const jumbotronHeaderSx = {
  pt: 1.5,
  pb: 1.25,
  px: 1.5,
};

const backBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const headerActionBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border-strong)",
  color: "var(--app-color-text)",
};

const moreActionBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border-strong)",
};

const iconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: "10px",
  fontSize: "22px",
  flexShrink: 0,
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
};

const groupTitleTextSx = {
  m: 0,
  fontSize: "17px",
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

const groupMetadataTextSx = {
  mt: 0.15,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const metaPillsRibbonSx = {
  mt: 1.5,
  pt: 1,
  borderTop: "1px dashed var(--app-color-border)",
  display: "flex",
  flexDirection: "column",
  gap: 0.4,
  fontSize: "10.5px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const tabsLineTrackSx = {
  display: "flex",
  gap: 0.75,
  borderBottom: "1px solid var(--app-color-divider)",
  px: 1.5,
  overflowX: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
    width: 0,
    height: 0,
  },
};

const mainBodyScrollContentWrapperSx = {
  px: 1.5,
  py: 1.5,
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
  textTransform: "uppercase",
  fontWeight: 800,
};

const highlightsHeaderSpacingBoxSx = {
  pt: 0.5,
  pb: 0.25,
};

export default AccountGroupDetailsMobilePage;
