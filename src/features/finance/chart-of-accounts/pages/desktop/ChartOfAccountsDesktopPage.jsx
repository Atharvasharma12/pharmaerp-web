import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import {
  FiArrowRight,
  FiFileText,
  FiGitBranch,
  FiLayers,
  FiXCircle,
  FiRefreshCw,
  FiPlus,
  FiDownload,
  FiUpload,
  FiBookOpen,
  FiChevronRight,
  FiChevronLeft,
  FiExternalLink,
  FiEye,
  FiFilter,
} from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppTable,
  AppTag,
  AppText,
  PageHeader,
} from "@/components";

// Map statistic IDs to react-icons
const statIcons = {
  totalGroups: <FiGitBranch />,
  totalAccounts: <FiFileText />,
  rootGroups: <FiLayers />,
  inactiveAccounts: <FiXCircle />,
};

const statusColorMap = {
  active: "success",
  inactive: "neutral",
};

const typeColorMap = {
  Asset: "primary",
  Liability: "warning",
  Equity: "purple",
  Income: "success",
  Expense: "danger",
};

// Toolbar component for Accounts
const AccountsTableToolbar = ({
  filters,
  accountTypeOptions,
  statusOptions,
  handleFilterChange,
  handleAction,
}) => (
  <div className="border-b border-border px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
    <div className="flex items-center gap-3 flex-1 min-w-[300px]">
      <AppSearchInput
        name="searchAccounts"
        value={filters.searchAccounts}
        onChange={(e) => handleFilterChange("searchAccounts", e.target.value)}
        placeholder="Search accounts..."
        clearable
        onClear={() => handleFilterChange("searchAccounts", "")}
        size="small"
        variant="bordered"
        rounded="md"
        sx={{ maxWidth: 220, width: "100%" }}
        inputSx={filterInputSx}
      />
      <AppSelect
        name="accountType"
        value={filters.accountType}
        onChange={(e) => handleFilterChange("accountType", e.target.value)}
        options={accountTypeOptions}
        size="small"
        variant="bordered"
        rounded="md"
        sx={{ width: 140 }}
        inputSx={filterInputSx}
      />
      <AppSelect
        name="accountStatus"
        value={filters.accountStatus}
        onChange={(e) => handleFilterChange("accountStatus", e.target.value)}
        options={statusOptions}
        size="small"
        variant="bordered"
        rounded="md"
        sx={{ width: 110 }}
        inputSx={filterInputSx}
      />
    </div>
    <AppButton
      type="button"
      variant="contained"
      colorVariant="success"
      rounded="md"
      size="small"
      startIcon={<FiPlus />}
      onClick={() => handleAction("add_account")}
      sx={addButtonSx}
    >
      Add Account
    </AppButton>
  </div>
);

// Toolbar component for Account Groups
const GroupsTableToolbar = ({
  filters,
  statusOptions,
  handleFilterChange,
  handleAction,
}) => (
  <div className="border-b border-border px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
    <div className="flex items-center gap-3 flex-1 min-w-[300px]">
      <AppSearchInput
        name="searchGroups"
        value={filters.searchGroups}
        onChange={(e) => handleFilterChange("searchGroups", e.target.value)}
        placeholder="Search groups..."
        clearable
        onClear={() => handleFilterChange("searchGroups", "")}
        size="small"
        variant="bordered"
        rounded="md"
        sx={{ maxWidth: 220, width: "100%" }}
        inputSx={filterInputSx}
      />
      <AppSelect
        name="groupStatus"
        value={filters.groupStatus}
        onChange={(e) => handleFilterChange("groupStatus", e.target.value)}
        options={statusOptions}
        size="small"
        variant="bordered"
        rounded="md"
        sx={{ width: 110 }}
        inputSx={filterInputSx}
      />
    </div>
    <AppButton
      type="button"
      variant="contained"
      colorVariant="success"
      rounded="md"
      size="small"
      startIcon={<FiPlus />}
      onClick={() => handleAction("add_group")}
      sx={addButtonSx}
    >
      Add Group
    </AppButton>
  </div>
);

