import React, { useEffect, useState } from "react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalBody,
  UIModalFooter,
  UIButton,
} from "@/components/ui";
import {
  IndianRupee, QrCode, FileText, ArrowLeftRight,
  Banknote, Snowflake, LayoutDashboard, CreditCard,
  Wallet, TrendingUp, TrendingDown, Minus
} from "lucide-react";
import { apiClient } from "@/services";
import { useBranchCash } from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";

const DENOMINATIONS = [500, 200, 100, 50, 20, 10, 5, 2, 1];

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

const TABS = [
  { id: "cash",    label: "Cash Summary",     icon: IndianRupee },
  { id: "bills",   label: "Bills & Payments", icon: FileText },
  { id: "drawer",  label: "Cash Drawer",      icon: Banknote },
  { id: "funds",   label: "Fund Movements",   icon: ArrowLeftRight },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const StatRow = ({ label, value, color = "", sign = "" }) => (
  <div className="flex justify-between items-center text-sm py-1.5 border-b border-border/30 last:border-0">
    <span className="text-text-muted">{label}</span>
    <span className={`font-mono font-semibold ${color}`}>{sign}₹{value}</span>
  </div>
);

const DenomTable = ({ title, denominations, total, accent }) => (
  <div>
    <h4 className={`text-[11px] font-bold uppercase tracking-widest mb-2 border-b border-border pb-1 ${accent || "text-text-muted"}`}>
      {title}
    </h4>
    <div className="space-y-0.5">
      {DENOMINATIONS.map((note) => {
        const d = denominations?.find((x) => Number(x.denomination) === note);
        const count = d?.count ?? d?.quantity ?? 0;
        return (
          <div key={note} className="flex justify-between items-center text-xs px-2 py-1 rounded hover:bg-surface-alt/40 transition">
            <span className="font-mono text-text-muted">₹{note}</span>
            <span className="text-text-muted text-[10px]">×</span>
            <span className="font-mono font-medium">{count}</span>
            <span className="font-mono text-text-muted text-[10px]">= ₹{note * count}</span>
          </div>
        );
      })}
      <div className="flex justify-between items-center text-xs px-2 py-1.5 rounded bg-surface-alt font-bold mt-1 border-t border-border">
        <span>Total</span>
        <span className="font-mono">₹{fmt(total)}</span>
      </div>
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

export const ViewShiftDialog = ({ isOpen, onClose, shift }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cash");

  const { fetchBranchCash, currentBranchCash } = useBranchCash();

  useEffect(() => {
    if (isOpen && shift?._id) {
      setLoading(true);
      setActiveTab("cash");
      apiClient
        .get(`/operations/shifts/${shift._id}/summary`)
        .then((res) => setSummary(res.data.data))
        .catch(console.error)
        .finally(() => setLoading(false));

      if (shift.branchId) fetchBranchCash(shift.branchId);
    } else {
      setSummary(null);
    }
  }, [isOpen, shift, fetchBranchCash]);

  const shiftName = summary?.shiftName || shift?.shiftName || "Shift";
  const isClosed = summary?.status === "closed";
  const diff = (summary?.actualClosingCashAmount || 0) - (summary?.expectedClosingCashAmount || 0);

  // ── Tab Content ──────────────────────────────────────────────────────────────

  const renderCashSummary = () => (
    <div className="space-y-5">
      {/* Live balances */}
      {currentBranchCash && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-widest">
              <Banknote className="size-3.5" /> Running Cash
            </div>
            <div className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-lg">
              ₹{fmt(currentBranchCash?.runningCash)}
            </div>
            <div className="text-[10px] text-emerald-600/70 dark:text-emerald-500">Active drawer</div>
          </div>
          <div className="flex flex-col gap-1 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-blue-700 dark:text-blue-400 font-bold uppercase tracking-widest">
              <Snowflake className="size-3.5" /> Frozen Reserve
            </div>
            <div className="font-mono font-bold text-blue-700 dark:text-blue-400 text-lg">
              ₹{fmt(currentBranchCash?.frozenCash)}
            </div>
            <div className="text-[10px] text-blue-600/70 dark:text-blue-500">Awaiting bank deposit</div>
          </div>
        </div>
      )}

      {/* Expected cash math */}
      <div className="bg-surface-secondary border border-border rounded-xl p-4">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-3">Expected Cash Calculation</h4>
        <StatRow label="Opening Balance" value={fmt(summary?.openingFloatAmount)} />
        <StatRow label="+ Cash Sales" value={fmt(summary?.cashNet)} color="text-emerald-600 dark:text-emerald-400" sign="+" />
        {(summary?.totalDeposits || 0) > 0 && (
          <StatRow label="+ Manual Deposits" value={fmt(summary?.totalDeposits)} color="text-emerald-600 dark:text-emerald-400" sign="+" />
        )}
        {(summary?.totalWithdrawals || 0) > 0 && (
          <StatRow label="− Withdrawals (Running)" value={fmt(summary?.totalWithdrawals)} color="text-red-500" sign="−" />
        )}
        <div className="flex justify-between items-center pt-2 mt-1 border-t border-border font-bold">
          <span className="text-sm">Expected Cash</span>
          <span className="font-mono text-primary text-base">₹{fmt(summary?.expectedClosingCashAmount)}</span>
        </div>
      </div>

      {/* Actual vs Expected */}
      {isClosed && (
        <div className={`border rounded-xl p-4 ${
          diff === 0
            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"
            : diff > 0
            ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
            : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30"
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Actual Closing Count</p>
              <p className="font-mono font-bold text-2xl mt-1">₹{fmt(summary?.actualClosingCashAmount)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Difference</p>
              <div className={`flex items-center gap-1 mt-1 font-mono font-bold text-lg ${
                diff === 0 ? "text-emerald-600" : diff > 0 ? "text-amber-600" : "text-red-500"
              }`}>
                {diff > 0 ? <TrendingUp className="size-4" /> : diff < 0 ? <TrendingDown className="size-4" /> : <Minus className="size-4" />}
                {diff > 0 ? "+" : ""}₹{fmt(diff)}
              </div>
            </div>
          </div>
          {summary?.frozenAtClose > 0 && (
            <p className="text-[11px] text-text-muted mt-2 pt-2 border-t border-border/30">
              Moved to Frozen at close: <span className="font-semibold">₹{fmt(summary?.frozenAtClose)}</span>
            </p>
          )}
        </div>
      )}

      {/* Shift meta */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        {[
          ["Shift Name", shiftName],
          ["Business Date", new Date(summary?.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })],
          ["Status", summary?.status?.toUpperCase()],
          ["Opened By", summary?.openedBy?.fullName || summary?.openedBy?.name || "System"],
          ["Opened At", summary?.openedAt ? new Date(summary.openedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "—"],
          isClosed && ["Closed By", summary?.closedBy?.fullName || summary?.closedBy?.name || "System"],
        ].filter(Boolean).map(([label, val]) => (
          <div key={label} className="bg-surface-secondary rounded-lg p-2.5 border border-border">
            <p className="text-[10px] text-text-muted mb-0.5">{label}</p>
            <p className="text-sm font-medium truncate">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBillsPayments = () => (
    <div className="space-y-5">
      {/* Cash bills */}
      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Banknote className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">Cash Bills</span>
          </div>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
            {summary?.cashInvoiceCount || 0} bills
          </span>
        </div>
        <p className="font-mono font-black text-2xl text-emerald-700 dark:text-emerald-400">₹{fmt(summary?.cashNet)}</p>
        <p className="text-[11px] text-emerald-600/70 dark:text-emerald-500 mt-1">Cash collected from cash bills this shift</p>
      </div>

      {/* UPI / QR bills */}
      <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <QrCode className="size-4 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-sm text-purple-800 dark:text-purple-300">UPI / QR Bills</span>
          </div>
          <span className="text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full font-bold">
            {summary?.paymentQrCount || 0} bills
          </span>
        </div>
        <p className="font-mono font-black text-2xl text-purple-700 dark:text-purple-400">₹{fmt(summary?.qrNet)}</p>

        {/* Per-QR breakdown */}
        {(summary?.upiBreakdown || []).length > 0 && (
          <div className="mt-3 space-y-1.5 border-t border-purple-200 dark:border-purple-500/30 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2">Per QR Breakdown</p>
            {summary.upiBreakdown.map((qr) => (
              <div key={qr.paymentQrId || "unattr"} className="flex justify-between items-center text-xs bg-white/50 dark:bg-black/10 rounded px-2 py-1.5">
                <div>
                  <p className="font-semibold">{qr.label || qr.upiId}</p>
                  <p className="text-[10px] text-text-muted">{qr.transactionCount} transactions</p>
                </div>
                <span className="font-mono font-bold">₹{fmt(qr.totalAmount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grand totals */}
      <div className="bg-surface-secondary border border-border rounded-xl p-4">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-text-muted mb-3">Total Sales</h4>
        <StatRow label="Total Invoices" value={fmt(summary?.invoiceCount)} />
        <StatRow label="Net Sales (All)" value={fmt(summary?.netSales)} color="text-primary" />
        {(summary?.returnCount || 0) > 0 && (
          <StatRow label={`Returns (${summary?.returnCount || 0})`} value={fmt(summary?.returnAmount)} color="text-red-500" />
        )}
      </div>
    </div>
  );

  const renderCashDrawer = () => {
    // If shift is open, show the live drawer instead of pending closing count
    const isLiveDrawer = !isClosed && currentBranchCash?.currentShiftId === shift?._id;
    const title = isClosed ? "Actual Count (Closing)" : isLiveDrawer ? "Current Drawer (Live)" : "Closing Count (Pending)";
    const denominations = isClosed 
      ? summary?.closingDenominations 
      : isLiveDrawer ? currentBranchCash?.denominationBalance?.runningDenominations : [];
    const total = isClosed 
      ? summary?.actualClosingCashAmount 
      : isLiveDrawer ? currentBranchCash?.runningCash : 0;
    const accent = isClosed ? "text-primary" : isLiveDrawer ? "text-emerald-600 dark:text-emerald-400" : "text-text-muted";

    return (
      <div className="grid grid-cols-2 gap-5">
        <DenomTable
          title="Opening Count"
          denominations={summary?.openingDenominations}
          total={summary?.openingFloatAmount}
        />
        <DenomTable
          title={title}
          denominations={denominations}
          total={total}
          accent={accent}
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
        <div className="py-10 text-center text-text-muted text-sm">
          No manual fund movements recorded in this shift.
        </div>
      );
    }

    return (
      <div className="space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Total Deposited</p>
            <p className="font-mono font-bold text-xl text-emerald-700 dark:text-emerald-400 mt-0.5">₹{fmt(summary?.totalDeposits)}</p>
            <p className="text-[11px] text-emerald-600/70 mt-0.5">{deposits.length} transaction{deposits.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400">Total Withdrawn</p>
            <p className="font-mono font-bold text-xl text-red-600 dark:text-red-400 mt-0.5">₹{fmt(summary?.totalWithdrawals)}</p>
            <p className="text-[11px] text-red-500/70 mt-0.5">{withdrawals.length} transaction{withdrawals.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Deposits */}
        {deposits.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-2">Deposits Into Running</h4>
            <div className="space-y-2">
              {deposits.map((d) => (
                <div key={d._id} className="flex justify-between items-center bg-surface-secondary border border-border rounded-lg px-3 py-2.5 text-sm">
                  <div>
                    <p className="font-medium">{d.narration || "Manual deposit"}</p>
                    <p className="text-[10px] text-text-muted">{d.createdBy} · {d.transferDate ? new Date(d.transferDate).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+₹{fmt(d.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Withdrawals */}
        {withdrawals.length > 0 && (
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-red-600 dark:text-red-400 mb-2">Withdrawals</h4>
            <div className="space-y-2">
              {withdrawals.map((w) => (
                <div key={w._id} className="flex justify-between items-center bg-surface-secondary border border-border rounded-lg px-3 py-2.5 text-sm">
                  <div>
                    <p className="font-medium">{w.narration || "Manual withdrawal"}</p>
                    <p className="text-[10px] text-text-muted">
                      From: {w.source === "running" ? "Running Cash" : w.source === "frozen" ? "Frozen Reserve" : "Unknown"} ·{" "}
                      {w.createdBy}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-red-500">−₹{fmt(w.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="xl">
      <UIModalHeader>
        <UIModalTitle>
          <span className="text-base">{shiftName}</span>
          <span className="text-sm font-normal text-text-muted ml-2">· {shift?.shiftNo}</span>
        </UIModalTitle>
      </UIModalHeader>
      <UIModalBody className="max-h-[78vh] overflow-y-auto">
        {loading ? (
          <div className="py-16 text-center text-text-muted">Loading shift summary…</div>
        ) : !summary ? (
          <div className="py-16 text-center text-text-muted">No summary available.</div>
        ) : (
          <div className="space-y-4">
            {/* Tab strip */}
            <div className="flex gap-1 p-1 bg-surface-secondary rounded-xl border border-border overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap flex-1 justify-center ${
                    activeTab === id
                      ? "bg-surface text-primary border border-border shadow-sm"
                      : "text-text-muted hover:text-text hover:bg-surface/60"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab body */}
            <div className="min-h-[300px]">
              {activeTab === "cash"   && renderCashSummary()}
              {activeTab === "bills"  && renderBillsPayments()}
              {activeTab === "drawer" && renderCashDrawer()}
              {activeTab === "funds"  && renderFundMovements()}
            </div>
          </div>
        )}
      </UIModalBody>
      <UIModalFooter>
        <UIButton variant="ghost" onClick={onClose}>Close</UIButton>
      </UIModalFooter>
    </UIModal>
  );
};
