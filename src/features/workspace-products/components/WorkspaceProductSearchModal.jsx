// src/features/workspace-products/components/WorkspaceProductSearchModal.jsx

import React from "react";
import { X, Search, Package } from "lucide-react";
import WorkspaceProductSearchBar from "./WorkspaceProductSearchBar";

/**
 * WorkspaceProductSearchModal
 * Modal popover for searching workspace products anywhere in the application.
 */
export const WorkspaceProductSearchModal = ({
  open,
  onClose,
  onSelectProduct,
  title = "Search Workspace Products",
  subtitle = "Search by name, SKU, manufacturer, or salt composition",
  productType,
  statusFilter,
  showQuickCreateAction = true,
  onCreateProductClick,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1500] flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="relative w-full max-w-xl overflow-visible rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-150 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Package className="size-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text">{title}</h3>
              <p className="text-xs text-text-muted">{subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-text transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search Input Bar with embedded results dropdown */}
        <div className="pb-2">
          <WorkspaceProductSearchBar
            autoFocus
            size="lg"
            productType={productType}
            statusFilter={statusFilter}
            showQuickCreateAction={showQuickCreateAction}
            onCreateProductClick={(term) => {
              if (onCreateProductClick) onCreateProductClick(term);
              onClose();
            }}
            onSelectProduct={(product, details) => {
              if (onSelectProduct) onSelectProduct(product, details);
              onClose();
            }}
          />
        </div>

        {/* Hints Footer */}
        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-text-muted">
          <span>Tip: Click product or press ↵ Enter to select</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:underline text-text-muted"
          >
            Press Esc to close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceProductSearchModal;
