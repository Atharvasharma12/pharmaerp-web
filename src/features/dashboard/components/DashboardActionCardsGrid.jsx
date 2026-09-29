// src/features/dashboard/components/DashboardActionCardsGrid.jsx

import React from "react";
import {
  AlertTriangle,
  CalendarDays,
  Receipt,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { UICard, UIButton, UIBadge } from "@/components/ui";
import { cn } from "@/lib/utils";

export const DashboardActionCardsGrid = ({
  lowStockItems = [],
  expiringBatches = [],
  recentPurchaseBills = [],
  onReorderClick,
  onExpiryDetailsClick,
  onReviewOrdersClick,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6 font-sans", className)}>
      {/* ── 1. Low Stock Medicines Card ────────────────────────────── */}
      <UICard
        variant="default"
        className="flex flex-col justify-between p-5 sm:p-6 border-border rounded-2xl bg-surface shadow-xs"
      >
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-border/70">
            <div className="size-9 rounded-xl bg-warning-soft border border-warning/20 flex items-center justify-center text-warning shrink-0 shadow-2xs">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text tracking-tight">
                Low Stock Medicines
              </h3>
              <p className="text-xs text-text-muted">
                {lowStockItems.length} item{lowStockItems.length === 1 ? "" : "s"} below threshold
              </p>
            </div>
          </div>

          {/* List of items */}
          <div className="divide-y divide-border/50 py-2 min-h-[140px] flex flex-col justify-center">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 text-xs group hover:bg-surface-alt/50 px-1 rounded-lg transition-colors"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-text group-hover:text-warning transition-colors truncate">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-text-muted font-mono">
                      Batch #{item.batch}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-warning tabular-nums shrink-0">
                    {item.remaining} left
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6 text-text-muted">
                <CheckCircle className="size-7 text-success mb-1 opacity-70" />
                <span className="text-xs font-semibold text-text">Stock is healthy</span>
                <span className="text-[11px]">No items under 10 units threshold</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-border/70">
          <UIButton
            variant="outline"
            size="sm"
            onClick={onReorderClick}
            className="w-full justify-center text-warning hover:bg-warning-soft hover:border-warning/40 font-semibold"
            rightIcon={<ArrowRight className="size-4" />}
          >
            Manage Inventory
          </UIButton>
        </div>
      </UICard>

      {/* ── 2. Expiry Alerts Card ──────────────────────────────────── */}
      <UICard
        variant="default"
        className="flex flex-col justify-between p-5 sm:p-6 border-border rounded-2xl bg-surface shadow-xs"
      >
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-border/70">
            <div className="size-9 rounded-xl bg-error-soft border border-error/20 flex items-center justify-center text-error shrink-0 shadow-2xs">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text tracking-tight">
                Expiry Alerts
              </h3>
              <p className="text-xs text-text-muted">
                Next 30 days window
              </p>
            </div>
          </div>

          {/* Big Stat Count */}
          <div className="pt-3 pb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-text tabular-nums">
                {expiringBatches.length}
              </span>
              <span className="text-xs text-text-muted font-medium">
                batch{expiringBatches.length === 1 ? "" : "es"} expiring soon
              </span>
            </div>
          </div>

          {/* Quick List Preview */}
          <div className="divide-y divide-border/50 py-1 min-h-[90px] flex flex-col justify-center">
            {expiringBatches.length > 0 ? (
              expiringBatches.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1.5 text-xs"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-text font-medium truncate max-w-[170px]">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      Batch #{item.batch}
                    </span>
                  </div>
                  <span className="font-mono text-error text-[11px] font-semibold shrink-0">
                    {item.daysLeft === 0 ? "Expired" : `In ${item.daysLeft}d`}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-3 text-text-muted">
                <CheckCircle className="size-6 text-success mb-1 opacity-70" />
                <span className="text-xs font-semibold text-text">No batches expiring</span>
                <span className="text-[11px]">All batches valid beyond 30 days</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-border/70">
          <UIButton
            variant="outline"
            size="sm"
            onClick={onExpiryDetailsClick}
            className="w-full justify-center text-error hover:bg-error-soft hover:border-error/40 font-semibold"
            rightIcon={<ArrowRight className="size-4" />}
          >
            Review Batches
          </UIButton>
        </div>
      </UICard>

      {/* ── 3. Recent Purchase Bills & Payables Card ───────────────── */}
      <UICard
        variant="default"
        className="flex flex-col justify-between p-5 sm:p-6 border-border rounded-2xl bg-surface shadow-xs"
      >
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-border/70">
            <div className="size-9 rounded-xl bg-info-soft border border-info/20 flex items-center justify-center text-info shrink-0 shadow-2xs">
              <Receipt className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text tracking-tight">
                Recent Purchase Bills
              </h3>
              <p className="text-xs text-text-muted">
                Live supplier billings
              </p>
            </div>
          </div>

          {/* List of Supplier Bills */}
          <div className="divide-y divide-border/50 py-2 min-h-[140px] flex flex-col justify-center">
            {recentPurchaseBills.length > 0 ? (
              recentPurchaseBills.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 text-xs group hover:bg-surface-alt/50 px-1 rounded-lg transition-colors"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-text group-hover:text-primary transition-colors truncate">
                      {item.supplierName}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted">
                      {item.billNo}
                    </span>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-mono font-bold text-text tabular-nums">
                      ₹{Number(item.amount || 0).toLocaleString()}
                    </span>
                    <UIBadge
                      variant="soft"
                      intent={item.status === "CONFIRMED" ? "success" : "neutral"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {item.status}
                    </UIBadge>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6 text-text-muted">
                <Receipt className="size-7 text-text-muted opacity-40 mb-1" />
                <span className="text-xs font-semibold text-text">No purchase bills yet</span>
                <span className="text-[11px]">Recorded supplier bills will appear here</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-border/70">
          <UIButton
            variant="outline"
            size="sm"
            onClick={onReviewOrdersClick}
            className="w-full justify-center text-primary hover:bg-primary-soft hover:border-primary/40 font-semibold"
            rightIcon={<ArrowRight className="size-4" />}
          >
            View All Purchases
          </UIButton>
        </div>
      </UICard>
    </div>
  );
};

export default DashboardActionCardsGrid;
