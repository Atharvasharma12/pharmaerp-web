import React from "react";
import {
  FiArrowRight,
  FiBookOpen,
  FiCalendar,
  FiFileText,
  FiGitBranch,
  FiRefreshCw,
  FiRepeat,
  FiArrowDownCircle,
  FiArrowUpCircle,
  FiBarChart2,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { LuScale, LuBuilding2 } from "react-icons/lu";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";

// Map statistics to icons
const statIcons = {
  totalAccounts: <FaRupeeSign />,
  ledgerAccounts: <FiBookOpen />,
  openingBalance: <LuScale />,
  currentPeriod: <FiCalendar />,
};

// Map modules to icons
const moduleIcons = {
  chartOfAccounts: <FiGitBranch />,
  ledgerAccounts: <FiBookOpen />,
  openingBalances: <LuScale />,
  financialPeriods: <FiCalendar />,
  journalVouchers: <FiFileText />,
  receipts: <FiArrowDownCircle />,
  payments: <FiArrowUpCircle />,
  contraVouchers: <FiRepeat />,
  treasury: <LuBuilding2 />,
  reports: <FiBarChart2 />,
};

const FinanceMobilePage = ({
  stats = [],
  modules = [],
  isLoading = false,
  handleRefresh,
  handleModuleClick,
}) => {
  // Mobile displays the first 4 stats cards (Total Accounts, Ledger Accounts, Opening Balance, Current Period)
  const mobileStats = stats.slice(0, 4);

  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Mobile Page Title Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            gap={1}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Finance & Accounting
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Manage your financial operations, accounts, transactions and reports.
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
            {mobileStats.map((stat) => (
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
                    {statIcons[stat.id] || <LuScale />}
                  </AppBox>
                  <AppBox sx={{ minWidth: 0, flex: 1 }}>
                    <AppText variant="body2" sx={compactStatTitleSx}>
                      {stat.title}
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

        {/* Finance Modules Grid */}
        <AppBox sx={sectionWrapperSx}>
          <AppHeading level={2} weight={700} sx={sectionTitleSx}>
            Finance Modules
          </AppHeading>
          <AppText variant="body2" sx={sectionSubtitleSx}>
            Access and manage all your finance and accounting modules
          </AppText>

          {/* 2-Column Mobile Grid for Modules */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            {modules.map((mod) => (
              <AppCard
                key={mod.id}
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                onClick={() => handleModuleClick(mod)}
                sx={moduleRowItemCardSx}
              >
                <AppStack
                  direction="row"
                  align="center"
                  justify="space-between"
                  gap={0.5}
                  sx={{ width: "100%" }}
                >
                  <AppStack
                    direction="row"
                    align="center"
                    gap={0.8}
                    sx={{ minWidth: 0, flex: 1 }}
                  >
                    <AppBox
                      sx={{
                        ...moduleIconFrameSx,
                        bgcolor: `var(--app-color-${mod.colorVariant}-soft)`,
                        color: `var(--app-color-${mod.colorVariant})`,
                      }}
                    >
                      {moduleIcons[mod.id] || <LuScale />}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading level={3} weight={600} sx={moduleTitleTextSx}>
                        {mod.title}
                      </AppHeading>
                      <AppText variant="body2" sx={moduleDescTextSx}>
                        {mod.description}
                      </AppText>
                    </AppBox>
                  </AppStack>

                  <FiArrowRight
                    className="text-[11px] shrink-0"
                    style={{ color: `var(--app-color-${mod.colorVariant})` }}
                  />
                </AppStack>
              </AppCard>
            ))}
          </div>
        </AppBox>

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
                  <FiFileText />
                </AppBox>
                <div>
                  <AppHeading level={3} weight={600} sx={bannerTitleSx}>
                    Streamline your financial operations
                  </AppHeading>
                  <AppText variant="body2" sx={bannerDescSx}>
                    Use these modules to manage your accounts, track transactions, and generate reports.
                  </AppText>
                </div>
              </div>

              <AppBox sx={bannerIllustrationSx}>
                <FinanceIllustration />
              </AppBox>
            </div>
          </AppCard>
        </AppBox>
      </AppBox>
    </section>
  );
};

// Premium Mobile Inline SVG Illustration (Compact Version)
const FinanceIllustration = () => (
  <svg
    width="55"
    height="38"
    viewBox="0 0 65 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="22" r="18" fill="var(--app-color-info-soft)" opacity="0.6" />
    <rect
      x="12"
      y="5"
      width="28"
      height="35"
      rx="2"
      fill="var(--app-color-surface)"
      stroke="var(--app-color-border)"
      strokeWidth="1"
    />
    <rect x="17" y="11" width="18" height="2" rx="1" fill="var(--app-color-text-muted)" opacity="0.35" />
    <rect x="17" y="16" width="10" height="2" rx="1" fill="var(--app-color-text-muted)" opacity="0.35" />
    <rect x="17" y="24" width="3" height="10" rx="0.5" fill="var(--app-color-success)" />
    <rect x="22" y="21" width="3" height="13" rx="0.5" fill="var(--app-color-info)" />
    <rect x="27" y="27" width="3" height="7" rx="0.5" fill="var(--app-color-warning)" />

    <rect
      x="36"
      y="20"
      width="18"
      height="22"
      rx="2.5"
      fill="var(--app-color-primary)"
      stroke="var(--app-color-surface)"
      strokeWidth="1"
    />
    <rect x="39" y="23" width="12" height="4" rx="0.8" fill="var(--app-color-surface)" opacity="0.95" />
    <circle cx="41" cy="30" r="1" fill="var(--app-color-surface)" />
    <circle cx="45" cy="30" r="1" fill="var(--app-color-surface)" />
    <circle cx="49" cy="30" r="1" fill="var(--app-color-surface)" />
    <circle cx="41" cy="34" r="1" fill="var(--app-color-surface)" />
    <circle cx="45" cy="34" r="1" fill="var(--app-color-surface)" />
    <circle cx="49" cy="34" r="1" fill="var(--app-color-surface)" />
    <circle cx="41" cy="38" r="1" fill="var(--app-color-surface)" />
    <circle cx="45" cy="38" r="1" fill="var(--app-color-surface)" />
    <circle cx="49" cy="38" r="1" fill="var(--app-color-surface)" />
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

const sectionWrapperSx = {
  px: 0.5,
  pb: 1.5,
};

const sectionTitleSx = {
  m: 0,
  fontSize: "13.5px",
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.05,
  fontSize: "10.8px",
  color: "var(--app-color-text-muted)",
};

const moduleRowItemCardSx = {
  py: 1.25,
  px: 0.85,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  minHeight: 60,
  transition: "background-color 0.1s ease",
  "&:active": {
    bgcolor: "var(--app-color-surface-hover)",
  },
};

const moduleIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "6px",
  fontSize: "13px",
  flexShrink: 0,
};

const moduleTitleTextSx = {
  m: 0,
  fontSize: "11px",
  fontWeight: 600,
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const moduleDescTextSx = {
  mt: 0.1,
  fontSize: "9px",
  lineHeight: "12px",
  color: "var(--app-color-text-muted)",
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

export default FinanceMobilePage;
