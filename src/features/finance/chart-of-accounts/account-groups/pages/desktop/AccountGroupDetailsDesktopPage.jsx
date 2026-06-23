// src/features/finance/chart-of-accounts/account-groups/pages/desktop/AccountGroupDetailsDesktopPage.jsx

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
  FiFileText,
  FiClock,
  FiTag,
  FiTrendingUp,
} from "react-icons/fi";
import { HiOutlineRectangleStack } from "react-icons/hi2";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppMenu,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
  AppPageLoader,
  AppErrorState,
} from "@/components";

import { formatDate } from "@/utils";

import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";

const AccountGroupDetailsDesktopPage = ({
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
  const navigate = useNavigate();

  if (isLoading && !group) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppPageLoader text="Retrieving account group details..." />
      </section>
    );
  }

  if (hasError && !group) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppErrorState
          title="Account Group Fetch Failed"
          description={error || "Unable to load account group details."}
          actionText="Retry"
          onRetry={handleRefresh}
          size="page"
        />
      </section>
    );
  }

  const safeGroup = group || {};

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "accounts", label: "Accounts" },
    { value: "timeline", label: "Timeline" },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard", onClick: () => navigate("/") },
              { label: "Finance", onClick: () => navigate("/finance") },
              { label: "Account Groups", onClick: handleBack },
              {
                label: safeGroup.groupCode || "Group Details",
                current: true,
              },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* Header Row */}
        <div className="mt-2 flex w-full items-start justify-between border-b border-border-strong bg-surface rounded-xl border p-4 shadow-xs">
          <AppStack direction="row" align="center" gap={1.2}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary text-[28px]">
              <HiOutlineRectangleStack />
            </div>
            <AppBox>
              <AppStack direction="row" align="center" gap={0.8}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {safeGroup.groupName || "—"}
                </AppHeading>
                <AppStatusBadge
                  status={safeGroup.status || "active"}
                  variant="soft"
                  rounded="md"
                  size="small"
                />
              </AppStack>
              <AppText variant="body2" sx={subHeaderMetaDataSx}>
                {safeGroup.groupCode || "—"} &bull;{" "}
                <span className="capitalize font-medium text-text-muted">
                  {safeGroup.nature || "—"} Group
                </span>
              </AppText>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-text-muted">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-primary text-[13px]" />
                  Created on{" "}
                  {safeGroup.createdAt ? formatDate(safeGroup.createdAt) : "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiLayers className="text-warning text-[13px]" />
                  Level {safeGroup.level || 1}
                </span>
                {safeGroup.parentGroupId && (
                  <span className="flex items-center gap-1.5">
                    <FiGitBranch className="text-success text-[13px]" />
                    Under:{" "}
                    {typeof safeGroup.parentGroupId === "object"
                      ? safeGroup.parentGroupId?.groupName
                      : "Parent Group"}
                  </span>
                )}
              </div>
            </AppBox>
          </AppStack>

          <AppStack direction="row" align="center" gap={1}>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiEdit3 />}
              onClick={handleEdit}
              sx={secondaryButtonSx}
            >
              Edit Group
            </AppButton>
            <AppMenu
              trigger={
                <AppButton
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  endIcon={<FiMoreHorizontal />}
                  sx={secondaryButtonSx}
                >
                  More Actions
                </AppButton>
              }
              items={[
                {
                  id: "refresh",
                  label: "Force Refresh",
                  onClick: handleRefresh,
                },
                {
                  id: "back",
                  label: "Back to Listing",
                  onClick: handleBack,
                },
              ]}
              dense
            />
          </AppStack>
        </div>

        {/* Tab Bar */}
        <div className="mt-4 flex border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-4 pb-2.5 text-[12.5px] font-bold transition whitespace-nowrap outline-none ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-5">
          {currentTab === "overview" && (
            <OverviewTab group={safeGroup} onEdit={handleEdit} />
          )}
          {currentTab === "accounts" && (
            <AccountsTab group={safeGroup} navigate={navigate} />
          )}
          {currentTab === "timeline" && (
            <TimelineTab group={safeGroup} />
          )}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   1. OVERVIEW TAB
   ========================================================================== */
