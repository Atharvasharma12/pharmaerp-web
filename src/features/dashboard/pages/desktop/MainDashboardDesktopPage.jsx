// src/features/dashboard/pages/desktop/MainDashboardDesktopPage.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, FileText, Download } from "lucide-react";
import {
  DashboardHeroBanner,
  DashboardKpiGrid,
  MonthlyRevenueChartCard,
  InventoryDistributionCard,
  InventoryOverviewTableCard,
  SmartPharmacyInsightsCard,
  DashboardActionCardsGrid,
  GenerateReportModal,
  QuickAddMedicineModal,
} from "../../components";
import { ROUTES } from "@/constants";

export const MainDashboardDesktopPage = () => {
  const navigate = useNavigate();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleGenerateReportSuccess = ({ reportType, timeframe, format }) => {
    showNotification(
      `📊 Report exported successfully (${format.toUpperCase()} • ${timeframe})`
    );
  };

  const handleAddMedicineSuccess = (data) => {
    showNotification(`✅ "${data.name}" added to inventory successfully.`);
  };

  return (
    <section className="min-h-[100dvh] w-full bg-bg px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Dynamic Action Toast */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-8 z-50 flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-surface/95 px-4 py-3 text-sm font-semibold text-text shadow-xl backdrop-blur-md"
        >
          <CheckCircle2 className="size-5 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── 1. Top Hero Greeting Banner ─────────────────────────────── */}
        <DashboardHeroBanner
          onGenerateReport={() => setIsReportModalOpen(true)}
          onAddMedicine={() => setIsAddMedicineModalOpen(true)}
        />

        {/* ── 2. Top 6 KPI Metric Stat Cards Strip ───────────────────── */}
        <DashboardKpiGrid
          onCardClick={(card) => {
            if (card.id === "total-revenue" || card.id === "todays-sales") {
              // Nav or feedback
            }
          }}
        />

        {/* ── 3. Middle Performance & Distribution Grid (12-Col) ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Monthly Revenue Performance (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <MonthlyRevenueChartCard className="h-full" />
          </div>

          {/* Inventory Distribution Donut (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <InventoryDistributionCard className="h-full" />
          </div>
        </div>

        {/* ── 4. Main Operational Grid: Inventory Table & AI Insights (12-Col) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Inventory Overview Table (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <InventoryOverviewTableCard
              onAddMedicine={() => setIsAddMedicineModalOpen(true)}
              onExport={() => showNotification("📥 Inventory CSV exported successfully.")}
              className="h-full"
            />
          </div>

          {/* Smart Pharmacy AI Insights Widget (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <SmartPharmacyInsightsCard
              onAnalyticsClick={() =>
                showNotification("🔍 Loading predictive analytics and demand forecasting...")
              }
              className="h-full"
            />
          </div>
        </div>

        {/* ── 5. Bottom Row: 3 Operational Action Cards ───────────────── */}
        <DashboardActionCardsGrid
          onReorderClick={() => setIsAddMedicineModalOpen(true)}
          onExpiryDetailsClick={() =>
            showNotification("🗓 Opening batch expiry inspection schedule...")
          }
          onReviewOrdersClick={() =>
            showNotification("📦 Navigating to supplier purchase order review...")
          }
        />
      </div>

      {/* ── Modals & Drawers ────────────────────────────────────────── */}
      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerated={handleGenerateReportSuccess}
      />

      <QuickAddMedicineModal
        isOpen={isAddMedicineModalOpen}
        onClose={() => setIsAddMedicineModalOpen(false)}
        onAdded={handleAddMedicineSuccess}
      />
    </section>
  );
};

export default MainDashboardDesktopPage;
