import React from "react";
import {
  FiArrowLeft,
  FiEdit2,
  FiRefreshCw,
} from "react-icons/fi";
import { LuWallet } from "react-icons/lu";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppStack,
  AppText,
} from "@/components";

const CashAccountDetailsMobilePage = ({
  account,
  isLoading = false,
  hasError = false,
  error,
  handleBack,
  handleEdit,
  handleRefresh,
}) => {
  if (isLoading) {
    return (
      <section className="w-full bg-bg py-8 flex items-center justify-center">
        <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
          Loading cash account details...
        </AppText>
      </section>
    );
  }

  if (hasError || !account) {
    return (
      <section className="w-full bg-bg px-4 py-8 text-center">
        <AppHeading level={2} weight={700} sx={{ fontSize: "16px", color: "var(--app-color-text)" }}>
          Error Loading Cash Account
        </AppHeading>
        <AppText variant="body2" sx={{ color: "var(--app-color-danger)", mt: 1 }}>
          {error || "Cash account details could not be found."}
        </AppText>
        <AppIconButton
          icon={<FiArrowLeft />}
          variant="filled"
          colorVariant="primary"
          onClick={handleBack}
          sx={{ mt: 3, mx: "auto" }}
        />
      </section>
    );
  }

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" gap={1} justify="space-between">
            <AppStack direction="row" align="center" gap={1} sx={{ minWidth: 0, flex: 1 }}>
              <AppIconButton
                icon={<FiArrowLeft />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleBack}
                sx={actionHeaderIconBtnSx}
              />
              <AppBox sx={{ minWidth: 0, flex: 1 }}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {account.accountName}
                </AppHeading>
                <AppText variant="body2" sx={pageSubtitleSx}>
                  Cash register details
                </AppText>
              </AppBox>
            </AppStack>

            <AppStack direction="row" gap={0.8} align="center">
              <AppIconButton
                icon={<FiRefreshCw />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleRefresh}
                sx={actionHeaderIconBtnSx}
              />
              <AppIconButton
                icon={<FiEdit2 />}
                variant="filled"
                colorVariant="primary"
                size="small"
                rounded="md"
                onClick={handleEdit}
                sx={editMobileBtnSx}
              />
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Content stack */}
        <div className="px-2 space-y-4">
          {/* Overview Balance Card */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-soft border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <LuWallet className="text-[20px]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 flex-wrap">
                  <AppHeading level={2} weight={700} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                    {account.accountName}
                  </AppHeading>
                  {account.isPrimary && (
                    <span className="inline-flex items-center rounded bg-[#e6fcf5] px-1.5 py-0.2 text-[8px] font-bold text-[#0ca678] uppercase tracking-wide">
                      Primary
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${account.status === "active" ? "bg-success" : "bg-danger"}`}></span>
                  <span className={`text-[10px] font-bold capitalize ${account.status === "active" ? "text-success" : "text-danger"}`}>
                    {account.status || "active"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border/60 p-4 bg-surface-alt/5 rounded-b-lg">
              <span className="text-[10px] text-text-muted block">Available Balance</span>
              <span className="text-[18px] font-extrabold text-text block mt-0.5">
                ₹ {account.ledgerAccountId?.openingBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 }) || "0.00"}
              </span>
            </div>
          </AppCard>

          {/* Account Details Card */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
            <div className="p-3.5 border-b border-border">
              <AppHeading level={2} weight={700} sx={cardTitleSx}>
                Metadata Details
              </AppHeading>
            </div>

            <div className="p-3.5 space-y-3.5 text-[12px]">
              <div>
                <span className="text-text-muted block font-semibold">Account Label</span>
                <span className="font-semibold text-text block mt-0.5">
                  {account.accountName}
                </span>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">Opening Balance</span>
                <span className="font-semibold text-text block mt-0.5">
                  ₹ {account.ledgerAccountId?.openingBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })} {account.ledgerAccountId?.openingBalanceType ? `(${account.ledgerAccountId.openingBalanceType.toUpperCase()})` : ""}
                </span>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">Mapped General Ledger</span>
                <span className="font-bold text-primary block mt-0.5">
                  {account.ledgerAccountId?.accountCode
                    ? `[${account.ledgerAccountId.accountCode}] ${account.ledgerAccountId.accountName}`
                    : "-"}
                </span>
              </div>

              <div>
                <span className="text-text-muted block font-semibold">Description / Purpose</span>
                <span className="text-text block mt-0.5 leading-relaxed text-[11.5px]">
                  {account.description || "-"}
                </span>
              </div>
            </div>
          </AppCard>

          {/* Latest Cash Count Snapshot Card */}
          {account.latestCashCount?.countNumber && (
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={formCardSx}>
              <div className="p-3.5 border-b border-border bg-surface-alt/5 flex flex-col gap-1">
                <AppHeading level={2} weight={700} sx={cardTitleSx}>
                  Latest Audit Count #{account.latestCashCount.countNumber}
                </AppHeading>
                <span className="text-[10px] text-text-muted font-semibold">
                  Counted on: {new Date(account.latestCashCount.countDate).toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="p-3.5 space-y-3.5 text-[12px]">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted font-semibold">Total Counted:</span>
                  <span className="font-black font-mono text-[13px] text-text">
                    ₹ {account.latestCashCount.physicalTotal?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                {account.latestCashCount.cashDenominationId && (
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted font-semibold">Audit Status:</span>
                    <span className="inline-flex items-center rounded bg-[#e6fcf5] px-1.5 py-0.2 text-[8.5px] font-bold text-[#0ca678] uppercase tracking-wide">
                      {account.latestCashCount.cashDenominationId.status || "CONFIRMED"}
                    </span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <span className="text-text-muted block font-semibold mb-2">Denominations Breakdown:</span>
                  {account.latestCashCount.denominations?.map((d) => (
                    <div key={d.denomination} className="flex justify-between items-center py-1.5 border-b border-border/40 last:border-b-0">
                      <span className="font-bold text-text font-mono text-[11px]">₹ {d.denomination}</span>
                      <span className="text-text-muted font-mono text-[10px]">×</span>
                      <span className="font-mono text-[11px]">{d.quantity}</span>
                      <span className="font-extrabold text-text font-mono text-[11.5px] w-[100px] text-right">
                        ₹ {d.subtotal?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AppCard>
          )}
        </div>
      </AppBox>
    </section>
  );
};

// MUI style configurations
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0.5,
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
  fontSize: "17.5px",
  lineHeight: 1.15,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 180,
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

const editMobileBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  bgcolor: "var(--app-color-primary)",
  color: "white",
  "&:hover": { bgcolor: "var(--app-color-primary-hover)" },
};

const formCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const cardTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
};

export default CashAccountDetailsMobilePage;
