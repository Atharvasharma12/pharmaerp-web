import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppMobileHeader from "@/layouts/app/mobile/AppMobileHeader";
import { ROUTES } from "@/constants";
import { useGstr3b } from "../../hooks/useGstr3b";
import Gstr3bDrillDownModal from "../../components/Gstr3bDrillDownModal";
import {
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiLayers,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
  FiPrinter,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export const Gstr3bMobilePage = () => {
  const {
    financialYears,
    selectedFy,
    setSelectedFy,
    returnPeriods,
    selectedPeriod,
    setSelectedPeriod,
    branches,
    branchId,
    setBranchId,
    currentBranch,
    summaryData,
    loading,
    error,
    refetch,
    drillDownData,
    isDrillDownOpen,
    openDrillDown,
    closeDrillDown,
    exportToExcel,
    exportToPdf,
  } = useGstr3b();

  const [openSection31, setOpenSection31] = useState(true);
  const [openSection4, setOpenSection4] = useState(true);
  const [openLiability, setOpenLiability] = useState(true);

  const cards = summaryData?.summaryCards;
  const sec31 = summaryData?.section31;
  const sec4 = summaryData?.section4;
  const taxLiab = summaryData?.taxLiability;
  const recon = summaryData?.reconciliation;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-text transition-colors pb-16">
      {/* 1. App Mobile Header */}
      <AppMobileHeader />

      {/* 2. Top Title & Filter Controls */}
      <div className="bg-white dark:bg-surface border-b border-slate-200 dark:border-border p-4 space-y-3 transition-colors">
        {/* Mobile GST Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-200/70 dark:bg-surface-alt p-1 gap-1">
          <Link
            to={ROUTES.GSTR1}
            className="flex-1 py-1.5 text-center text-xs font-medium rounded-lg text-slate-600 dark:text-text-muted hover:text-slate-900 dark:hover:text-text"
          >
            GSTR-1
          </Link>
          <Link
            to={ROUTES.GSTR2}
            className="flex-1 py-1.5 text-center text-xs font-medium rounded-lg text-slate-600 dark:text-text-muted hover:text-slate-900 dark:hover:text-text"
          >
            GSTR-2
          </Link>
          <Link
            to={ROUTES.GSTR3B}
            className="flex-1 py-1.5 text-center text-xs font-bold rounded-lg bg-white dark:bg-surface text-slate-900 dark:text-text shadow-xs"
          >
            GSTR-3B
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm">
              <FiLayers className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-slate-900 dark:text-text">GSTR-3B</h1>
                <span className="text-[10px] px-2 py-0.2 rounded-md font-bold uppercase bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                  Summary
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-text-muted">GST Monthly Self-Declaration</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={refetch}
              disabled={loading}
              className="p-2 text-slate-600 dark:text-text-muted hover:text-slate-900 dark:hover:text-text bg-slate-100 dark:bg-surface-alt rounded-lg border border-slate-200 dark:border-border"
            >
              <FiRefreshCw className={`size-3.5 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            <button
              type="button"
              onClick={exportToExcel}
              disabled={loading || !summaryData}
              className="p-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
              title="Export Excel"
            >
              <FiDownload className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={exportToPdf}
              disabled={loading || !summaryData}
              className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              title="Print / PDF"
            >
              <FiPrinter className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Period selection inputs */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-text-muted uppercase block mb-1">FY</label>
            <select
              value={selectedFy}
              onChange={(e) => setSelectedFy(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-surface-alt border border-slate-200 dark:border-border font-bold text-slate-900 dark:text-text"
            >
              {financialYears.map((fy) => (
                <option key={fy} value={fy} className="bg-white dark:bg-surface text-slate-900 dark:text-text">
                  {fy}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-text-muted uppercase block mb-1">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-surface-alt border border-slate-200 dark:border-border font-bold text-slate-900 dark:text-text"
            >
              {returnPeriods.map((p) => (
                <option key={p.key} value={p.key} className="bg-white dark:bg-surface text-slate-900 dark:text-text">
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Content Body */}
      <div className="p-4 space-y-4">
        {/* Error notification */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Summary Cards Mobile Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white dark:bg-surface p-3 rounded-xl border border-slate-200 dark:border-border shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 dark:text-text-muted uppercase block">Taxable Outward</span>
            <span className="text-sm font-black font-mono text-slate-900 dark:text-text mt-1 block">
              {formatCurrency(cards?.totalTaxableOutward?.value || 0)}
            </span>
          </div>

          <div className="bg-indigo-50/40 dark:bg-indigo-500/10 p-3 rounded-xl border border-indigo-200 dark:border-indigo-500/20 shadow-2xs">
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block">Output GST</span>
            <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1 block">
              {formatCurrency(cards?.outputGst?.value || 0)}
            </span>
          </div>

          <div className="bg-blue-50/40 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-200 dark:border-blue-500/20 shadow-2xs">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase block">Eligible ITC</span>
            <span className="text-sm font-black font-mono text-blue-600 dark:text-blue-400 mt-1 block">
              {formatCurrency(cards?.eligibleItc?.value || 0)}
            </span>
          </div>

          <div className="bg-emerald-50/40 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20 shadow-2xs">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block">Net ITC</span>
            <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
              {formatCurrency(cards?.netItc?.value || 0)}
            </span>
          </div>

          <div className="col-span-2 bg-amber-50/50 dark:bg-amber-500/10 p-3.5 rounded-xl border border-amber-200 dark:border-amber-500/30 shadow-2xs flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase block">Net GST Cash Payable</span>
              <span className="text-base font-black font-mono text-amber-600 dark:text-amber-400 mt-0.5 block">
                {formatCurrency(cards?.netGstLiability?.value || 0)}
              </span>
            </div>
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <FaRupeeSign className="size-4" />
            </span>
          </div>
        </div>

        {/* ── Section 3.1 Accordion ── */}
        <div className="bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenSection31(!openSection31)}
            className="w-full px-4 py-3 bg-slate-50/60 dark:bg-surface-alt/40 flex items-center justify-between text-left"
          >
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-text">3.1 Outward & RCM Supplies</h2>
              <span className="text-[10px] text-slate-500 dark:text-text-muted">Total: {formatCurrency(sec31?.total?.totalTax || 0)}</span>
            </div>
            {openSection31 ? <FiChevronUp className="size-4 text-slate-500" /> : <FiChevronDown className="size-4 text-slate-500" />}
          </button>

          {openSection31 && (
            <div className="divide-y divide-slate-100 dark:divide-border/60 p-2 space-y-2">
              {(sec31?.rows || []).map((row) => (
                <div key={row.code} className="p-2.5 rounded-lg bg-slate-50/50 dark:bg-surface-alt/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] px-1.5 py-0.2 bg-slate-200 dark:bg-surface rounded text-slate-800 dark:text-text">
                      {row.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => openDrillDown(row)}
                      className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
                    >
                      {row.voucherCount} items <FiExternalLink className="size-2.5" />
                    </button>
                  </div>
                  <p className="text-[11px] font-medium text-slate-900 dark:text-text leading-tight">{row.description}</p>
                  <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-200/60 dark:border-border/60 text-[10px] font-mono">
                    <div>Taxable: <strong className="text-slate-800 dark:text-text">{formatCurrency(row.taxable)}</strong></div>
                    <div className="text-right">Tax: <strong className="text-indigo-600 dark:text-indigo-400">{formatCurrency(row.totalTax)}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Section 4 ITC Accordion ── */}
        <div className="bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenSection4(!openSection4)}
            className="w-full px-4 py-3 bg-slate-50/60 dark:bg-surface-alt/40 flex items-center justify-between text-left"
          >
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-text">4. Eligible ITC & Reversals</h2>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Net ITC: {formatCurrency(sec4?.netItc?.totalItc || 0)}</span>
            </div>
            {openSection4 ? <FiChevronUp className="size-4 text-slate-500" /> : <FiChevronDown className="size-4 text-slate-500" />}
          </button>

          {openSection4 && (
            <div className="divide-y divide-slate-100 dark:divide-border/60 p-2 space-y-2">
              {(sec4?.available?.rows || []).map((row) => (
                <div key={row.code} className="p-2.5 rounded-lg bg-blue-50/20 dark:bg-blue-500/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] px-1.5 py-0.2 bg-blue-100 dark:bg-blue-500/20 rounded text-blue-800 dark:text-blue-300">
                      {row.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => openDrillDown(row)}
                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                    >
                      {row.voucherCount} items <FiExternalLink className="size-2.5" />
                    </button>
                  </div>
                  <p className="text-[11px] font-medium text-slate-900 dark:text-text leading-tight">{row.description}</p>
                  <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-border/60 text-[10px] font-mono">
                    <span>IGST: {formatCurrency(row.igst)}</span>
                    <span>Total ITC: <strong className="text-blue-700 dark:text-blue-300">{formatCurrency(row.totalItc)}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Section 5/6 Tax Liability Accordion ── */}
        <div className="bg-white dark:bg-surface rounded-xl border border-slate-200 dark:border-border shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenLiability(!openLiability)}
            className="w-full px-4 py-3 bg-slate-50/60 dark:bg-surface-alt/40 flex items-center justify-between text-left"
          >
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-text">5/6. Payment of Tax</h2>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">Payable: {formatCurrency(taxLiab?.cashPayable?.total || 0)}</span>
            </div>
            {openLiability ? <FiChevronUp className="size-4 text-slate-500" /> : <FiChevronDown className="size-4 text-slate-500" />}
          </button>

          {openLiability && (
            <div className="p-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-border/60">
                <span className="text-slate-500 dark:text-text-muted">Gross Liability:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-text">{formatCurrency(taxLiab?.totalLiability?.total || 0)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-border/60 text-emerald-700 dark:text-emerald-400">
                <span>Less: Paid Through ITC:</span>
                <span className="font-mono font-bold">-{formatCurrency(taxLiab?.itcUtilized?.total || 0)}</span>
              </div>
              <div className="flex justify-between py-1.5 pt-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <span>Net Cash Payable:</span>
                <span className="font-mono">{formatCurrency(taxLiab?.cashPayable?.total || 0)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Drill-Down Modal */}
      <Gstr3bDrillDownModal
        isOpen={isDrillDownOpen}
        onClose={closeDrillDown}
        data={drillDownData}
      />
    </div>
  );
};

export default Gstr3bMobilePage;
