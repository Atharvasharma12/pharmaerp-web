// src/features/dashboard/components/DashboardHeroBanner.jsx

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { UIButton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import useAuth from "@/features/auth/hooks/useAuth";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export const DashboardHeroBanner = ({
  onGenerateReport,
  onAddMedicine,
  className,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    "Shahriar";

  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 sm:p-7 lg:p-8",
        "bg-surface border border-border shadow-xs text-text font-sans",
        className
      )}
    >
      {/* Decorative Pill/Capsule Watermark Vector using Theme Accent */}
      <div
        className="pointer-events-none absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 select-none opacity-10 text-primary"
        aria-hidden="true"
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 120 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transform rotate-45"
        >
          <rect x="25" y="15" width="70" height="90" rx="35" />
          <line x1="25" y1="60" x2="95" y2="60" />
        </svg>
      </div>

      {/* Decorative Soft Brand Glow */}
      <div
        className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-primary-soft/50 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col justify-between gap-5 max-w-4xl">
        {/* Top Operational Status Pill & Setup Link */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span>All systems operational</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(ROUTES.SETUP_CENTER)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary transition-colors cursor-pointer"
          >
            <Sparkles className="size-3.5 text-primary" />
            <span>Setup Center Settings &rarr;</span>
          </button>
        </div>

        {/* Hero Greeting & Description */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text leading-tight">
            {greeting}, {userName} <span className="inline-block select-none">👋</span>
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed font-normal">
            Monitor inventory levels, track medicine sales, manage prescriptions, and ensure smooth pharmacy operations from one centralized dashboard.
          </p>
        </div>

        {/* Action Buttons and Live Metrics Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/70">
          {/* Left Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <UIButton
              variant="primary"
              size="sm"
              onClick={onGenerateReport}
              leftIcon={<FileText className="size-4" />}
            >
              Generate Report
            </UIButton>

            <UIButton
              variant="outline"
              size="sm"
              onClick={onAddMedicine}
              leftIcon={<Plus className="size-4" />}
            >
              Add Medicine
            </UIButton>

            <UIButton
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.SETUP_CENTER)}
              leftIcon={<Sparkles className="size-4 text-primary" />}
              className="border-border hover:bg-surface-hover text-text"
            >
              Setup Center
            </UIButton>
          </div>

          {/* Right Live Mini-Metrics */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-text-muted font-medium select-none">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="size-4 text-primary stroke-[2.5]" />
              <span className="font-mono tabular-nums font-bold text-text">184</span>
              <span>transactions today</span>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-primary stroke-[2.5]" />
              <span>Compliance:</span>
              <span className="font-mono tabular-nums font-bold text-primary">98%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeroBanner;
