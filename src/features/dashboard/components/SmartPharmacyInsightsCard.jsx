// src/features/dashboard/components/SmartPharmacyInsightsCard.jsx

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  TrendingUp,
  Package,
  CalendarDays,
  ShieldCheck,
  ShoppingCart,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { UICard, UIButton, UIBadge } from "@/components/ui";
import { cn } from "@/lib/utils";

const iconMap = {
  TrendingUp: <TrendingUp className="size-4" />,
  Package: <Package className="size-4" />,
  Activity: <Activity className="size-4" />,
  ShieldCheck: <ShieldCheck className="size-4" />,
  CalendarDays: <CalendarDays className="size-4" />,
  ShoppingCart: <ShoppingCart className="size-4" />,
};

const intentStyles = {
  primary: "bg-primary-soft text-primary border-primary/20",
  warning: "bg-warning-soft text-warning border-warning/20",
  info: "bg-info-soft text-info border-info/20",
  success: "bg-success-soft text-success border-success/20",
  error: "bg-error-soft text-error border-error/20",
};

export const SmartPharmacyInsightsCard = ({
  liveAlerts = [],
  onAnalyticsClick,
  className,
}) => {
  return (
    <UICard
      variant="default"
      className={cn(
        "flex flex-col justify-between p-5 sm:p-6 border-border rounded-2xl bg-surface shadow-xs",
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary-soft border border-primary/20 flex items-center justify-center text-primary shadow-2xs">
            <Activity className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text tracking-tight">
              Operational Activity
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Live status & inventory signals
            </p>
          </div>
        </div>

        <UIBadge variant="soft" intent="primary" className="text-[11px] font-semibold shrink-0">
          Live Feed
        </UIBadge>
      </div>

      {/* Live Alerts List */}
      <div className="space-y-2.5 py-3 my-auto min-h-[160px] flex flex-col justify-center">
        {liveAlerts.length > 0 ? (
          liveAlerts.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.22,
                delay: index * 0.04,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-surface-alt/60 p-3 transition-colors hover:bg-surface-hover hover:border-primary/30"
            >
              <div
                className={cn(
                  "size-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs",
                  intentStyles[item.intent] || intentStyles.primary
                )}
              >
                {iconMap[item.iconName] || <Activity className="size-4" />}
              </div>

              <p className="text-xs text-text font-normal leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-6 text-text-muted">
            <CheckCircle className="size-7 text-success mb-1 opacity-70" />
            <span className="text-xs font-semibold text-text">All systems normal</span>
            <span className="text-[11px]">No critical alerts or warnings right now</span>
          </div>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-3 border-t border-border/70">
        <UIButton
          variant="outline"
          size="sm"
          onClick={onAnalyticsClick}
          className="w-full justify-center text-primary font-semibold hover:bg-primary-soft hover:border-primary/40"
          rightIcon={<ArrowRight className="size-4" />}
        >
          View Sales Register
        </UIButton>
      </div>
    </UICard>
  );
};

export default SmartPharmacyInsightsCard;
