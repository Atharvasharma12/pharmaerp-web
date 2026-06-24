// src/features/finance/chart-of-accounts/accounts/pages/desktop/AccountDetailsDesktopPage.jsx

import {
  FiArrowLeft,
  FiEdit3,
  FiMoreHorizontal,
  FiCalendar,
  FiLayers,
  FiCheckCircle,
  FiInfo,
  FiTag,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
  FiGitBranch,
  FiBookOpen,
} from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi2";

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

import { formatDate, formatCurrency } from "@/utils";
import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";

const AccountDetailsDesktopPage = ({
  account,
  accountId,
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

  if (isLoading && !account) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppPageLoader text="Retrieving account details..." />
      </section>
    );
  }

  if (hasError && !account) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppErrorState
          title="Account Fetch Failed"
          description={error || "Unable to load account details."}
          actionText="Retry"
          onRetry={handleRefresh}
          size="page"
        />
      </section>
    );
  }

  const safeAccount = account || {};

// Tabs removed; sections will be displayed sequentially.

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
              { label: "Accounts", onClick: handleBack },
              {
                label: safeAccount.accountCode || "Account Details",
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
              <HiOutlineBookOpen />
            </div>
            <AppBox>
              <AppStack direction="row" align="center" gap={0.8}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {safeAccount.accountName || "—"}
                </AppHeading>
                <AppStatusBadge
                  status={safeAccount.status || "active"}
                  variant="soft"
                  rounded="md"
                  size="small"
                />
              </AppStack>
              <AppText variant="body2" sx={subHeaderMetaDataSx}>
                {safeAccount.accountCode || "—"} &bull;{" "}
                <span className="capitalize font-medium text-text-muted">
                  {safeAccount.accountNature || "—"} /{" "}
                  {safeAccount.accountCategory || "—"}
                </span>
              </AppText>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-text-muted">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-primary text-[13px]" />
                  Created on{" "}
                  {safeAccount.createdAt ? formatDate(safeAccount.createdAt) : "—"}
                </span>
                {safeAccount.accountGroupId && (
                  <span className="flex items-center gap-1.5">
                    <FiLayers className="text-warning text-[13px]" />
                    Group:{" "}
                    {typeof safeAccount.accountGroupId === "object"
                      ? safeAccount.accountGroupId?.groupName
                      : "Account Group"}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <FiDollarSign className="text-success text-[13px]" />
                  Opening Bal:{" "}
                  {formatCurrency(safeAccount.openingBalance || 0)}{" "}
                  <span className="uppercase font-bold text-text">
                    {safeAccount.openingBalanceType || "Dr"}
                  </span>
                </span>
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
              Edit Account
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

        {/* Render all sections sequentially without tabs */}
        <OverviewTab account={safeAccount} onEdit={handleEdit} navigate={navigate} />
        <FinancialTab account={safeAccount} />
        <TimelineTab account={safeAccount} />
      </div>
    </section>
  );
};

/* ==========================================================================
   1. OVERVIEW TAB
   ========================================================================== */
const OverviewTab = ({ account, onEdit, navigate }) => (
  <div className="grid grid-cols-[1fr_340px] gap-4 items-start">
    {/* Left Column */}
    <div className="space-y-4">
      {/* Account Information */}
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
            Account Information
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
          <InfoRow label="Account Code" value={account.accountCode || "—"} />
          <InfoRow label="Account Name" value={account.accountName || "—"} />
          <InfoRow
            label="Account Group"
            value={
              account.accountGroupId
                ? typeof account.accountGroupId === "object"
                  ? account.accountGroupId?.groupName
                  : "Account Group"
                : "—"
            }
          />
          <InfoRow
            label="Nature"
            value={
              account.accountNature ? (
                <AppTag
                  label={account.accountNature}
                  colorVariant={
                    account.accountNature === "ASSET"
                      ? "primary"
                      : account.accountNature === "LIABILITY"
                      ? "warning"
                      : account.accountNature === "INCOME"
                      ? "success"
                      : account.accountNature === "EXPENSE"
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
          <InfoRow
            label="Category"
            value={
              account.accountCategory ? (
                <AppTag
                  label={account.accountCategory}
                  colorVariant="neutral"
                  variant="soft"
                  rounded="md"
                  sx={{ height: 20, fontSize: "10.5px", fontWeight: 700, textTransform: "capitalize" }}
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
                label={account.status || "active"}
                colorVariant={account.status === "active" ? "success" : "warning"}
                variant="soft"
                rounded="md"
                sx={{ height: 20, fontSize: "10.5px", fontWeight: 700, textTransform: "capitalize" }}
              />
            }
          />
          <div className="col-span-2">
            <InfoRow label="Description" value={account.description || "—"} vertical />
          </div>
        </div>
      </AppCard>

      {/* Audit Timestamps */}
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
            Audit Timestamps
          </AppHeading>
        </div>
        <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3.5">
          <InfoRow
            label="Created At"
            value={account.createdAt ? formatDate(account.createdAt) : "—"}
          />
          <InfoRow
            label="Updated At"
            value={account.updatedAt ? formatDate(account.updatedAt) : "—"}
          />
        </div>
      </AppCard>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      {/* Account Summary */}
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
            Account Summary
          </AppHeading>
        </div>
        <div className="p-4 space-y-4">
          <SummaryItem
            label="Nature / Account Type"
            value={account.accountNature || "—"}
            icon={<FiTag />}
            color="text-primary bg-primary-soft"
          />
          <SummaryItem
            label="Category"
            value={account.accountCategory || "—"}
            icon={<FiBookOpen />}
            color="text-warning bg-warning-soft"
          />
          <SummaryItem
            label="Opening Balance"
            value={`${formatCurrency(account.openingBalance || 0)} ${(account.openingBalanceType || "Dr").toUpperCase()}`}
            icon={<FiDollarSign />}
            color="text-success bg-success-soft"
          />
          <SummaryItem
            label="Status"
            value={account.status || "active"}
            icon={<FiCheckCircle />}
            color="text-success bg-success-soft"
          />
          <div className="pt-2 border-t border-border flex justify-between text-[11px] text-text-muted font-medium">
            <span>Last Modified</span>
            <span className="font-bold text-text">
              {account.updatedAt ? formatDate(account.updatedAt) : "Never"}
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
            label="Edit Account"
            icon={<FiEdit3 />}
            onClick={onEdit}
          />
          <QuickActionButton
            label="View Financial Info"
            icon={<FiDollarSign />}
          />
          <QuickActionButton
            label="View Timeline"
            icon={<FiClock />}
          />
          <QuickActionButton
            label="Go to Account Groups"
            icon={<FiLayers />}
            onClick={() => navigate("/finance/chart-of-accounts/account-groups")}
          />
        </div>
      </AppCard>

      {/* Info Panel */}
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
            About This Account
          </AppHeading>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex gap-2 text-[11.5px] text-text-muted leading-relaxed">
            <FiInfo className="text-primary mt-0.5 shrink-0" />
            <span>
              This is a ledger account used in the double-entry bookkeeping system. It belongs to the {account.accountNature || "—"} category.
            </span>
          </div>
          <div className="flex gap-2 text-[11.5px] text-text-muted leading-relaxed">
            <FiGitBranch className="text-success mt-0.5 shrink-0" />
            <span>
              Opening balance is set at {formatCurrency(account.openingBalance || 0)} ({(account.openingBalanceType || "Dr").toUpperCase()}).
            </span>
          </div>
        </div>
      </AppCard>
    </div>
  </div>
);

/* ==========================================================================
   2. FINANCIAL TAB
   ========================================================================== */
const FinancialTab = ({ account }) => (
  <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
    <div className="border-b border-border px-4 py-3.5 bg-surface-alt/10">
      <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
        Financial Details
      </AppHeading>
      <span className="block text-[11px] text-text-muted mt-0.5">
        Opening balance and financial configuration for this account.
      </span>
    </div>
    <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-4">
      <InfoRow label="Opening Balance" value={formatCurrency(account.openingBalance || 0)} />
      <InfoRow
        label="Balance Type"
        value={
          <AppTag
            label={account.openingBalanceType === "dr" ? "DR (Debit)" : "CR (Credit)"}
            colorVariant={account.openingBalanceType === "dr" ? "primary" : "warning"}
            variant="soft"
            rounded="md"
            sx={{ height: 20, fontSize: "10.5px", fontWeight: 700 }}
          />
        }
      />
      <InfoRow label="Account Nature" value={account.accountNature || "—"} />
      <InfoRow label="Account Category" value={account.accountCategory || "—"} />
      <InfoRow
        label="Account Group"
        value={
          account.accountGroupId
            ? typeof account.accountGroupId === "object"
              ? account.accountGroupId?.groupName
              : "Account Group"
            : "—"
        }
      />
      <InfoRow label="Status" value={account.status || "—"} />
    </div>
  </AppCard>
);

/* ==========================================================================
   3. TIMELINE TAB
   ========================================================================== */
const TimelineTab = ({ account }) => (
  <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
    <div className="border-b border-border px-4 py-3.5 bg-surface-alt/10">
      <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>
        Audit Log Timeline
      </AppHeading>
      <span className="block text-[11px] text-text-muted mt-0.5">
        Chronological history of changes to this account.
      </span>
    </div>
    <div className="p-6 max-w-[600px] space-y-6">
      <TimelineItem
        title="Account Created"
        desc={`Account "${account.accountName || "—"}" was registered in the chart of accounts.`}
        time={account.createdAt ? formatDate(account.createdAt) : "—"}
        active
      />
      {account.updatedAt && account.updatedAt !== account.createdAt && (
        <TimelineItem
          title="Account Updated"
          desc="Account details were modified."
          time={formatDate(account.updatedAt)}
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

export default AccountDetailsDesktopPage;
