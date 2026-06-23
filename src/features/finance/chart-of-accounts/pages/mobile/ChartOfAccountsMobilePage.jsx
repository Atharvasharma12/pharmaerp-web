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
  FiChevronRight,
  FiMoreHorizontal,
  FiEye,
  FiFilter,
  FiPlus,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppSearchInput,
  AppSelect,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
} from "@/components";

// Map statistics to icons
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

const ChartOfAccountsMobilePage = ({
  isLoading = false,
  stats = [],
  accountGroups = [],
  accounts = [],
  handleRefresh,
  handleAction,
}) => {
  const navigate = useNavigate();
  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Mobile Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Chart Of Accounts
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Manage your account groups and chart of accounts.
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

        {/* 2x2 High-Density Stats Grid */}
        <AppBox sx={statsGridWrapperSx}>
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <AppCard
                key={stat.id}
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={compactStatCardSx}
              >
                <AppStack direction="row" align="center" gap={0.85} sx={{ width: "100%" }}>
                  <AppBox
                    sx={{
                      ...compactStatIconSx,
                      bgcolor: `var(--app-color-${stat.colorVariant}-soft)`,
                      color: `var(--app-color-${stat.colorVariant})`,
                    }}
                  >
                    {statIcons[stat.id] || <FiLayers />}
                  </AppBox>
                  <AppBox sx={{ minWidth: 0, flex: 1 }}>
                    <AppText variant="body2" sx={compactStatTitleSx}>
                      {stat.title.split(" ").slice(1).join(" ") || stat.title}
                    </AppText>
                    <AppHeading level={3} weight={600} sx={compactStatValueSx}>
                      {stat.value}
                    </AppHeading>
                    <AppText variant="body2" sx={compactStatDescSx}>
                      {stat.description}
                    </AppText>
                  </AppBox>
                </AppStack>
              </AppCard>
            ))}
          </div>
        </AppBox>

        {/* Tables Section */}
        <div className="space-y-4 px-1.5 pb-4">
          {/* Account Groups Table Card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={tableCardSx}
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div>
                <AppHeading level={2} weight={700} sx={cardTitleSx}>
                  Account Groups (Top 5 Levels)
                </AppHeading>
                <AppText variant="body2" sx={cardSubtitleSx}>
                  View and manage account groups
                </AppText>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.ACCOUNT_GROUPS)}
                className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline"
              >
                View All <FiArrowRight />
              </button>
            </div>

            {/* Scrollable Compact Table */}
            <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="min-w-[500px] w-full border-collapse text-left text-[11px] font-medium text-text">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/50 text-[9.5px] font-bold text-text-muted uppercase">
                    <th className="py-2 px-3">Group Name</th>
                    <th className="py-2 px-2">Group Code</th>
                    <th className="py-2 px-2">Level</th>
                    <th className="py-2 px-2">Accounts</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {accountGroups.map((row) => (
                    <tr key={row._id} className="hover:bg-surface-hover/30 transition">
                      <td className="py-2 px-3 font-semibold text-text">
                        <span className="inline-flex items-center gap-0.5">
                          <FiChevronRight className="text-text-muted text-[10px]" />
                          {row.name}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-text-muted">{row.code}</td>
                      <td className="py-2 px-2 text-text">{row.level}</td>
                      <td className="py-2 px-2 text-text">{row.accountsCount}</td>
                      <td className="py-2 px-2">
                        <AppStatusBadge
                          status={row.status}
                          label={row.status}
                          variant="soft"
                          size="small"
                          rounded="sm"
                          colorVariant={statusColorMap[row.status] || "neutral"}
                          sx={tableStatusBadgeSx}
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex justify-end gap-1">
                          <AppIconButton
                            icon={<FiEye />}
                            variant="text"
                            colorVariant="neutral"
                            size="small"
                            rounded="md"
                            sx={{ p: 0, height: 22, width: 22, minWidth: 22 }}
                            onClick={() => handleAction(`view_group_${row._id}`)}
                          />
                          <AppIconButton
                            icon={<FiMoreHorizontal />}
                            variant="text"
                            colorVariant="neutral"
                            size="small"
                            rounded="md"
                            sx={{ p: 0, height: 22, width: 22, minWidth: 22 }}
                            onClick={() => handleAction(`menu_group_${row._id}`)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-border">
              <button
                type="button"
                onClick={() => navigate(ROUTES.ACCOUNT_GROUPS)}
                className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline"
              >
                View all account groups <FiArrowRight />
              </button>
            </div>
          </AppCard>

          {/* Accounts Table Card */}
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={tableCardSx}
          >
            <div className="p-3 border-b border-border flex items-center justify-between">
              <div>
                <AppHeading level={2} weight={700} sx={cardTitleSx}>
                  Accounts
                </AppHeading>
                <AppText variant="body2" sx={cardSubtitleSx}>
                  View and manage chart of accounts
                </AppText>
              </div>
              <button
                type="button"
                onClick={() => navigate(ROUTES.ACCOUNTS)}
                className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline"
              >
                View All <FiArrowRight />
              </button>
            </div>

            {/* Scrollable Compact Table */}
            <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="min-w-[580px] w-full border-collapse text-left text-[11px] font-medium text-text">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/50 text-[9.5px] font-bold text-text-muted uppercase">
                    <th className="py-2 px-3">Account Name</th>
                    <th className="py-2 px-2">Account Code</th>
                    <th className="py-2 px-2">Account Type</th>
                    <th className="py-2 px-2">Nature</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {accounts.map((row) => (
                    <tr key={row._id} className="hover:bg-surface-hover/30 transition">
                      <td className="py-2 px-3 font-semibold text-text">{row.name}</td>
                      <td className="py-2 px-2 text-text-muted">{row.code}</td>
                      <td className="py-2 px-2">
                        <AppTag
                          label={row.type}
                          variant="soft"
                          colorVariant={typeColorMap[row.type] || "primary"}
                          rounded="sm"
                          sx={tableTagSx}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <AppTag
                          label={row.nature}
                          variant="soft"
                          colorVariant={row.nature === "Debit" ? "success" : "purple"}
                          rounded="sm"
                          sx={tableTagSx}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <AppStatusBadge
                          status={row.status}
                          label={row.status}
                          variant="soft"
                          size="small"
                          rounded="sm"
                          colorVariant={statusColorMap[row.status] || "neutral"}
                          sx={tableStatusBadgeSx}
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <div className="flex justify-end gap-1">
                          <AppIconButton
                            icon={<FiEye />}
                            variant="text"
                            colorVariant="neutral"
                            size="small"
                            rounded="md"
                            sx={{ p: 0, height: 22, width: 22, minWidth: 22 }}
                            onClick={() => handleAction(`view_account_${row._id}`)}
                          />
                          <AppIconButton
                            icon={<FiMoreHorizontal />}
                            variant="text"
                            colorVariant="neutral"
                            size="small"
                            rounded="md"
                            sx={{ p: 0, height: 22, width: 22, minWidth: 22 }}
                            onClick={() => handleAction(`menu_account_${row._id}`)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-border">
              <button
                type="button"
                onClick={() => navigate(ROUTES.ACCOUNTS)}
                className="text-[10px] font-bold text-primary flex items-center gap-0.5 hover:underline"
              >
                View all accounts <FiArrowRight />
              </button>
            </div>
          </AppCard>
        </div>

        {/* Bottom Banner */}
        <AppBox sx={bannerWrapperSx}>
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="none"
            sx={bannerCardSx}
          >
            <div className="flex items-center justify-between w-full p-3">
              <div className="flex items-center gap-3">
                <AppBox sx={bannerIconBoxSx}>
                  <FiLayers />
                </AppBox>
                <div>
                  <AppHeading level={3} weight={600} sx={bannerTitleSx}>
                    Organize your financial data
                  </AppHeading>
                  <AppText variant="body2" sx={bannerDescSx}>
                    Use account groups to structure your chart of accounts in a hierarchical way.
                  </AppText>
                </div>
              </div>

              <AppBox sx={bannerIllustrationSx}>
                <ChartIllustration />
              </AppBox>
            </div>
          </AppCard>
        </AppBox>
      </AppBox>
    </section>
  );
};

// Inline SVG Illustration specifically for Chart of Accounts (Compact Mobile Version)
const ChartIllustration = () => (
  <svg
    width="55"
    height="38"
    viewBox="0 0 65 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="22" r="18" fill="var(--app-color-success-soft)" opacity="0.6" />
    <rect x="25" y="6" width="16" height="9" rx="1.5" fill="var(--app-color-primary)" stroke="var(--app-color-surface)" strokeWidth="0.8" />
    <path d="M33 15v10M18 25h30M18 25v5M48 25v5" stroke="var(--app-color-border)" strokeWidth="0.8" />
    <rect x="10" y="30" width="16" height="9" rx="1.5" fill="var(--app-color-success)" stroke="var(--app-color-surface)" strokeWidth="0.8" />
    <rect x="40" y="30" width="16" height="9" rx="1.5" fill="var(--app-color-info)" stroke="var(--app-color-surface)" strokeWidth="0.8" />
  </svg>
);

// Layout style configuration (MUI box sx mapping)
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
  fontSize: "18.5px",
  lineHeight: 1.15,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const tabsContainerSx = {
  display: "flex",
  gap: 0.5,
  borderBottom: "1px solid var(--app-color-border)",
  mx: 0.5,
  mb: 1.5,
};

const statsGridWrapperSx = {
  px: 0.5,
  pb: 1.25,
};

const compactStatCardSx = {
  p: 1,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};

const compactStatIconSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "50%",
  fontSize: "13px",
  flexShrink: 0,
};

const compactStatTitleSx = {
  m: 0,
  fontSize: "9.2px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
};

const compactStatValueSx = {
  m: 0,
  fontSize: "11.5px",
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const compactStatDescSx = {
  m: 0,
  fontSize: "8.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const tableCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const cardTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

const cardSubtitleSx = {
  mt: 0.1,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

const tableTagSx = {
  height: 18,
  px: 0.8,
  fontSize: "8.5px",
  fontWeight: 700,
};

const tableStatusBadgeSx = {
  height: 18,
  px: 1.1,
  fontSize: "8.5px",
  fontWeight: 700,
  textTransform: "capitalize",
};

const bannerWrapperSx = {
  px: 0.5,
  pb: 1.5,
};

const bannerCardSx = {
  bgcolor: "var(--app-color-info-soft)",
  borderColor: "color-mix(in srgb, var(--app-color-info) 10%, transparent)",
  boxShadow: "none",
};

const bannerIconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 30,
  height: 30,
  borderRadius: "8px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-info)",
  fontSize: "14px",
  flexShrink: 0,
};

const bannerTitleSx = {
  m: 0,
  fontSize: "11.2px",
  fontWeight: 600,
  color: "var(--app-color-info)",
};

const bannerDescSx = {
  mt: 0.1,
  fontSize: "9.2px",
  lineHeight: "12px",
  color: "var(--app-color-text-muted)",
};

const bannerIllustrationSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11px",
  bgcolor: "var(--app-color-surface)",
};

const compactAddBtnSx = {
  height: 28,
  width: 28,
  minWidth: 28,
  p: 0,
  bgcolor: "var(--app-color-success)",
  color: "var(--app-color-surface)",
  "& svg": { fontSize: "14px" },
  "&:hover": {
    bgcolor: "color-mix(in srgb, var(--app-color-success) 85%, black)",
  },
};

export default ChartOfAccountsMobilePage;
