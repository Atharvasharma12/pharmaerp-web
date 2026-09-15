// src/features/workspace-products/components/WorkspaceProductDetailsModal.jsx

import React from "react";
import {
  X,
  Package,
  Hash,
  Building2,
  Tag,
  FileText,
  Percent,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Layers,
  Calendar,
  Pill,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * WorkspaceProductDetailsModal
 * Displays detailed information about a workspace product including master specs,
 * pricing, HSN codes, salts/compositions, and facility availability.
 */
export const WorkspaceProductDetailsModal = ({
  open,
  onClose,
  product,
  isLoading = false,
  onSelect,
}) => {
  if (!open) return null;

  const name = product?.displayName || product?.name || "Workspace Product Details";
  const sku = product?.displaySku || product?.sku || product?.code || "-";
  const category = product?.displayCategory || product?.category || "-";
  const manufacturer = product?.displayManufacturer || product?.manufacturer || product?.brand || "-";
  const dosageForm = product?.displayDosageForm || product?.dosageForm || product?.productType || "-";
  const strength = product?.displayStrength || product?.strength || "-";
  const status = product?.displayStatus || product?.status || "active";
  const hsnCode = product?.hsnCode || product?.hsn || product?.hsnMaster?.hsnCode || "-";
  const gstRate = product?.gstRate ?? product?.taxRate ?? product?.gst ?? "-";
  const saltComposition = product?.saltComposition || product?.saltMaster?.name || product?.salt || "-";
  const uom = product?.unitOfMeasurement || product?.uomMaster?.name || product?.uom || "-";
  const mrp = product?.mrp ?? product?.price ?? "-";
  const purchasePrice = product?.purchasePrice ?? product?.costPrice ?? "-";
  const notes = product?.notes || product?.description || null;
  const createdAt = product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : null;

  const isActive = status === "active";

  return (
    <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50 duration-150">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface-alt/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Package className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-text truncate max-w-[360px]">
                  {name}
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border shrink-0",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
                  )}
                >
                  <span className={cn("size-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-slate-400")} />
                  {status}
                </span>
              </div>
              <span className="text-xs text-text-muted">
                Workspace Custom Product Details
              </span>
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

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-text-muted space-y-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Fetching full workspace product details...</p>
            </div>
          ) : (
            <>
              {/* Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-surface-alt/40 p-3 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
                    <Hash className="size-3 text-primary" /> SKU Code
                  </span>
                  <span className="text-sm font-mono font-bold text-text mt-1 truncate">
                    {sku}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-surface-alt/40 p-3 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
                    <Tag className="size-3 text-purple-500" /> Category
                  </span>
                  <span className="text-sm font-semibold text-text mt-1 truncate">
                    {category}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-surface-alt/40 p-3 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
                    <Pill className="size-3 text-blue-500" /> Form & Strength
                  </span>
                  <span className="text-sm font-semibold text-text mt-1 truncate">
                    {[dosageForm, strength].filter((x) => x !== "-").join(" ") || "-"}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-surface-alt/40 p-3 flex flex-col justify-between">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="size-3 text-amber-500" /> Manufacturer
                  </span>
                  <span className="text-sm font-semibold text-text mt-1 truncate">
                    {manufacturer}
                  </span>
                </div>
              </div>

              {/* General Specs Section */}
              <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                <h4 className="text-xs font-bold text-text uppercase tracking-wider text-text-muted">
                  Specifications & Tax Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-alt/40 border border-border/60">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <FileText className="size-3.5" /> HSN Code
                    </span>
                    <span className="font-mono font-semibold text-text">{hsnCode}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-alt/40 border border-border/60">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <Percent className="size-3.5" /> GST Tax Rate
                    </span>
                    <span className="font-semibold text-text">{gstRate !== "-" ? `${gstRate}%` : "-"}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-alt/40 border border-border/60">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <Layers className="size-3.5" /> Unit of Measurement
                    </span>
                    <span className="font-semibold text-text">{uom}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-alt/40 border border-border/60">
                    <span className="text-text-muted flex items-center gap-1.5">
                      <FlaskConical className="size-3.5 text-teal-500" /> Composition / Salt
                    </span>
                    <span className="font-semibold text-text truncate max-w-[160px]">{saltComposition}</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Commercials (if available) */}
              {(mrp !== "-" || purchasePrice !== "-") && (
                <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
                  <h4 className="text-xs font-bold text-text uppercase tracking-wider text-text-muted">
                    Pricing Overview
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex flex-col">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium">MRP / Retail Price</span>
                      <span className="text-base font-bold text-text mt-0.5">{mrp !== "-" ? `₹${mrp}` : "-"}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 flex flex-col">
                      <span className="text-blue-700 dark:text-blue-400 font-medium">Purchase / Cost Price</span>
                      <span className="text-base font-bold text-text mt-0.5">{purchasePrice !== "-" ? `₹${purchasePrice}` : "-"}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes or description */}
              {notes && (
                <div className="rounded-xl border border-border bg-surface p-4 space-y-1">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                    Notes & Description
                  </span>
                  <p className="text-xs text-text leading-relaxed">{notes}</p>
                </div>
              )}

              {createdAt && (
                <div className="flex items-center justify-between text-[11px] text-text-muted px-1 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" /> Created: {createdAt}
                  </span>
                  <span>Workspace catalog item</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-3.5 bg-surface-alt/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text rounded-xl hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Close
          </button>
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Select Product</span>
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceProductDetailsModal;
