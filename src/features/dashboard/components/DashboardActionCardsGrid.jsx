// src/features/dashboard/components/DashboardActionCardsGrid.jsx

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  Truck,
  ArrowRight,
} from "lucide-react";
import { UICard, UIButton, UIBadge } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  LOW_STOCK_MEDICINES,
  EXPIRY_ALERTS,
  SUPPLIER_UPDATES,
} from "../constants/dashboardData";

export const DashboardActionCardsGrid = ({
  onReorderClick,
  onExpiryDetailsClick,
  onReviewOrdersClick,
  className,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
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
                4 items below threshold
              </p>
            </div>
          </div>

          {/* List of items */}
          <div className="divide-y divide-border/50 py-2">
            {LOW_STOCK_MEDICINES.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2.5 text-xs group hover:bg-surface-alt/50 px-1 rounded-lg transition-colors"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-text group-hover:text-warning transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {item.form}
                  </span>
                </div>
                <span className="font-mono font-bold text-warning tabular-nums">
                  {item.remaining} left
                </span>
              </div>
            ))}
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
            Reorder Now
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
          <div className="pt-4 pb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-text tabular-nums">
                12
              </span>
              <span className="text-xs text-text-muted font-medium">
                products expiring soon
              </span>
            </div>

            {/* Visual Urgency Bar Visualizer (12 blocks) using theme tokens */}
            <div className="flex items-center gap-1.5 pt-4 pb-2">
              {[
                "bg-error",
                "bg-error/90",
                "bg-error/80",
                "bg-error/70",
                "bg-warning",
                "bg-warning/90",
                "bg-warning/80",
                "bg-warning/70",
                "bg-warning/60",
                "bg-surface-alt",
                "bg-surface-alt",
                "bg-surface-alt",
              ].map((colorClass, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-6 flex-1 rounded-md border border-border/50 shadow-2xs transition-transform hover:scale-110",
                    colorClass
                  )}
                  title={`Batch Block #${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Quick List Preview */}
          <div className="divide-y divide-border/50 py-1">
            {EXPIRY_ALERTS.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-1.5 text-xs"
              >
                <span className="text-text font-medium truncate max-w-[160px]">
                  {item.name}
                </span>
                <span className="font-mono text-error text-[11px] font-semibold">
                  In {item.daysLeft} days
                </span>
              </div>
            ))}
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
            View Details
          </UIButton>
        </div>
      </UICard>

      {/* ── 3. Supplier Updates Card ───────────────────────────────── */}
      <UICard
        variant="default"
        className="flex flex-col justify-between p-5 sm:p-6 border-border rounded-2xl bg-surface shadow-xs"
      >
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-border/70">
            <div className="size-9 rounded-xl bg-info-soft border border-info/20 flex items-center justify-center text-info shrink-0 shadow-2xs">
              <Truck className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-text tracking-tight">
                Supplier Updates
              </h3>
              <p className="text-xs text-text-muted">
                Action required
              </p>
            </div>
          </div>

          {/* List of Supplier Updates */}
          <div className="divide-y divide-border/50 py-2">
            {SUPPLIER_UPDATES.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2.5 text-xs group hover:bg-surface-alt/50 px-1 rounded-lg transition-colors"
              >
                <span className="font-semibold text-text group-hover:text-primary transition-colors">
                  {item.name}
                </span>
                <UIBadge
                  variant="soft"
                  intent={item.statusType}
                  className="text-[11px]"
                >
                  {item.status}
                </UIBadge>
              </div>
            ))}
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
            Review Orders
          </UIButton>
        </div>
      </UICard>
    </div>
  );
};

export default DashboardActionCardsGrid;
