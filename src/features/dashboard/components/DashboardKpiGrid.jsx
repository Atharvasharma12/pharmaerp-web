// src/features/dashboard/components/DashboardKpiGrid.jsx

import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  FileText,
  AlertTriangle,
  CalendarDays,
  ShoppingCart,
} from "lucide-react";
import { UIStatCard } from "@/components/ui";

const iconComponentMap = {
  TrendingUp: <TrendingUp className="size-5" />,
  Package: <Package className="size-5" />,
  FileText: <FileText className="size-5" />,
  AlertTriangle: <AlertTriangle className="size-5" />,
  CalendarDays: <CalendarDays className="size-5" />,
  ShoppingCart: <ShoppingCart className="size-5" />,
};

export const DashboardKpiGrid = ({ kpis, onCardClick, className }) => {
  const totalSalesVal = kpis?.totalRevenue ?? kpis?.todaysSalesAmount ?? 0;
  const totalInvoicesVal = kpis?.totalInvoicesCount ?? kpis?.transactionsToday ?? 0;
  const totalPurchasesVal = kpis?.totalPurchases || 0;
  const totalPurchasesCountVal = kpis?.totalPurchasesCount || 0;
  const activeProductsVal = kpis?.medicinesInStock || 0;
  const totalUnitsVal = kpis?.totalStockUnits || 0;
  const alertsCount = (kpis?.lowStockAlertsCount || 0) + (kpis?.expiringSoonCount || 0);

  const cards = [
    {
      id: "total-sales",
      title: "Total Sales",
      value: `₹${totalSalesVal.toLocaleString()}`,
      subtitle: `${totalInvoicesVal} invoice${totalInvoicesVal === 1 ? "" : "s"} generated`,
      trend:
        kpis?.revenueTrendPercent !== undefined && kpis?.revenueTrendPercent !== 0
          ? {
              value: `${kpis.revenueTrendPercent > 0 ? "+" : ""}${kpis.revenueTrendPercent}%`,
              direction: kpis.revenueTrendPercent >= 0 ? "up" : "down",
              label: "vs last mo",
            }
          : null,
      color: "primary",
      iconName: "TrendingUp",
    },
    {
      id: "total-purchases",
      title: "Total Purchases",
      value: `₹${totalPurchasesVal.toLocaleString()}`,
      subtitle: `${totalPurchasesCountVal} purchase bill${totalPurchasesCountVal === 1 ? "" : "s"}`,
      trend: null,
      color: "warning",
      iconName: "ShoppingCart",
    },
    {
      id: "total-transactions",
      title: "Transactions",
      value: `${totalInvoicesVal.toLocaleString()}`,
      subtitle: "Sales invoices completed",
      trend: null,
      color: "info",
      iconName: "FileText",
    },
    {
      id: "medicines-stock",
      title: "Active Products",
      value: `${activeProductsVal.toLocaleString()}`,
      subtitle: `${totalUnitsVal.toLocaleString()} units in inventory`,
      trend: null,
      color: "success",
      iconName: "Package",
    },
    {
      id: "stock-alerts",
      title: "Stock Alerts",
      value: `${alertsCount}`,
      subtitle: `${kpis?.lowStockAlertsCount || 0} low stock • ${kpis?.expiringSoonCount || 0} expiring`,
      trend:
        alertsCount > 0
          ? {
              value: `${alertsCount} items`,
              direction: "down",
              label: "Needs action",
            }
          : null,
      color: alertsCount > 0 ? "error" : "primary",
      iconName: "AlertTriangle",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            delay: index * 0.04,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <UIStatCard
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            trend={card.trend}
            color={card.color}
            icon={iconComponentMap[card.iconName]}
            variant="interactive"
            onClick={() => onCardClick && onCardClick(card)}
            className="h-full border-border/80 hover:border-primary/50 shadow-xs"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardKpiGrid;
