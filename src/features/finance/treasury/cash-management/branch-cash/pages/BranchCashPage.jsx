// src/features/finance/treasury/cash-management/branch-cash/pages/BranchCashPage.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  UIButton,
  UIAlert,
  UISkeleton,
} from "@/components/ui";
import { useBranchCash } from "../hooks/useBranchCash";
import useBranch from "@/features/branch/hooks/useBranch";
import useActiveShift from "@/features/operations/shifts/hooks/useActiveShift";
import { getOpenBusinessDay } from "@/features/operations/business-days/store/businessDayThunk";
import {
  RefreshCw,
  Lock,
  Wallet,
  Banknote,
  Coins,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  Tag,
  Shield,
  BarChart3,
  Layers,
  BarChart2,
  Table as TableIcon,
} from "lucide-react";
import InitializeBranchCashModal from "../components/InitializeBranchCashModal";
import DepositModal from "../components/DepositModal";
import WithdrawModal from "../components/WithdrawModal";

const DENOMINATIONS_CONFIG = [
  { note: 500, label: "₹ 500", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800", icon: "P" },
  { note: 200, label: "₹ 200", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800", icon: "P" },
  { note: 100, label: "₹ 100", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800", icon: "P" },
  { note: 50,  label: "₹ 50",  color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", icon: "P" },
  { note: 20,  label: "₹ 20",  color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800", icon: "P" },
  { note: 10,  label: "₹ 10",  color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800", icon: "P" },
  { note: 5,   label: "₹ 5",   color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800", icon: "P" },
  { note: 2,   label: "₹ 2",   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700", icon: "i" },
  { note: 1,   label: "₹ 1",   color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700", icon: "i" },
];

const formatCurrency = (val) =>
  `₹ ${Number(val || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const sumDenominations = (denominations = []) =>
  (denominations || []).reduce(
    (s, d) => s + (Number(d.denomination) || 0) * (Number(d.quantity) || Number(d.count) || 0),
    0
  );

const countNotes = (denominations = []) =>
  (denominations || []).reduce(
    (s, d) => s + (Number(d.quantity) || Number(d.count) || 0),
    0
  );

export const BranchCashPage = () => {
  const dispatch = useDispatch();
  const { currentBranch } = useBranch();
  const { currentBranchCash, fetchBranchCash, fetchStatus, error } = useBranchCash();
  const { activeShift } = useActiveShift(currentBranch?._id);
  const { openBusinessDay } = useSelector((state) => state.businessDay || {});

  const [activeTab, setActiveTab] = useState("drawers"); // "drawers" | "matrix"
  const [matrixViewMode, setMatrixViewMode] = useState("matrix"); // "matrix" | "chart"
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    if (currentBranch?._id) {
      fetchBranchCash(currentBranch._id);
      dispatch(getOpenBusinessDay(currentBranch._id));
    }
  }, [currentBranch?._id, fetchBranchCash, dispatch]);

  const isLoading = fetchStatus === "loading";

  // Denominations lists
  const runningDenominations =
    currentBranchCash?.denominationBalance?.runningDenominations || [];
  const frozenDenominations =
    currentBranchCash?.denominationBalance?.frozenDenominations ||
    currentBranchCash?.balance?.frozenDenominations ||
    [];

  const runningTotal = sumDenominations(runningDenominations);
  const frozenTotal = sumDenominations(frozenDenominations);
  const totalVault = runningTotal + frozenTotal;

  const runningNotesCount = countNotes(runningDenominations);
  const frozenNotesCount = countNotes(frozenDenominations);
  const totalNotesCount = runningNotesCount + frozenNotesCount;

  const runningDenomsCount = runningDenominations.filter(
    (d) => (Number(d.quantity) || Number(d.count) || 0) > 0
  ).length;
  const frozenDenomsCount = frozenDenominations.filter(
    (d) => (Number(d.quantity) || Number(d.count) || 0) > 0
  ).length;

  // Determine if branch cash is initialized
  const isInitialized = Boolean(
    currentBranchCash &&
      (currentBranchCash.isInitialized === true ||
        runningTotal > 0 ||
        frozenTotal > 0 ||
        (currentBranchCash.createdAt && !currentBranchCash.isUninitialized))
  );

  const isShiftActive = Boolean(activeShift);
  const shiftDisplay = activeShift
    ? `Shift # ${activeShift.code || activeShift.shiftNumber || "SFT-001"} • ${activeShift.name || activeShift.shiftType || "General Shift"}`
    : "No Active Shift";

  const businessDateDisplay = useMemo(() => {
    if (!openBusinessDay?.businessDate) return "Today";
    try {
      const d = new Date(openBusinessDay.businessDate);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return String(openBusinessDay.businessDate);
    }
  }, [openBusinessDay]);

  const branchName = currentBranch?.name || "Makati Branch";


  // Denomination Matrix Rows
  const matrixRows = useMemo(() => {
    return DENOMINATIONS_CONFIG.map((d) => {
      const rItem = runningDenominations.find((item) => Number(item.denomination) === d.note);
      const fItem = frozenDenominations.find((item) => Number(item.denomination) === d.note);

      const rCount = rItem ? Number(rItem.quantity ?? rItem.count ?? 0) : 0;
      const rAmount = rCount * d.note;

      const fCount = fItem ? Number(fItem.quantity ?? fItem.count ?? 0) : 0;
      const fAmount = fCount * d.note;

      const totalCount = rCount + fCount;
      const totalAmount = rAmount + fAmount;

      const pct = totalVault > 0 ? ((totalAmount / totalVault) * 100).toFixed(1) : "0.0";

      return {
        ...d,
        rCount,
        rAmount,
        fCount,
        fAmount,
        totalCount,
        totalAmount,
        pct: Number(pct),
      };
    });
  }, [runningDenominations, frozenDenominations, totalVault]);

  return (
    <div className="p-4 sm:p-6 bg-[#f8fafc] dark:bg-bg min-h-[calc(100vh-60px)] space-y-6 max-w-[1480px] mx-auto select-none">


      {/* ── Page Header: Title & Action Buttons ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight">
            Branch Cash & Drawer Management
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Manage branch cash, view drawer balances, and handle deposits/withdrawals
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <UIButton
            type="button"
            variant="outline"
            size="sm"
            onClick={() => currentBranch?._id && fetchBranchCash(currentBranch._id)}
            disabled={isLoading}
            startIcon={<RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />}
            className="rounded-xl text-xs font-semibold px-3 py-2 bg-surface hover:bg-surface-alt shadow-2xs border-border text-text cursor-pointer"
          >
            Refresh
          </UIButton>

          {/* Initialize Cash button: Only show when NOT initialized */}
          {!isInitialized && (
            <UIButton
              type="button"
              size="sm"
              onClick={() => setIsInitModalOpen(true)}
              startIcon={<Lock className="size-3.5" />}
              className="rounded-xl text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
            >
              Initialize Cash
            </UIButton>
          )}

          {/* Deposit & Withdraw Buttons: Only shown when initialized and shift is active */}
          {isInitialized && isShiftActive && (
            <>
              <UIButton
                type="button"
                size="sm"
                onClick={() => setIsDepositModalOpen(true)}
                disabled={isLoading}
                startIcon={<ArrowDownToLine className="size-3.5" />}
                className="rounded-xl text-xs font-bold px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white shadow-xs cursor-pointer transition"
              >
                Deposit
              </UIButton>

              <UIButton
                type="button"
                size="sm"
                onClick={() => setIsWithdrawModalOpen(true)}
                disabled={isLoading}
                startIcon={<ArrowUpFromLine className="size-3.5" />}
                className="rounded-xl text-xs font-bold px-4 py-2 bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-xs cursor-pointer transition"
              >
                Withdraw
              </UIButton>
            </>
          )}
        </div>
      </div>

      {/* ── Initialized Dashboard: Tabs & Stat Cards ── */}
      {isInitialized && (
        <>
          {/* Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-border/80">
            <button
              type="button"
              onClick={() => setActiveTab("drawers")}
              className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "drawers"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              Visual Drawers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("matrix")}
              className={`pb-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "matrix"
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              Vault Denomination Matrix
            </button>
          </div>

          {/* 4 Top Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Vault */}
            <div className="bg-surface rounded-2xl border border-border p-4.5 flex items-center gap-3.5 shadow-xs">
              <div className="size-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Wallet className="size-5" />
              </div>
              <div>
                <div className="text-[11px] font-medium text-text-muted">Total Vault</div>
                <div className="text-xl font-black font-mono text-text">
                  {formatCurrency(totalVault)}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Running + Frozen
                </div>
              </div>
            </div>

            {/* Card 2: Running Cash Drawer */}
            <div className="bg-surface rounded-2xl border border-border p-4.5 flex items-center gap-3.5 shadow-xs">
              <div className="size-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Banknote className="size-5" />
              </div>
              <div>
                <div className="text-[11px] font-medium text-text-muted">Running Cash Drawer</div>
                <div className="text-xl font-black font-mono text-text">
                  {formatCurrency(runningTotal)}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Available for current shift
                </div>
              </div>
            </div>

            {/* Card 3: Frozen Reserve Vault */}
            <div className="bg-surface rounded-2xl border border-border p-4.5 flex items-center gap-3.5 shadow-xs">
              <div className="size-11 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="size-5" />
              </div>
              <div>
                <div className="text-[11px] font-medium text-text-muted">Frozen Reserve Vault</div>
                <div className="text-xl font-black font-mono text-text">
                  {formatCurrency(frozenTotal)}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">
                  Locked / Reserved
                </div>
              </div>
            </div>

            {/* Card 4: Current Shift */}
            <div className="bg-surface rounded-2xl border border-border p-4.5 flex items-center gap-3.5 shadow-xs">
              <div className="size-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Clock className="size-5" />
              </div>
              <div>
                <div className="text-[11px] font-medium text-text-muted">Current Shift</div>
                <div className="text-base font-bold text-text">
                  {isShiftActive ? "Active" : "Shift Closed"}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5 truncate max-w-[180px]">
                  {isShiftActive ? shiftDisplay : "No operational shift open"}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      {isLoading && !currentBranchCash ? (
        <div className="space-y-4">
          <UISkeleton className="h-72 rounded-2xl" />
        </div>
      ) : !isInitialized ? (
        /* ══════════════════════════════════════════════════════════════════
           SCREEN 4: BEFORE-INITIALIZATION SCREEN (Compact)
           ══════════════════════════════════════════════════════════════════ */
        <div className="space-y-4">
          {/* Center Hero Card */}
          <div className="bg-surface rounded-2xl border border-border py-6 px-6 sm:py-8 sm:px-8 text-center shadow-xs flex flex-col items-center justify-center">
            {/* Cash Box Illustration with coins & warning badge */}
            <div className="relative w-32 h-24 sm:w-36 sm:h-28 mb-3 flex items-center justify-center">
              <svg
                viewBox="0 0 200 160"
                className="w-full h-full drop-shadow-sm"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Soft backdrop blur ellipse */}
                <ellipse cx="100" cy="120" rx="80" ry="24" fill="#e2e8f0" fillOpacity="0.45" />

                {/* Cash drawer back lid */}
                <path
                  d="M48 68 L72 38 L148 38 L124 68 Z"
                  fill="#cbd5e1"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Cash drawer main open box */}
                <path
                  d="M38 70 L136 70 L122 118 L24 118 Z"
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M136 70 L174 70 L160 118 L122 118 Z"
                  fill="#cbd5e1"
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />

                {/* Drawer front face */}
                <path
                  d="M24 118 L160 118 L152 136 L16 136 Z"
                  fill="#94a3b8"
                  stroke="#64748b"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Drawer handle */}
                <rect x="76" y="124" width="32" height="4" rx="2" fill="#f8fafc" />

                {/* Coins Stacks on Left */}
                <ellipse cx="42" cy="112" rx="14" ry="5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx="42" cy="108" rx="14" ry="5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx="42" cy="104" rx="14" ry="5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx="42" cy="100" rx="14" ry="5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />

                <ellipse cx="58" cy="116" rx="12" ry="4.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx="58" cy="112" rx="12" ry="4.5" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Orange circular warning badge with exclamation mark */}
                <g filter="url(#dropShadow)">
                  <circle cx="140" cy="98" r="24" fill="#f59e0b" />
                  <circle cx="140" cy="98" r="21" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
                  <path
                    d="M140 86 L140 98"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="140" cy="106" r="2.2" fill="#ffffff" />
                </g>

                <defs>
                  <filter id="dropShadow" x="110" y="70" width="60" height="60" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
                  </filter>
                </defs>
              </svg>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-text tracking-tight mb-1.5">
              Branch Cash Not Initialized
            </h2>

            <div className="max-w-lg text-xs text-text-muted space-y-1 leading-relaxed mb-4">
              <p>Branch cash has not been initialized for this branch yet.</p>
              <p>
                Set the initial cash balance (opening denominations) before starting cashier operations, sales, or deposits.
              </p>
            </div>

            <UIButton
              type="button"
              onClick={() => setIsInitModalOpen(true)}
              startIcon={<Coins className="size-4" />}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Initialize Branch Cash
            </UIButton>
          </div>

          {/* 4 Bottom Benefit Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Feature 1 */}
            <div className="bg-surface rounded-2xl border border-border p-3.5 flex items-start gap-3 shadow-xs">
              <div className="size-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Tag className="size-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-bold text-text truncate">Set Opening Balance</div>
                <p className="text-[11px] text-text-muted leading-snug">
                  Enter denomination-wise opening cash available in branch.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface rounded-2xl border border-border p-3.5 flex items-start gap-3 shadow-xs">
              <div className="size-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Shield className="size-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-bold text-text truncate">Enable Cash Operations</div>
                <p className="text-[11px] text-text-muted leading-snug">
                  Process POS sales, drawer exchanges, deposits & withdrawals.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface rounded-2xl border border-border p-3.5 flex items-start gap-3 shadow-xs">
              <div className="size-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <BarChart3 className="size-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-bold text-text truncate">Track Cash Accuracy</div>
                <p className="text-[11px] text-text-muted leading-snug">
                  Maintain accurate records with note-level breakdown.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-surface rounded-2xl border border-border p-3.5 flex items-start gap-3 shadow-xs">
              <div className="size-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Lock className="size-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-xs font-bold text-text truncate">Secure & Controlled</div>
                <p className="text-[11px] text-text-muted leading-snug">
                  Ensure strict compliance with full shift audit trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "drawers" ? (
        /* ══════════════════════════════════════════════════════════════════
           SCREEN 1 - TAB 1: VISUAL DRAWERS (Image 1 - Top)
           ══════════════════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* ── CARD 1: Running Cash Drawer (5 Cols) ── */}
          <div className="lg:col-span-4 bg-surface rounded-2xl border border-border p-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                    <Banknote className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">Running Cash Drawer</h3>
                    <p className="text-[11px] text-text-muted">Used for daily transactions (POS, sales, etc.)</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                  Active
                </span>
              </div>

              {/* Balance */}
              <div>
                <div className="text-[11px] font-medium text-text-muted">Current Balance</div>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(runningTotal)}
                </div>
              </div>

              {/* Metrics: Denominations & Total Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-alt/70 border border-border/80 rounded-xl p-3 flex items-center gap-2.5">
                  <Wallet className="size-4 text-text-muted" />
                  <div>
                    <div className="text-[10px] text-text-muted">Denominations</div>
                    <div className="text-xs font-black font-mono text-text">
                      {runningDenomsCount} / 9
                    </div>
                  </div>
                </div>
                <div className="bg-surface-alt/70 border border-border/80 rounded-xl p-3 flex items-center gap-2.5">
                  <Coins className="size-4 text-text-muted" />
                  <div>
                    <div className="text-[10px] text-text-muted">Total Notes/Coins</div>
                    <div className="text-xs font-black font-mono text-text">
                      {runningNotesCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Only show when shift is active */}
            {isShiftActive && (
              <div className="grid grid-cols-2 gap-3 pt-5 border-t border-border/60 mt-4">
                <UIButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDepositModalOpen(true)}
                  startIcon={<ArrowDownToLine className="size-3.5 text-emerald-600" />}
                  className="w-full rounded-xl text-xs font-bold border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                >
                  Deposit Cash
                </UIButton>
                <UIButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsWithdrawModalOpen(true)}
                  startIcon={<ArrowUpFromLine className="size-3.5 text-rose-600" />}
                  className="w-full rounded-xl text-xs font-bold border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  Withdraw Cash
                </UIButton>
              </div>
            )}
          </div>

          {/* ── CARD 2: Frozen Reserve Vault (4 Cols) ── */}
          <div className="lg:col-span-4 bg-surface rounded-2xl border border-border p-5 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                    <Lock className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text">Frozen Reserve Vault</h3>
                    <p className="text-[11px] text-text-muted">Reserved cash for security and future use</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                  Locked
                </span>
              </div>

              {/* Balance */}
              <div>
                <div className="text-[11px] font-medium text-text-muted">Current Balance</div>
                <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">
                  {formatCurrency(frozenTotal)}
                </div>
              </div>

              {/* Metrics: Denominations & Total Notes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-alt/70 border border-border/80 rounded-xl p-3 flex items-center gap-2.5">
                  <Wallet className="size-4 text-text-muted" />
                  <div>
                    <div className="text-[10px] text-text-muted">Denominations</div>
                    <div className="text-xs font-black font-mono text-text">
                      {frozenDenomsCount} / 9
                    </div>
                  </div>
                </div>
                <div className="bg-surface-alt/70 border border-border/80 rounded-xl p-3 flex items-center gap-2.5">
                  <Coins className="size-4 text-text-muted" />
                  <div>
                    <div className="text-[10px] text-text-muted">Total Notes/Coins</div>
                    <div className="text-xs font-black font-mono text-text">
                      {frozenNotesCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-5 border-t border-border/60 mt-4">
              <UIButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("matrix")}
                startIcon={<Lock className="size-3.5 text-amber-600" />}
                className="w-full rounded-xl text-xs font-bold border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              >
                View Vault Details
              </UIButton>
            </div>
          </div>

          {/* ── CARD 3: Combined Summary (4 Cols) ── */}
          <div className="lg:col-span-4 bg-surface rounded-2xl border border-border p-5 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Layers className="size-5" />
              </div>
              <h3 className="text-sm font-bold text-text">Combined Summary</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Running Cash (Drawer)</span>
                <span className="font-mono font-bold text-text">{formatCurrency(runningTotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Frozen Cash (Vault)</span>
                <span className="font-mono font-bold text-text">{formatCurrency(frozenTotal)}</span>
              </div>
            </div>

            <div className="border-t border-border/80 pt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-text">Total Branch Cash</span>
              <span className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">
                {formatCurrency(totalVault)}
              </span>
            </div>

            <div className="border-t border-border/80 pt-3 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Shift Status</span>
                <span className="font-semibold text-text flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${isShiftActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {isShiftActive ? "Active" : "Closed"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Business Day</span>
                <div className="flex items-center gap-1.5 font-semibold text-text">
                  <span>{businessDateDisplay}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Open
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Branch</span>
                <span className="font-semibold text-text">{branchName}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════════
           SCREEN 1 - TAB 2: VAULT DENOMINATION MATRIX (Image 1 - Bottom)
           ══════════════════════════════════════════════════════════════════ */
        <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
          {/* Header Bar */}
          <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-text-muted flex items-center justify-center">
                <Lock className="size-4" />
              </div>
              <h3 className="text-sm font-bold text-text">Denomination Breakdown</h3>
            </div>

            {/* Toggle Buttons: Denomination Matrix vs Chart View */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMatrixViewMode("matrix")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  matrixViewMode === "matrix"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-surface-alt text-text-muted hover:text-text border border-border"
                }`}
              >
                <TableIcon className="size-3.5" />
                Denomination Matrix
              </button>
              <button
                type="button"
                onClick={() => setMatrixViewMode("chart")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  matrixViewMode === "chart"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-surface-alt text-text-muted hover:text-text border border-border"
                }`}
              >
                <BarChart2 className="size-3.5" />
                Chart View
              </button>
            </div>
          </div>

          {matrixViewMode === "matrix" ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  {/* Super Header */}
                  <tr className="border-b border-border/80 text-[11px] font-bold text-text">
                    <th className="py-2.5 px-4 bg-surface-alt/40">Denomination</th>
                    <th colSpan={2} className="py-2.5 px-4 text-center bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-x border-border/60">
                      Running Cash Drawer
                    </th>
                    <th colSpan={2} className="py-2.5 px-4 text-center bg-amber-50/70 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-r border-border/60">
                      Frozen Reserve Vault
                    </th>
                    <th colSpan={2} className="py-2.5 px-4 text-center bg-blue-50/70 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 border-r border-border/60">
                      Total
                    </th>
                    <th className="py-2.5 px-4 bg-surface-alt/40 text-left">% of Total</th>
                  </tr>
                  {/* Sub Header */}
                  <tr className="border-b border-border text-[10px] font-bold text-text-muted uppercase tracking-wider bg-surface-alt/20">
                    <th className="py-2 px-4"></th>
                    <th className="py-2 px-3 text-center border-l border-border/60">Count</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                    <th className="py-2 px-3 text-center border-l border-border/60">Count</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                    <th className="py-2 px-3 text-center border-l border-border/60">Count</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                    <th className="py-2 px-4 border-l border-border/60"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/50">
                  {matrixRows.map((row) => (
                    <tr key={row.note} className="hover:bg-surface-alt/30 transition">
                      {/* Denomination badge */}
                      <td className="py-2.5 px-4 font-bold text-text">
                        <div className="flex items-center gap-2">
                          <span className={`size-5 rounded flex items-center justify-center text-[9px] font-bold border ${row.color}`}>
                            {row.icon}
                          </span>
                          <span>{row.label}</span>
                        </div>
                      </td>

                      {/* Running Count */}
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-text border-l border-border/40">
                        {row.rCount}
                      </td>
                      {/* Running Amount */}
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-text">
                        {formatCurrency(row.rAmount)}
                      </td>

                      {/* Frozen Count */}
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-text border-l border-border/40">
                        {row.fCount}
                      </td>
                      {/* Frozen Amount */}
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-text">
                        {formatCurrency(row.fAmount)}
                      </td>

                      {/* Total Count */}
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-text border-l border-border/40">
                        {row.totalCount}
                      </td>
                      {/* Total Amount */}
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-text">
                        {formatCurrency(row.totalAmount)}
                      </td>

                      {/* % of Total & Progress Bar */}
                      <td className="py-2.5 px-4 border-l border-border/40 min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <span className="w-10 text-right font-mono font-semibold text-text-muted">
                            {row.pct.toFixed(1)}%
                          </span>
                          <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, Math.max(0, row.pct))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Footer Totals Row */}
                <tfoot>
                  <tr className="border-t-2 border-border font-bold text-xs bg-surface-alt/40">
                    <td className="py-3 px-4 font-black text-text">Total</td>
                    {/* Running Totals */}
                    <td className="py-3 px-3 text-center font-mono font-black text-emerald-700 dark:text-emerald-400 border-l border-border/40 bg-emerald-50/40 dark:bg-emerald-950/10">
                      {runningNotesCount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/10">
                      {formatCurrency(runningTotal)}
                    </td>

                    {/* Frozen Totals */}
                    <td className="py-3 px-3 text-center font-mono font-black text-amber-700 dark:text-amber-400 border-l border-border/40 bg-amber-50/40 dark:bg-amber-950/10">
                      {frozenNotesCount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/10">
                      {formatCurrency(frozenTotal)}
                    </td>

                    {/* Grand Totals */}
                    <td className="py-3 px-3 text-center font-mono font-black text-blue-700 dark:text-blue-400 border-l border-border/40 bg-blue-50/40 dark:bg-blue-950/10">
                      {totalNotesCount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-blue-700 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/10">
                      {formatCurrency(totalVault)}
                    </td>

                    {/* 100% Bar */}
                    <td className="py-3 px-4 border-l border-border/40">
                      <div className="flex items-center gap-3">
                        <span className="w-10 text-right font-mono font-black text-text">
                          100%
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-blue-600" />
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            /* Chart View */
            <div className="p-6 space-y-4">
              <div className="text-xs font-semibold text-text-muted mb-2">
                Denomination Value Distribution (Running vs Frozen Reserve)
              </div>
              <div className="space-y-3">
                {matrixRows.map((row) => (
                  <div key={row.note} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-text">{row.label}</span>
                      <span className="font-mono text-text-muted">
                        {formatCurrency(row.totalAmount)} ({row.pct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-4 rounded-lg bg-surface-alt overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{
                          width: `${totalVault > 0 ? (row.rAmount / totalVault) * 100 : 0}%`,
                        }}
                        title={`Running: ${formatCurrency(row.rAmount)}`}
                      />
                      <div
                        className="bg-amber-500 h-full transition-all duration-300"
                        style={{
                          width: `${totalVault > 0 ? (row.fAmount / totalVault) * 100 : 0}%`,
                        }}
                        title={`Frozen: ${formatCurrency(row.fAmount)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Dialog Modals ── */}
      <InitializeBranchCashModal
        isOpen={isInitModalOpen}
        onClose={() => {
          setIsInitModalOpen(false);
          if (currentBranch?._id) fetchBranchCash(currentBranch._id);
        }}
      />
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => {
          setIsDepositModalOpen(false);
          if (currentBranch?._id) fetchBranchCash(currentBranch._id);
        }}
      />
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => {
          setIsWithdrawModalOpen(false);
          if (currentBranch?._id) fetchBranchCash(currentBranch._id);
        }}
      />
    </div>
  );
};

export default BranchCashPage;
