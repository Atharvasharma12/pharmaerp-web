// src/features/finance/treasury/payment-qr/components/UpiTransactionsFilterModal.jsx

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, ArrowUpDown, RotateCcw, Check, Layers, Split } from "lucide-react";
import { UIModal, UIButton, UISelect } from "@/components/ui";

const SOURCE_TYPE_OPTIONS = [
  { label: "All Transaction Sources", value: "all" },
  { label: "Retail Sales Invoices", value: "invoice" },
  { label: "Customer Credit Settlements", value: "credit_settlement" },
  { label: "Customer Advance Receipts", value: "advance" },
];

const SORT_SELECT_OPTIONS = [
  { label: "Date: Newest First", value: "date-desc" },
  { label: "Date: Oldest First", value: "date-asc" },
  { label: "Amount: High to Low", value: "amount-desc" },
  { label: "Amount: Low to High", value: "amount-asc" },
  { label: "Reference #: A to Z", value: "referenceno-asc" },
  { label: "Reference #: Z to A", value: "referenceno-desc" },
];

const SPLIT_FILTER_OPTIONS = [
  { label: "All Transactions (Pure + Split)", value: "all" },
  { label: "Pure UPI Only", value: "pure" },
  { label: "Split Invoices Only", value: "split" },
];

export const UpiTransactionsFilterModal = ({
  isOpen,
  onClose,
  initialFilters = {},
  onApply,
  onReset,
}) => {
  const [sourceType, setSourceType] = useState("all");
  const [sortOption, setSortOption] = useState("date-desc");
  const [splitFilter, setSplitFilter] = useState("all");

  useEffect(() => {
    if (isOpen) {
      setSourceType(initialFilters.sourceType || "all");
      setSortOption(initialFilters.sortBy || "date-desc");
      setSplitFilter(initialFilters.splitFilter || "all");
    }
  }, [isOpen, initialFilters]);

  const handleApply = () => {
    onApply({
      sourceType,
      sortBy: sortOption,
      splitFilter,
    });
    onClose();
  };

  const handleReset = () => {
    setSourceType("all");
    setSortOption("date-desc");
    setSplitFilter("all");
    onReset();
    onClose();
  };

  const activeCount = [
    sourceType && sourceType !== "all" ? 1 : 0,
    sortOption && sortOption !== "date-desc" ? 1 : 0,
    splitFilter && splitFilter !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  if (!isOpen) return null;

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      title="Advanced UPI Filters"
      size="md"
    >
      <div className="p-5 space-y-4.5 font-sans">
        {/* ── 1. Transaction Source Type ── */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-alt/25 space-y-2">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Transaction Source
            </h4>
          </div>
          <p className="text-[11.5px] text-text-muted leading-relaxed">
            Filter transactions by origin stream (Sales Counter Billing, Credit Settlement, or Advance Deposit).
          </p>
          <div className="pt-1">
            <UISelect
              value={sourceType}
              onChange={(val) => setSourceType(val)}
              options={SOURCE_TYPE_OPTIONS}
              placeholder="Select Source"
              size="md"
            />
          </div>
        </div>

        {/* ── 2. Pure vs Split Allocation Filter ── */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-alt/25 space-y-2">
          <div className="flex items-center gap-2">
            <Split className="size-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Split Bill Allocation
            </h4>
          </div>
          <p className="text-[11.5px] text-text-muted leading-relaxed">
            Isolate direct 100% UPI settlements or inspect bills where UPI was paid in conjunction with Cash.
          </p>
          <div className="pt-1">
            <UISelect
              value={splitFilter}
              onChange={(val) => setSplitFilter(val)}
              options={SPLIT_FILTER_OPTIONS}
              placeholder="All Transactions"
              size="md"
            />
          </div>
        </div>

        {/* ── 3. Sort Order ── */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-alt/25 space-y-2">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Sort By
            </h4>
          </div>
          <div className="pt-1">
            <UISelect
              value={sortOption}
              onChange={(val) => setSortOption(val)}
              options={SORT_SELECT_OPTIONS}
              placeholder="Sort order"
              size="md"
            />
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <UIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            startIcon={<RotateCcw className="size-3.5 text-text-muted" />}
            className="text-text-muted hover:text-text text-xs"
          >
            Reset Filters
          </UIButton>

          <div className="flex items-center gap-2">
            <UIButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </UIButton>

            <UIButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApply}
              startIcon={<Check className="size-4" />}
              className="text-xs font-semibold px-4"
            >
              Apply {activeCount > 0 && `(${activeCount})`}
            </UIButton>
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default UpiTransactionsFilterModal;
