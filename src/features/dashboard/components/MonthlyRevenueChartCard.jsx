// src/features/dashboard/components/MonthlyRevenueChartCard.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import { UICard, UIIconButton } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  MONTHLY_REVENUE_METRICS,
  REVENUE_CHART_TIMEFRAMES,
  REVENUE_CHART_POINTS,
} from "../constants/dashboardData";

export const MonthlyRevenueChartCard = ({ className }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const points = REVENUE_CHART_POINTS;
  const width = 680;
  const height = 240;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;
  const maxVal = 140;

  // Generate SVG coordinates
  const getCoordinates = (key) => {
    return points.map((p, i) => {
      const x = paddingX + (i / (points.length - 1)) * chartW;
      const y = paddingY + chartH - (p[key] / maxVal) * chartH;
      return { x, y, val: p[key], month: p.month };
    });
  };

  const revenueCoords = getCoordinates("revenue");
  const profitCoords = getCoordinates("profit");

  // Create smooth bezier curve path
  const createSmoothPath = (coords) => {
    if (!coords.length) return "";
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
  const revenueAreaPath = `${revenueLinePath} L ${revenueCoords[revenueCoords.length - 1].x} ${height - paddingY} L ${revenueCoords[0].x} ${height - paddingY} Z`;

  const profitLinePath = createSmoothPath(profitCoords);

  const yTicks = [140, 105, 70, 35, 0];

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
            Monthly Revenue Performance
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Revenue, profit and operational expenses overview
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Timeframe selector */}
          <div className="relative">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-surface-alt/70 px-3.5 py-1.5 pr-8 text-xs font-medium text-text transition-all hover:bg-surface-hover focus:border-primary focus:outline-none cursor-pointer"
            >
              {REVENUE_CHART_TIMEFRAMES.map((tf) => (
                <option key={tf.value} value={tf.value}>
                  {tf.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-text-muted" />
          </div>

          <UIIconButton
            variant="ghost"
            size="sm"
            aria-label="More revenue options"
            icon={<MoreHorizontal className="size-4" />}
          />
        </div>
      </div>

      {/* Metric Legend Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        {MONTHLY_REVENUE_METRICS.map((metric) => (
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
              <span className={cn("text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded-md", metric.badgeClass)}>
                {metric.change}
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
              <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--app-color-success)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--app-color-success)" stopOpacity="0.0" />
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
                    {tick === 0 ? "0" : `${tick}`}
                  </text>
                </g>
              );
            })}

            {/* X-Axis Month Labels */}
            {points.map((p, i) => {
              const x = paddingX + (i / (points.length - 1)) * chartW;
              return (
                <text
                  key={p.month}
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
            <path d={revenueAreaPath} fill="url(#revenueGrad)" />
            <path
              d={revenueLinePath}
              fill="none"
              stroke="var(--app-color-primary)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Profit Line */}
            <path
              d={profitLinePath}
              fill="none"
              stroke="var(--app-color-success)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5 3"
            />

            {/* Interactive Points */}
            {revenueCoords.map((coord, i) => (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical hover guide line */}
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

                {/* Point dot */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={hoveredIndex === i ? 6 : 4}
                  fill="var(--app-color-surface)"
                  stroke="var(--app-color-primary)"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />

                {/* Profit dot */}
                <circle
                  cx={profitCoords[i].x}
                  cy={profitCoords[i].y}
                  r={hoveredIndex === i ? 5 : 3.5}
                  fill="var(--app-color-surface)"
                  stroke="var(--app-color-success)"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />

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
          {hoveredIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute pointer-events-none rounded-xl border border-border bg-surface px-3 py-2 text-xs shadow-md z-20"
              style={{
                left: `${(hoveredIndex / (points.length - 1)) * 80 + 10}%`,
                top: "30%",
              }}
            >
              <div className="font-semibold text-text mb-1 border-b border-border pb-1">
                {points[hoveredIndex].month} Summary
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-primary font-medium">● Revenue:</span>
                <span className="font-mono font-bold text-text">
                  ₹{points[hoveredIndex].revenue}k
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-success font-medium">● Profit:</span>
                <span className="font-mono font-bold text-text">
                  ₹{points[hoveredIndex].profit}k
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-warning font-medium">● Expenses:</span>
                <span className="font-mono font-bold text-text">
                  ₹{points[hoveredIndex].expenses}k
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
