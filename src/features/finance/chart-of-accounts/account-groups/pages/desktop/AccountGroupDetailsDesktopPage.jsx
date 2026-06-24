// src/features/finance/chart-of-accounts/account-groups/pages/desktop/AccountGroupDetailsDesktopPage.jsx

import {
  FiEdit3,
  FiMoreHorizontal,
  FiCalendar,
  FiLayers,
  FiGitBranch,
  FiCheckCircle,
  FiInfo,
  FiRefreshCw,
  FiFileText,
  FiTag,
  FiTrendingUp,
  FiHome,
  FiUsers,
  FiPieChart,
  FiList,
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
  isLoading,
  hasError,
  error,
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

  const parentGroupLabel =
    safeGroup.parentGroupId && typeof safeGroup.parentGroupId === "object"
      ? safeGroup.parentGroupId?.groupName || "Current Assets"
      : safeGroup.parentGroupName || "Current Assets";

  const rootGroupLabel = safeGroup.rootGroupName || "Assets (GRP-001)";

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-375">
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
        <div className="mt-2 flex w-full items-start justify-between rounded-xl border border-border-strong bg-surface p-4 shadow-xs">
          <AppStack direction="row" align="center" gap={1.2}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary text-[28px]">
              <HiOutlineRectangleStack />
            </div>
            <AppBox>
              <AppStack direction="row" align="center" gap={0.8}>
                <AppHeading level={1} weight={600} sx={pageTitleSx}>
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

              <div className="mt-2 flex flex-wrap items-center gap-4 text-[10.5px] font-medium text-text-muted">
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

        {/* Compact Overview */}
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
          <div className="space-y-4">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              padding="none"
              sx={sectionCardSx}
            >
              <div className="border-b border-border px-4 py-2.5 bg-surface-alt/20">
                <AppHeading level={2} weight={600} sx={cardHeaderTitleSx}>
                  Group Information
                </AppHeading>
              </div>
              <div className="p-4 grid grid-cols-2 gap-x-5 gap-y-2">
                <InfoRow
                  label="Group Name"
                  value={safeGroup.groupName || "—"}
                />
                <InfoRow
                  label="Group Code"
                  value={safeGroup.groupCode || "—"}
                />
                <InfoRow label="Parent Group" value={parentGroupLabel} />
                <InfoRow
                  label="Group Level"
                  value={`Level ${safeGroup.level || 1}`}
                />
                <InfoRow
                  label="Nature"
                  value={
                    safeGroup.nature ? (
                      <AppTag
                        label={safeGroup.nature}
                        colorVariant={
                          safeGroup.nature === "ASSET"
                            ? "primary"
                            : safeGroup.nature === "LIABILITY"
                              ? "warning"
                              : safeGroup.nature === "INCOME"
                                ? "success"
                                : safeGroup.nature === "EXPENSE"
                                  ? "danger"
                                  : "neutral"
                        }
                        variant="soft"
                        rounded="md"
                        sx={{
                          height: 20,
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                      />
                    ) : (
                      "—"
                    )
                  }
                />
                <InfoRow
                  label="Status"
                  value={
                    <AppTag
                      label={safeGroup.status || "active"}
                      colorVariant={
                        safeGroup.status === "active" ? "success" : "warning"
                      }
                      variant="soft"
                      rounded="md"
                      sx={{
                        height: 20,
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    />
                  }
                />
                <div className="col-span-2">
                  <InfoRow
                    label="Description"
                    value={safeGroup.description || "—"}
                    vertical
                  />
                </div>
              </div>
            </AppCard>

            <div className="grid grid-cols-2 gap-4">
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                padding="none"
                sx={sectionCardSx}
              >
                <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
                  <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
                    Hierarchy Information
                  </AppHeading>
                </div>
                <div className="p-4">
                  <div className="space-y-4 border-l border-border pl-4">
                    <HierarchyStep
                      icon={<FiHome />}
                      label="Level 0 (Root)"
                      value={rootGroupLabel}
                      accent="text-success bg-success-soft"
                    />
                    <HierarchyStep
                      icon={<FiLayers />}
                      label="Level 1"
                      value={parentGroupLabel}
                      accent="text-warning bg-warning-soft"
                    />
                    <HierarchyStep
                      icon={<HiOutlineRectangleStack />}
                      label={`Level ${safeGroup.level || 2} (Current)`}
                      value={safeGroup.groupName || "—"}
                      accent="text-primary bg-primary-soft"
                      active
                      badge="This Group"
                    />
                  </div>
                </div>
              </AppCard>

              <AppCard
                variant="default"
                rounded="lg"
                bordered
                padding="none"
                sx={sectionCardSx}
              >
                <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
                  <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
                    Group Summary
                  </AppHeading>
                </div>
                <div className="p-4 space-y-3">
                  <SummaryItem
                    label="Group Code"
                    value={safeGroup.groupCode || "—"}
                    icon={<FiTag />}
                    color="text-primary bg-primary-soft"
                  />
                  <SummaryItem
                    label="Group Level"
                    value={`Level ${safeGroup.level || 1}`}
                    icon={<FiLayers />}
                    color="text-warning bg-warning-soft"
                  />
                  <SummaryItem
                    label="Parent Group"
                    value={parentGroupLabel}
                    icon={<FiGitBranch />}
                    color="text-text-muted bg-surface-alt"
                  />
                  <SummaryItem
                    label="Nature"
                    value={safeGroup.nature || "—"}
                    icon={<FiPieChart />}
                    color="text-success bg-success-soft"
                  />
                  <SummaryItem
                    label="Status"
                    value={safeGroup.status || "active"}
                    icon={<FiCheckCircle />}
                    color="text-success bg-success-soft"
                  />
                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-muted font-medium">
                    <span>Created On</span>
                    <span className="font-semibold text-text">
                      {safeGroup.createdAt
                        ? formatDate(safeGroup.createdAt)
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted font-medium">
                    <span>Last Updated</span>
                    <span className="font-semibold text-text">
                      {safeGroup.updatedAt
                        ? formatDate(safeGroup.updatedAt)
                        : "—"}
                    </span>
                  </div>
                </div>
              </AppCard>
            </div>

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              padding="none"
              sx={sectionCardSx}
            >
              <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
                <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
                  Accounts in This Group
                </AppHeading>
              </div>
              <div className="p-4">
                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="grid grid-cols-[1.7fr_.7fr_.7fr_.7fr] gap-0 border-b border-border bg-surface-alt/20 px-3 py-2 text-[10.5px] font-bold uppercase tracking-wide text-text-muted">
                    <span>Account Name</span>
                    <span>Account Code</span>
                    <span>Account Type</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-border">
                    <CompactAccountRow
                      name="HDFC Bank A/C"
                      code="1002"
                      type="Asset"
                      status="Active"
                    />
                    <CompactAccountRow
                      name="SBI Current A/C"
                      code="1003"
                      type="Asset"
                      status="Active"
                    />
                    <CompactAccountRow
                      name="ICICI Bank A/C"
                      code="1004"
                      type="Asset"
                      status="Active"
                    />
                    <CompactAccountRow
                      name="Axis Bank A/C"
                      code="1005"
                      type="Asset"
                      status="Inactive"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/finance/chart-of-accounts/accounts")
                  }
                  className="mt-3 text-[11px] font-bold text-success transition hover:text-success/80"
                >
                  View all accounts in this group →
                </button>
              </div>
            </AppCard>
          </div>

          <div className="space-y-4">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              padding="none"
              sx={sectionCardSx}
            >
              <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
                <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
                  Quick Actions
                </AppHeading>
              </div>
              <div className="p-3 space-y-2">
                <QuickActionButton
                  label="Edit Account Group"
                  icon={<FiEdit3 />}
                  onClick={handleEdit}
                />
                <QuickActionButton
                  label="Add Sub Group"
                  icon={<FiGitBranch />}
                />
                <QuickActionButton label="Add Account" icon={<FiUsers />} />
                <QuickActionButton
                  label="View Group Hierarchy"
                  icon={<FiHome />}
                />
                <QuickActionButton
                  label="Refresh Group"
                  icon={<FiRefreshCw />}
                  onClick={handleRefresh}
                />
              </div>
            </AppCard>

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              padding="none"
              sx={sectionCardSx}
            >
              <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
                <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
                  About Account Groups
                </AppHeading>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex gap-2 text-[11.5px] text-text-muted leading-relaxed">
                  <FiInfo className="text-primary mt-0.5 shrink-0" />
                  <span>
                    Account groups classify accounts into categories like
                    Assets, Liabilities, Income, and Expenses for systematic
                    financial reporting.
                  </span>
                </div>
                <div className="flex gap-2 text-[11.5px] text-text-muted leading-relaxed">
                  <FiGitBranch className="text-success mt-0.5 shrink-0" />
                  <span>
                    Groups can be nested hierarchically, so child groups inherit
                    structure from their parent group.
                  </span>
                </div>
              </div>
            </AppCard>

            <AppCard
              variant="default"
              rounded="lg"
              bordered
              padding="none"
              sx={sectionCardSx}
            >
              <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
                <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
                  Help & Support
                </AppHeading>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-2 text-[11.5px] text-text-muted leading-relaxed">
                  <FiInfo className="mt-0.5 shrink-0 text-primary" />
                  <span>
                    Learn more about account groups and organizing your chart of
                    accounts.
                  </span>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-[11px] font-bold text-success transition hover:text-success/80"
                >
                  View User Guide →
                </button>
              </div>
            </AppCard>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ========================================================================== 
   PRESENTATIONAL HELPERS
   ========================================================================== */
const InfoRow = ({ label, value, vertical = false }) => (
  <div
    className={`text-[11.5px] ${vertical ? "flex flex-col gap-0.5" : "grid grid-cols-[128px_1fr] gap-2 items-start"}`}
  >
    <span className="font-semibold text-text-muted leading-tight">{label}</span>
    <span className="font-medium text-text wrap-break-word leading-tight">
      {value || "—"}
    </span>
  </div>
);

const SummaryItem = ({ label, value, icon, color }) => (
  <div className="flex items-center gap-2.5">
    <div
      className={`h-8 w-8 rounded-lg flex items-center justify-center text-[15px] shrink-0 ${color}`}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <span className="block text-[10px] font-semibold text-text-muted leading-tight capitalize">
        {label}
      </span>
      <span className="block text-[13px] font-bold text-text mt-0.5 leading-tight capitalize">
        {value}
      </span>
    </div>
  </div>
);

const QuickActionButton = ({ label, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-surface text-[11.5px] font-semibold text-text hover:bg-surface-alt/30 transition text-left"
  >
    <span className="text-[12.5px] text-primary">{icon}</span>
    {label}
  </button>
);

const CompactAccountRow = ({ name, code, type, status }) => (
  <div className="grid grid-cols-[1.7fr_.7fr_.7fr_.7fr] gap-0 px-3 py-2 text-[11px] items-center">
    <span className="font-semibold text-text">{name}</span>
    <span className="font-semibold text-text-muted">{code}</span>
    <span>
      <AppTag
        label={type}
        colorVariant="primary"
        variant="soft"
        rounded="md"
        sx={{
          height: 18,
          fontSize: "9.5px",
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      />
    </span>
    <span>
      <AppTag
        label={status}
        colorVariant={status === "Active" ? "success" : "danger"}
        variant="soft"
        rounded="md"
        sx={{
          height: 18,
          fontSize: "9.5px",
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      />
    </span>
  </div>
);

const HierarchyStep = ({
  icon,
  label,
  value,
  accent,
  active = false,
  badge,
}) => (
  <div className="flex gap-3">
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[15px] ${accent}`}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1 pb-2.5">
      <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <span className="block text-[12px] font-semibold text-text leading-tight">
        {value}
      </span>
      {badge ? (
        <span
          className={`mt-1 inline-flex rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${active ? "bg-success-soft text-success" : "bg-surface-alt text-text-muted"}`}
        >
          {badge}
        </span>
      ) : null}
    </div>
  </div>
);

/* Styles */
const breadcrumbSx = { mb: 1 };
const breadcrumbItemSx = { fontSize: "11px", fontWeight: 600 };
const breadcrumbCurrentSx = { fontSize: "11px", fontWeight: 600 };
const pageTitleSx = {
  fontSize: "17px",
  fontWeight: 700,
  m: 0,
  color: "var(--app-color-text)",
  letterSpacing: "-0.4px",
};
const subHeaderMetaDataSx = {
  mt: 0.15,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};
const secondaryButtonSx = {
  height: 32,
  fontSize: "11.5px",
  fontWeight: 600,
  borderColor: "var(--app-color-border-strong)",
};
const sectionCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};
const cardHeaderTitleSx = {
  m: 0,
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  textTransform: "uppercase",
  letterSpacing: "0.2px",
};

export default AccountGroupDetailsDesktopPage;
