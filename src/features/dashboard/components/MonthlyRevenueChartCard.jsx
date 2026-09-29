// src/features/dashboard/components/MonthlyRevenueChartCard.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { UICard, UIIconButton } from "@/components/ui";
import { cn } from "@/lib/utils";

export const MonthlyRevenueChartCard = ({ monthlyFinancials, className }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const defaultPoints = [
    { month: "May", revenue: 0, expenses: 0, profit: 0, invoices: 0 },
    { month: "Jun", revenue: 0, expenses: 0, profit: 0, invoices: 0 },
    { month: "Jul", revenue: 0, expenses: 0, profit: 0, invoices: 0 },
    { month: "Aug", revenue: 0, expenses: 0, profit: 0, invoices: 0 },
    { month: "Sep", revenue: 0, expenses: 0, profit: 0, invoices: 0 },
    { month: "Oct", revenue: 0, expenses: 0, profit: 0, invoices: 0 },
  ];

  const points = monthlyFinancials?.chartPoints?.length > 0
    ? monthlyFinancials.chartPoints
    : defaultPoints;

  const width = 680;
  const height = 240;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Defensive dynamic max value calculation
  const highestVal = Math.max(
    ...points.map((p) => Math.max(p.revenue || 0, p.expenses || 0)),
    100
  );
  // Round up to nice number
  const maxVal = Math.ceil(highestVal / 50) * 50;

  // Generate SVG coordinates
  const getCoordinates = (key) => {
    return points.map((p, i) => {
      const x = paddingX + (i / Math.max(1, points.length - 1)) * chartW;
      const val = p[key] || 0;
      const y = paddingY + chartH - (val / maxVal) * chartH;
      return { x, y, val, month: p.month };
    });
  };

  const revenueCoords = getCoordinates("revenue");
  const expensesCoords = getCoordinates("expenses");

  // Create smooth bezier curve path
  const createSmoothPath = (coords) => {
    if (!coords || !coords.length) return "";
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const revenueLinePath = createSmoothPath(revenueCoords);
  const revenueAreaPath = revenueCoords.length > 0
    ? `${revenueLinePath} L ${revenueCoords[revenueCoords.length - 1].x} ${height - paddingY} L ${revenueCoords[0].x} ${height - paddingY} Z`
    : "";

  const expensesLinePath = createSmoothPath(expensesCoords);

  const yTicks = [
    maxVal,
    Math.round(maxVal * 0.75),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.25),
    0,
  ];

  const metrics = [
    {
      id: "revenue",
      label: "Revenue",
      value: `₹${(monthlyFinancials?.revenue || 0).toLocaleString()}`,
      badge: "This Month",
      colorVar: "var(--app-color-primary)",
      badgeClass: "bg-primary-soft text-primary",
    },
    {
      id: "expenses",
      label: "Purchases",
      value: `₹${(monthlyFinancials?.expenses || 0).toLocaleString()}`,
      badge: "Bills Total",
      colorVar: "var(--app-color-warning)",
      badgeClass: "bg-warning-soft text-warning",
    },
    {
      id: "profit",
      label: "Gross Margin",
      value: `₹${(monthlyFinancials?.profit || 0).toLocaleString()}`,
      badge: "Margin",
      colorVar: "var(--app-color-success)",
      badgeClass: "bg-success-soft text-success",
    },
    {
      id: "invoices",
      label: "Invoices Count",
      value: `${monthlyFinancials?.invoicesCount || 0}`,
      badge: "Sales Bills",
      colorVar: "var(--app-color-info)",
      badgeClass: "bg-info-soft text-info",
    },
  ];

  return (
    <UICard
      variant="default"
      className={cn(
        "flex flex-col justify-between p-5 sm:p-6 border-border rounded-2xl bg-surface shadow-xs",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text tracking-tight">
            Monthly Performance Trend
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Live 6-month revenue and purchase bills overview
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-text-muted font-medium bg-surface-alt px-3 py-1 rounded-xl border border-border">
            Last 6 Months
          </span>

          <UIIconButton
            variant="ghost"
            size="sm"
            aria-label="Options"
            icon={<MoreHorizontal className="size-4" />}
          />
        </div>
      </div>

      {/* Metric Legend Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="flex flex-col p-3 rounded-xl bg-surface-alt/60 border border-border/70"
          >
            <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: metric.colorVar }}
              />
              <span>{metric.label}</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-lg sm:text-xl font-extrabold font-mono text-text tabular-nums">
                {metric.value}
              </span>
              <span className={cn("text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md", metric.badgeClass)}>
                {metric.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* SVG Interactive Area Chart */}
      <div className="relative w-full overflow-x-auto pt-2">
        <div className="min-w-[500px] w-full">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-[220px] sm:h-[240px] overflow-visible select-none"
          >
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--app-color-primary)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--app-color-primary)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis labels */}
            {yTicks.map((tick) => {
              const y = paddingY + chartH - (tick / maxVal) * chartH;
              return (
                <g key={tick}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="var(--app-color-border)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fontFamily="monospace"
                    fill="var(--app-color-text-muted)"
                    className="tabular-nums select-none"
                  >
                    {tick === 0 ? "0" : `₹${tick > 999 ? `${Math.round(tick / 1000)}k` : tick}`}
                  </text>
                </g>
              );
            })}

            {/* X-Axis Month Labels */}
            {points.map((p, i) => {
              const x = paddingX + (i / Math.max(1, points.length - 1)) * chartW;
              return (
                <text
                  key={`${p.month}-${i}`}
                  x={x}
                  y={height - 2}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="var(--app-color-text-muted)"
                >
                  {p.month}
                </text>
              );
            })}

            {/* Revenue Area & Line */}
            {revenueAreaPath && <path d={revenueAreaPath} fill="url(#revenueGrad)" />}
            {revenueLinePath && (
              <path
                d={revenueLinePath}
                fill="none"
                stroke="var(--app-color-primary)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Purchases / Expenses Line */}
            {expensesLinePath && (
              <path
                d={expensesLinePath}
                fill="none"
                stroke="var(--app-color-warning)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5 3"
              />
            )}

            {/* Interactive Points */}
            {revenueCoords.map((coord, i) => (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {hoveredIndex === i && (
                  <line
                    x1={coord.x}
                    y1={paddingY}
                    x2={coord.x}
                    y2={height - paddingY}
                    stroke="var(--app-color-primary)"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}

                {/* Revenue dot */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={hoveredIndex === i ? 6 : 4}
                  fill="var(--app-color-surface)"
                  stroke="var(--app-color-primary)"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />

                {/* Expenses dot */}
                {expensesCoords[i] && (
                  <circle
                    cx={expensesCoords[i].x}
                    cy={expensesCoords[i].y}
                    r={hoveredIndex === i ? 5 : 3.5}
                    fill="var(--app-color-surface)"
                    stroke="var(--app-color-warning)"
                    strokeWidth="2"
                    className="transition-all duration-150"
                  />
                )}

                {/* Larger hover target */}
                <rect
                  x={coord.x - 20}
                  y={paddingY}
                  width="40"
                  height={chartH}
                  fill="transparent"
                />
              </g>
            ))}
          </svg>

          {/* Floating Hover Tooltip */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute pointer-events-none rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-md z-20"
              style={{
                left: `${(hoveredIndex / Math.max(1, points.length - 1)) * 75 + 10}%`,
                top: "25%",
              }}
            >
              <div className="font-semibold text-text mb-1 border-b border-border pb-1">
                {points[hoveredIndex].month} Live Data
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-primary font-medium">● Sales:</span>
                <span className="font-mono font-bold text-text">
                  ₹{(points[hoveredIndex].revenue || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-warning font-medium">● Purchases:</span>
                <span className="font-mono font-bold text-text">
                  ₹{(points[hoveredIndex].expenses || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-info font-medium">● Invoices:</span>
                <span className="font-mono font-bold text-text">
                  {points[hoveredIndex].invoices || 0}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </UICard>
  );
};

export default MonthlyRevenueChartCard;
