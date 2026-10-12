// src/features/parties/customers/components/CustomerStatementLedgerDialog.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  UIModal,
  UIButton,
  UIBadge,
  UIAlert,
} from "@/components/ui";
import {
  Wallet,
  CreditCard,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  PlusCircle,
  Printer,
  Phone,
  Mail,
  RefreshCw,
  Hash,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import customerService from "../services/customerService";
import CustomerAdvanceReceiptDialog from "./CustomerAdvanceReceiptDialog";
import CustomerSettlementDialog from "./CustomerSettlementDialog";

const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "0.00";
  return Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const CustomerStatementLedgerDialog = ({
  isOpen,
  onClose,
  customer: propCustomer,
  customerId: propCustomerId,
  onSuccess,
}) => {
  const resolvedCustomerId = propCustomer?._id || propCustomer?.id || propCustomerId;

  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(propCustomer || null);
  const [data, setData] = useState({ summary: {}, advances: [], credits: [] });
  const [ledgerData, setLedgerData] = useState([]);
  const [activeTab, setActiveTab] = useState("credits"); // 'credits' | 'advances' | 'ledger'
  const [creditFilter, setCreditFilter] = useState("PENDING"); // 'ALL' | 'PENDING' | 'SETTLED'
  const [error, setError] = useState(null);

  // Sub-dialog states for Receive Advance & Settle Credit inside Statement
  const [isAdvanceDialogOpen, setIsAdvanceDialogOpen] = useState(false);
  const [isSettlementDialogOpen, setIsSettlementDialogOpen] = useState(false);
  const [selectedInvoiceIdForSettle, setSelectedInvoiceIdForSettle] = useState(null);

  const fetchData = useCallback(async () => {
    if (!resolvedCustomerId || !isOpen) return;
    setLoading(true);
    setError(null);

    try {
      const [custRes, txRes, ledgerRes] = await Promise.all([
        customerService.getCustomerById(resolvedCustomerId),
        customerService.getCustomerTransactions(resolvedCustomerId),
        customerService.getCustomerLedger(resolvedCustomerId),
      ]);

      const custData = custRes?.data?.data || custRes?.data || propCustomer;
      setCustomer(custData);
      setData(txRes?.data?.data || txRes?.data || { summary: {}, advances: [], credits: [] });
      setLedgerData(
        ledgerRes?.data?.data?.entries ||
          ledgerRes?.data?.entries ||
          ledgerRes?.data ||
          []
      );
    } catch (err) {
      console.error("Failed to fetch customer statement & ledger:", err);
      setError("Failed to load customer transactions and statements.");
    } finally {
      setLoading(false);
    }
  }, [resolvedCustomerId, isOpen, propCustomer]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    } else {
      setData({ summary: {}, advances: [], credits: [] });
      setLedgerData([]);
      setActiveTab("credits");
      setCreditFilter("PENDING");
      setError(null);
    }
  }, [isOpen, fetchData]);

  const summary = data.summary || {};
  const creditOutstanding = Number(
    summary.creditOutstanding !== undefined
      ? summary.creditOutstanding
      : customer?.creditOutstanding || 0
  );
  const advanceBalance = Number(
    summary.advanceBalance !== undefined
      ? summary.advanceBalance
      : customer?.advanceBalance || 0
  );
  const overdueCount = Number(
    summary.overdueCount !== undefined
      ? summary.overdueCount
      : customer?.overdueCount || 0
  );
  const now = new Date();

  // Filtered credits
  const filteredCredits = useMemo(() => {
    const list = data.credits || [];
    if (creditFilter === "PENDING") {
      return list.filter((c) => ["PENDING", "PARTIAL"].includes(c.status));
    }
    if (creditFilter === "SETTLED") {
      return list.filter((c) => c.status === "SETTLED");
    }
    return list;
  }, [data.credits, creditFilter]);

  const handleOpenSettleInvoice = (invoiceId) => {
    setSelectedInvoiceIdForSettle(invoiceId);
    setIsSettlementDialogOpen(true);
  };

  const handlePrintStatement = () => {
    window.print();
  };

  const handleSubActionSuccess = () => {
    fetchData();
    if (onSuccess) onSuccess();
  };

  if (!isOpen) return null;

  return (
    <>
      <UIModal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        className="w-[96vw] max-w-6xl lg:w-[1150px] h-[88vh] min-h-[620px] max-h-[88vh] flex flex-col rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden font-sans"
      >
        <div className="p-6 font-sans flex flex-col h-full w-full overflow-hidden">
          {/* ── 1. Modal Header Bar ────────────────────────────────────────── */}
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
                <FileSpreadsheet className="size-6 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-text">
                    {customer?.name || "Customer Account Statement"}
                  </h2>
                  {customer?.customerCode && (
                    <UIBadge variant="soft" color="primary" className="font-mono text-xs font-semibold">
                      {customer.customerCode}
                    </UIBadge>
                  )}
                  <UIBadge
                    variant="soft"
                    color={
                      customer?.status === "active"
                        ? "success"
                        : customer?.status === "blocked"
                        ? "error"
                        : "neutral"
                    }
                    className="text-xs uppercase font-semibold"
                  >
                    {customer?.status || "active"}
                  </UIBadge>
                  <span className="text-[11px] font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded-md">
                    {(customer?.customerType || "retail").toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted mt-1 flex-wrap">
                  {customer?.mobile && (
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="size-3 text-text-muted" /> {customer.mobile}
                    </span>
                  )}
                  {customer?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="size-3 text-text-muted" /> {customer.email}
                    </span>
                  )}
                  <span className="text-text-muted/70">• Statement & Running Ledger</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <UIButton
                variant="outline"
                size="sm"
                startIcon={<RefreshCw className={cn("size-3.5 text-primary", loading && "animate-spin")} />}
                onClick={fetchData}
                disabled={loading}
              >
                Refresh
              </UIButton>
              <UIButton
                variant="outline"
                size="sm"
                startIcon={<Printer className="size-3.5" />}
                onClick={handlePrintStatement}
              >
                Print Statement
              </UIButton>
              <UIButton
                variant="outline"
                size="sm"
                startIcon={<PlusCircle className="size-3.5 text-emerald-600" />}
                onClick={() => setIsAdvanceDialogOpen(true)}
              >
                Receive Advance
              </UIButton>
              <UIButton
                variant="primary"
                size="sm"
                startIcon={<CheckCircle2 className="size-3.5" />}
                onClick={() => {
                  setSelectedInvoiceIdForSettle(null);
                  setIsSettlementDialogOpen(true);
                }}
              >
                Settle Credit
              </UIButton>
            </div>
          </div>

          {error && (
            <div className="shrink-0 pt-2">
              <UIAlert variant="danger">{error}</UIAlert>
            </div>
          )}

          {/* ── 2. Compact 4-Card Financial Overview ──────────────────────── */}
          <div className="shrink-0 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Credit Outstanding */}
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.03] dark:bg-rose-950/20 p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
                <span className="text-rose-600 dark:text-rose-400">Credit Outstanding</span>
                <div className="size-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <CreditCard className="size-3.5" />
                </div>
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
                ₹{formatCurrency(creditOutstanding)}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                {overdueCount > 0 ? (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <AlertTriangle className="size-3 text-amber-500" /> {overdueCount} Overdue Invoices
                  </span>
                ) : (
                  <span className="text-text-muted">All credit within maturity term</span>
                )}
              </div>
            </div>

            {/* Advance Balance Held */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] dark:bg-emerald-950/20 p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
                <span className="text-emerald-600 dark:text-emerald-400">Advance Balance Held</span>
                <div className="size-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Wallet className="size-3.5" />
                </div>
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                ₹{formatCurrency(advanceBalance)}
              </div>
              <div className="mt-1 text-[11px] text-text-muted">
                Prepayment available for automatic billing offset
              </div>
            </div>

            {/* Credit Limit */}
            <div className="rounded-xl border border-border bg-surface p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
                <span>Credit Limit</span>
                <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="size-3.5" />
                </div>
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-text tabular-nums">
                ₹{formatCurrency(customer?.creditLimit || 0)}
              </div>
              <div className="mt-1 text-[11px] text-text-muted font-mono">
                Avail: ₹{formatCurrency(Math.max(0, (customer?.creditLimit || 0) - creditOutstanding))}
              </div>
            </div>

            {/* Maturity Window & Net Receivable */}
            <div className="rounded-xl border border-border bg-surface p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
                <span>Maturity Window</span>
                <div className="size-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Clock className="size-3.5" />
                </div>
              </div>
              <div className="mt-1 text-xl sm:text-2xl font-bold font-mono text-text">
                {customer?.creditDays || 0} <span className="text-xs font-normal text-text-muted">Days</span>
              </div>
              <div className="mt-1 text-[11px] text-text-muted font-mono">
                Net Receivable: ₹{formatCurrency(Math.max(0, creditOutstanding - advanceBalance))}
              </div>
            </div>
          </div>

          {/* ── 3. Tabs Navigation ─────────────────────────────────────────── */}
          <div className="shrink-0 border-b border-border">
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => setActiveTab("credits")}
                className={cn(
                  "pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 select-none",
                  activeTab === "credits"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                )}
              >
                <CreditCard className="size-4" />
                <span>Credit Invoices ({data.credits?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("advances")}
                className={cn(
                  "pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 select-none",
                  activeTab === "advances"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                )}
              >
                <Wallet className="size-4" />
                <span>Advance History ({data.advances?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ledger")}
                className={cn(
                  "pb-2.5 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 select-none",
                  activeTab === "ledger"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                )}
              >
                <Receipt className="size-4" />
                <span>General Ledger ({ledgerData?.length || 0})</span>
              </button>
            </div>
          </div>

          {/* ── 4. Fixed Tab Body Content Container ────────────────────────── */}
          <div className="flex-1 min-h-0 pt-3 flex flex-col overflow-hidden">
            {/* Tab 1: Credit Invoices */}
            {activeTab === "credits" && (
              <div className="flex flex-col h-full overflow-hidden">
                <div className="shrink-0 pb-2.5 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCreditFilter("PENDING")}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        creditFilter === "PENDING"
                          ? "bg-primary text-white shadow-xs"
                          : "bg-surface-alt text-text-muted hover:text-text"
                      )}
                    >
                      Outstanding ({data.credits?.filter((c) => ["PENDING", "PARTIAL"].includes(c.status)).length || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreditFilter("SETTLED")}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        creditFilter === "SETTLED"
                          ? "bg-primary text-white shadow-xs"
                          : "bg-surface-alt text-text-muted hover:text-text"
                      )}
                    >
                      Settled ({data.credits?.filter((c) => c.status === "SETTLED").length || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreditFilter("ALL")}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        creditFilter === "ALL"
                          ? "bg-primary text-white shadow-xs"
                          : "bg-surface-alt text-text-muted hover:text-text"
                      )}
                    >
                      All ({data.credits?.length || 0})
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-border bg-surface">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 z-10 bg-surface-alt text-text-muted uppercase font-bold border-b border-border text-[11px]">
                      <tr>
                        <th className="p-3">Invoice No</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-right">Bill Total</th>
                        <th className="p-3 text-right">Settled Amount</th>
                        <th className="p-3 text-right">Balance Due</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="p-14 text-center text-text-muted">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <RefreshCw className="size-5 animate-spin text-primary" />
                              <span className="text-xs font-medium">Loading credit invoices...</span>
                            </div>
                          </td>
                        </tr>
                      ) : filteredCredits.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-14 text-center text-text-muted font-medium">
                            No credit invoices found for this filter.
                          </td>
                        </tr>
                      ) : (
                      filteredCredits.map((c) => {
                        const isOverdue = c.dueDate && new Date(c.dueDate) < now && c.status !== "SETTLED";

                        return (
                          <tr key={c._id} className="hover:bg-surface-hover/70 transition-colors">
                            <td className="p-3 font-mono font-bold text-primary">{c.invoiceNo}</td>
                            <td className="p-3 text-text-muted">
                              {new Date(c.invoiceDate || c.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-text tabular-nums">
                              ₹{formatCurrency(c.invoiceAmount)}
                            </td>
                            <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                              ₹{formatCurrency(c.paidAmount)}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                              ₹{formatCurrency(c.balanceDue)}
                            </td>
                            <td className="p-3">
                              <span
                                className={cn(
                                  "flex items-center gap-1 font-mono text-xs",
                                  isOverdue ? "text-amber-600 dark:text-amber-400 font-bold" : "text-text-muted"
                                )}
                              >
                                {c.dueDate
                                  ? new Date(c.dueDate).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                                {isOverdue && <AlertTriangle className="size-3 text-amber-500" />}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <UIBadge
                                variant="soft"
                                color={
                                  c.status === "SETTLED"
                                    ? "success"
                                    : isOverdue
                                    ? "warning"
                                    : c.status === "PARTIAL"
                                    ? "info"
                                    : "neutral"
                                }
                                className="font-semibold text-[10px]"
                              >
                                {isOverdue ? "OVERDUE" : c.status}
                              </UIBadge>
                            </td>
                            <td className="p-3 text-right">
                              {c.status !== "SETTLED" ? (
                                <UIButton
                                  variant="outline"
                                  size="xs"
                                  onClick={() => handleOpenSettleInvoice(c._id)}
                                >
                                  Settle
                                </UIButton>
                              ) : (
                                <span className="text-xs text-text-muted font-medium">Settled</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── 5. Tab 2: Advance Receipts ─────────────────────────────────── */}
          {activeTab === "advances" && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-surface-alt text-text-muted uppercase font-bold border-b border-border text-[11px]">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Transaction Type</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-right">Balance After</th>
                      <th className="p-3">Payment Mode</th>
                      <th className="p-3">Reference No</th>
                      <th className="p-3">Narration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="p-14 text-center text-text-muted">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="size-5 animate-spin text-primary" />
                            <span className="text-xs font-medium">Loading advance receipts...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (data.advances || []).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-14 text-center text-text-muted font-medium">
                          No advance payment history found for this customer.
                        </td>
                      </tr>
                    ) : (
                      data.advances.map((adv) => (
                        <tr key={adv._id} className="hover:bg-surface-hover/70 transition-colors">
                          <td className="p-3 text-text-muted font-mono">
                            {new Date(adv.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-3">
                            <UIBadge
                              variant="soft"
                              color={
                                adv.type === "ADVANCE_RECEIVED"
                                  ? "success"
                                  : adv.type === "CREDIT_SETTLED"
                                  ? "info"
                                  : "warning"
                              }
                              className="font-semibold text-[10.5px]"
                            >
                              {adv.type}
                            </UIBadge>
                          </td>
                          <td className="p-3 text-right font-mono font-bold tabular-nums">
                            <span
                              className={
                                adv.type === "ADVANCE_RECEIVED"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-text"
                              }
                            >
                              {adv.type === "ADVANCE_RECEIVED" ? "+" : "-"}₹
                              {formatCurrency(adv.amount)}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-text tabular-nums">
                            ₹{formatCurrency(adv.balanceAfter)}
                          </td>
                          <td className="p-3 text-text-muted">{adv.paymentMethod || "N/A"}</td>
                          <td className="p-3 font-mono text-text-muted">
                            {adv.referenceNumber || "N/A"}
                          </td>
                          <td className="p-3 text-text-muted max-w-[200px] truncate">
                            {adv.narration || "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── 6. Tab 3: Customer General Ledger ─────────────────────────── */}
          {activeTab === "ledger" && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-surface-alt text-text-muted uppercase font-bold border-b border-border text-[11px]">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Voucher Type</th>
                      <th className="p-3">Voucher No</th>
                      <th className="p-3 text-right">Debit (₹)</th>
                      <th className="p-3 text-right">Credit (₹)</th>
                      <th className="p-3 text-right">Balance (₹)</th>
                      <th className="p-3">Narration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="p-14 text-center text-text-muted">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <RefreshCw className="size-5 animate-spin text-primary" />
                            <span className="text-xs font-medium">Loading ledger entries...</span>
                          </div>
                        </td>
                      </tr>
                    ) : ledgerData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-14 text-center text-text-muted font-medium">
                          No ledger entries recorded yet.
                        </td>
                      </tr>
                    ) : (
                      ledgerData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-surface-hover/70 transition-colors">
                          <td className="p-3 text-text-muted font-mono">
                            {row.date ? new Date(row.date).toLocaleDateString("en-IN") : "-"}
                          </td>
                          <td className="p-3 font-semibold text-text">{row.voucherType || row.type || "SALE"}</td>
                          <td className="p-3 font-mono text-primary font-bold">{row.voucherNumber || row.refNo || "-"}</td>
                          <td className="p-3 text-right font-mono text-rose-600 dark:text-rose-400 font-bold tabular-nums">
                            {row.debit ? `₹${formatCurrency(row.debit)}` : "-"}
                          </td>
                          <td className="p-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                            {row.credit ? `₹${formatCurrency(row.credit)}` : "-"}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-text tabular-nums">
                            {row.runningBalance !== undefined
                              ? `₹${formatCurrency(row.runningBalance)}`
                              : "-"}
                          </td>
                          <td className="p-3 text-text-muted max-w-[220px] truncate">{row.narration || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>

          {/* ── 7. Modal Footer ────────────────────────────────────────────── */}
          <div className="shrink-0 flex items-center justify-end gap-2 pt-3 border-t border-border mt-3">
            <UIButton
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              className="px-5"
            >
              Close
            </UIButton>
          </div>
        </div>
      </UIModal>

      {/* Sub-modals for Receive Advance & Settle Credit directly from Statement */}
      {customer && (
        <>
          <CustomerAdvanceReceiptDialog
            isOpen={isAdvanceDialogOpen}
            onClose={() => setIsAdvanceDialogOpen(false)}
            customer={customer}
            onSuccess={handleSubActionSuccess}
          />

          <CustomerSettlementDialog
            isOpen={isSettlementDialogOpen}
            onClose={() => {
              setIsSettlementDialogOpen(false);
              setSelectedInvoiceIdForSettle(null);
            }}
            customer={customer}
            preselectedInvoiceId={selectedInvoiceIdForSettle}
            onSuccess={handleSubActionSuccess}
          />
        </>
      )}
    </>
  );
};

export default CustomerStatementLedgerDialog;
