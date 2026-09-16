// src/features/purchases/pages/desktop/PurchasesDesktopPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import {
  UICard,
  UIButton,
  UIBadge,
  UIStatCard,
} from "@/components/ui";
import { AppPagination } from "@/components/ui/data-display";
import { PermissionGate } from "@/components/common/PermissionGate";
import { cn } from "@/lib/utils";
import {
  PURCHASES_STATS,
  PURCHASE_SUPPLIERS,
} from "../../constants/purchasesData";
import { CreatePurchaseOrderModal } from "../../components/CreatePurchaseOrderModal";
import { PurchaseBillPreviewModal } from "../../components/PurchaseBillPreviewModal";
import purchaseBillService from "../../services/purchaseBillService";

const statIconMap = {
  Truck: <Truck className="size-5" />,
  Package: <Package className="size-5" />,
  CheckCircle2: <CheckCircle2 className="size-5" />,
  Clock: <Clock className="size-5" />,
};

export const PurchasesDesktopPage = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const statusTabs = [
    "all",
    "DRAFT",
    "CONFIRMED",
    "CANCELLED",
  ];

  const fetchBills = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (searchQuery) params.search = searchQuery;
      if (selectedStatus !== "all") params.status = selectedStatus;

      const res = await purchaseBillService.getPurchaseBills(params);
      const data = res.data?.data || {};
      setBills(data.bills || []);
      setPagination((prev) => ({ ...prev, total: data.total || 0 }));
    } catch (err) {
      console.error("Failed to fetch bills", err);
      setToastMessage("❌ Failed to load purchase bills");
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, selectedStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBills();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchBills]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize) => {
    setPagination((prev) => ({ ...prev, limit: newSize, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCreateSuccess = (newPO) => {
    setToastMessage(`✅ Purchase Order "${newPO.poNumber}" created.`);
    setTimeout(() => setToastMessage(null), 4000);
    fetchBills();
  };

  const handleMarkReceived = (poId) => {
    setToastMessage("✅ Stock intake confirmed. Inventory levels updated.");
    setTimeout(() => setToastMessage(null), 3500);
    fetchBills();
  };

  const handleCancelPO = (poId) => {
    setToastMessage("⚠️ Purchase order cancelled.");
    setTimeout(() => setToastMessage(null), 3000);
    fetchBills();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <UIBadge variant="soft" intent="success">Confirmed</UIBadge>;
      case "DRAFT":
        return <UIBadge variant="soft" intent="neutral">Draft</UIBadge>;
      case "CANCELLED":
        return <UIBadge variant="soft" intent="error">Cancelled</UIBadge>;
      default:
        return <UIBadge variant="soft" intent="info">{status}</UIBadge>;
    }
  };

  return (
    <section className="min-h-[100dvh] w-full bg-bg px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Toast Notification */}
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Purchases & Procurement
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Manage medicine orders, supplier logistics, batch procurement and goods receipts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PermissionGate
              permission="purchase:create"
              fallback={
                <UIButton variant="primary" size="md" disabled>
                  Create PO (Requires purchase:create)
                </UIButton>
              }
            >
              <UIButton
                variant="primary"
                size="md"
                onClick={() => setIsCreateOpen(true)}
                leftIcon={<Plus className="size-4" />}
              >
                Issue Purchase Order
              </UIButton>
            </PermissionGate>
            <PermissionGate
              permission="purchase:create"
              fallback={
                <UIButton variant="primary" size="md" disabled>
                  Enter Purchase Bill (Requires purchase:create)
                </UIButton>
              }
            >
              <UIButton
                variant="primary"
                size="md"
                onClick={() => navigate("/purchases/bills/create")}
                leftIcon={<FileSpreadsheet className="size-4" />}
              >
                Enter Purchase Bill
              </UIButton>
            </PermissionGate>
          </div>
        </div>



        {/* Purchase Orders Table Card */}
        <UICard variant="default" className="p-5 sm:p-6 rounded-2xl bg-surface border-border shadow-xs space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              {/* Search Input */}
              <div className="relative min-w-[240px] sm:min-w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Bill # or Invoice #..."
                  className="w-full rounded-xl border border-border bg-surface-alt/70 pl-9 pr-3 py-2 text-xs text-text placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
                />
              </div>

              {/* Refresh Button */}
              <UIButton
                variant="outline"
                size="icon"
                onClick={fetchBills}
                disabled={isLoading}
                title="Refresh bills"
                className="shrink-0 rounded-xl bg-surface-alt/70 border-border hover:bg-surface-hover hover:text-primary"
              >
                <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
              </UIButton>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1 bg-surface-alt p-1 rounded-xl border border-border overflow-x-auto">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedStatus(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer",
                    selectedStatus === tab
                      ? "bg-surface text-primary shadow-xs"
                      : "text-text-muted hover:text-text"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold text-text-muted uppercase tracking-wider bg-surface-alt/30">
                  <th className="py-3 px-4 font-semibold">Bill Number</th>
                  <th className="py-3 px-4 font-semibold">Supplier</th>
                  <th className="py-3 px-3 font-semibold">Bill Date</th>
                  <th className="py-3 px-3 font-semibold">Rate Basis</th>
                  <th className="py-3 px-3 font-semibold text-center">Items</th>
                  <th className="py-3 px-4 font-semibold text-right">Bill Total</th>
                  <th className="py-3 px-3 font-semibold text-center">Status</th>
                  <th className="py-3 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-text-muted">
                      Loading bills...
                    </td>
                  </tr>
                ) : bills.length > 0 ? (
                  bills.map((bill) => (
                    <tr
                      key={bill._id || bill.id}
                      className="group hover:bg-surface-hover/70 transition-colors"
                    >
                      {/* Bill Number */}
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {bill.purchaseBillNo || "-"}
                      </td>

                      {/* Supplier */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-text">{bill.supplierId?.businessName || "-"}</span>
                        </div>
                      </td>

                      {/* Order Date */}
                      <td className="py-3 px-3 text-text-muted font-medium">
                        {bill.invoiceDate || new Date(bill.createdAt).toLocaleDateString()}
                      </td>

                      {/* Rate Basis */}
                      <td className="py-3 px-3 text-text-muted font-medium">
                        {bill.rateBasis || "PTS"}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 text-center font-mono text-text">
                        {bill.items?.length || 0}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-text tabular-nums">
                        ₹{(bill.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {getStatusBadge(bill.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <UIButton
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedBill(bill)}
                          leftIcon={<Eye className="size-3.5" />}
                        >
                          View
                        </UIButton>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-text-muted">
                      No purchase bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination */}
          <div className="pt-3 border-t border-border/70">
            <AppPagination
              page={pagination.page}
              count={Math.ceil(pagination.total / pagination.limit) || 1}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageSize
            />
          </div>
        </UICard>
      </div>

      {/* Create Modal */}
      <CreatePurchaseOrderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreateSuccess}
      />

      {/* Details Modal */}
      <PurchaseBillPreviewModal
        bill={selectedBill}
        isOpen={Boolean(selectedBill)}
        onClose={() => setSelectedBill(null)}
      />
    </section>
  );
};

export default PurchasesDesktopPage;
