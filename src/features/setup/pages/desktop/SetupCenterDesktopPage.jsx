// src/features/setup/pages/desktop/SetupCenterDesktopPage.jsx

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
  HelpCircle,
  BookOpen,
  Layers,
  ChevronRight,
  PlusCircle,
  Check,
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

export const SetupCenterDesktopPage = ({
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
    <section className="min-h-[calc(100vh-58px)] w-full bg-bg px-6 py-7 font-sans">
      <div className="mx-auto w-full max-w-7xl space-y-7">
        {/* ── 1. Page Breadcrumbs & Header ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              {isAllCompleted ? (
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
              ) : (
                <span className="text-text-muted/60">Workspace</span>
              )}
              <ChevronRight className="size-3.5 text-text-muted/60" />
              <span className="text-text font-bold">Setup Center</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
                Setup Center
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                Activation Flow
              </span>
            </div>

            <p className="text-sm text-text-muted max-w-2xl">
              Complete these two essential setup steps to activate your legal pharmacy entity,
              establish your primary store location, and unlock full ERP billing and inventory features.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            {isAllCompleted ? (
              <button
                type="button"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="size-4 text-white" />
              </button>
            ) : nextStep ? (
              <button
                type="button"
                onClick={nextStep.onClick}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Continue: {nextStep.title}</span>
                <ArrowRight className="size-4 text-white" />
              </button>
            ) : null}
          </div>
        </div>

        {/* ── 2. Top Progress & Status Hero Banner ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Progress Card (7 Cols) */}
          <div className="md:col-span-7 rounded-2xl border border-border bg-surface p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Workspace Readiness
                </span>
                <h2 className="mt-1 text-lg font-bold text-text">
                  {isAllCompleted
                    ? "🎉 Workspace Setup Complete"
                    : "Setup in Progress"}
                </h2>
                <p className="mt-0.5 text-xs text-text-muted">
                  {isAllCompleted
                    ? "Both company and branch configurations are active. All ERP modules unlocked."
                    : `${completedStepsCount} of ${mappedSetupSteps.length} foundational steps completed.`}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-3xl font-extrabold tracking-tight text-primary">
                  {progress}%
                </span>
                <p className="text-[11px] font-semibold text-text-muted">Completed</p>
              </div>
            </div>

            {/* Progress Bar Track */}
            <div className="mt-5 space-y-2">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-alt border border-border/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full bg-primary"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium text-text-muted">
                <span>Step 1: Legal Company</span>
                <span>Step 2: Retail Branch</span>
              </div>
            </div>
          </div>

          {/* Workspace Info Card (5 Cols) */}
          <div className="md:col-span-5 rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Active Context
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 border border-success/20 px-2.5 py-0.5 text-[11px] font-semibold text-success">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Free Tier Active
                </span>
              </div>

              <h3 className="mt-2 text-base font-bold text-text truncate">
                {workspaceName}
              </h3>
              <p className="text-xs font-mono font-medium text-text-muted">
                Code: {workspaceCode}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-text-muted font-medium">Tenant Hierarchy</span>
              <span className="font-semibold text-text flex items-center gap-1">
                <Layers className="size-3.5 text-primary" />
                Workspace ➔ Company ➔ Branch
              </span>
            </div>
          </div>
        </div>

        {/* ── 3. Card-Wise Setup Steps Grid (2 Large Cards) ──────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <span>Required Activation Steps</span>
              <span className="text-xs font-bold text-text-muted px-2 py-0.5 rounded-md bg-surface-alt border border-border">
                {completedStepsCount}/{mappedSetupSteps.length}
              </span>
            </h2>
            <span className="text-xs text-text-muted">
              Click any unlocked card to proceed with configuration
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {mappedSetupSteps.map((step) => {
              const Icon = stepIcons[step.id] || Layers;

              return (
                <motion.div
                  key={step.id}
                  whileHover={!step.locked ? { y: -3 } : {}}
                  transition={{ duration: 0.2 }}
                  className={`group relative rounded-2xl border p-6 flex flex-col justify-between shadow-sm transition-all ${
                    step.completed
                      ? "border-success/30 bg-surface/90 hover:border-success/60"
                      : step.locked
                        ? "border-border/60 bg-surface-alt/40 opacity-75 cursor-not-allowed"
                        : "border-primary/40 bg-surface hover:border-primary shadow-primary/5 hover:shadow-md cursor-pointer"
                  }`}
                  onClick={step.locked ? undefined : step.onClick}
                >
                  {/* Step Header */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex size-8 items-center justify-center rounded-xl text-xs font-black ${
                            step.completed
                              ? "bg-success text-white"
                              : step.locked
                                ? "bg-surface-alt border border-border text-text-muted"
                                : "bg-primary text-white"
                          }`}
                        >
                          {step.stepNumber}
                        </span>

                        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                          {step.category}
                        </span>
                      </div>

                      {/* Status Pill */}
                      {step.completed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 border border-success/30 px-3 py-1 text-xs font-bold text-success">
                          <Check className="size-3.5 stroke-[3]" />
                          Completed
                        </span>
                      ) : step.locked ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt border border-border px-3 py-1 text-xs font-semibold text-text-muted">
                          <Lock className="size-3 text-text-muted" />
                          Locked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-bold text-primary">
                          <span className="size-1.5 rounded-full bg-primary animate-ping" />
                          Ready to Setup
                        </span>
                      )}
                    </div>

                    {/* Icon + Title Block */}
                    <div className="mt-5 flex items-start gap-4">
                      <div
                        className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
                          step.completed
                            ? "border-success/30 bg-success/10 text-success"
                            : step.locked
                              ? "border-border bg-surface-alt text-text-muted"
                              : "border-primary/20 bg-primary/10 text-primary group-hover:scale-105"
                        }`}
                      >
                        <Icon className="size-6" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-xs font-medium text-text-muted mt-0.5">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-xs leading-relaxed text-text-muted">
                      {step.description}
                    </p>

                    {/* Feature Checklist */}
                    <div className="mt-5 space-y-2 rounded-xl bg-surface-alt/50 border border-border/50 p-3.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Included in this setup
                      </span>
                      <ul className="mt-1.5 space-y-1.5">
                        {step.checklist?.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs font-medium text-text"
                          >
                            <CheckCircle2
                              className={`size-3.5 mt-0.5 shrink-0 ${
                                step.completed
                                  ? "text-success"
                                  : "text-primary/70"
                              }`}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Step Footer & Action CTA */}
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                      <Clock className="size-3.5 text-text-muted" />
                      <span>{step.estimatedTime || "2 mins"}</span>
                    </div>

                    {step.completed ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          step.onClick();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        <span>{step.completedActionText || "View Details"}</span>
                        <ArrowRight className="size-3.5" />
                      </button>
                    ) : step.locked ? (
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-alt border border-border px-3.5 py-2 text-xs font-semibold text-text-muted">
                        <Lock className="size-3 text-text-muted" />
                        Requires Company
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          step.onClick();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4.5 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <span>{step.actionText}</span>
                        <ArrowRight className="size-3.5 text-white" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── 4. Celebratory 100% Complete Banner ────────────────────────────── */}
        {isAllCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-success/30 bg-gradient-to-r from-success/10 via-surface to-primary/5 p-6 shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <h3 className="text-base font-bold text-text">
                    Your Pharmacy Workspace is Ready for Daily Operations!
                  </h3>
                </div>
                <p className="text-xs text-text-muted max-w-2xl">
                  Legal entity and retail branch are confirmed. You can now add products to your catalog,
                  record supplier purchase orders, and start generating customer invoices at the POS counter.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4.5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="size-3.5 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(ROUTES.CREATE_WORKSPACE_PRODUCT || "/workspace-products/create")
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-text hover:bg-surface-alt transition-colors cursor-pointer"
                >
                  <PlusCircle className="size-3.5 text-primary" />
                  <span>Add Products</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 5. Recommended Steps for Later (Small Cards) ──────────────────── */}
        {isAllCompleted && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-text">
                    Recommended Next Steps
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    <Sparkles className="size-3" />
                    Expand Workflow
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  Optional configurations to help you organize stock, staff, and customer payments at your own pace.
                </p>
              </div>

              <span className="text-xs text-text-muted font-medium">
                {recommendedSteps.length} Recommended Actions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {recommendedSteps.map((rec) => {
                const Icon = recommendedIcons[rec.iconName] || Package;

                return (
                  <motion.div
                    key={rec.id}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.18 }}
                    onClick={() => navigate(rec.route)}
                    className="group rounded-2xl border border-border bg-surface p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-105 transition-transform">
                          <Icon className="size-4.5" />
                        </div>

                        <span className="inline-flex items-center rounded-full bg-surface-alt border border-border/80 px-2.5 py-0.5 text-[10px] font-bold text-text-muted">
                          {rec.category}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-3.5 text-sm font-bold text-text group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>{rec.title}</span>
                        <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </h3>

                      <p className="mt-1 text-xs text-text-muted leading-relaxed line-clamp-2">
                        {rec.description}
                      </p>
                    </div>

                    {/* Bottom: Time & Action Link */}
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-text-muted flex items-center gap-1">
                        <Clock className="size-3" />
                        {rec.estimatedTime}
                      </span>

                      <span className="font-bold text-primary text-xs flex items-center gap-1 group-hover:underline">
                        <span>{rec.actionText}</span>
                        <ChevronRight className="size-3" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 6. Setup Help & Quick Guides Strip ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <BookOpen className="size-4" />
              <span>GSTIN & Drug Licenses</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Ensure your Form 20B/21B drug license numbers and GSTIN details match your official registration
              for accurate GST tax invoices.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-info font-bold text-xs">
              <Store className="size-4" />
              <span>Multi-Branch Scaling</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              You can easily add more retail branches, central warehouses, or franchise outlets under the same
              workspace anytime.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-text font-bold text-xs">
              <HelpCircle className="size-4 text-primary" />
              <span>Need Assistance?</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Have questions about inventory batch tracking or bulk data import? Visit our help center
              or consult onboarding docs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SetupCenterDesktopPage;
