// src/features/finance/account-balances/components/AccountBalanceDetailsDialog.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Hash,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import { UIModal, UIButton, UIBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import accountBalanceService from "../services/accountBalanceService";

const formatCurrency = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "0.00";
  return Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const AccountBalanceDetailsDialog = ({
  isOpen,
  onClose,
  accountId,
  onRecalculateSuccess,
}) => {
  const [balanceDetails, setBalanceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Fetch balance details by account ID
  const fetchDetails = useCallback(async () => {
    if (!accountId || !isOpen) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await accountBalanceService.getAccountBalanceByAccountId(accountId);
      const data = res.data?.data || res.data;
      setBalanceDetails(data);
    } catch (err) {
      console.error("Failed to load account balance details:", err);
      const msg = err.response?.data?.message || "Failed to load account details.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsLoading(false);
    }
  }, [accountId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchDetails();
    } else {
      setBalanceDetails(null);
      setFeedback(null);
    }
  }, [isOpen, fetchDetails]);

  // Recalculate balance on-demand
  const handleRecalculate = async () => {
    if (!accountId || isRecalculating) return;
    setIsRecalculating(true);
    setFeedback(null);
    try {
      const res = await accountBalanceService.recalculateAccountBalance(accountId);
      const updated = res.data?.data || res.data;
      if (updated) {
        setBalanceDetails((prev) => ({
          ...prev,
          ...updated,
        }));
      } else {
        await fetchDetails();
      }
      setFeedback({
        type: "success",
        message: "Account ledger sheet recalculated and verified successfully.",
      });
      if (onRecalculateSuccess) {
        onRecalculateSuccess(accountId);
      }
    } catch (err) {
      console.error("Recalculate balance error:", err);
      const msg = err.response?.data?.message || "Failed to recalculate balance.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setIsRecalculating(false);
      setTimeout(() => {
        setFeedback((f) => (f?.type === "success" ? null : f));
      }, 4000);
    }
  };

  const handleCopyCode = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  const account = balanceDetails?.accountId || {};
  const accName = account.accountName || "Account Details";
  const accCode = account.accountCode || "—";
  const accNature = String(account.accountNature || "ASSET").toUpperCase();
  const accCategory = account.accountCategory || "GENERAL";
  const openingBal = Number(account.openingBalance || 0);
  const openingType = String(account.openingBalanceType || "dr").toLowerCase();

  const debitTotal = Number(balanceDetails?.debitTotal || 0);
  const creditTotal = Number(balanceDetails?.creditTotal || 0);
  const balance = Number(balanceDetails?.balance || 0);
  const balanceType = String(balanceDetails?.balanceType || "dr").toLowerCase();
  const isDebit = balanceType === "dr";

  const renderNatureBadge = (nature) => {
    switch (nature) {
      case "ASSET":
        return <UIBadge variant="soft" color="info" className="font-semibold text-xs">ASSET</UIBadge>;
      case "LIABILITY":
        return <UIBadge variant="soft" color="warning" className="font-semibold text-xs">LIABILITY</UIBadge>;
      case "INCOME":
        return <UIBadge variant="soft" color="success" className="font-semibold text-xs">INCOME</UIBadge>;
      case "EXPENSE":
        return <UIBadge variant="soft" color="error" className="font-semibold text-xs">EXPENSE</UIBadge>;
      case "EQUITY":
        return <UIBadge variant="soft" color="primary" className="font-semibold text-xs">EQUITY</UIBadge>;
      default:
        return <UIBadge variant="soft" color="neutral" className="font-semibold text-xs">{nature}</UIBadge>;
    }
  };

  const renderCategoryTag = (cat) => {
    const c = String(cat || "").toUpperCase();
    if (c.includes("CUSTOMER")) {
      return (
        <span className="text-[11px] font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded-md">
          Customer Ledger
        </span>
      );
    }
    if (c.includes("SUPPLIER")) {
      return (
        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded-md">
          Supplier Ledger
        </span>
      );
    }
    if (c.includes("CASH") || c.includes("BANK")) {
      return (
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-md">
          Treasury Account
        </span>
      );
    }
    if (c.includes("SALES")) {
      return (
        <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded-md">
          Revenue / Sales
        </span>
      );
    }
    return (
      <span className="text-[11px] font-semibold text-text-muted px-2 py-0.5 bg-surface-alt rounded-md">
        {cat}
      </span>
    );
  };

  return (
    <UIModal
      isOpen={isOpen}
      onClose={isRecalculating ? undefined : onClose}
      closeOnBackdrop={!isRecalculating}
      closeOnEsc={!isRecalculating}
      showCloseButton={!isRecalculating}
      size="lg"
    >
      <div className="p-6 font-sans space-y-5 max-h-[88vh] overflow-y-auto">
        {/* ── 1. Modal Header ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <BookOpen className="size-5.5 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight text-text">
                  {accName}
                </h2>
                {renderNatureBadge(accNature)}
                {renderCategoryTag(accCategory)}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                <span className="font-mono font-semibold text-primary flex items-center gap-1">
                  <Hash className="size-3 text-text-muted" />
                  {accCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(accCode)}
                  className="text-text-muted hover:text-text transition-colors flex items-center gap-1 text-[11px] font-medium"
                  title="Copy Account Code"
                >
                  {copiedCode ? (
                    <Check className="size-3 text-emerald-600" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  {copiedCode ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UIButton
              type="button"
              variant="secondary"
              size="sm"
              disabled={isRecalculating || isLoading}
              onClick={handleRecalculate}
              startIcon={
                <RefreshCw
                  className={cn("size-3.5 text-primary", isRecalculating && "animate-spin")}
                />
              }
              className="h-8 px-2.5 text-xs font-semibold"
            >
              {isRecalculating ? "Recalculating..." : "Recalculate"}
            </UIButton>
          </div>
        </div>

        {/* ── 2. Feedback Alert ─────────────────────────────────────────── */}
        {feedback && (
          <div
            className={cn(
              "flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold",
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
            )}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="size-4 shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* ── 3. Loading Skeleton or Main Content ───────────────────────── */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="size-7 text-primary animate-spin" />
            <p className="text-sm font-medium text-text-muted">Loading account details...</p>
          </div>
        ) : (
          <>
            {/* ── Hero Closing Balance Card ────────────────────────────── */}
            <div
              className={cn(
                "rounded-2xl p-5 border shadow-sm transition-all relative overflow-hidden",
                isDebit
                  ? "bg-emerald-500/[0.04] border-emerald-500/30 dark:bg-emerald-950/20"
                  : "bg-rose-500/[0.04] border-rose-500/30 dark:bg-rose-950/20"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11.5px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <Scale className="size-3.5" /> Effective Closing Balance
                  </span>
                  <div className="flex items-baseline gap-2.5 mt-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-text tabular-nums">
                      ₹ {formatCurrency(balance)}
                    </span>
                    <UIBadge
                      variant="solid"
                      color={isDebit ? "success" : "error"}
                      className="text-xs font-black px-2 py-0.5 tracking-wider"
                    >
                      {isDebit ? "DEBIT (DR)" : "CREDIT (CR)"}
                    </UIBadge>
                  </div>
                  <p className="text-xs text-text-muted mt-1 font-medium">
                    {accNature === "ASSET"
                      ? isDebit
                        ? "Asset Resource / Customer Receivable (Debit Balance - Debtor owes pharmacy)"
                        : "Credit balance on asset account (Overpaid or advance position)"
                      : accNature === "LIABILITY"
                      ? !isDebit
                        ? "Liability Obligation (Credit Balance - Pharmacy owes party/supplier)"
                        : "Debit balance on liability account (Prepaid or advance deposited)"
                      : `${accNature} normal standing: ${isDebit ? "Debit (Dr)" : "Credit (Cr)"}`}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-center">
                  <div
                    className={cn(
                      "size-12 rounded-2xl flex items-center justify-center shadow-xs",
                      isDebit
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {isDebit ? (
                      <ArrowUpRight className="size-6 stroke-[2.2]" />
                    ) : (
                      <ArrowDownRight className="size-6 stroke-[2.2]" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 4. Detailed Turnover Breakdown (3 Columns) ───────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Debit Volume */}
              <div className="p-3.5 rounded-xl bg-surface-alt/40 border border-border/80">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpRight className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Debit Turnover (Dr)
                </span>
                <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                  ₹ {formatCurrency(debitTotal)}
                </p>
                <span className="text-[10.5px] text-text-muted">Total debited to ledger</span>
              </div>

              {/* Credit Volume */}
              <div className="p-3.5 rounded-xl bg-surface-alt/40 border border-border/80">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                  <ArrowDownRight className="size-3.5 text-rose-600 dark:text-rose-400" />
                  Credit Turnover (Cr)
                </span>
                <p className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
                  ₹ {formatCurrency(creditTotal)}
                </p>
                <span className="text-[10.5px] text-text-muted">Total credited to ledger</span>
              </div>

              {/* Opening Balance */}
              <div className="p-3.5 rounded-xl bg-surface-alt/40 border border-border/80">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                  <Scale className="size-3.5 text-primary" />
                  Opening Balance
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-lg font-bold font-mono text-text tabular-nums">
                    ₹ {formatCurrency(openingBal)}
                  </p>
                  <span className="text-[10.5px] font-bold uppercase text-text-muted">
                    {openingType}
                  </span>
                </div>
                <span className="text-[10.5px] text-text-muted">Carried forward baseline</span>
              </div>
            </div>

            {/* ── 5. Account Classification & Accounting Rules ─────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Classification Info */}
              <div className="p-4 rounded-xl bg-surface border border-border/80 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-text text-sm">
                  <Layers className="size-4 text-primary" />
                  <span>Chart of Accounts Classification</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="text-text-muted">Nature Group:</span>
                    <span className="font-bold text-text">{accNature}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="text-text-muted">Account Category:</span>
                    <span className="font-semibold text-text">{accCategory}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/50">
                    <span className="text-text-muted">System Controlled:</span>
                    <span className="font-semibold text-text">
                      {account.isSystem ? "Yes (Protected)" : "No (Custom User Account)"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-text-muted">Ledger Account ID:</span>
                    <span className="font-mono text-[11px] text-text-muted truncate max-w-[180px]">
                      {account._id || accountId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accounting Rules */}
              <div className="p-4 rounded-xl bg-surface border border-border/80 space-y-3">
                <div className="flex items-center gap-1.5 font-bold text-text text-sm">
                  <Info className="size-4 text-primary" />
                  <span>Double-Entry Bookkeeping Rule</span>
                </div>

                <p className="text-xs text-text-muted leading-relaxed">
                  {accNature === "ASSET" && (
                    <>
                      <strong>Assets</strong> increase on the <strong>Debit</strong> side and decrease on the <strong>Credit</strong> side. For customer accounts, a debit closing balance indicates credit taken that is currently owed to the pharmacy.
                    </>
                  )}
                  {accNature === "LIABILITY" && (
                    <>
                      <strong>Liabilities</strong> increase on the <strong>Credit</strong> side and decrease on the <strong>Debit</strong> side. A credit balance indicates an outstanding payable obligation to a supplier or customer advance.
                    </>
                  )}
                  {accNature === "INCOME" && (
                    <>
                      <strong>Revenue & Income</strong> accounts normally hold a <strong>Credit</strong> balance representing cumulative earned revenue.
                    </>
                  )}
                  {accNature === "EXPENSE" && (
                    <>
                      <strong>Expenses</strong> normally maintain a <strong>Debit</strong> balance reflecting cumulative operational costs.
                    </>
                  )}
                  {accNature === "EQUITY" && (
                    <>
                      <strong>Equity</strong> accounts represent pharmacy capital and retain earnings, normally holding a <strong>Credit</strong> balance.
                    </>
                  )}
                </p>

                <div className="p-2.5 rounded-lg bg-surface-alt/60 text-[11px] text-text-muted flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                  <span>Real-time balance derived from posted Journal & Settlement Vouchers.</span>
                </div>
              </div>
            </div>

            {/* ── 6. Audit & Timestamp Log ─────────────────────────────── */}
            <div className="p-3.5 rounded-xl bg-surface-alt/30 border border-border text-xs flex flex-wrap items-center justify-between gap-3 text-text-muted">
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 text-text-muted" />
                <span>Last Transaction Posted:</span>
                <strong className="text-text font-mono">
                  {balanceDetails?.lastTransactionAt
                    ? `${formatDate(balanceDetails.lastTransactionAt)} ${formatTime(balanceDetails.lastTransactionAt)}`
                    : "No transactions posted"}
                </strong>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 text-text-muted" />
                <span>Last Recalculated:</span>
                <strong className="text-text font-mono">
                  {balanceDetails?.updatedAt
                    ? `${formatDate(balanceDetails.updatedAt)} ${formatTime(balanceDetails.updatedAt)}`
                    : "—"}
                </strong>
              </div>
            </div>
          </>
        )}

        {/* ── 7. Modal Footer Actions ───────────────────────────────────── */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <UIButton
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isRecalculating}
            className="px-4"
          >
            Close
          </UIButton>
        </div>
      </div>
    </UIModal>
  );
};

export default AccountBalanceDetailsDialog;
