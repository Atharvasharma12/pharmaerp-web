// src/features/setup/pages/mobile/SetupCenterMobilePage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Store,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  Check,
  PlusCircle,
  HelpCircle,
  Layers,
  ChevronRight,
  Package,
  Truck,
  UserPlus,
  ShoppingCart,
  QrCode,
  Receipt,
  ArrowUpRight,
} from "lucide-react";
import { ROUTES } from "@/constants";
import { recommendedSteps } from "../../constants/recommendedSteps";

const stepIcons = {
  company: Building2,
  branch: Store,
};

const recommendedIcons = {
  Package: Package,
  Truck: Truck,
  UserPlus: UserPlus,
  ShoppingCart: ShoppingCart,
  QrCode: QrCode,
  Receipt: Receipt,
};

export const SetupCenterMobilePage = ({
  workspace = null,
  mappedSetupSteps = [],
  completedStepsCount = 0,
  progress = 0,
  nextStep = null,
  isAllCompleted = false,
}) => {
  const navigate = useNavigate();

  const workspaceName = workspace?.name || "My Pharmacy";
  const workspaceCode = workspace?.workspaceCode || "WS-ENTERPRISE";

  return (
    <section className="min-h-[calc(100vh-56px)] w-full bg-bg px-4 py-5 font-sans">
      <div className="mx-auto w-full max-w-md space-y-5">
        {/* ── 1. Mobile Header ──────────────────────────────────────────────── */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Workspace Activation
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/20 px-2 py-0.5 text-[10px] font-semibold text-success">
              <span className="size-1.5 rounded-full bg-success" />
              Free Tier
            </span>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <h1 className="text-xl font-bold tracking-tight text-text">
              Setup Center
            </h1>
            <span className="text-xs font-mono font-semibold text-text-muted">
              {workspaceCode}
            </span>
          </div>

          <p className="text-xs text-text-muted">
            Complete the 2 core steps to activate billing & inventory.
          </p>
        </div>

        {/* ── 2. Progress Metric Card ────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-text">
                {isAllCompleted ? "🎉 All Steps Complete" : "Activation Progress"}
              </h2>
              <p className="text-[11px] text-text-muted">
                {completedStepsCount} of {mappedSetupSteps.length} steps configured
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-primary">{progress}%</span>
            </div>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-alt border border-border/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        {/* ── 3. Card-Wise Setup Steps (Mobile Stack) ────────────────────────── */}
        <div className="space-y-3.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted px-1">
            Setup Steps ({completedStepsCount}/{mappedSetupSteps.length})
          </h2>

          {mappedSetupSteps.map((step) => {
            const Icon = stepIcons[step.id] || Layers;

            return (
              <div
                key={step.id}
                className={`rounded-2xl border p-4 shadow-sm transition-all ${
                  step.completed
                    ? "border-success/30 bg-surface/90"
                    : step.locked
                      ? "border-border/60 bg-surface-alt/40 opacity-80"
                      : "border-primary/40 bg-surface shadow-primary/5"
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex size-6 items-center justify-center rounded-lg text-[10px] font-black ${
                        step.completed
                          ? "bg-success text-white"
                          : step.locked
                            ? "bg-surface-alt border border-border text-text-muted"
                            : "bg-primary text-white"
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      {step.category}
                    </span>
                  </div>

                  {step.completed ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/30 px-2 py-0.5 text-[10px] font-bold text-success">
                      <Check className="size-3 stroke-[3]" />
                      Done
                    </span>
                  ) : step.locked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-alt border border-border px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                      <Lock className="size-2.5 text-text-muted" />
                      Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary">
                      Ready
                    </span>
                  )}
                </div>

                {/* Main Body */}
                <div className="mt-3 flex items-start gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
                      step.completed
                        ? "border-success/30 bg-success/10 text-success"
                        : step.locked
                          ? "border-border bg-surface-alt text-text-muted"
                          : "border-primary/20 bg-primary/10 text-primary"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-text truncate">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Checklist Summary */}
                <div className="mt-3 rounded-xl bg-surface-alt/60 border border-border/40 p-2.5 space-y-1">
                  {step.checklist?.slice(0, 3).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] font-medium text-text truncate"
                    >
                      <CheckCircle2
                        className={`size-3 shrink-0 ${
                          step.completed ? "text-success" : "text-primary/70"
                        }`}
                      />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="mt-3 pt-2.5 border-t border-border/60">
                  {step.completed ? (
                    <button
                      type="button"
                      onClick={step.onClick}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 py-2.5 text-xs font-bold text-primary active:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <span>{step.completedActionText || "View Details"}</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  ) : step.locked ? (
                    <div className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-surface-alt py-2 text-xs font-semibold text-text-muted">
                      <Lock className="size-3 text-text-muted" />
                      <span>Complete Company First</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={step.onClick}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight className="size-3.5 text-white" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 4. Celebratory Mobile Banner ──────────────────────────────────── */}
        {isAllCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-success/30 bg-gradient-to-br from-success/10 to-primary/5 p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <div>
                <h3 className="text-sm font-bold text-text">Workspace Operational!</h3>
                <p className="text-[11px] text-text-muted">
                  Your store is ready for products, purchases, and POS billing.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="size-3.5 text-white" />
            </button>
          </motion.div>
        )}

        {/* ── 5. Recommended Steps for Later (Small Cards) ──────────────────── */}
        {isAllCompleted && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-text">
                  Recommended Next Steps
                </h2>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary">
                  Optional
                </span>
              </div>
              <span className="text-[10px] text-text-muted font-medium">
                {recommendedSteps.length} Steps
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {recommendedSteps.map((rec) => {
                const Icon = recommendedIcons[rec.iconName] || Package;

                return (
                  <div
                    key={rec.id}
                    onClick={() => navigate(rec.route)}
                    className="group rounded-2xl border border-border bg-surface p-3.5 shadow-xs active:bg-surface-alt transition-colors flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <Icon className="size-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-text truncate">
                            {rec.title}
                          </h3>
                        </div>
                        <p className="text-[10px] text-text-muted truncate mt-0.5">
                          {rec.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-primary">
                      <ChevronRight className="size-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 6. Quick Help ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-surface p-3.5 space-y-1 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-text">
            <HelpCircle className="size-3.5 text-primary" />
            <span>Need Help with Setup?</span>
          </div>
          <p className="text-[11px] text-text-muted">
            All details can be updated anytime from your Settings & Branch pages.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SetupCenterMobilePage;
