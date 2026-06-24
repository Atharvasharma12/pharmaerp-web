import React from "react";
import {
  FiArrowRight,
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
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppStack,
  AppText,
  PageHeader,
} from "@/components";

// Map statistic IDs to react-icons
const statIcons = {
  totalAccounts: <FaRupeeSign />,
  openingBalance: <LuScale />,
  currentPeriod: <FiCalendar />,
  totalTransactions: <FiFileText />,
};

// Map module IDs to react-icons
const moduleIcons = {
  chartOfAccounts: <FiGitBranch />,
  openingBalances: <LuScale />,
  financialPeriods: <FiCalendar />,
  journalVouchers: <FiFileText />,
  receipts: <FiArrowDownCircle />,
  payments: <FiArrowUpCircle />,
  contraVouchers: <FiRepeat />,
  treasury: <LuBuilding2 />,
  reports: <FiBarChart2 />,
};

const FinanceDesktopPage = ({
  stats = [],
  modules = [],
  isLoading = false,
  handleRefresh,
  handleModuleClick,
}) => {
  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Finance & Accounting"
          subtitle="Manage your financial operations, accounts, transactions and reports."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting", current: true },
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

        {/* Top Statistics Row */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
              <AppStack
                direction="row"
                align="center"
                gap={1.5}
                sx={{ width: "100%" }}
              >
                <AppBox
                  sx={{
                    ...statIconFrameSx,
                    bgcolor: `var(--app-color-${stat.colorVariant}-soft)`,
                    color: `var(--app-color-${stat.colorVariant})`,
                  }}
                >
                  {statIcons[stat.id] || <LuScale />}
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

        {/* Finance Modules Header */}
        <AppBox sx={{ mt: 5, mb: 3 }}>
          <AppHeading level={2} weight={700} sx={sectionTitleSx}>
            Finance Modules
          </AppHeading>
          <AppText variant="body2" sx={sectionSubtitleSx}>
            Access and manage all your finance and accounting modules
          </AppText>
        </AppBox>

        {/* Finance Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => handleModuleClick(mod)}
              className="block w-full text-left"
            >
              <AppCard
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={moduleCardSx}
              >
                <div className="flex items-center justify-between gap-3 w-full">
                  <AppStack
                    direction="row"
                    align="center"
                    gap={1.5}
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
                      <AppHeading level={3} weight={650} sx={moduleTitleSx}>
                        {mod.title}
                      </AppHeading>
                      <AppText variant="body2" sx={moduleDescSx}>
                        {mod.description}
                      </AppText>
                    </AppBox>
                  </AppStack>

                  <FiArrowRight
                    className="text-[15px] shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{ color: `var(--app-color-${mod.colorVariant})` }}
                  />
                </div>
              </AppCard>
            </button>
          ))}
        </div>

        {/* Bottom Informational Banner */}
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
                <FiFileText className="text-[18px]" />
              </AppBox>
              <div>
                <AppHeading level={2} weight={600} sx={bannerTitleSx}>
                  Streamline your financial operations
                </AppHeading>
                <AppText variant="body2" sx={bannerDescSx}>
                  Use these modules to manage your accounts, track transactions,
                  and generate accurate financial reports.
                </AppText>
              </div>
            </div>

            {/* Column 2: SVG Illustration */}
            <AppBox sx={bannerIllustrationSx}>
              <FinanceIllustration />
            </AppBox>
          </div>
        </AppCard>
      </div>
    </section>
  );
};

