import React from "react";
import { FiArrowLeft, FiEdit2, FiRefreshCw, FiCopy, FiTrendingUp } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";

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

const PaymentQrDetailsDesktopPage = ({
  paymentQr,
  isLoading = false,
  hasError = false,
  error,
  stats = null,
  isStatsLoading = false,
  handleBack,
  handleEdit,
  handleRefresh,
}) => {
  if (isLoading) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5 flex items-center justify-center">
        <AppText
          variant="body1"
          sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}
        >
          Loading Payment QR details...
        </AppText>
      </section>
    );
  }

  if (hasError || !paymentQr) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
        <div className="mx-auto w-full max-w-[1200px] text-center py-10">
          <AppHeading
            level={2}
            weight={700}
            sx={{ color: "var(--app-color-text)" }}
          >
            Loading Payment QR
          </AppHeading>
          <AppText
            variant="body1"
            sx={{ color: "var(--app-color-danger)", mt: 1 }}
          >
            {error || "Payment QR register not found or has been deleted."}
          </AppText>
          <AppButton
            variant="contained"
            colorVariant="primary"
            onClick={handleBack}
            sx={{ mt: 3 }}
          >
            Back to Payment QRs
          </AppButton>
        </div>
      </section>
    );
  }

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(paymentQr.upiId);
    alert(`Copied UPI ID: ${paymentQr.upiId}`);

  };

  const getProviderLabel = (provider) => {
    const raw = String(provider || "").toUpperCase();
    if (raw === "GPAY") return "Google Pay";
    if (raw === "PHONEPE") return "PhonePe";
    if (raw === "PAYTM") return "Paytm";
    if (raw === "BHIM") return "BHIM UPI";
    if (raw === "RAZORPAY") return "Razorpay";
    if (raw === "CASHFREE") return "Cashfree";
    return "Other / Generic";
  };

  const statCardSx = {
    bgcolor: "var(--app-color-surface)",
    borderColor: "var(--app-color-border)",
  };

  const getProviderBadge = (provider) => {
    const raw = String(provider || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";
    if (raw === "GPAY") bg = "bg-[#e8f0fe] text-[#1a73e8] border-[#adcdfc]";
    else if (raw === "PHONEPE")
      bg = "bg-[#f3e8ff] text-[#7c3aed] border-[#ddd6fe]";
    else if (raw === "PAYTM")
      bg = "bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]";
    else if (raw === "BHIM")
      bg = "bg-[#ccfbf1] text-[#0d9488] border-[#99f6e4]";
    else if (raw === "RAZORPAY")
      bg = "bg-[#e0e7ff] text-[#4f46e5] border-[#c7d2fe]";
    else if (raw === "CASHFREE")
      bg = "bg-[#ffedd5] text-[#ea580c] border-[#fed7aa]";

    return (
      <span
        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase border ${bg}`}
      >
        {raw}
      </span>
    );
  };

  const isActive = String(paymentQr.status || "").toUpperCase() === "ACTIVE";

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Page Header */}
        <PageHeader
          title={paymentQr.label || "Payment QR Details"}
          subtitle={`Details for payment VPA: ${paymentQr.upiId}`}
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance & Accounting" },
                { label: "Treasury" },
                { label: "Payment QRs", onClick: handleBack },
                { label: paymentQr.label || "Details", current: true },
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
          {/* Left Card: QR Image visual */}
          <div className="col-span-1">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={leftCardSx}
            >
              <div className="flex flex-col items-center text-center p-4">
                <AppHeading level={2} weight={700} sx={titleSx}>
                  {paymentQr.label || "UPI QR Code"}
                </AppHeading>
                <div className="mt-2 flex items-center gap-1.5 justify-center flex-wrap">
                  {getProviderBadge(paymentQr.provider)}
                  {paymentQr.isPrimary && (
                    <span className="inline-flex items-center rounded bg-[#fff9db] px-2 py-0.5 text-[10.5px] font-bold text-[#f08c00] uppercase tracking-wide">
                      Primary
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-semibold uppercase border ${
                      isActive
                        ? "bg-success-soft text-success border-success/30"
                        : "bg-danger-soft text-danger border-danger/30"
                    }`}
                  >
                    {isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                {/* QR Display Container */}
                <div className="mt-6 w-[200px] h-[200px] bg-white border border-border/80 rounded-xl p-3 flex flex-col items-center justify-center relative shadow-sm group">
                  {paymentQr.qrImageUrl ? (
                    <img
                      src={paymentQr.qrImageUrl}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-text-muted/40">
                      <LuQrCode className="text-[90px]" />
                      <span className="text-[10px] text-text-muted mt-2 font-semibold">
                        Static Image Not Configured
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border p-4 text-center">
                <span className="text-[11.5px] text-text-muted block">
                  UPI ID Address
                </span>
                <div className="flex items-center gap-1 justify-center mt-1">
                  <span className="text-[13.5px] font-extrabold text-text block">
                    {paymentQr.upiId}
                  </span>
                  <button
                    onClick={handleCopyUpiId}
                    className="p-1 text-text-muted hover:text-primary rounded hover:bg-surface-hover/20 cursor-pointer"
                  >
                    <FiCopy className="text-[12px]" />
                  </button>
                </div>
              </div>
            </AppCard>
          </div>

          {/* Right Card: Metadata */}
          <div className="col-span-2">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              sx={rightCardSx}
            >
              <div className="px-5 py-4 border-b border-border">
                <AppHeading level={3} weight={700} sx={cardTitleSx}>
                  UPI Register Metadata
                </AppHeading>
              </div>

              <div className="p-5 space-y-5 text-[13px]">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <span className="text-text-muted block font-semibold">
                      Custom Label
                    </span>
                    <span className="font-semibold text-text block mt-1">
                      {paymentQr.label || "-"}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">
                      UPI VPA Address
                    </span>
                    <span className="font-semibold text-text block mt-1">
                      {paymentQr.upiId}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <span className="text-text-muted block font-semibold">
                      Service Provider
                    </span>
                    <span className="font-semibold text-text block mt-1">
                      {getProviderLabel(paymentQr.provider)}
                    </span>
                  </div>

                  <div>
                    <span className="text-text-muted block font-semibold">
                      Active Status
                    </span>
                    <span className="font-semibold text-text block mt-1 capitalize">
                      {String(paymentQr.status || "").toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <span className="text-text-muted block font-semibold">
                      Linked Settlement Bank Account
                    </span>
                    {paymentQr.bankAccountId && typeof paymentQr.bankAccountId === 'object' ? (
                      <span className="font-bold text-primary block mt-1">
                        {paymentQr.bankAccountId.bankMasterId?.name || "Bank Account"} - A/C:{" "}
                        {paymentQr.bankAccountId.accountNumber} (
                        {paymentQr.bankAccountId.accountName ||
                          "Primary Checking"}
                        )
                      </span>
                    ) : (
                      <span className="font-semibold text-text block mt-1">
                        -
                      </span>
                    )}
                  </div>
                </div>

                {paymentQr.qrImageUrl && (
                  <div>
                    <span className="text-text-muted block font-semibold">
                      QR Code Image Link
                    </span>
                    <a
                      href={paymentQr.qrImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary hover:underline block mt-1 break-all"
                    >
                      {paymentQr.qrImageUrl}
                    </a>
                  </div>
                )}
              </div>
            </AppCard>
          </div>
        </div>

        {/* ── Analytics Section ─────────────────────────────────────────────── */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-primary text-[16px]" />
            <AppHeading level={3} weight={700} sx={{ m: 0, fontSize: "15px", color: "var(--app-color-text)" }}>
              UPI Transaction Analytics
            </AppHeading>
            <span className="text-[11px] text-text-muted font-semibold ml-1">
              — Revenue collected via <span className="font-mono font-bold text-primary">{paymentQr.upiId}</span>
            </span>
          </div>

          {/* Stats Cards Row */}
          {isStatsLoading ? (
            <div className="flex gap-5 mb-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-1 h-[90px] rounded-xl border border-border bg-surface animate-pulse" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-3 gap-5 mb-5">
              {/* Today */}
              <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
                <div className="p-4">
                  <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider block">Today</span>
                  <span className="text-[22px] font-extrabold text-primary block mt-1">
                    ₹{Number(stats.todayAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-text-muted block mt-0.5">
                    {stats.todayTransactions || 0} transaction{stats.todayTransactions !== 1 ? "s" : ""}
                  </span>
                </div>
              </AppCard>

              {/* This Month */}
              <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
                <div className="p-4">
                  <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider block">This Month</span>
                  <span className="text-[22px] font-extrabold text-[#7c3aed] block mt-1">
                    ₹{Number(stats.thisMonthAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-text-muted block mt-0.5">
                    {stats.thisMonthTransactions || 0} transaction{stats.thisMonthTransactions !== 1 ? "s" : ""}
                  </span>
                </div>
              </AppCard>

              {/* All Time */}
              <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
                <div className="p-4">
                  <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider block">All Time Total</span>
                  <span className="text-[22px] font-extrabold text-[#2b8a3e] block mt-1">
                    ₹{Number(stats.totalAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-text-muted block mt-0.5">
                    {stats.totalTransactions || 0} transaction{stats.totalTransactions !== 1 ? "s" : ""}
                  </span>
                </div>
              </AppCard>
            </div>
          ) : null}

          {/* Recent Transactions Table */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none" sx={{ bgcolor: "var(--app-color-surface)", borderColor: "var(--app-color-border)" }}>
            <div className="px-5 py-3.5 border-b border-border">
              <AppHeading level={4} weight={700} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                Recent Transactions
              </AppHeading>
            </div>

            {isStatsLoading ? (
              <div className="py-10 flex justify-center">
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}>Loading transactions...</AppText>
              </div>
            ) : !stats || !stats.recentTransactions || stats.recentTransactions.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <LuQrCode className="text-[36px] text-text-muted/30 mb-2" />
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}>No transactions recorded yet for this UPI</AppText>
                <AppText variant="caption" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>Transactions will appear here once payments are received via this QR code</AppText>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt/30">
                      <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase text-text-muted tracking-wider">Invoice No</th>
                      <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase text-text-muted tracking-wider">Date</th>
                      <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase text-text-muted tracking-wider">Customer</th>
                      <th className="text-right px-5 py-2.5 text-[11px] font-bold uppercase text-text-muted tracking-wider">Amount</th>
                      <th className="text-left px-5 py-2.5 text-[11px] font-bold uppercase text-text-muted tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentTransactions.map((tx, idx) => (
                      <tr key={tx._id || idx} className="border-b border-border/50 hover:bg-surface-hover/30 transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-primary">{tx.invoiceNo || "-"}</td>
                        <td className="px-5 py-3 text-text-muted">
                          {tx.date ? new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                        </td>
                        <td className="px-5 py-3 font-semibold text-text">{tx.customer?.name || "Walk-in"}</td>
                        <td className="px-5 py-3 text-right font-mono font-extrabold text-text">
                          ₹{Number(tx.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                            String(tx.status || "").toLowerCase() === "paid"
                              ? "bg-success-soft text-success border-success/30"
                              : "bg-surface-alt text-text-muted border-border"
                          }`}>
                            {tx.status || "Paid"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AppCard>
        </div>
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

export default PaymentQrDetailsDesktopPage;
