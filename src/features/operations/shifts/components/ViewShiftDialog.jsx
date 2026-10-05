// src/features/operations/shifts/components/ViewShiftDialog.jsx

import React, { useEffect, useState, useMemo } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
  UIBadge,
} from "@/components/ui";
import {
  IndianRupee,
  QrCode,
  FileText,
  ArrowLeftRight,
  Banknote,
  Snowflake,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  Layers,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/services";
import useBranch from "@/features/branch/hooks/useBranch";
import { useBranchCash } from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

const TABS = [
  { id: "cash", label: "Cash Summary", icon: IndianRupee },
  { id: "bills", label: "Bills & Payments", icon: FileText },
  { id: "drawer", label: "Cash Drawer", icon: Banknote },
  { id: "funds", label: "Fund Movements", icon: ArrowLeftRight },
];

const StatRow = ({ label, value, color = "", sign = "" }) => (
  <div className="flex justify-between items-center text-xs py-2 border-b border-border/40 last:border-0">
    <span className="text-text-muted font-medium">{label}</span>
    <span className={`font-mono font-bold ${color}`}>
      {sign}₹{value}
    </span>
  </div>
);

const DenomTable = ({ title, denominations, total, accent }) => (
  <div className="bg-surface-alt/60 border border-border/70 rounded-xl p-3.5 space-y-2">
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <h4 className={`text-[11px] font-bold uppercase tracking-wider ${accent || "text-text-muted"}`}>
        {title}
      </h4>
      <span className="font-mono text-xs font-black text-text">₹{fmt(total)}</span>
    </div>

    <div className="space-y-1 pt-1">
      {DENOMINATIONS.map((note) => {
        const d = denominations?.find((x) => Number(x.denomination) === note);
        const count = d?.count ?? d?.quantity ?? 0;
        return (
          <div
            key={note}
            className="flex justify-between items-center text-xs px-2 py-1 rounded-md hover:bg-surface transition-colors"
          >
            <span className="font-mono font-bold text-text-muted">₹{note}</span>
            <span className="text-text-muted/60 text-[10px]">×</span>
            <span className="font-mono font-semibold text-text">{count}</span>
            <span className="font-mono text-text-muted text-[11px] tabular-nums">
              = ₹{fmt(note * count)}
            </span>
          </div>
        );
      })}
    </div>

    <div className="flex justify-between items-center text-xs px-2 py-2 rounded-lg bg-surface font-extrabold mt-2 border border-border/80">
      <span>Total Counted</span>
      <span className="font-mono text-primary">₹{fmt(total)}</span>
    </div>
  </div>
);

export const ViewShiftDialog = ({ isOpen, onClose, shift }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");

  const { currentBranch } = useBranch();
  const { currentBranchCash, fetchBranchCash } = useBranchCash();

  useEffect(() => {
    if (isOpen && shift?._id) {
      setLoading(true);
      setActiveTab("cash");
      apiClient
        .get(`/operations/shifts/${shift._id}/summary`)
        .then((res) => setSummary(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));

      if (currentBranch?._id && shift.status !== "closed") {
        fetchBranchCash(currentBranch._id);
      }
    } else {
      setSummary(null);
    }
  }, [isOpen, shift, currentBranch?._id, fetchBranchCash]);

  const shiftName = summary?.shiftName || shift?.shiftName || "Shift Session";
  const isClosed = summary?.status === "closed";
  const diff =
    (summary?.actualClosingCashAmount || 0) -
    (summary?.expectedClosingCashAmount || 0);

  const adjustedDenominations = useMemo(() => {
    if (!isClosed || !summary?.isAdjusted) return [];

    if (summary?.adjustedDenominations && summary.adjustedDenominations.length > 0) {
      return summary.adjustedDenominations.map((chg) => ({
        denomination: chg.denomination,
        expected: chg.expectedCount,
        actual: chg.actualCount,
        diff: chg.actualCount - chg.expectedCount,
      }));
    }

    const expected = summary?.expectedDenominations || [];
    const counted = summary?.closingDenominations || [];
    const changes = [];

    DENOMINATIONS.forEach((d) => {
      const expCount = expected.find((x) => Number(x.denomination) === d)?.count || 0;
      const actCount = counted.find((x) => Number(x.denomination) === d)?.count || 0;
      if (expCount !== actCount) {
        changes.push({
          denomination: d,
          expected: expCount,
          actual: actCount,
          diff: actCount - expCount,
        });
      }
    });
    return changes;
  }, [summary, isClosed]);

  const renderCashSummary = () => (
    <div className="space-y-4">
      {/* Running & Frozen Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col justify-between bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Banknote className="size-4" /> Running Cash
            </span>
            <span className="text-[10px] font-normal text-text-muted">
              {!isClosed ? "Current live balance" : "At shift close"}
            </span>
          </div>
          <div className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-2xl mt-2">
            {!isClosed
              ? currentBranchCash
                ? `₹${fmt(currentBranchCash.runningCash)}`
                : "Loading..."
              : summary?.branchRunningCashAtClose != null
              ? `₹${fmt(summary.branchRunningCashAtClose)}`
              : "N/A"}
          </div>
        </div>

        <div className="flex flex-col justify-between bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Snowflake className="size-4" /> Frozen Reserve
            </span>
            <span className="text-[10px] font-normal text-text-muted">
              {!isClosed ? "Awaiting deposit" : "At shift close"}
            </span>
          </div>
          <div className="font-mono font-black text-cyan-600 dark:text-cyan-400 text-2xl mt-2">
            {!isClosed
              ? currentBranchCash
                ? `₹${fmt(currentBranchCash.frozenCash)}`
                : "Loading..."
              : summary?.branchFrozenCashAtClose != null
              ? `₹${fmt(summary.branchFrozenCashAtClose)}`
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Expected Cash Calculation Breakdown */}
      <div className="bg-surface-alt/60 border border-border/80 rounded-xl p-4 space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
          Expected Cash Breakdown
        </h4>
        <StatRow label="Opening Float Balance" value={fmt(summary?.openingFloatAmount)} />
        <StatRow label="+ Cash Invoice Sales" value={fmt(summary?.cashNet)} color="text-emerald-600 dark:text-emerald-400" sign="+" />
        {(summary?.totalDeposits || 0) > 0 && (
          <StatRow label="+ Shift Cash Deposits" value={fmt(summary?.totalDeposits)} color="text-emerald-600 dark:text-emerald-400" sign="+" />
        )}
        {(summary?.totalWithdrawals || 0) > 0 && (
          <StatRow label="− Shift Withdrawals" value={fmt(summary?.totalWithdrawals)} color="text-rose-600 dark:text-rose-400" sign="−" />
        )}
        <div className="flex justify-between items-center pt-2 mt-1 border-t border-border font-bold">
          <span className="text-xs text-text">Expected System Cash</span>
          <span className="font-mono text-primary text-base">₹{fmt(summary?.expectedClosingCashAmount)}</span>
        </div>
      </div>

      {/* Actual vs Expected Card */}
      {isClosed && (
        <div
          className={`border rounded-xl p-4 shadow-2xs ${
            diff === 0
              ? "bg-emerald-500/5 border-emerald-500/30"
              : diff > 0
              ? "bg-amber-500/5 border-amber-500/30"
              : "bg-rose-500/5 border-rose-500/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Actual Physical Cash Counted
              </p>
              <p className="font-mono font-black text-2xl mt-1 text-text">
                ₹{fmt(summary?.actualClosingCashAmount)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Discrepancy / Variance
              </p>
              <div
                className={`flex items-center gap-1 mt-1 font-mono font-bold text-lg ${
                  diff === 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : diff > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {diff > 0 ? (
                  <TrendingUp className="size-4" />
                ) : diff < 0 ? (
                  <TrendingDown className="size-4" />
                ) : (
                  <Minus className="size-4" />
                )}
                {diff > 0 ? "+" : ""}₹{fmt(diff)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Chips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {[
          ["Session Name", shiftName],
          [
            "Session Date",
            summary?.date
              ? new Date(summary.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—",
          ],
          ["Status", summary?.status?.toUpperCase()],
          [
            "Opened By",
            summary?.openedBy?.fullName ||
              summary?.openedBy?.name ||
              summary?.openedBy?.email ||
              "System",
          ],
          [
            "Opened Time",
            summary?.openedAt
              ? new Date(summary.openedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—",
          ],
          isClosed && [
            "Closed By",
            summary?.closedBy?.fullName ||
              summary?.closedBy?.name ||
              summary?.closedBy?.email ||
              "System",
          ],
        ]
          .filter(Boolean)
          .map(([label, val]) => (
            <div
              key={label}
              className="bg-surface-alt/50 border border-border/70 rounded-xl p-2.5"
            >
              <span className="text-[10px] font-semibold text-text-muted block">
                {label}
              </span>
              <span className="text-xs font-bold text-text truncate block mt-0.5">
                {val}
              </span>
            </div>
          ))}
      </div>
    </div>
  );

  const renderBillsPayments = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Cash Invoices */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Banknote className="size-4" /> Cash Sales
            </span>
            <UIBadge variant="soft" color="success" className="text-[10px] font-bold py-0 px-2">
              {summary?.cashInvoiceCount || 0} Bills
            </UIBadge>
          </div>
          <p className="font-mono font-black text-2xl text-emerald-600 dark:text-emerald-400">
            ₹{fmt(summary?.cashNet)}
          </p>
          <p className="text-[11px] text-text-muted">
            Total physical cash collected at counter
          </p>
        </div>

        {/* UPI / QR Invoices */}
        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
              <QrCode className="size-4" /> Digital / UPI Sales
            </span>
            <UIBadge variant="soft" color="primary" className="text-[10px] font-bold py-0 px-2">
              {summary?.paymentQrCount || 0} Bills
            </UIBadge>
          </div>
          <p className="font-mono font-black text-2xl text-purple-600 dark:text-purple-400">
            ₹{fmt(summary?.qrNet)}
          </p>
          <p className="text-[11px] text-text-muted">
            Total digital QR payments received
          </p>
        </div>
      </div>

      {/* Per QR Breakdown */}
      {(summary?.upiBreakdown || []).length > 0 && (
        <div className="bg-surface-alt/60 border border-border/80 rounded-xl p-3.5 space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Per-QR Terminal Breakdown
          </h4>
          <div className="space-y-1.5">
            {summary.upiBreakdown.map((qr) => (
              <div
                key={qr.paymentQrId || "unattr"}
                className="flex items-center justify-between text-xs bg-surface border border-border/60 rounded-lg p-2.5"
              >
                <div>
                  <p className="font-bold text-text">{qr.label || qr.upiId}</p>
                  <p className="text-[10px] text-text-muted">
                    {qr.transactionCount} transactions
                  </p>
                </div>
                <span className="font-mono font-bold text-primary">
                  ₹{fmt(qr.totalAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Total Sales Summary */}
      <div className="bg-surface-alt/60 border border-border/80 rounded-xl p-4 space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
          Gross Sales Performance
        </h4>
        <StatRow label="Total Invoices Generated" value={fmt(summary?.invoiceCount)} />
        <StatRow label="Net Sales Total" value={fmt(summary?.netSales)} color="text-primary" />
        {(summary?.returnCount || 0) > 0 && (
          <StatRow
            label={`Returns (${summary?.returnCount || 0})`}
            value={fmt(summary?.returnAmount)}
            color="text-rose-600 dark:text-rose-400"
          />
        )}
      </div>
    </div>
  );

  const renderCashDrawer = () => {
    const isLiveDrawer =
      !isClosed && currentBranchCash?.currentShiftId === shift?._id;
    const title = isClosed
      ? "Actual Closing Count"
      : isLiveDrawer
      ? "Current Live Drawer Balance"
      : "Pending Closing Count";
    const denominations = isClosed
      ? summary?.closingDenominations
      : isLiveDrawer
      ? currentBranchCash?.denominationBalance?.runningDenominations
      : [];
    const total = isClosed
      ? summary?.actualClosingCashAmount
      : isLiveDrawer
      ? currentBranchCash?.runningCash
      : 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <DenomTable
          title="Opening Float Count"
          denominations={summary?.openingDenominations}
          total={summary?.openingFloatAmount}
        />
        <DenomTable
          title={title}
          denominations={denominations}
          total={total}
          accent={isClosed ? "text-primary" : "text-emerald-600 dark:text-emerald-400"}
        />
      </div>
    );
  };

  const renderFundMovements = () => {
    const deposits = summary?.deposits || [];
    const withdrawals = summary?.withdrawals || [];
    const hasAny = deposits.length > 0 || withdrawals.length > 0;

    if (!hasAny) {
      return (
        <div className="py-12 text-center text-text-muted text-xs bg-surface-alt/40 border border-border/60 rounded-xl">
          No manual fund transfers or drawer movements were recorded during this shift.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              Total Shift Deposits
            </span>
            <span className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400 mt-1 block">
              ₹{fmt(summary?.totalDeposits)}
            </span>
            <span className="text-[10px] text-text-muted">
              {deposits.length} deposit entry
            </span>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
              Total Shift Withdrawals
            </span>
            <span className="font-mono font-black text-xl text-rose-600 dark:text-rose-400 mt-1 block">
              ₹{fmt(summary?.totalWithdrawals)}
            </span>
            <span className="text-[10px] text-text-muted">
              {withdrawals.length} withdrawal entry
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="xl">
      <UIModalHeader>
        <UIModalTitle>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Clock className="h-5.5 w-5.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-text tracking-tight">
                  {shiftName}
                </h3>
                <UIBadge
                  variant="soft"
                  color={isClosed ? "neutral" : "success"}
                  className="text-[10px] font-bold uppercase py-0 px-2"
                >
                  {summary?.status || "open"}
                </UIBadge>
              </div>
              <p className="text-xs font-mono text-text-muted mt-0.5">
                {shift?.shiftNo || "N/A"}
              </p>
            </div>
          </div>
        </UIModalTitle>
      </UIModalHeader>

      <UIModalBody className="max-h-[75vh] overflow-y-auto">
        {loading ? (
          <div className="py-16 text-center text-text-muted space-y-2">
            <div className="size-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium">Loading session analytics...</p>
          </div>
        ) : !summary ? (
          <div className="py-12 text-center text-text-muted text-xs">
            Unable to retrieve shift details.
          </div>
        ) : (
          <div className="space-y-4 py-1">
            {/* Adjustment Banner if modified */}
            {isClosed && summary?.isAdjusted && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 p-3.5 rounded-xl flex items-start gap-3">
                <AlertTriangle className="size-5 shrink-0 text-amber-500 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold">Shift Count Adjusted</h4>
                  <p className="mt-0.5 opacity-90">
                    Physical cash counted (₹{fmt(summary?.actualClosingCashAmount)}) differed from system cash (₹{fmt(summary?.expectedClosingCashAmount)}). Cash balance was automatically adjusted by {diff > 0 ? "+" : ""}₹{fmt(diff)}.
                  </p>
                </div>
              </div>
            )}

            {/* Segmented Tab Controls */}
            <div className="flex items-center gap-1 p-1 bg-surface-alt/80 border border-border/70 rounded-xl overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-1 cursor-pointer ${
                    activeTab === id
                      ? "bg-surface text-primary shadow-2xs border border-border/80"
                      : "text-text-muted hover:text-text hover:bg-surface/50"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="min-h-[260px] pt-1">
              {activeTab === "cash" && renderCashSummary()}
              {activeTab === "bills" && renderBillsPayments()}
              {activeTab === "drawer" && renderCashDrawer()}
              {activeTab === "funds" && renderFundMovements()}
            </div>
          </div>
        )}
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="ghost" onClick={onClose}>
          Close
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default ViewShiftDialog;