// Inline premium custom SVG Illustration component (compact scaled down)
const FinanceIllustration = () => (
  <svg
    width="90"
    height="60"
    viewBox="0 0 110 75"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-95 transition-transform duration-300 hover:scale-105"
  >
    {/* Background Glow */}
    <circle
      cx="55"
      cy="37"
      r="30"
      fill="var(--app-color-info-soft)"
      opacity="0.6"
    />

    {/* Document sheet representation */}
    <rect
      x="20"
      y="8"
      width="46"
      height="58"
      rx="3.5"
      fill="var(--app-color-surface)"
      stroke="var(--app-color-border)"
      strokeWidth="1.5"
    />
    <rect
      x="28"
      y="18"
      width="30"
      height="3.5"
      rx="1.5"
      fill="var(--app-color-text-muted)"
      opacity="0.35"
    />
    <rect
      x="28"
      y="26"
      width="18"
      height="3.5"
      rx="1.5"
      fill="var(--app-color-text-muted)"
      opacity="0.35"
    />

    {/* Small decorative bar chart in document */}
    <rect
      x="28"
      y="40"
      width="5"
      height="14"
      rx="1"
      fill="var(--app-color-success)"
    />
    <rect
      x="36"
      y="35"
      width="5"
      height="19"
      rx="1"
      fill="var(--app-color-info)"
    />
    <rect
      x="44"
      y="44"
      width="5"
      height="10"
      rx="1"
      fill="var(--app-color-warning)"
    />

    {/* Calculator overlapping block */}
    <rect
      x="58"
      y="32"
      width="28"
      height="36"
      rx="4"
      fill="var(--app-color-primary)"
      stroke="var(--app-color-surface)"
      strokeWidth="1.5"
    />
    {/* Calculator screen */}
    <rect
      x="63"
      y="37"
      width="18"
      height="7"
      rx="1.2"
      fill="var(--app-color-surface)"
      opacity="0.95"
    />
    {/* Grid of keys */}
    <rect
      x="63"
      y="48"
      width="4"
      height="4"
      rx="0.8"
      fill="var(--app-color-surface)"
      opacity="0.8"
    />
    <rect
      x="70"
      y="48"
      width="4"
      height="4"
      rx="0.8"
      fill="var(--app-color-surface)"
      opacity="0.8"
    />
    <rect
      x="77"
      y="48"
      width="4"
      height="4"
      rx="0.8"
      fill="var(--app-color-surface)"
      opacity="0.8"
    />
    <rect
      x="63"
      y="54"
      width="4"
      height="4"
      rx="0.8"
      fill="var(--app-color-surface)"
      opacity="0.8"
    />
    <rect
      x="70"
      y="54"
      width="4"
      height="4"
      rx="0.8"
      fill="var(--app-color-surface)"
      opacity="0.8"
    />
    <rect
      x="77"
      y="54"
      width="4"
      height="4"
      rx="0.8"
      fill="var(--app-color-surface)"
      opacity="0.8"
    />
    <rect
      x="63"
      y="60"
      width="4"
      height="4"
      rx="0.8"
      fill="var(--app-color-surface)"
      opacity="0.8"
    />
    <rect
      x="70"
      y="60"
      width="4"
      height="4"
      rx="0.8"
      fill="var(--app-color-surface)"
      opacity="0.8"
    />
    <rect
      x="77"
      y="60"
      width="4"
      height="4"
      rx="0.8"
      fill="var(--app-color-surface)"
      opacity="0.8"
    />
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

const sectionTitleSx = {
  m: 0,
  fontSize: "16.5px",
  color: "var(--app-color-text)",
};

const sectionSubtitleSx = {
  mt: 0.35,
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
};

const moduleCardSx = {
  py: 4,
  px: 2.25,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "all 200ms ease",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  minHeight: 94,
  "&:hover": {
    borderColor: "var(--app-color-primary)",
    boxShadow: "var(--app-shadow-sm)",
    "& svg:last-of-type": {
      transform: "translateX(2px)",
    },
  },
};

const moduleIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: "9px",
  fontSize: "16px",
  flexShrink: 0,
};

const moduleTitleSx = {
  m: 0,
  fontSize: "12.8px",
  color: "var(--app-color-text)",
};

const moduleDescSx = {
  mt: 0.3,
  fontSize: "11px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const bannerCardSx = {
  mt: 5,
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

export default FinanceDesktopPage;
