import React from "react";
import {
  FiArrowLeft,
  FiEdit2,
  FiRefreshCw,
} from "react-icons/fi";
import { LuWallet } from "react-icons/lu";

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

const CashAccountDetailsDesktopPage = ({
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
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5 flex items-center justify-center">
        <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}>
          Loading cash account details...
        </AppText>
      </section>
    );
  }

  if (hasError || !account) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
        <div className="mx-auto w-full max-w-[1200px] text-center py-10">
          <AppHeading level={2} weight={700} sx={{ color: "var(--app-color-text)" }}>
            Error Loading Cash Account
          </AppHeading>
          <AppText variant="body1" sx={{ color: "var(--app-color-danger)", mt: 1 }}>
            {error || "Cash account not found or has been deleted."}
          </AppText>
          <AppButton variant="contained" colorVariant="primary" onClick={handleBack} sx={{ mt: 3 }}>
            Back to Cash Accounts
          </AppButton>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page Header */}
        <PageHeader
          title={account.accountName}
          subtitle={`Details for cash account: ${account.accountName}`}
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Cash Accounts", onClick: handleBack },
                { label: account.accountName, current: true },
              ]}
              sx={breadcrumbSx}
              itemSx={breadcrumbItemSx}
              currentItemSx={breadcrumbCurrentSx}
            />
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Toolbar */}
        <div className="mt-4 flex items-center justify-between">
          <AppButton
            type="button"
            variant="outlined"
            colorVariant="neutral"
            rounded="md"
            size="small"
            startIcon={<FiArrowLeft />}
            onClick={handleBack}
            sx={actionBtnSx}
          >
            Back
          </AppButton>

          <AppStack direction="row" gap={1.5} align="center">
            <AppButton
              type="button"
              variant="outlined"
              colorVariant="neutral"
              rounded="md"
              size="small"
              startIcon={<FiRefreshCw />}
              onClick={handleRefresh}
              sx={actionBtnSx}
            >
              Refresh
            </AppButton>
            <AppButton
              type="button"
              variant="filled"
              colorVariant="primary"
              rounded="md"
              size="small"
              startIcon={<FiEdit2 />}
              onClick={handleEdit}
              sx={editBtnSx}
            >
              Edit Details
            </AppButton>
          </AppStack>
        </div>

        {/* Main Details Panel */}
        <div className="mt-5 grid grid-cols-3 gap-5">
          {/* Left Card: Wallet logo & Balance */}
          <div className="col-span-1">
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={leftCardSx}>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-lg bg-primary-soft border border-primary/20 flex items-center justify-center text-primary shrink-0 select-none shadow-sm">
                  <LuWallet className="text-[24px]" />
                </div>
                <AppHeading level={2} weight={700} sx={titleSx}>
                  {account.accountName}
                </AppHeading>
                <div className="mt-2 flex items-center gap-1.5 justify-center flex-wrap">
                  {account.isPrimary && (
                    <span className="inline-flex items-center rounded bg-[#e6fcf5] px-2 py-0.5 text-[10.5px] font-bold text-[#0ca678] uppercase tracking-wide">
                      Primary
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase border ${
                      account.status === "active"
                        ? "bg-success-soft text-success border-success/30"
                        : "bg-danger-soft text-danger border-danger/30"
                    }`}
                  >
                    {account.status || "active"}
                  </span>
                </div>
              </div>

              <div className="border-t border-border p-4 text-center">
                <span className="text-[12px] text-text-muted block">Available Balance</span>
                <span className="text-[24px] font-extrabold text-text block mt-1 font-mono">
                  ₹ {(account.denominationBalance?.totalBalance !== undefined ? account.denominationBalance.totalBalance : (account.ledgerAccountId?.openingBalance || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </AppCard>
          </div>

          {/* Right Card: Metadata */}
          <div className="col-span-2">
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={rightCardSx}>
              <div className="px-5 py-4 border-b border-border">
                <AppHeading level={3} weight={700} sx={cardTitleSx}>
                  Cash Registry Metadata
                </AppHeading>
              </div>

              <div className="p-5 space-y-5 text-[13px]">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <span className="text-text-muted block font-semibold">Account Label</span>
                    <span className="font-semibold text-text block mt-1">
                      {account.accountName}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">Account Status</span>
                    <span className="font-semibold text-text block mt-1 capitalize">
                      {account.status || "active"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <span className="text-text-muted block font-semibold">Mapped General Ledger</span>
                    <span className="font-bold text-primary block mt-1">
                      {account.ledgerAccountId?.accountCode
                        ? `[${account.ledgerAccountId.accountCode}] ${account.ledgerAccountId.accountName}`
                        : "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">Opening Balance</span>
                    <span className="font-semibold text-text block mt-1">
                      ₹ {account.ledgerAccountId?.openingBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })} {account.ledgerAccountId?.openingBalanceType ? `(${account.ledgerAccountId.openingBalanceType.toUpperCase()})` : ""}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-text-muted block font-semibold">Description / Purpose</span>
                  <span className="text-text block mt-1 leading-relaxed">
                    {account.description || "-"}
                  </span>
                </div>
              </div>
            </AppCard>
          </div>
        </div>

        {/* Current Chest Denomination Balances */}
        {account.denominationBalance?.denominations?.length > 0 && (
          <div className="mt-5">
            <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={rightCardSx}>
              <div className="px-5 py-4 border-b border-border bg-surface-alt/5 flex items-center justify-between">
                <AppHeading level={3} weight={700} sx={cardTitleSx}>
                  Current Chest Denomination Balances
                </AppHeading>
                {account.denominationBalance.lastUpdatedAt && (
                  <span className="text-[12px] text-text-muted font-semibold">
                    Last Updated: {new Date(account.denominationBalance.lastUpdatedAt).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div className="p-5 grid grid-cols-[1fr_2fr] gap-6">
                {/* Summary */}
                <div className="space-y-4 text-[13px] border-r border-border pr-6">
                  <div>
                    <span className="text-text-muted block font-semibold">Total Running Balance</span>
                    <span className="text-[20px] font-black text-text block mt-1 font-mono">
                      ₹ {account.denominationBalance.totalBalance?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="text-text-muted leading-relaxed text-[11px]">
                    This breakdown represents the running physical denomination counts inside this chest, adjusted automatically by cash transactions, fund transfers, and verified audits.
                  </div>
                </div>
                {/* Denominations table */}
                <div>
                  <span className="text-text-muted block font-semibold mb-3">Chest Denominations Breakdown</span>
                  <table className="w-full text-left border-collapse text-[12px]">
                    <thead>
                      <tr className="border-b border-border text-text-muted">
                        <th className="py-1.5 px-2 font-semibold">Denomination</th>
                        <th className="py-1.5 px-2 font-semibold text-center">×</th>
                        <th className="py-1.5 px-2 font-semibold">Quantity</th>
                        <th className="py-1.5 px-2 font-semibold text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {account.denominationBalance.denominations?.map((d) => (
                        <tr key={d.denomination} className="border-b border-border/40 hover:bg-surface-hover/10 transition">
                          <td className="py-1.5 px-2 font-bold text-text font-mono">₹ {d.denomination}</td>
                          <td className="py-1.5 px-2 text-center text-text-muted font-mono">×</td>
                          <td className="py-1.5 px-2 font-mono">{d.quantity}</td>
                          <td className="py-1.5 px-2 text-right font-extrabold text-text font-mono">
                            ₹ {d.subtotal?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AppCard>
          </div>
        )}
      </div>
    </section>
  );
};

// Styling variables
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  cursor: "pointer",
  "&:hover": { color: "var(--app-color-primary)" },
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageHeaderSx = { width: "100%" };
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

const actionBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
};

const editBtnSx = {
  height: 34,
  fontSize: "11.5px",
  fontWeight: 600,
  bgcolor: "var(--app-color-primary)",
  "&:hover": { bgcolor: "var(--app-color-primary-hover)" },
};

const leftCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  height: "100%",
};

const rightCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const titleSx = {
  m: 0,
  mt: 2,
  fontSize: "16px",
  color: "var(--app-color-text)",
};

const cardTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

export default CashAccountDetailsDesktopPage;
