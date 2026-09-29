// src/features/dashboard/pages/desktop/MainDashboardDesktopPage.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, RotateCw } from "lucide-react";
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
import { useDashboardData } from "../../hooks";
import { ROUTES } from "@/constants";

export const MainDashboardDesktopPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refresh } = useDashboardData();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleGenerateReportSuccess = ({ timeframe, format }) => {
    showNotification(
      `📊 Report exported successfully (${format.toUpperCase()} • ${timeframe})`
    );
  };

  const handleAddMedicineSuccess = (formData) => {
    showNotification(`✅ "${formData.name}" added to inventory.`);
    refresh();
  };

  return (
    <section className="min-h-[100dvh] w-full bg-bg px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Dynamic Action Toast */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-8 z-[9999] flex items-center gap-2.5 rounded-2xl border border-primary/30 bg-surface/95 px-4 py-3 text-sm font-semibold text-text shadow-xl backdrop-blur-md"
        >
          <CheckCircle2 className="size-5 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── 1. Top Hero Greeting Banner ─────────────────────────────── */}
        <DashboardHeroBanner
          kpis={data?.kpis}
          isLoading={isLoading}
          onRefresh={refresh}
          onGenerateReport={() => setIsReportModalOpen(true)}
          onAddMedicine={() => setIsAddMedicineModalOpen(true)}
        />

        {/* ── 2. Top 5 KPI Metric Stat Cards Strip ───────────────────── */}
        <DashboardKpiGrid
          kpis={data?.kpis}
          onCardClick={(card) => {
            if (card.id === "total-sales" || card.id === "total-transactions" || card.id === "total-revenue") {
              navigate(ROUTES.SALES || "/sales");
            } else if (card.id === "total-purchases") {
              navigate(ROUTES.PURCHASES || "/purchases");
            } else if (card.id === "medicines-stock" || card.id === "stock-alerts") {
              navigate(ROUTES.WORKSPACE_PRODUCTS || "/inventory/products");
            }
          }}
        />

        {/* ── 3. Middle Performance & Distribution Grid (12-Col) ──────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Monthly Revenue Performance (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <MonthlyRevenueChartCard
              monthlyFinancials={data?.monthlyFinancials}
              className="h-full"
            />
          </div>

          {/* Inventory Distribution Donut (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <InventoryDistributionCard
              inventoryDistribution={data?.inventoryDistribution}
              className="h-full"
            />
          </div>
        </div>

        {/* ── 4. Main Operational Grid: Inventory Table & Live Alerts (12-Col) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Inventory Overview Table (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <InventoryOverviewTableCard
              onAddMedicine={() => setIsAddMedicineModalOpen(true)}
              onExport={() => showNotification("📥 Inventory CSV exported successfully.")}
              className="h-full"
            />
          </div>

          {/* Live Operational Alerts Card (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <SmartPharmacyInsightsCard
              liveAlerts={data?.liveAlerts}
              onAnalyticsClick={() => navigate(ROUTES.SALES || "/sales")}
              className="h-full"
            />
          </div>
        </div>

        {/* ── 5. Bottom Row: 3 Operational Action Cards ───────────────── */}
        <DashboardActionCardsGrid
          lowStockItems={data?.lowStockItems}
          expiringBatches={data?.expiringBatches}
          recentPurchaseBills={data?.recentPurchaseBills}
          onReorderClick={() => navigate(ROUTES.WORKSPACE_PRODUCTS || "/inventory/products")}
          onExpiryDetailsClick={() => navigate(ROUTES.WORKSPACE_PRODUCTS || "/inventory/products")}
          onReviewOrdersClick={() => navigate("/catalog/purchase-bills")}
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