// Pagination footer component
const TableFooter = ({ total, count, type }) => (
  <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
    <AppText variant="body2" sx={footerTextSx}>
      Showing 1 to {count} of {total} {type}
    </AppText>

    <AppStack direction="row" align="center" gap={1}>
      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        size="small"
        endIcon={<FiChevronRight className="rotate-90" />}
        sx={pageSizeButtonSx}
      >
        10 / page
      </AppButton>

      <AppIconButton
        icon={<FiChevronLeft />}
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        disabled
      />

      <span className="flex h-[31px] min-w-[31px] items-center justify-center rounded-md bg-primary px-2 text-[12px] font-bold text-text-inverse">
        1
      </span>

      <AppIconButton
        icon={<FiChevronRight />}
        variant="outlined"
        colorVariant="neutral"
        size="small"
        rounded="md"
        disabled
      />
    </AppStack>
  </div>
);

const ChartOfAccountsDesktopPage = ({
  isLoading = false,
  stats = [],
  accountGroups = [],
  accounts = [],
  summary = {},
  handleRefresh,
  handleAction,
  handleBackToFinance,
}) => {
  const navigate = useNavigate();
  // Define columns for Account Groups Table
  const groupColumns = [
    {
      id: "name",
      key: "name",
      label: "Group Name",
      minWidth: 180,
      render: (_, row) => (
        <AppStack direction="row" align="center" gap={0.5}>
          <FiChevronRight className="text-text-muted text-[13px]" />
          <AppText variant="body2" sx={rowNameBoldSx}>
            {row.name}
          </AppText>
        </AppStack>
      ),
    },
    {
      id: "code",
      key: "code",
      label: "Group Code",
      minWidth: 110,
      render: (_, row) => (
        <AppText variant="body2" sx={rowTextMutedSx}>
          {row.code}
        </AppText>
      ),
    },
    {
      id: "level",
      key: "level",
      label: "Level",
      minWidth: 80,
      render: (_, row) => (
        <AppText variant="body2" sx={rowTextSx}>
          {row.level}
        </AppText>
      ),
    },
    {
      id: "underGroup",
      key: "underGroup",
      label: "Under Group",
      minWidth: 120,
      render: (_, row) => (
        <AppText variant="body2" sx={rowTextMutedSx}>
          {row.underGroup}
        </AppText>
      ),
    },
    {
      id: "accountsCount",
      key: "accountsCount",
      label: "Accounts",
      minWidth: 90,
      render: (_, row) => (
        <AppText variant="body2" sx={rowTextSx}>
          {row.accountsCount}
        </AppText>
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      minWidth: 100,
      render: (_, row) => (
        <AppStatusBadge
          status={row.status}
          label={row.status}
          variant="soft"
          size="small"
          rounded="md"
          colorVariant={statusColorMap[row.status] || "neutral"}
          sx={statusBadgeSx}
        />
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 90,
      render: (_, row) => (
        <AppStack direction="row" align="center" justify="flex-end" gap={0.5}>
          <AppIconButton
            icon={<FiEye />}
            variant="text"
            colorVariant="neutral"
            size="small"
            rounded="md"
            onClick={() => handleAction(`view_group_${row._id}`)}
          />
        </AppStack>
      ),
    },
  ];

  // Define columns for Accounts Table
  const accountColumns = [
    {
      id: "name",
      key: "name",
      label: "Account Name",
      minWidth: 180,
      render: (_, row) => (
        <AppText variant="body2" sx={rowNameBoldSx}>
          {row.name}
        </AppText>
      ),
    },
    {
      id: "code",
      key: "code",
      label: "Account Code",
      minWidth: 100,
      render: (_, row) => (
        <AppText variant="body2" sx={rowTextMutedSx}>
          {row.code}
        </AppText>
      ),
    },
    {
      id: "underGroup",
      key: "underGroup",
      label: "Account Group",
      minWidth: 140,
      render: (_, row) => (
        <AppText variant="body2" sx={rowTextSx}>
          {row.underGroup}
        </AppText>
      ),
    },
    {
      id: "type",
      key: "type",
      label: "Account Type",
      minWidth: 120,
      render: (_, row) => (
        <AppTag
          label={row.type}
          variant="soft"
          colorVariant={typeColorMap[row.type] || "primary"}
          rounded="md"
          sx={tagSx}
        />
      ),
    },
    {
      id: "nature",
      key: "nature",
      label: "Nature",
      minWidth: 100,
      render: (_, row) => (
        <AppTag
          label={row.nature}
          variant="soft"
          colorVariant={row.nature === "Debit" ? "success" : "purple"}
          rounded="md"
          sx={tagSx}
        />
      ),
    },
    {
      id: "status",
      key: "status",
      label: "Status",
      minWidth: 100,
      render: (_, row) => (
        <AppStatusBadge
          status={row.status}
          label={row.status}
          variant="soft"
          size="small"
          rounded="md"
          colorVariant={statusColorMap[row.status] || "neutral"}
          sx={statusBadgeSx}
        />
      ),
    },
    {
      id: "actions",
      key: "actions",
      label: "Actions",
      align: "right",
      width: 90,
      render: (_, row) => (
        <AppStack direction="row" align="center" justify="flex-end" gap={0.5}>
          <AppIconButton
            icon={<FiEye />}
            variant="text"
            colorVariant="neutral"
            size="small"
            rounded="md"
            onClick={() => handleAction(`view_account_${row._id}`)}
          />
        </AppStack>
      ),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Chart Of Accounts"
          subtitle="Manage your account groups and chart of accounts."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting", onClick: handleBackToFinance },
                { label: "Chart Of Accounts", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          actions={
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiRefreshCw />}
              onClick={handleRefresh}
              loading={isLoading}
              disabled={isLoading}
              sx={secondaryButtonSx}
            >
              Refresh
            </AppButton>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Layout split: Left tables/stats, Right side-cards */}
        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_290px] gap-5">
          <div className="space-y-5">
            {/* 4 Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <AppCard
                  key={stat.id}
                  variant="default"
                  rounded="xl"
                  bordered
                  shadow="sm"
                  padding="none"
                  sx={statCardSx}
                >
                  <AppStack direction="row" align="center" gap={1.5} sx={{ width: "100%" }}>
                    <AppBox
                      sx={{
                        ...statIconFrameSx,
                        bgcolor: `var(--app-color-${stat.colorVariant}-soft)`,
                        color: `var(--app-color-${stat.colorVariant})`,
                      }}
                    >
                      {statIcons[stat.id] || <FiLayers />}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0, flex: 1 }}>
                      <AppText variant="body2" sx={statTitleSx}>
                        {stat.title}
                      </AppText>
                      <AppHeading level={3} weight={600} sx={statValueSx}>
                        {stat.value}
                      </AppHeading>
                      <AppText variant="body2" sx={statDescSx}>
                        {stat.description}
                      </AppText>
                    </AppBox>
                  </AppStack>
                </AppCard>
              ))}
            </div>

            {/* Account Groups Table Card */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={tableCardSx}
            >
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <AppHeading level={2} weight={700} sx={cardTitleSx}>
                    Account Groups (Top 5 Levels)
                  </AppHeading>
                  <AppText variant="body2" sx={cardSubtitleSx}>
                    View and manage account groups
                  </AppText>
                </div>
                <AppButton
                  variant="text"
                  colorVariant="primary"
                  size="small"
                  endIcon={<FiArrowRight />}
                  onClick={() => navigate(ROUTES.ACCOUNT_GROUPS)}
                  sx={cardHeaderLinkSx}
                >
                  View All Groups
                </AppButton>
              </div>

              <AppTable
                columns={groupColumns}
                rows={accountGroups}
                getRowId={(row) => row._id}
                dense
                bordered={false}
                rounded={false}
                hover
                sx={tableSx}
                headSx={tableHeadSx}
                cellSx={tableCellSx}
              />

              <div className="px-5 py-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ACCOUNT_GROUPS)}
                  className="text-[12px] font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  View all account groups <FiArrowRight className="text-[13px]" />
                </button>
              </div>
            </AppCard>

            {/* Accounts Table Card */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={tableCardSx}
            >
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <AppHeading level={2} weight={700} sx={cardTitleSx}>
                    Accounts
                  </AppHeading>
                  <AppText variant="body2" sx={cardSubtitleSx}>
                    View and manage chart of accounts
                  </AppText>
                </div>
                <AppButton
                  variant="text"
                  colorVariant="primary"
                  size="small"
                  endIcon={<FiArrowRight />}
                  onClick={() => navigate(ROUTES.ACCOUNTS)}
                  sx={cardHeaderLinkSx}
                >
                  View All Accounts
                </AppButton>
              </div>

              <AppTable
                columns={accountColumns}
                rows={accounts}
                getRowId={(row) => row._id}
                dense
                bordered={false}
                rounded={false}
                hover
                sx={tableSx}
                headSx={tableHeadSx}
                cellSx={tableCellSx}
              />

              <div className="px-5 py-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ACCOUNTS)}
                  className="text-[12px] font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  View all accounts <FiArrowRight className="text-[13px]" />
                </button>
              </div>
            </AppCard>
          </div>

          {/* Right Sidebar columns */}
          <div className="space-y-4">
            {/* Summary details */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={sideCardSx}
            >
              <div className="px-4 py-3.5 border-b border-border">
                <AppHeading level={3} weight={700} sx={sideCardTitleSx}>
                  Chart Of Accounts Summary
                </AppHeading>
              </div>
              <div className="p-4 space-y-3.5">
                <div className="flex justify-between items-center text-[12.5px]">
                  <span className="text-text-muted font-medium">Total Accounts</span>
                  <span className="font-bold text-text">{summary.totalAccounts}</span>
                </div>
                <div className="flex justify-between items-center text-[12.5px]">
                  <span className="text-text-muted font-medium">Active Accounts</span>
                  <span className="font-bold text-success">{summary.activeAccounts}</span>
                </div>
                <div className="flex justify-between items-center text-[12.5px]">
                  <span className="text-text-muted font-medium">Inactive Accounts</span>
                  <span className="font-bold text-text-muted">{summary.inactiveAccounts}</span>
                </div>
                <div className="my-2 h-[1px] bg-divider" />
                <div className="flex justify-between items-center text-[12.5px]">
                  <span className="text-text-muted font-medium">Total Groups</span>
                  <span className="font-bold text-text">{summary.totalGroups}</span>
                </div>
                <div className="flex justify-between items-center text-[12.5px]">
                  <span className="text-text-muted font-medium">Root Groups</span>
                  <span className="font-bold text-text">{summary.rootGroups}</span>
                </div>
                <div className="my-2 h-[1px] bg-divider" />
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-text-muted">Last Updated</span>
                  <span className="text-text font-semibold">{summary.lastUpdated}</span>
                </div>
              </div>
            </AppCard>

            {/* Quick Actions */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={sideCardSx}
            >
              <div className="px-4 py-3.5 border-b border-border">
                <AppHeading level={3} weight={700} sx={sideCardTitleSx}>
                  Quick Actions
                </AppHeading>
              </div>
              <div className="p-2 space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleAction("add_group")}
                  className="w-full text-left flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-hover transition text-[11.5px] font-medium text-text"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-success-soft text-success text-[12px] shrink-0">
                    <FiPlus />
                  </span>
                  Add Account Group
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("add_account")}
                  className="w-full text-left flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-hover transition text-[11.5px] font-medium text-text"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-info-soft text-info text-[12px] shrink-0">
                    <FiPlus />
                  </span>
                  Add Account
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("import")}
                  className="w-full text-left flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-hover transition text-[11.5px] font-medium text-text"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-primary-soft text-primary text-[12px] shrink-0">
                    <FiUpload />
                  </span>
                  Import Accounts
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("export")}
                  className="w-full text-left flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-hover transition text-[11.5px] font-medium text-text"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-primary-soft text-primary text-[12px] shrink-0">
                    <FiDownload />
                  </span>
                  Export Chart Of Accounts
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("hierarchy_report")}
                  className="w-full text-left flex items-center gap-2 p-1.5 rounded-md hover:bg-surface-hover transition text-[11.5px] font-medium text-text"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-soft text-purple text-[12px] shrink-0">
                    <FiBookOpen />
                  </span>
                  Account Hierarchy Report
                </button>
              </div>
            </AppCard>

            {/* Help support card */}
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="none"
              sx={sideCardSx}
            >
              <div className="p-4">
                <AppHeading level={3} weight={700} sx={sideCardTitleSx}>
                  Help & Support
                </AppHeading>
                <AppText variant="body2" sx={helpDescSx}>
                  Learn more about Chart of Accounts and how to manage your financial structure.
                </AppText>
                <button
                  type="button"
                  className="mt-3.5 text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  View User Guide <FiExternalLink className="text-[12px]" />
                </button>
              </div>
            </AppCard>
          </div>
        </div>

        {/* Bottom illustration banner */}
        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="none"
          padding="none"
          sx={bannerCardSx}
        >
          <div className="flex items-center justify-between w-full p-4 md:p-5">
            {/* Column 1: Icon and Text */}
            <div className="flex items-center gap-4">
              <AppBox sx={bannerIconBoxSx}>
                <FiLayers className="text-[18px]" />
              </AppBox>
              <div>
                <AppHeading level={2} weight={600} sx={bannerTitleSx}>
                  Organize your financial data
                </AppHeading>
                <AppText variant="body2" sx={bannerDescSx}>
                  Use account groups to structure your chart of accounts in a hierarchical way. This helps in better reporting and financial analysis.
                </AppText>
              </div>
            </div>

            {/* Column 2: SVG illustration */}
            <AppBox sx={bannerIllustrationSx}>
              <ChartIllustration />
            </AppBox>
          </div>
        </AppCard>
      </div>
    </section>
  );
};

// Inline SVG Illustration specifically for Chart of Accounts
const ChartIllustration = () => (
  <svg
    width="90"
    height="60"
    viewBox="0 0 110 75"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-95 transition-transform duration-300 hover:scale-105"
  >
    {/* Background soft glow */}
    <circle cx="55" cy="37" r="30" fill="var(--app-color-success-soft)" opacity="0.6" />

    {/* Root block */}
    <rect x="42" y="10" width="26" height="14" rx="2" fill="var(--app-color-primary)" stroke="var(--app-color-surface)" strokeWidth="1.5" />
    <rect x="47" y="15" width="16" height="2" rx="0.5" fill="var(--app-color-surface)" opacity="0.8" />

    {/* Connection lines */}
    <path d="M55 24V40M30 40H80M30 40V48M80 40V48" stroke="var(--app-color-border)" strokeWidth="1.5" />

    {/* Child block 1 */}
    <rect x="17" y="48" width="26" height="14" rx="2" fill="var(--app-color-success)" stroke="var(--app-color-surface)" strokeWidth="1.5" />
    <rect x="22" y="53" width="16" height="2" rx="0.5" fill="var(--app-color-surface)" opacity="0.8" />

    {/* Child block 2 */}
    <rect x="67" y="48" width="26" height="14" rx="2" fill="var(--app-color-info)" stroke="var(--app-color-surface)" strokeWidth="1.5" />
    <rect x="72" y="53" width="16" height="2" rx="0.5" fill="var(--app-color-surface)" opacity="0.8" />
  </svg>
);

// Styled token dictionaries
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageHeaderSx = {
  width: "100%",
};

const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "23px",
    lineHeight: 1.15,
    letterSpacing: "-0.4px",
    color: "var(--app-color-text)",
  },
};

