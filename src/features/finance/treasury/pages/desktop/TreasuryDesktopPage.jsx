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
} from "react-icons/fi";
import { FaRupeeSign, FaWallet, FaUniversity, FaCoins } from "react-icons/fa";
import {
  LuScale,
  LuBuilding2,
  LuWallet,
  LuTrendingUp,
  LuQrCode,
  LuCoins,
  LuTicket,
} from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

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
  ledgerImpact: <FiLayers />, // Custom ledger icon representation
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
  bankSlips: <LuTicket />,
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
  generateBankSlip: <LuTicket />,
  cashDenominations: <LuCoins />,
};

const TreasuryDesktopPage = ({
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
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Treasury"
          subtitle="Manage your cash, bank, UPI, cheques and all money movements in one place."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard", onClick: () => navigate(ROUTES.DASHBOARD) },
                { label: "Finance & Accounting", onClick: () => navigate(ROUTES.FINANCE) },
                { label: "Treasury", current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          actions={
            <AppStack direction="row" gap={1.5} align="center">
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
              <AppButton
                type="button"
                variant="outlined"
                colorVariant="primary"
                rounded="md"
                size="small"
                startIcon={<MdOutlineDashboard />}
                sx={secondaryButtonSx}
              >
                Treasury Dashboard
              </AppButton>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* 5-Column Stats Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
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
                  <AppHeading level={3} weight={700} sx={statValueSx}>
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

        {/* Treasury Processing Flow */}
        <AppCard
          variant="default"
          rounded="xl"
          bordered
          shadow="none"
          padding="md"
          sx={{ mt: 3, bgcolor: "var(--app-color-surface)" }}
        >
          <AppHeading level={3} weight={700} sx={flowSectionTitleSx}>
            Treasury Processing Flow
          </AppHeading>

          <div className="mt-3 flex items-center justify-between w-full pb-1">
            {processingFlow.map((step, idx) => (
              <React.Fragment key={step.id}>
                {/* Flow Step Card */}
                <AppStack
                  direction="row"
                  align="center"
                  gap={1.25}
                  sx={{
                    flex: "0 0 auto",
                    p: 0.5,
                  }}
                >
                  <AppBox
                    sx={{
                      ...flowIconFrameSx,
                      bgcolor: `var(--app-color-${step.colorVariant}-soft)`,
                      color: `var(--app-color-${step.colorVariant})`,
                    }}
                  >
                    {flowIcons[step.id]}
                  </AppBox>
                  <AppBox
                    sx={{
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <AppHeading level={5} weight={700} sx={flowStepTitleSx}>
                      {step.title}
                    </AppHeading>
                    <AppText variant="body2" sx={flowStepDescSx}>
                      {step.description}
                    </AppText>
                  </AppBox>
                </AppStack>

                {/* Arrow Connector */}
                {idx < processingFlow.length - 1 && (
                  <div className="flex-grow flex items-center justify-center mx-2 min-w-[20px]">
                    <div className="w-full h-[1.5px] bg-border-strong opacity-40 relative flex items-center justify-center">
                      <FiArrowRight
                        className="absolute text-[12px] bg-surface px-1 text-text-muted"
                        style={{
                          backgroundColor: "var(--app-color-surface)",
                          color: "var(--app-color-text-muted)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </AppCard>

        {/* Treasury Modules Header */}
        <AppBox sx={{ mt: 3, mb: 1.5 }}>
          <AppHeading level={2} weight={700} sx={sectionTitleSx}>
            Treasury Modules
          </AppHeading>
        </AppBox>

        {/* Treasury Modules 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <AppBox sx={{ minWidth: 0, flex: 1 }}>
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

        {/* Bottom Section: Recent Transactions & Quick Actions */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Column 1: Recent Transactions (5/12 width) */}
          <div className="lg:col-span-5">
            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="none"
              padding="md"
              sx={{ height: "100%", bgcolor: "var(--app-color-surface)" }}
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

              <AppStack gap={1.25} sx={{ width: "100%" }}>
                {recentTransactions.map((tx) => (
                  <AppStack
                    key={tx.id}
                    direction="row"
                    align="center"
                    justify="space-between"
                    gap={1.5}
                    sx={transactionRowSx}
                  >
                    <AppStack
                      direction="row"
                      align="center"
                      gap={1.5}
                      sx={{ minWidth: 0, flex: 1 }}
                    >
                      <AppBox
                        sx={{
                          ...txIconFrameSx,
                          bgcolor: `var(--app-color-${tx.colorVariant}-soft)`,
                          color: `var(--app-color-${tx.colorVariant})`,
                        }}
                      >
                        {tx.type === "received" ? (
                          <FiTrendingUp />
                        ) : (
                          <FiRepeat />
                        )}
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
                      <AppHeading
                        level={4}
                        weight={700}
                        sx={{
                          ...txAmountSx,
                          color:
                            tx.type === "received"
                              ? "var(--app-color-success)"
                              : "var(--app-color-text)",
                        }}
                      >
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
          </div>

          {/* Column 2: Quick Actions (7/12 width) */}
          <div className="lg:col-span-7">
            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="none"
              padding="md"
              sx={{ height: "100%", bgcolor: "var(--app-color-surface)" }}
            >
              <AppHeading
                level={3}
                weight={700}
                sx={{ ...bottomHeaderTitleSx, mb: 3 }}
              >
                Quick Actions
              </AppHeading>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                      <div className="flex items-center gap-2.5 w-full pl-3 pr-2 py-1.5 min-h-[44px]">
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
                        <span className="text-[11.5px] font-semibold text-text leading-none mt-0.5">
                          {action.title}
                        </span>
                      </div>
                    </AppCard>
                  </button>
                ))}
              </div>
            </AppCard>
          </div>
        </div>
      </div>
    </section>
  );
};

// Styling Tokens Map
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
  py: 2,
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
  mt: 0.15,
};

const statDescSx = {
  m: 0,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  mt: 0.15,
};

const sectionTitleSx = {
  m: 0,
  fontSize: "16.5px",
  color: "var(--app-color-text)",
};

const flowSectionTitleSx = {
  m: 0,
  fontSize: "14px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const flowIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: "50%",
  fontSize: "17px",
  flexShrink: 0,
};

const flowStepTitleSx = {
  m: 0,
  fontSize: "11.5px",
  color: "var(--app-color-text)",
  fontWeight: 650,
  lineHeight: 1.2,
};

const flowStepDescSx = {
  m: 0,
  fontSize: "9.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  mt: 0.15,
};

const moduleCardSx = {
  py: 2.25,
  px: 2,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  transition: "all 200ms ease",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  minHeight: 88,
  maxWidth: 380,
  mx: "auto",
  width: "100%",
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

const bottomHeaderTitleSx = {
  m: 0,
  fontSize: "14px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const viewAllBtnSx = {
  fontSize: "11.5px",
  fontWeight: 650,
  p: 0,
  minWidth: 0,
  height: "auto",
};

const transactionRowSx = {
  pb: 1.5,
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
  width: 34,
  height: 34,
  borderRadius: "50%",
  fontSize: "14px",
  flexShrink: 0,
};

const txAccountSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

const txDescSx = {
  m: 0,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  mt: 0.15,
};

const txAmountSx = {
  m: 0,
  fontSize: "12.5px",
  lineHeight: 1.2,
};

const txTimeSx = {
  m: 0,
  fontSize: "9.5px",
  color: "var(--app-color-text-muted)",
  lineHeight: 1.15,
  mt: 0.15,
};

const quickActionCardSx = {
  p: 1,
  display: "flex",
  alignItems: "center",
  minHeight: 44,
  cursor: "pointer",
  transition: "all 0.18s ease",
  "&:hover": {
    bgcolor: "var(--app-color-surface-hover)",
    boxShadow: "var(--app-shadow-xs)",
  },
};

const quickIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "7px",
  fontSize: "13px",
  flexShrink: 0,
};

const quickActionTitleSx = {
  m: 0,
  fontSize: "11px",
  fontWeight: 600,
  color: "var(--app-color-text)",
  lineHeight: 1.2,
};

export default TreasuryDesktopPage;
