import React from "react";
import {
  FiArrowRight,
  FiRefreshCw,
  FiRepeat,
  FiFileText,
  FiCreditCard,
  FiTrendingUp,
  FiAlertCircle,
  FiLayers,
  FiArrowDown,
  FiArrowUp,
} from "react-icons/fi";
import { FaRupeeSign, FaWallet, FaUniversity, FaCoins } from "react-icons/fa";
import { LuScale, LuBuilding2, LuWallet, LuTrendingUp, LuQrCode, LuCoins, LuTicket } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
  AppButton,
} from "@/components";

// Map stats to React Icons
const statIcons = {
  totalBankBalance: <LuBuilding2 />,
  totalCashBalance: <LuWallet />,
  totalFundsInTransit: <FiRepeat />,
  todaysTransactions: <LuTrendingUp />,
  unreconciledItems: <FiAlertCircle />,
};

// Map processing flow steps to icons
const flowIcons = {
  moneyMovement: <FaRupeeSign />,
  treasuryTransaction: <FiRepeat />,
  journalVoucher: <FiFileText />,
  ledgerImpact: <FiLayers />,
  accountBalance: <LuScale />,
};

// Map module IDs to React Icons
const moduleIcons = {
  bankAccounts: <LuBuilding2 />,
  cashAccounts: <LuWallet />,
  fundTransfers: <FiRepeat />,
  bankTransactions: <LuBuilding2 />,
  cashTransactions: <LuWallet />,
  chequeManagement: <FiCreditCard />,
  paymentQrUpi: <LuQrCode />,
  cashDenominations: <LuCoins />,
};

// Map quick action IDs to icons
const quickActionIcons = {
  addBankAccount: <LuBuilding2 />,
  addCashAccount: <LuWallet />,
  recordBankTransaction: <LuBuilding2 />,
  recordCashTransaction: <LuWallet />,
  fundTransfer: <FiRepeat />,
  manageCheques: <FiCreditCard />,
  cashDenominations: <LuCoins />,
};

