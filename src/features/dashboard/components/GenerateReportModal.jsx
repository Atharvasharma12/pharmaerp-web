// src/features/dashboard/components/GenerateReportModal.jsx

import React, { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { UIModal, UIButton, UIBadge } from "@/components/ui";

export const GenerateReportModal = ({ isOpen, onClose, onGenerated }) => {
  const [reportType, setReportType] = useState("inventory-sales");
  const [timeframe, setTimeframe] = useState("30d");
  const [format, setFormat] = useState("pdf");
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: "inventory-sales",
      title: "Comprehensive Inventory & Sales",
      desc: "Full stock valuation, sales trends, and movement logs.",
      badge: "Popular",
    },
    {
      id: "expiry-audit",
      title: "Batch Expiry & Risk Audit",
      desc: "Batches expiring in 30/60/90 days with rotation advice.",
      badge: "Compliance",
    },
    {
      id: "revenue-financial",
      title: "Revenue & Profit Performance",
      desc: "Gross margins, operational overhead, and net earnings.",
      badge: "Finance",
    },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      if (onGenerated) onGenerated({ reportType, timeframe, format });
      onClose();
    }, 900);
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 font-sans space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Generate Pharmacy Report</h2>
              <p className="text-xs text-text-muted">
                Select parameters to export analytics and operational audits.
              </p>
            </div>
          </div>
        </div>

        {/* Report Type Options */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Report Type
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {reportTypes.map((type) => (
              <label
                key={type.id}
                onClick={() => setReportType(type.id)}
                className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  reportType === type.id
                    ? "border-primary bg-primary-soft/30 shadow-xs"
                    : "border-border hover:bg-surface-alt/60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === type.id}
                    onChange={() => setReportType(type.id)}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <div className="text-sm font-bold text-text">{type.title}</div>
                    <div className="text-xs text-text-muted mt-0.5">{type.desc}</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-md">
                  {type.badge}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Timeframe & Export Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">Time Period</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs font-medium text-text focus:border-primary focus:outline-none"
            >
              <option value="today">Today (Live)</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days (Recommended)</option>
              <option value="90d">This Quarter (90 Days)</option>
              <option value="1y">Full Financial Year</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat("pdf")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  format === "pdf"
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border text-text hover:bg-surface-alt"
                }`}
              >
                <FileText className="size-4" />
                <span>PDF Document</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat("excel")}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  format === "excel"
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border text-text hover:bg-surface-alt"
                }`}
              >
                <FileSpreadsheet className="size-4" />
                <span>Excel / CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <UIButton variant="outline" size="sm" onClick={onClose}>
            Cancel
          </UIButton>
          <UIButton
            variant="primary"
            size="sm"
            onClick={handleGenerate}
            isLoading={isGenerating}
            leftIcon={<Download className="size-4" />}
          >
            Export Report
          </UIButton>
        </div>
      </div>
    </UIModal>
  );
};

export default GenerateReportModal;
