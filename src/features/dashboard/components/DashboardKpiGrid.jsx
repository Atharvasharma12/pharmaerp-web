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
import { DASHBOARD_KPI_CARDS } from "../constants/dashboardData";

const iconComponentMap = {
  TrendingUp: <TrendingUp className="size-5" />,
  Package: <Package className="size-5" />,
  FileText: <FileText className="size-5" />,
  AlertTriangle: <AlertTriangle className="size-5" />,
  CalendarDays: <CalendarDays className="size-5" />,
  ShoppingCart: <ShoppingCart className="size-5" />,
};

export const DashboardKpiGrid = ({ onCardClick, className }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {DASHBOARD_KPI_CARDS.map((card, index) => (
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
            sparklineData={card.sparklineData}
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