const TreasuryMobilePage = ({
  stats = [],
  processingFlow = [],
  modules = [],
  recentTransactions = [],
  quickActions = [],
  isLoading = false,
  handleRefresh,
  handleModuleClick,
  handleQuickActionClick,
}) => {
  return (
    <section className="w-full bg-bg">
      <AppBox sx={containerSx}>
        {/* Mobile Page Title Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack
            direction="row"
            align="flex-start"
            justify="space-between"
            gap={1}
            sx={{ width: "100%" }}
          >
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Treasury
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Manage your cash, bank, UPI, cheques and all money movements in one place.
              </AppText>
            </AppBox>

            <AppStack direction="row" gap={0.5} align="center" sx={{ shrink: 0 }}>
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
              <AppIconButton
                icon={<MdOutlineDashboard />}
                variant="outlined"
                colorVariant="primary"
                size="small"
                rounded="md"
                sx={actionHeaderIconBtnSx}
              />
            </AppStack>
          </AppStack>
        </AppBox>

        {/* 5 Stats Cards Grid (2-columns for first 4, last spans 2 columns) */}
        <AppBox sx={statsStackWrapperSx}>
          <div className="grid grid-cols-2 gap-2">
            {stats.slice(0, 4).map((stat) => (
              <AppCard
                key={stat.id}
                variant="default"
                rounded="lg"
                bordered
                shadow="none"
                padding="none"
                sx={compactStatCardSx}
              >
                <AppStack direction="row" align="center" gap={1} sx={{ width: "100%" }}>
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
                    <AppHeading level={3} weight={700} sx={compactStatValueSx}>
                      {stat.value}
                    </AppHeading>
                    <AppText variant="body2" sx={compactStatDescSx}>
                      {stat.description}
                    </AppText>
                  </AppBox>
                </AppStack>
              </AppCard>
            ))}
            {stats.slice(4).map((stat) => (
              <div key={stat.id} className="col-span-2">
                <AppCard
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  sx={compactStatCardSx}
                >
                  <AppStack direction="row" align="center" gap={1.25} sx={{ width: "100%" }}>
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
                      <AppHeading level={3} weight={700} sx={compactStatValueSx}>
                        {stat.value}
                      </AppHeading>
                      <AppText variant="body2" sx={compactStatDescSx}>
                        {stat.description}
                      </AppText>
                    </AppBox>
                  </AppStack>
                </AppCard>
              </div>
            ))}
          </div>
        </AppBox>

        {/* Treasury Processing Flow - Mobile Snake Pattern */}
        <AppBox sx={sectionWrapperSx}>
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="sm"
            sx={{ bgcolor: "var(--app-color-surface)" }}
          >
            <AppHeading level={3} weight={700} sx={flowSectionTitleSx}>
              Treasury Processing Flow
            </AppHeading>

            <div className="relative mt-3 flex justify-between gap-4 w-full">
              {/* Column 1 */}
              <div className="flex-1 flex flex-col gap-0">
                {/* Step 1 */}
                <div className="h-[44px] flex items-center">
                  <AppStack direction="row" align="center" gap={1}>
                    <AppBox sx={{ ...flowIconFrameSx, bgcolor: `var(--app-color-${processingFlow[0].colorVariant}-soft)`, color: `var(--app-color-${processingFlow[0].colorVariant})` }}>
                      {flowIcons[processingFlow[0].id]}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading level={5} weight={750} sx={flowStepTitleSx}>
                        {processingFlow[0].title}
                      </AppHeading>
                      <AppText variant="body2" sx={flowStepDescSx}>
                        {processingFlow[0].description}
                      </AppText>
                    </AppBox>
                  </AppStack>
                </div>

                {/* Spacer to match Down Arrow in Col 2 */}
                <div className="h-[24px]" />

                {/* Step 4 */}
                <div className="h-[44px] flex items-center">
                  <AppStack direction="row" align="center" gap={1}>
                    <AppBox sx={{ ...flowIconFrameSx, bgcolor: `var(--app-color-${processingFlow[3].colorVariant}-soft)`, color: `var(--app-color-${processingFlow[3].colorVariant})` }}>
                      {flowIcons[processingFlow[3].id]}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading level={5} weight={750} sx={flowStepTitleSx}>
                        {processingFlow[3].title}
                      </AppHeading>
                      <AppText variant="body2" sx={flowStepDescSx}>
                        {processingFlow[3].description}
                      </AppText>
                    </AppBox>
                  </AppStack>
                </div>

                {/* Centered Down Arrow */}
                <div className="h-[24px] flex items-center justify-center">
                  <FiArrowDown className="text-border-strong text-[14px] opacity-60" />
                </div>

                {/* Step 5 */}
                <div className="h-[44px] flex items-center">
                  <AppStack direction="row" align="center" gap={1}>
                    <AppBox sx={{ ...flowIconFrameSx, bgcolor: `var(--app-color-${processingFlow[4].colorVariant}-soft)`, color: `var(--app-color-${processingFlow[4].colorVariant})` }}>
                      {flowIcons[processingFlow[4].id]}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading level={5} weight={750} sx={flowStepTitleSx}>
                        {processingFlow[4].title}
                      </AppHeading>
                      <AppText variant="body2" sx={flowStepDescSx}>
                        {processingFlow[4].description}
                      </AppText>
                    </AppBox>
                  </AppStack>
                </div>
              </div>

              {/* Column 2 */}
              <div className="flex-1 flex flex-col gap-0">
                {/* Step 2 */}
                <div className="h-[44px] flex items-center">
                  <AppStack direction="row" align="center" gap={1}>
                    <AppBox sx={{ ...flowIconFrameSx, bgcolor: `var(--app-color-${processingFlow[1].colorVariant}-soft)`, color: `var(--app-color-${processingFlow[1].colorVariant})` }}>
                      {flowIcons[processingFlow[1].id]}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading level={5} weight={750} sx={flowStepTitleSx}>
                        {processingFlow[1].title}
                      </AppHeading>
                      <AppText variant="body2" sx={flowStepDescSx}>
                        {processingFlow[1].description}
                      </AppText>
                    </AppBox>
                  </AppStack>
                </div>

                {/* Centered Down Arrow */}
                <div className="h-[24px] flex items-center justify-center">
                  <FiArrowDown className="text-border-strong text-[14px] opacity-60" />
                </div>

                {/* Step 3 */}
                <div className="h-[44px] flex items-center">
                  <AppStack direction="row" align="center" gap={1}>
                    <AppBox sx={{ ...flowIconFrameSx, bgcolor: `var(--app-color-${processingFlow[2].colorVariant}-soft)`, color: `var(--app-color-${processingFlow[2].colorVariant})` }}>
                      {flowIcons[processingFlow[2].id]}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading level={5} weight={750} sx={flowStepTitleSx}>
                        {processingFlow[2].title}
                      </AppHeading>
                      <AppText variant="body2" sx={flowStepDescSx}>
                        {processingFlow[2].description}
                      </AppText>
                    </AppBox>
                  </AppStack>
                </div>

                {/* Spacer to match Down Arrow + Step 5 in Col 1 */}
                <div className="h-[68px]" />
              </div>

              {/* Horizontal connection: Step 1 -> Step 2 */}
              <div className="absolute left-[50%] top-[22px] -translate-x-1/2 -translate-y-1/2 z-10 bg-surface px-1">
                <FiArrowRight className="text-border-strong text-[12px] opacity-60" />
              </div>

              {/* Horizontal connection: Step 3 -> Step 4 */}
              <div className="absolute left-[50%] top-[90px] -translate-x-1/2 -translate-y-1/2 z-10 bg-surface px-1">
                <FiArrowRight className="text-border-strong text-[12px] opacity-60 rotate-180" />
              </div>
            </div>
          </AppCard>
        </AppBox>

        {/* Treasury Modules Grid */}
        <AppBox sx={sectionWrapperSx}>
          <AppHeading level={2} weight={700} sx={sectionTitleSx}>
            Treasury Modules
          </AppHeading>

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
                    gap={0.75}
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
                    <AppBox sx={{ minWidth: 0, flex: 1 }}>
                      <AppHeading level={3} weight={650} sx={moduleTitleTextSx}>
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

        {/* Recent Transactions List */}
        <AppBox sx={sectionWrapperSx}>
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="sm"
            sx={{ bgcolor: "var(--app-color-surface)" }}
          >
            <div className="flex justify-between items-center w-full mb-2">
              <AppHeading level={3} weight={700} sx={bottomHeaderTitleSx}>
                Recent Transactions
              </AppHeading>
              <AppButton
                variant="text"
                colorVariant="success"
                size="small"
                sx={viewAllBtnSx}
              >
                View All
              </AppButton>
            </div>

            <AppStack gap={1.5} sx={{ width: "100%" }}>
              {recentTransactions.map((tx) => (
                <AppStack
                  key={tx.id}
                  direction="row"
                  align="center"
                  justify="space-between"
                  gap={1}
                  sx={transactionRowSx}
                >
                  <AppStack direction="row" align="center" gap={1} sx={{ minWidth: 0, flex: 1 }}>
                    <AppBox
                      sx={{
                        ...txIconFrameSx,
                        bgcolor: `var(--app-color-${tx.colorVariant}-soft)`,
                        color: `var(--app-color-${tx.colorVariant})`,
                      }}
                    >
                      {tx.type === "received" ? <FiTrendingUp /> : <FiRepeat />}
                    </AppBox>
                    <AppBox sx={{ minWidth: 0 }}>
                      <AppHeading level={4} weight={600} sx={txAccountSx}>
                        {tx.account}
                      </AppHeading>
                      <AppText variant="body2" sx={txDescSx}>
                        {tx.description}
                      </AppText>
                    </AppBox>
                  </AppStack>

                  <AppBox sx={{ textAlign: "right", shrink: 0 }}>
                    <AppHeading level={4} weight={700} sx={{
                      ...txAmountSx,
                      color: tx.type === "received" ? "var(--app-color-success)" : "var(--app-color-text)",
                    }}>
                      {tx.type === "received" ? `+ ${tx.amount}` : tx.amount}
                    </AppHeading>
                    <AppText variant="body2" sx={txTimeSx}>
                      {tx.time}
                    </AppText>
                  </AppBox>
                </AppStack>
              ))}
            </AppStack>
          </AppCard>
        </AppBox>

        {/* Quick Actions 2-Column Grid */}
        <AppBox sx={sectionWrapperSx}>
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="none"
            padding="sm"
            sx={{ bgcolor: "var(--app-color-surface)" }}
          >
            <AppHeading level={3} weight={700} sx={{ ...bottomHeaderTitleSx, mb: 2 }}>
              Quick Actions
            </AppHeading>

            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleQuickActionClick(action)}
                  className="block w-full text-left"
                >
                  <AppCard
                    variant="soft"
                    rounded="lg"
                    bordered={false}
                    shadow="none"
                    padding="none"
                    sx={quickActionCardSx}
                  >
                    <div className="flex items-center gap-2.5 w-full pl-3 pr-2 py-1 min-h-[38px]">
                      <AppBox
                        sx={{
                          ...quickIconFrameSx,
                          bgcolor: `var(--app-color-${action.colorVariant}-soft)`,
                          color: `var(--app-color-${action.colorVariant})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {quickActionIcons[action.id] || <LuScale />}
                      </AppBox>
                      <span className="text-[10px] font-semibold text-text leading-none mt-0.5">
                        {action.title}
                      </span>
                    </div>
                  </AppCard>
                </button>
              ))}
            </div>
          </AppCard>
        </AppBox>
      </AppBox>
    </section>
  );
};

// Layout style configuration (MUI box sx mapping)
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: "100%", sm: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 2.25,
  pb: 1.5,
  px: 0,
};

const pageTitleSx = {
  m: 0,
  fontSize: "20px",
  lineHeight: 1.15,
  letterSpacing: "-0.4px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.35,
  fontSize: "11.5px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const statsStackWrapperSx = {
  px: 0,
  pb: 2.25,
};

const compactStatCardSx = {
  p: 1.25,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
};

const compactStatIconSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 38,
  height: 38,
  borderRadius: "10px",
  fontSize: "16px",
  flexShrink: 0,
};

const compactStatTitleSx = {
  m: 0,
  fontSize: "10px",
  fontWeight: 500,
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
};

const compactStatValueSx = {
  m: 0,
  fontSize: "14.5px",
  color: "var(--app-color-text)",
  lineHeight: 1.2,
  mt: 0.15,
};

const compactStatDescSx = {
  m: 0,
  fontSize: "9.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  mt: 0.15,
};

const sectionWrapperSx = {
  px: 0,
  pb: 2.25,
};

const sectionTitleSx = {
  m: 0,
  fontSize: "14px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const flowSectionTitleSx = {
  m: 0,
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const flowIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  borderRadius: "50%",
  fontSize: "13px",
  flexShrink: 0,
};

const flowStepTitleSx = {
  m: 0,
  fontSize: "9px",
  color: "var(--app-color-text)",
  fontWeight: 700,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
};

const flowStepDescSx = {
  m: 0,
  fontSize: "7.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  mt: 0.1,
  whiteSpace: "nowrap",
};

const moduleRowItemCardSx = {
  py: 1.5,
  px: 1.25,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  minHeight: 74,
  transition: "all 0.18s ease",
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
  borderRadius: "7px",
  fontSize: "13px",
  flexShrink: 0,
};

const moduleTitleTextSx = {
  m: 0,
  fontSize: "11px",
  fontWeight: 650,
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const moduleDescTextSx = {
  mt: 0.15,
  fontSize: "9px",
  lineHeight: "12px",
  color: "var(--app-color-text-muted)",
};

const bottomHeaderTitleSx = {
  m: 0,
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const viewAllBtnSx = {
  fontSize: "10.5px",
  fontWeight: 700,
  p: 0,
  minWidth: 0,
  height: "auto",
};

const transactionRowSx = {
  pb: 1.25,
  borderBottom: "1px solid var(--app-color-border)",
  "&:last-child": {
    pb: 0,
    borderBottom: "none",
  },
};

const txIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "50%",
  fontSize: "12px",
  flexShrink: 0,
};

const txAccountSx = {
  m: 0,
  fontSize: "11px",
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const txDescSx = {
  m: 0,
  fontSize: "9.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  mt: 0.1,
};

const txAmountSx = {
  m: 0,
  fontSize: "11.5px",
  lineHeight: 1.2,
};

const txTimeSx = {
  m: 0,
  fontSize: "8.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  mt: 0.1,
};

const quickActionCardSx = {
  p: 0.75,
  display: "flex",
  alignItems: "center",
  minHeight: 38,
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:active": {
    bgcolor: "var(--app-color-surface-hover)",
  },
};

const quickIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  borderRadius: "6px",
  fontSize: "11px",
  flexShrink: 0,
};

const quickActionTitleSx = {
  m: 0,
  fontSize: "10px",
  fontWeight: 600,
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

export default TreasuryMobilePage;
