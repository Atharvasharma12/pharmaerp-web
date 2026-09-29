// src/features/dashboard/pages/mobile/MainDashboardMobilePage.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Package,
  AlertTriangle,
  CalendarDays,
  ShoppingCart,
  FileText,
  Layers,
  BarChart3,
  CheckCircle2,
  Activity,
} from "lucide-react";
import {
  DashboardHeroBanner,
  MonthlyRevenueChartCard,
  InventoryDistributionCard,
  InventoryOverviewTableCard,
  SmartPharmacyInsightsCard,
  DashboardActionCardsGrid,
  GenerateReportModal,
  QuickAddMedicineModal,
} from "../../components";
import { UIStatCard } from "@/components/ui";
import { useDashboardData } from "../../hooks";
import { ROUTES } from "@/constants";

const iconComponentMap = {
  TrendingUp: <TrendingUp className="size-5" />,
  Package: <Package className="size-5" />,
  AlertTriangle: <AlertTriangle className="size-5" />,
  CalendarDays: <CalendarDays className="size-5" />,
  ShoppingCart: <ShoppingCart className="size-5" />,
  FileText: <FileText className="size-5" />,
};

export const MainDashboardMobilePage = () => {
  const navigate = useNavigate();
  const { data, isLoading, refresh } = useDashboardData();

  const [activeTab, setActiveTab] = useState("overview");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddMedicineModalOpen, setIsAddMedicineModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Layers },
    { id: "charts", label: "Analytics", icon: BarChart3 },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "alerts", label: "Live Alerts", icon: Activity },
  ];

  const kpis = data?.kpis;
  const totalSalesVal = kpis?.totalRevenue ?? kpis?.todaysSalesAmount ?? 0;
  const totalInvoicesVal = kpis?.totalInvoicesCount ?? kpis?.transactionsToday ?? 0;
  const totalPurchasesVal = kpis?.totalPurchases || 0;
  const totalPurchasesCountVal = kpis?.totalPurchasesCount || 0;
  const alertsCount = (kpis?.lowStockAlertsCount || 0) + (kpis?.expiringSoonCount || 0);

  const mobileKpiCards = [
    {
      id: "total-sales",
      title: "Total Sales",
      value: `₹${totalSalesVal.toLocaleString()}`,
      subtitle: `${totalInvoicesVal} invoice${totalInvoicesVal === 1 ? "" : "s"} generated`,
      color: "primary",
      iconName: "TrendingUp",
    },
    {
      id: "total-purchases",
      title: "Total Purchases",
      value: `₹${totalPurchasesVal.toLocaleString()}`,
      subtitle: `${totalPurchasesCountVal} purchase bill${totalPurchasesCountVal === 1 ? "" : "s"}`,
      color: "warning",
      iconName: "ShoppingCart",
    },
    {
      id: "total-transactions",
      title: "Transactions",
      value: `${totalInvoicesVal.toLocaleString()}`,
      subtitle: "Invoices completed",
      color: "info",
      iconName: "FileText",
    },
    {
      id: "medicines-stock",
      title: "Active Products",
      value: `${(kpis?.medicinesInStock || 0).toLocaleString()}`,
      subtitle: `${(kpis?.totalStockUnits || 0).toLocaleString()} units in inventory`,
      color: "success",
      iconName: "Package",
    },
    {
      id: "stock-alerts",
      title: "Stock Alerts",
      value: `${alertsCount}`,
      subtitle: `${kpis?.lowStockAlertsCount || 0} low • ${kpis?.expiringSoonCount || 0} expiring`,
      color: alertsCount > 0 ? "error" : "primary",
      iconName: "AlertTriangle",
    },
  ];

  return (
    <section className="min-h-[100dvh] w-full bg-bg px-3.5 pt-3 pb-24 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-[9999] flex items-center gap-2 rounded-xl border border-primary/30 bg-surface/95 p-3 text-xs font-semibold text-text shadow-xl backdrop-blur-md">
          <CheckCircle2 className="size-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-md mx-auto space-y-4">
        {/* ── 1. Compact Hero Greeting Banner ────────────────────────── */}
        <DashboardHeroBanner
          kpis={data?.kpis}
          isLoading={isLoading}
          onRefresh={refresh}
          onGenerateReport={() => setIsReportModalOpen(true)}
          onAddMedicine={() => setIsAddMedicineModalOpen(true)}
          className="p-5"
        />

        {/* ── 2. Swipeable KPI Stat Cards Strip ──────────────────────── */}
        <div className="flex gap-3 overflow-x-auto pb-1 pt-1 -mx-3.5 px-3.5 no-scrollbar snap-x snap-mandatory">
          {mobileKpiCards.map((card) => (
            <div
              key={card.id}
              className="min-w-[220px] max-w-[240px] shrink-0 snap-start"
            >
              <UIStatCard
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                trend={card.trend}
                color={card.color}
                icon={iconComponentMap[card.iconName]}
                variant="default"
                className="p-4"
              />
            </div>
          ))}
        </div>

        {/* ── 3. Mobile Navigation Tab Segmented Switcher ────────────── */}
        <div className="flex items-center gap-1 rounded-xl bg-surface-alt p-1 border border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-surface text-primary shadow-xs"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── 4. Tabbed Content Views ───────────────────────────────── */}
        <div className="space-y-4">
          {activeTab === "overview" && (
            <>
              <DashboardActionCardsGrid
                lowStockItems={data?.lowStockItems}
                expiringBatches={data?.expiringBatches}
                recentPurchaseBills={data?.recentPurchaseBills}
                onReorderClick={() => navigate(ROUTES.WORKSPACE_PRODUCTS || "/inventory/products")}
                onExpiryDetailsClick={() => navigate(ROUTES.WORKSPACE_PRODUCTS || "/inventory/products")}
                onReviewOrdersClick={() => navigate("/catalog/purchase-bills")}
              />
              <SmartPharmacyInsightsCard
                liveAlerts={data?.liveAlerts}
                onAnalyticsClick={() => setActiveTab("charts")}
              />
            </>
          )}

          {activeTab === "charts" && (
            <>
              <MonthlyRevenueChartCard
                monthlyFinancials={data?.monthlyFinancials}
              />
              <InventoryDistributionCard
                inventoryDistribution={data?.inventoryDistribution}
              />
            </>
          )}

          {activeTab === "inventory" && (
            <InventoryOverviewTableCard
              onAddMedicine={() => setIsAddMedicineModalOpen(true)}
              onExport={() => showNotification("📥 Inventory CSV exported successfully.")}
            />
          )}

          {activeTab === "alerts" && (
            <SmartPharmacyInsightsCard
              liveAlerts={data?.liveAlerts}
              onAnalyticsClick={() => navigate(ROUTES.SALES || "/sales")}
            />
          )}
        </div>
      </div>

      {/* ── Modals & Drawers ────────────────────────────────────────── */}
      <GenerateReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerated={({ format, timeframe }) =>
          showNotification(`📊 Report generated (${format.toUpperCase()} • ${timeframe})`)
        }
      />

      <QuickAddMedicineModal
        isOpen={isAddMedicineModalOpen}
        onClose={() => setIsAddMedicineModalOpen(false)}
        onAdded={(formData) => {
          showNotification(`✅ "${formData.name}" added to stock.`);
          refresh();
        }}
      />
    </section>
  );
};

export default MainDashboardMobilePage;
