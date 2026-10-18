// src/features/finance/treasury/bank-management/bank-transactions/components/BankTransactionsFilterModal.jsx

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, ArrowUpDown, RotateCcw, Check, Layers, ShieldCheck, Landmark } from "lucide-react";
import { UIModal, UIButton, UISelect } from "@/components/ui";

const TRANSACTION_TYPE_OPTIONS = [
  { label: "All Transaction Types", value: "all" },
  { label: "Bank Deposit", value: "DEPOSIT" },
  { label: "Cash Withdrawal", value: "WITHDRAWAL" },
  { label: "NEFT Transfer", value: "NEFT" },
  { label: "RTGS Transfer", value: "RTGS" },
  { label: "IMPS Transfer", value: "IMPS" },
  { label: "UPI Payment", value: "UPI" },
  { label: "Cheque Clearing", value: "CHEQUE" },
  { label: "Bank Charges & Fees", value: "BANK_CHARGES" },
  { label: "Interest Credited", value: "INTEREST" },
  { label: "Other Bank Transaction", value: "OTHER" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Posted to Ledger", value: "POSTED" },
  { label: "Draft (Pending Post)", value: "DRAFT" },
  { label: "Cancelled / Voided", value: "CANCELLED" },
];

const SORT_SELECT_OPTIONS = [
  { label: "Date: Newest First", value: "date-desc" },
  { label: "Date: Oldest First", value: "date-asc" },
  { label: "Amount: High to Low", value: "amount-desc" },
  { label: "Amount: Low to High", value: "amount-asc" },
  { label: "Transaction #: A to Z", value: "number-asc" },
  { label: "Transaction #: Z to A", value: "number-desc" },
];

export const BankTransactionsFilterModal = ({
  isOpen,
  onClose,
  initialFilters = {},
  onApply,
  onReset,
}) => {
  const [transactionType, setTransactionType] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date-desc");

  useEffect(() => {
    if (isOpen) {
      setTransactionType(initialFilters.transactionType || "all");
      setStatus(initialFilters.status || "all");
      setSortOption(initialFilters.sortBy || "date-desc");
    }
  }, [isOpen, initialFilters]);

  const handleApply = () => {
    onApply({
      transactionType,
      status,
      sortBy: sortOption,
    });
    onClose();
  };

  const handleReset = () => {
    setTransactionType("all");
    setStatus("all");
    setSortOption("date-desc");
    onReset();
    onClose();
  };

  const activeCount = [
    transactionType && transactionType !== "all" ? 1 : 0,
    status && status !== "all" ? 1 : 0,
    sortOption && sortOption !== "date-desc" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  if (!isOpen) return null;

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      title="Advanced Bank Transaction Filters"
      size="md"
    >
      <div className="p-5 space-y-4 font-sans text-text">
        {/* ── 1. Transaction Type ── */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-alt/25 space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Transaction Type
            </h4>
          </div>
          <p className="text-[11.5px] text-text-muted leading-relaxed">
            Filter transactions by transaction mode (Deposit, Withdrawal, NEFT, RTGS, IMPS, UPI, Cheque, Charges, Interest).
          </p>
          <div className="pt-1">
            <UISelect
              value={transactionType}
              onChange={(val) => setTransactionType(val)}
              options={TRANSACTION_TYPE_OPTIONS}
              placeholder="Select Type"
              size="md"
            />
          </div>
        </div>

        {/* ── 2. Ledger Status ── */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-alt/25 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Posting Status
            </h4>
          </div>
          <p className="text-[11.5px] text-text-muted leading-relaxed">
            Filter by transaction verification state in ledger accounts.
          </p>
          <div className="pt-1">
            <UISelect
              value={status}
              onChange={(val) => setStatus(val)}
              options={STATUS_OPTIONS}
              placeholder="Select Status"
              size="md"
            />
          </div>
        </div>

        {/* ── 3. Sort Order ── */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-alt/25 space-y-2">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Sort Records By
            </h4>
          </div>
          <div className="pt-1">
            <UISelect
              value={sortOption}
              onChange={(val) => setSortOption(val)}
              options={SORT_SELECT_OPTIONS}
              placeholder="Select Sort"
              size="md"
            />
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="pt-2 flex items-center justify-between border-t border-border">
          <UIButton
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-text-muted hover:text-text gap-1.5"
            disabled={activeCount === 0}
          >
            <RotateCcw className="size-3.5" />
            Reset All
          </UIButton>

          <div className="flex items-center gap-2">
            <UIButton
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </UIButton>
            <UIButton
              variant="primary"
              size="sm"
              onClick={handleApply}
              className="gap-1.5"
            >
              <Check className="size-4" />
              Apply Filters {activeCount > 0 && `(${activeCount})`}
            </UIButton>
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default BankTransactionsFilterModal;