const OverviewTab = ({ group, onEdit }) => (
  <div className="grid grid-cols-[1fr_340px] gap-4 items-start">
    {/* Left Column */}
    <div className="space-y-4">
      {/* Basic Information */}
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
            Group Information
          </AppHeading>
          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="small"
            rounded="md"
            startIcon={<FiEdit3 />}
            onClick={onEdit}
            sx={{ height: 28, fontSize: "11px" }}
          >
            Edit
          </AppButton>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3.5">
          <InfoRow label="Group Code" value={group.groupCode || "—"} />
          <InfoRow label="Group Name" value={group.groupName || "—"} />
          <InfoRow
            label="Nature"
            value={
              group.nature ? (
                <AppTag
                  label={group.nature}
                  colorVariant={
                    group.nature === "ASSET"
                      ? "primary"
                      : group.nature === "LIABILITY"
                      ? "warning"
                      : group.nature === "INCOME"
                      ? "success"
                      : group.nature === "EXPENSE"
                      ? "danger"
                      : "neutral"
                  }
                  variant="soft"
                  rounded="md"
                  sx={{ height: 20, fontSize: "10.5px", fontWeight: 700, textTransform: "capitalize" }}
                />
              ) : (
                "—"
              )
            }
          />
          <InfoRow label="Hierarchy Level" value={`Level ${group.level || 1}`} />
          <InfoRow
            label="Parent Group"
            value={
              group.parentGroupId
                ? typeof group.parentGroupId === "object"
                  ? group.parentGroupId?.groupName
                  : "Parent Group"
                : "Root Group (No Parent)"
            }
          />
          <InfoRow
            label="Status"
            value={
              <AppTag
                label={group.status || "active"}
                colorVariant={group.status === "active" ? "success" : "warning"}
                variant="soft"
                rounded="md"
                sx={{ height: 20, fontSize: "10.5px", fontWeight: 700, textTransform: "capitalize" }}
              />
            }
          />
          <div className="col-span-2">
            <InfoRow label="Description" value={group.description || "—"} vertical />
          </div>
        </div>
      </AppCard>

      {/* Timestamps */}
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
            Audit Timestamps
          </AppHeading>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3.5">
          <InfoRow
            label="Created At"
            value={group.createdAt ? formatDate(group.createdAt) : "—"}
          />
          <InfoRow
            label="Updated At"
            value={group.updatedAt ? formatDate(group.updatedAt) : "—"}
          />
        </div>
      </AppCard>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      {/* Summary Card */}
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
            Group Summary
          </AppHeading>
        </div>
        <div className="p-4 space-y-4">
          <SummaryItem
            label="Nature / Account Type"
            value={group.nature || "—"}
            icon={<FiTag />}
            color="text-primary bg-primary-soft"
          />
          <SummaryItem
            label="Hierarchy Level"
            value={`Level ${group.level || 1}`}
            icon={<FiLayers />}
            color="text-warning bg-warning-soft"
          />
          <SummaryItem
            label="Status"
            value={group.status || "active"}
            icon={<FiCheckCircle />}
            color="text-success bg-success-soft"
          />
          <div className="pt-2 border-t border-border flex justify-between text-[11px] text-text-muted font-medium">
            <span>Last Modified</span>
            <span className="font-bold text-text">
              {group.updatedAt ? formatDate(group.updatedAt) : "Never"}
            </span>
          </div>
        </div>
      </AppCard>

      {/* Quick Actions */}
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
            Quick Actions
          </AppHeading>
        </div>
        <div className="p-3 space-y-2">
          <QuickActionButton
            label="Edit Account Group"
            icon={<FiEdit3 />}
            onClick={onEdit}
          />
          <QuickActionButton
            label="View Child Accounts"
            icon={<FiTrendingUp />}
          />
          <QuickActionButton
            label="View Timeline"
            icon={<FiClock />}
          />
        </div>
      </AppCard>

      {/* Info Card */}
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
            About Account Groups
          </AppHeading>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex gap-2 text-[11.5px] text-text-muted leading-relaxed">
            <FiInfo className="text-primary mt-0.5 shrink-0" />
            <span>
              Account groups classify accounts into categories like Assets, Liabilities, Income, and Expenses for systematic financial reporting.
            </span>
          </div>
          <div className="flex gap-2 text-[11.5px] text-text-muted leading-relaxed">
            <FiGitBranch className="text-success mt-0.5 shrink-0" />
            <span>
              Groups can be nested hierarchically — a child group inherits the nature from its parent.
            </span>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
);

/* ==========================================================================
   2. ACCOUNTS TAB
   ========================================================================== */
