// src/features/dashboard/components/InventoryDistributionCard.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, PackageOpen } from "lucide-react";
import { UICard, UIIconButton } from "@/components/ui";
import { cn } from "@/lib/utils";

export const InventoryDistributionCard = ({ inventoryDistribution, className }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const total = inventoryDistribution?.totalProducts ?? 0;
  const categories = inventoryDistribution?.categories ?? [];

  // Donut SVG geometry parameters
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <UICard
      variant="default"
      className={cn(
        "flex flex-col justify-between p-5 sm:p-6 border-border rounded-2xl bg-surface shadow-xs",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text tracking-tight">
            Inventory Distribution
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Real stock breakdown by category
          </p>
        </div>

        <UIIconButton
          variant="ghost"
          size="sm"
          aria-label="More distribution options"
          icon={<MoreHorizontal className="size-4" />}
        />
      </div>

      {categories.length > 0 && total > 0 ? (
        <>
          {/* Donut Chart Container */}
          <div className="relative flex items-center justify-center py-4 my-auto">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90 select-none overflow-visible"
            >
              {/* Background track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="var(--app-color-surface-alt)"
                strokeWidth={strokeWidth}
              />

              {/* Slices */}
              {categories.map((cat) => {
                const pct = Math.max(0, Math.min(100, cat.percentage || 0));
                const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += pct;

                const isHovered = hoveredCategory === cat.name;

                return (
                  <circle
                    key={cat.name}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={cat.colorVar}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                Total Products
              </span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-text tabular-nums mt-0.5">
                {total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Category Breakdown Legend List */}
          <div className="space-y-2 pt-3 border-t border-border/70">
            {categories.map((cat) => {
              const isHovered = hoveredCategory === cat.name;

              return (
                <div
                  key={cat.name}
                  onMouseEnter={() => setHoveredCategory(cat.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={cn(
                    "flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                    isHovered ? "bg-surface-alt text-text" : "text-text-muted hover:text-text"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn("size-2.5 rounded-full shrink-0", cat.bgClass)}
                    />
                    <span className="font-medium text-text truncate">
                      {cat.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-bold text-text tabular-nums">
                      {(cat.count || 0).toLocaleString()}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-text-muted w-8 text-right tabular-nums">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center my-auto">
          <PackageOpen className="size-10 text-text-muted opacity-40 mb-2" />
          <p className="text-xs font-semibold text-text">No category data yet</p>
          <p className="text-[11px] text-text-muted max-w-[200px] mt-1">
            Products added to catalog with categories will appear here in real time.
          </p>
        </div>
      )}
    </UICard>
  );
};

export default InventoryDistributionCard;
