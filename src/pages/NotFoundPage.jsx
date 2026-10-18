// src/pages/NotFoundPage.jsx
//
// Shown when a user navigates to an invalid, missing, or mistyped route.
// Provides instant recovery CTAs to the primary operational hubs in PharmaERP.

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Compass,
  ArrowLeft,
  LayoutDashboard,
  Receipt,
  Package,
  Clock,
  Users,
  Search,
  Sparkles,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

import { ROUTES } from "@/constants";
import useAuth from "@/features/auth/hooks/useAuth";
import useBranch from "@/features/branch/hooks/useBranch";
import useCompany from "@/features/company/hooks/useCompany";
import { cn } from "@/lib/utils";

const QUICK_DESTINATIONS = [
  {
    title: "Sales & POS Billing",
    description: "Dispense medication, create invoices & receipts",
    path: ROUTES.SALES || "/sales",
    icon: Receipt,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    title: "Inventory & Products",
    description: "Manage medication batches, stocks & pricing",
    path: "/workspace-products",
    icon: Package,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    title: "Shifts & Cashiers",
    description: "View active register sessions & reconciliations",
    path: "/operations/shifts",
    icon: Clock,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  {
    title: "Customer Accounts",
    description: "Patient profiles, credit ledgers & settlements",
    path: ROUTES.CUSTOMERS || "/parties/customers",
    icon: Users,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
];

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { currentCompany } = useCompany();
  const { currentBranch } = useBranch();

  const requestedPath = location.pathname;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-bg px-4 py-12 select-none">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col items-center text-center max-w-2xl w-full"
      >
        {/* Animated Compass & Glow Aura */}
        <div className="relative mb-6">
          {/* Ambient Glow */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-primary/20 blur-3xl pointer-events-none"
            style={{ width: "180px", height: "180px", left: "-36px", top: "-36px" }}
          />

          {/* Central 404 Badge */}
          <div className="relative flex size-26 items-center justify-center rounded-[32px] bg-surface border border-border shadow-lg shadow-black/[0.04] ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
            <Compass className="size-13 text-primary stroke-[1.6]" />
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1 -right-1 flex size-8 items-center justify-center rounded-full bg-primary text-primary-contrast shadow-md border-2 border-bg font-mono font-bold text-xs"
            >
              404
            </motion.div>
          </div>
        </div>

        {/* Text Heading */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20 tracking-wide uppercase">
            <Sparkles className="size-3" />
            <span>Page Not Found</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
            Lost in the Pharmacy System?
          </h1>

          <p className="text-sm text-text-muted leading-relaxed max-w-md mx-auto">
            The URL or page you requested does not exist or may have been relocated.
          </p>

          {/* Path pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-alt border border-border text-[11px] font-mono text-text-muted mt-2">
            <span>Requested:</span>
            <span className="font-semibold text-text truncate max-w-[280px]">
              {requestedPath}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 w-full max-w-md mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-bold text-text transition-all hover:bg-surface-hover hover:border-border-strong active:scale-[0.98] cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="size-4 text-text-muted" />
            Go Back
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(isAuthenticated ? ROUTES.DASHBOARD || "/dashboard" : "/login", {
                replace: true,
              })
            }
            className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-contrast transition-all hover:bg-primary/90 active:scale-[0.98] cursor-pointer shadow-xs"
          >
            <LayoutDashboard className="size-4" />
            Go to Dashboard
          </button>

          <button
            type="button"
            onClick={() => navigate(ROUTES.SALES || "/sales")}
            className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2.5 text-xs font-bold transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
          >
            <Receipt className="size-4" />
            New Sale / POS
          </button>
        </div>

        {/* Recommended Core Destinations (Quick Launcher Grid) */}
        <div className="w-full text-left bg-surface rounded-2xl border border-border p-4 sm:p-5 shadow-2xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center justify-between">
            <span>Or jump directly to a core workspace:</span>
            {currentBranch?.name && (
              <span className="text-text-muted font-normal text-[10px] font-mono">
                Active: {currentBranch.name}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {QUICK_DESTINATIONS.map((dest) => {
              const Icon = dest.icon;
              return (
                <div
                  key={dest.title}
                  onClick={() => navigate(dest.path)}
                  className="group p-3 rounded-xl border border-border/70 hover:border-primary/40 bg-surface-alt/40 hover:bg-surface transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "size-9 rounded-lg flex items-center justify-center shrink-0 border",
                        dest.color
                      )}
                    >
                      <Icon className="size-4.5 stroke-[1.8]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-text group-hover:text-primary transition-colors truncate">
                        {dest.title}
                      </div>
                      <div className="text-[10px] text-text-muted truncate mt-0.5">
                        {dest.description}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