const secondaryButtonSx = {
  height: 34,
  minWidth: 100,
  px: 1.25,
  fontSize: "11.5px",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const tabsContainerSx = {
  display: "flex",
  gap: 1,
  borderBottom: "1px solid var(--app-color-border)",
  mt: 2,
};

const statCardSx = {
  p: 1.5,
  py: 3,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const statIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 38,
  height: 38,
  borderRadius: "10px",
  fontSize: "16px",
  flexShrink: 0,
};

const statTitleSx = {
  m: 0,
  fontSize: "10.5px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
};

const statValueSx = {
  m: 0,
  fontSize: "14.5px",
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const statDescSx = {
  m: 0,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
};

const tableCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const cardTitleSx = {
  m: 0,
  fontSize: "15px",
  color: "var(--app-color-text)",
};

const cardSubtitleSx = {
  mt: 0.25,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const cardHeaderLinkSx = {
  fontSize: "12px",
  fontWeight: 700,
};

const tableSx = {
  "& .MuiTableContainer-root": {
    borderRadius: 0,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": { display: "none" },
  },
};

const tableHeadSx = {
  bgcolor: "var(--app-color-surface-alt)",
  "& .MuiTableCell-root": {
    fontSize: "11.2px",
    fontWeight: 750,
    color: "var(--app-color-text-muted)",
    textTransform: "uppercase",
    py: 1.5,
    px: 2.5,
    borderBottom: "1px solid var(--app-color-border)",
  },
};

const tableCellSx = {
  "& .MuiTableCell-root": {
    fontSize: "12.5px",
    color: "var(--app-color-text)",
    py: 1.5,
    px: 2.5,
    borderBottom: "1px solid var(--app-color-border)",
  },
};

const rowNameBoldSx = {
  m: 0,
  fontWeight: 650,
  color: "var(--app-color-text)",
  fontSize: "12.5px",
};

const rowTextSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-text)",
};

const rowTextMutedSx = {
  m: 0,
  fontSize: "12.5px",
  color: "var(--app-color-text-muted)",
};

const tagSx = {
  height: 22,
  px: 1,
  fontSize: "10px",
  fontWeight: 700,
};

const statusBadgeSx = {
  height: 22,
  px: 1.5,
  fontSize: "10px",
  fontWeight: 700,
  textTransform: "capitalize",
};

const sideCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const sideCardTitleSx = {
  m: 0,
  fontSize: "13px",
  color: "var(--app-color-text)",
};

const helpDescSx = {
  mt: 1.25,
  fontSize: "12px",
  lineHeight: "18px",
  color: "var(--app-color-text-muted)",
};

const bannerCardSx = {
  mt: 6,
  bgcolor: "var(--app-color-info-soft)",
  borderColor: "color-mix(in srgb, var(--app-color-info) 15%, transparent)",
};

const bannerIconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: "10px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-info)",
  boxShadow: "var(--app-shadow-xs)",
  flexShrink: 0,
};

const bannerTitleSx = {
  m: 0,
  fontSize: "13.5px",
  color: "var(--app-color-info)",
};

const bannerDescSx = {
  mt: 0.35,
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
};

const bannerIllustrationSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const filterInputSx = {
  height: 36,
  fontSize: "12px",
  bgcolor: "var(--app-color-surface)",
};

const filterButtonSx = {
  height: 36,
  px: 1.25,
  fontSize: "12px",
  fontWeight: 650,
  whiteSpace: "nowrap",
};

const addButtonSx = {
  height: 36,
  px: 1.5,
  fontSize: "12.5px",
  fontWeight: 700,
  bgcolor: "var(--app-color-success)",
  color: "var(--app-color-surface)",
  "&:hover": {
    bgcolor: "color-mix(in srgb, var(--app-color-success) 85%, black)",
  },
};

const footerTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const pageSizeButtonSx = {
  height: 34,
  minWidth: 100,
  px: 1.2,
  fontSize: "12px",
  fontWeight: 600,
};

export default ChartOfAccountsDesktopPage;
