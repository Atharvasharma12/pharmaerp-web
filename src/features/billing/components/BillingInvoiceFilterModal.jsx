// src/features/billing/components/BillingInvoiceFilterModal.jsx
import React, { useState, useEffect } from "react";
import { SlidersHorizontal, Hash, Tag, ArrowUpDown, RotateCcw, Check } from "lucide-react";
import { UIModal, UIButton, UIInput, UISelect } from "@/components/ui";

export const BillingInvoiceFilterModal = ({
  isOpen,
  onClose,
  initialFilters = {},
  onApply,
  onReset,
  statusOptions = [],
  sortOptions = [],
}) => {
  const [fromInvoice, setFromInvoice] = useState("");
  const [toInvoice, setToInvoice] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date-desc");

  // Sync internal state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setFromInvoice(initialFilters.fromInvoice || "");
      setToInvoice(initialFilters.toInvoice || "");
      setSelectedStatus(initialFilters.status || "all");
      setSortOption(initialFilters.sortBy || "date-desc");
    }
  }, [isOpen, initialFilters]);

  const handleApply = () => {
    onApply({
      fromInvoice: fromInvoice.trim(),
      toInvoice: toInvoice.trim(),
      status: selectedStatus,
      sortBy: sortOption,
    });
    onClose();
  };

  const handleReset = () => {
    setFromInvoice("");
    setToInvoice("");
    setSelectedStatus("all");
    setSortOption("date-desc");
    onReset();
    onClose();
  };

  const activeCount = [
    fromInvoice.trim() ? 1 : 0,
    toInvoice.trim() ? 1 : 0,
    selectedStatus && selectedStatus !== "all" ? 1 : 0,
    sortOption && sortOption !== "date-desc" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  if (!isOpen) return null;

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      title="Advanced Invoice Filters"
      size="md"
    >
      <div className="p-5 space-y-4 font-sans">
        {/* ── 1. Invoice Number Range ── */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-alt/25 space-y-2.5">
          <div className="flex items-center gap-2">
            <Hash className="size-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Invoice Number Range
            </h4>
          </div>
          <p className="text-[11.5px] text-text-muted leading-relaxed">
            Specify an inclusive starting and ending invoice number (e.g. from <strong>35</strong> to <strong>55</strong> or serials like <strong>AEB-2627-0035</strong>).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                From Invoice #
              </label>
              <UIInput
                type="text"
                placeholder="e.g. 1 or 35"
                value={fromInvoice}
                onChange={(e) => setFromInvoice(e.target.value)}
                size="sm"
                isClearable
                onClear={() => setFromInvoice("")}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                To Invoice #
              </label>
              <UIInput
                type="text"
                placeholder="e.g. 20 or 55"
                value={toInvoice}
                onChange={(e) => setToInvoice(e.target.value)}
                size="sm"
                isClearable
                onClear={() => setToInvoice("")}
              />
            </div>
          </div>
        </div>

        {/* ── 2. Invoice Status ── */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-alt/25 space-y-2">
          <div className="flex items-center gap-2">
            <Tag className="size-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Invoice Status
            </h4>
          </div>
          <div className="pt-1">
            <UISelect
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              options={statusOptions}
              placeholder="All Statuses"
              size="md"
            />
          </div>
        </div>

        {/* ── 3. Sort Order ── */}
        <div className="p-3.5 rounded-xl border border-border bg-surface-alt/25 space-y-2">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4 text-primary" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Sort Sequence
            </h4>
          </div>
          <div className="pt-1">
            <UISelect
              value={sortOption}
              onChange={(val) => setSortOption(val)}
              options={sortOptions}
              placeholder="Sort Invoices"
              size="md"
            />
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <UIButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            startIcon={<RotateCcw className="size-3.5" />}
            className="text-text-muted hover:text-text"
          >
            Clear Filters {activeCount > 0 && `(${activeCount})`}
          </UIButton>

          <div className="flex items-center gap-2">
            <UIButton
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </UIButton>
            <UIButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApply}
              startIcon={<Check className="size-4" />}
            >
              Apply Filters
            </UIButton>
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default BillingInvoiceFilterModal;
