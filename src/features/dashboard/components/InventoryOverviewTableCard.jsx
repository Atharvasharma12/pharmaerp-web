// src/features/dashboard/components/InventoryOverviewTableCard.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Download,
  MoreHorizontal,
  Plus,
  AlertCircle,
  Eye,
  Loader2,
  Package,
} from "lucide-react";
import {
  UICard,
  UIButton,
  UIBadge,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import workspaceProductService from "@/features/workspace-products/services/workspaceProductService";
import { ROUTES } from "@/constants";

export const InventoryOverviewTableCard = ({
  onAddMedicine,
  onExport,
  className,
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState(null);

  const productTypes = ["all", "medicine", "otc"];

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        limit: 10,
        page: 1,
      };
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      if (selectedType !== "all") {
        params.productType = selectedType;
      }

      const res = await workspaceProductService.getWorkspaceProducts(params);
      const data = res.data?.data || res.data || {};
      const list = Array.isArray(data) ? data : (data.products || data.items || data.docs || []);
      setProducts(list);
      setTotalCount(data.total || list.length);
    } catch (err) {
      console.error("Failed to load inventory products:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleExportClick = () => {
    if (onExport) {
      onExport();
    } else {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Product Name,SKU,Type,MRP,PTR,Status\n" +
        products
          .map(
            (p) =>
              `"${p.name || ""}","${p.workspaceProductCode || ""}","${p.productType || ""}","${p.mrp || 0}","${p.ptr || 0}","${p.status || "active"}"`
          )
          .join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `inventory_live_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "active").toLowerCase();
    if (s === "active") {
      return (
        <UIBadge variant="soft" intent="success" className="font-semibold text-xs">
          Active
        </UIBadge>
      );
    }
    return (
      <UIBadge variant="soft" intent="neutral" className="font-semibold text-xs">
        Inactive
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
            Live catalog products and inventory records
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
              placeholder="Search product name or SKU..."
              className="w-full rounded-xl border border-border bg-surface-alt/70 pl-8 pr-3 py-1.5 text-xs text-text placeholder:text-text-muted transition-all hover:bg-surface-hover focus:border-primary focus:bg-surface focus:outline-none"
            />
          </div>

          {/* Type Filter Chips */}
          <div className="hidden sm:flex items-center gap-1 bg-surface-alt p-0.5 rounded-xl border border-border">
            {productTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all capitalize",
                  selectedType === type
                    ? "bg-surface text-primary shadow-xs font-semibold"
                    : "text-text-muted hover:text-text"
                )}
              >
                {type}
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
      <div className="relative overflow-x-auto w-full pt-3 min-h-[220px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-2">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span className="text-xs">Loading live inventory...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-border text-[11px] font-semibold text-text-muted uppercase tracking-wider bg-surface-alt/30">
                <th className="py-3 px-4 font-semibold">Product Name</th>
                <th className="py-3 px-3 font-semibold">SKU</th>
                <th className="py-3 px-3 font-semibold">Type</th>
                <th className="py-3 px-3 font-semibold text-right">MRP</th>
                <th className="py-3 px-3 font-semibold text-right">PTR</th>
                <th className="py-3 px-3 font-semibold">Rack</th>
                <th className="py-3 px-3 font-semibold text-center">Status</th>
                <th className="py-3 px-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {products.length > 0 ? (
                products.map((item) => (
                  <tr
                    key={item._id}
                    className="group hover:bg-surface-hover/70 transition-colors"
                  >
                    {/* Product Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary-soft text-primary font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                          {(item.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-text group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[11px] font-mono text-text-muted">
                            {item.pack || "Pack: N/A"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-3 font-mono font-medium text-text-muted">
                      {item.workspaceProductCode || "N/A"}
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3 text-text font-medium capitalize">
                      {item.productType || "Medicine"}
                    </td>

                    {/* MRP */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-text tabular-nums">
                      ₹{Number(item.mrp || 0).toLocaleString()}
                    </td>

                    {/* PTR */}
                    <td className="py-3 px-3 text-right font-mono text-text-muted tabular-nums">
                      ₹{Number(item.ptr || 0).toLocaleString()}
                    </td>

                    {/* Rack */}
                    <td className="py-3 px-3 font-medium text-text-muted">
                      {item.rack || "—"}
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
                            setActiveMenuId(activeMenuId === item._id ? null : item._id)
                          }
                          className="p-1 rounded-lg hover:bg-surface-alt text-text-muted hover:text-text transition-colors cursor-pointer"
                          aria-label="Row actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === item._id && (
                          <div className="absolute right-0 top-8 z-30 w-36 rounded-xl border border-border bg-surface p-1 shadow-lg text-xs space-y-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                navigate(`/catalog/products/${item._id}`);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-text hover:bg-surface-hover cursor-pointer"
                            >
                              <Eye className="size-3.5 text-text-muted" />
                              <span>View Product</span>
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
                    No live products found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Footer / Summary */}
      <div className="flex items-center justify-between pt-3 border-t border-border/70 text-xs text-text-muted">
        <span className="font-mono tabular-nums">
          Showing {products.length} of {totalCount} products
        </span>

        <button
          type="button"
          onClick={onAddMedicine || (() => navigate(ROUTES.WORKSPACE_PRODUCTS || "/inventory/products"))}
          className="inline-flex items-center gap-1 text-primary font-semibold hover:underline cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Add New Product</span>
        </button>
      </div>
    </UICard>
  );
};

export default InventoryOverviewTableCard;