const AccountsTab = ({ group, navigate }) => (
  <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
    <div className="border-b border-border px-4 py-3.5 bg-surface-alt/10">
      <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
        Accounts Under This Group
      </AppHeading>
      <span className="block text-[11px] text-text-muted mt-0.5">
        Individual ledger accounts that belong to this account group.
      </span>
    </div>
    <div className="p-6 flex flex-col items-center justify-center gap-3 text-center">
      <FiFileText className="text-[36px] text-text-muted/50" />
      <AppHeading level={3} weight={700} sx={{ m: 0, fontSize: "13px" }}>
        No Accounts Linked
      </AppHeading>
      <span className="text-[12px] text-text-muted max-w-[300px]">
        Navigate to the Accounts listing page to view all accounts under this group.
      </span>
      <AppButton
        variant="contained"
        colorVariant="primary"
        rounded="md"
        size="small"
        onClick={() => navigate("/finance/chart-of-accounts/accounts")}
        sx={{ mt: 1, height: 34, fontSize: "12px", fontWeight: 700 }}
      >
        Go to Accounts
      </AppButton>
    </div>
  </AppCard>
);

/* ==========================================================================
   3. TIMELINE TAB
   ========================================================================== */
const TimelineTab = ({ group }) => (
  <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
    <div className="border-b border-border px-4 py-3.5 bg-surface-alt/10">
      <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
        Audit Log Timeline
      </AppHeading>
      <span className="block text-[11px] text-text-muted mt-0.5">
        Chronological history of changes to this account group.
      </span>
    </div>
    <div className="p-6 max-w-[600px] space-y-6">
      <TimelineItem
        title="Account Group Created"
        desc={`Group "${group.groupName || "—"}" was registered in the chart of accounts.`}
        time={group.createdAt ? formatDate(group.createdAt) : "—"}
        active
      />
      {group.updatedAt && group.updatedAt !== group.createdAt && (
        <TimelineItem
          title="Account Group Updated"
          desc="Group details were modified."
          time={formatDate(group.updatedAt)}
        />
      )}
    </div>
  </AppCard>
);

/* ==========================================================================
   PRESENTATIONAL HELPERS
   ========================================================================== */
const InfoRow = ({ label, value, vertical = false }) => (
  <div className={`text-[12px] ${vertical ? "flex flex-col gap-1" : "grid grid-cols-[140px_1fr] gap-2 items-start"}`}>
    <span className="font-bold text-text-muted leading-tight">{label}</span>
    <span className="font-semibold text-text break-words leading-tight">{value || "—"}</span>
  </div>
);

const SummaryItem = ({ label, value, icon, color }) => (
  <div className="flex items-center gap-3">
    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[16px] shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <span className="block text-[10.5px] font-bold text-text-muted leading-tight capitalize">{label}</span>
      <span className="block text-[14px] font-black text-text mt-0.5 leading-tight capitalize">{value}</span>
    </div>
  </div>
);

const QuickActionButton = ({ label, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-surface text-[12px] font-bold text-text hover:bg-surface-alt/30 transition text-left"
  >
    <span className="text-[13px] text-primary">{icon}</span>
    {label}
  </button>
);

const TimelineItem = ({ title, desc, time, active = false }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center shrink-0">
      <div className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center ${active ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-text-muted"}`}>
        <div className="h-1.5 w-1.5 rounded-full bg-current" />
      </div>
      <div className="w-[1.5px] flex-1 bg-border my-1" />
    </div>
    <div className="pb-4 min-w-0">
      <span className="block text-[12.5px] font-bold text-text leading-tight">{title}</span>
      <span className="block text-[11px] text-text-muted mt-1 leading-relaxed">{desc}</span>
      <span className="block text-[10px] text-text-muted/80 mt-1 font-semibold">{time}</span>
    </div>
  </div>
);

/* Styles */
const breadcrumbSx = { mb: 1 };
const breadcrumbItemSx = { fontSize: "11px", fontWeight: 700 };
const breadcrumbCurrentSx = { fontSize: "11px", fontWeight: 700 };
const pageTitleSx = { fontSize: "20px", fontWeight: 800, m: 0, color: "var(--app-color-text)", letterSpacing: "-0.4px" };
const subHeaderMetaDataSx = { mt: 0.15, fontSize: "11px", color: "var(--app-color-text-muted)" };
const secondaryButtonSx = { height: 32, fontSize: "11.5px", fontWeight: 700, borderColor: "var(--app-color-border-strong)" };
const sectionCardSx = { bgcolor: "var(--app-color-surface)", borderColor: "var(--app-color-border)", boxShadow: "var(--app-shadow-xs)" };
const cardHeaderTitleSx = { m: 0, fontSize: "12.5px", fontWeight: 800, color: "var(--app-color-text)", textTransform: "uppercase", letterSpacing: "0.2px" };

export default AccountGroupDetailsDesktopPage;
