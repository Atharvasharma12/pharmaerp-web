// src/features/dashboard/components/InventoryOverviewTableCard.jsx

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  MoreHorizontal,
  Plus,
  AlertCircle,
  Eye,
  Edit,
  ShoppingCart,
} from "lucide-react";
import {
  UICard,
  UIButton,
  UIBadge,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { INVENTORY_MEDICINES } from "../constants/dashboardData";

export const InventoryOverviewTableCard = ({
  onAddMedicine,
  onExport,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState(null);

  const categories = ["all", "Tablet", "Capsule", "Injection", "Syrup"];

  const filteredMedicines = useMemo(() => {
    return INVENTORY_MEDICINES.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === "all" || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleExportClick = () => {
    if (onExport) {
      onExport();
    } else {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Medicine,Batch,SKU,Category,Stock,ReorderLevel,ExpiryDate,Status\n" +
        filteredMedicines
          .map(
            (m) =>
              `"${m.name}","${m.batch}","${m.sku}","${m.category}","${m.stock}","${m.reorderLevel}","${m.expiryDate}","${m.status}"`
          )
          .join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `inventory_overview_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Healthy") {
      return (
        <UIBadge variant="soft" intent="success" className="font-semibold text-xs">
          Healthy
        </UIBadge>
      );
    }
    if (status === "Low Stock") {
      return (
        <UIBadge variant="soft" intent="warning" className="font-semibold text-xs">
          Low Stock
        </UIBadge>
      );
    }
    return (
      <UIBadge variant="soft" intent="error" className="font-semibold text-xs animate-pulse">
        Critical
      </UIBadge>
    );
  };

  return (
    <UICard
      variant="default"
      className={cn(
        "flex flex-col justify-between p-5 sm:p-6 border-border rounded-2xl bg-surface shadow-xs",
        className
      )}
    >
      {/* Top Header & Search/Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text tracking-tight">
            Inventory Overview
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Real-time stock levels across all categories
          </p>
        </div>

        {/* Search, Filter Pills, and Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px] sm:min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine..."
              className="w-full rounded-xl border border-border bg-surface-alt/70 pl-8 pr-3 py-1.5 text-xs text-text placeholder:text-text-muted transition-all hover:bg-surface-hover focus:border-primary focus:bg-surface focus:outline-none"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="hidden sm:flex items-center gap-1 bg-surface-alt p-0.5 rounded-xl border border-border">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all capitalize",
                  selectedCategory === cat
                    ? "bg-surface text-primary shadow-xs font-semibold"
                    : "text-text-muted hover:text-text"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <UIButton
            variant="outline"
            size="sm"
            onClick={handleExportClick}
            leftIcon={<Download className="size-3.5" />}
          >
            Export
          </UIButton>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative overflow-x-auto w-full pt-3">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr className="border-b border-border text-[11px] font-semibold text-text-muted uppercase tracking-wider bg-surface-alt/30">
              <th className="py-3 px-4 font-semibold">Medicine Name</th>
              <th className="py-3 px-3 font-semibold">SKU</th>
              <th className="py-3 px-3 font-semibold">Category</th>
              <th className="py-3 px-3 font-semibold text-right">Stock</th>
              <th className="py-3 px-3 font-semibold text-right">Reorder Level</th>
              <th className="py-3 px-3 font-semibold">Expiry Date</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-surface-hover/70 transition-colors"
                >
                  {/* Medicine Name & Batch */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary-soft text-primary font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                        {item.initial}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-text group-hover:text-primary transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[11px] font-mono text-text-muted">
                          {item.batch}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-3 px-3 font-mono font-medium text-text-muted">
                    {item.sku}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 text-text font-medium">
                    {item.category}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-text tabular-nums">
                    {item.stock}
                  </td>

                  {/* Reorder Level */}
                  <td className="py-3 px-3 text-right font-mono text-text-muted tabular-nums">
                    {item.reorderLevel}
                  </td>

                  {/* Expiry Date */}
                  <td className="py-3 px-3 font-medium text-text-muted">
                    {item.expiryDate}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3 text-center">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* Action Menu */}
                  <td className="py-3 px-3 text-right relative">
                    <div className="inline-block text-left">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === item.id ? null : item.id)
                        }
                        className="p-1 rounded-lg hover:bg-surface-alt text-text-muted hover:text-text transition-colors cursor-pointer"
                        aria-label="Row actions"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === item.id && (
                        <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-border bg-surface p-1 shadow-lg text-xs space-y-0.5">
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(null)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-text hover:bg-surface-hover cursor-pointer"
                          >
                            <Eye className="size-3.5 text-text-muted" />
                            <span>View Details</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(null)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-text hover:bg-surface-hover cursor-pointer"
                          >
                            <Edit className="size-3.5 text-text-muted" />
                            <span>Adjust Stock</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(null)}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-primary hover:bg-primary-soft font-semibold cursor-pointer"
                          >
                            <ShoppingCart className="size-3.5" />
                            <span>Reorder Medicine</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-text-muted">
                  <AlertCircle className="size-6 mx-auto mb-2 opacity-50 text-text-muted" />
                  No medicines found matching &ldquo;{searchQuery}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Summary */}
      <div className="flex items-center justify-between pt-3 border-t border-border/70 text-xs text-text-muted">
        <span className="font-mono tabular-nums">
          Showing {filteredMedicines.length} of {INVENTORY_MEDICINES.length} medicines
        </span>

        <button
          type="button"
          onClick={onAddMedicine}
          className="inline-flex items-center gap-1 text-primary font-semibold hover:underline cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Add New Medicine</span>
        </button>
      </div>
    </UICard>
  );
};

export default InventoryOverviewTableCard;
