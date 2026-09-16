// src/features/purchases/pages/desktop/PurchasesDesktopPage.jsx

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  UICard,
  UIButton,
  UIBadge,
  UIStatCard,
} from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";
import { cn } from "@/lib/utils";
import {
  PURCHASES_STATS,
  PURCHASE_ORDERS,
  PURCHASE_SUPPLIERS,
} from "../../constants/purchasesData";
import { CreatePurchaseOrderModal } from "../../components/CreatePurchaseOrderModal";
import { PurchaseOrderDetailsModal } from "../../components/PurchaseOrderDetailsModal";

const statIconMap = {
  Truck: <Truck className="size-5" />,
  Package: <Package className="size-5" />,
  CheckCircle2: <CheckCircle2 className="size-5" />,
  Clock: <Clock className="size-5" />,
};

export const PurchasesDesktopPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(PURCHASE_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const statusTabs = [
    "all",
    "Ordered",
    "Received",
    "Partially Received",
    "Draft",
    "Cancelled",
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((po) => {
      const matchesSearch =
        po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        po.supplier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || po.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  const handleCreateSuccess = (newPO) => {
    setOrders([newPO, ...orders]);
    setToastMessage(`✅ Purchase Order "${newPO.poNumber}" created.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleMarkReceived = (poId) => {
    setOrders((prev) =>
      prev.map((po) =>
        po.id === poId
          ? { ...po, status: "Received", paymentStatus: "Paid" }
          : po
      )
    );
    setToastMessage("✅ Stock intake confirmed. Inventory levels updated.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCancelPO = (poId) => {
    setOrders((prev) =>
      prev.map((po) =>
        po.id === poId ? { ...po, status: "Cancelled" } : po
      )
    );
    setToastMessage("⚠️ Purchase order cancelled.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Received":
        return <UIBadge variant="soft" intent="success">Received</UIBadge>;
      case "Ordered":
        return <UIBadge variant="soft" intent="info">Ordered</UIBadge>;
      case "Partially Received":
        return <UIBadge variant="soft" intent="warning">Partial</UIBadge>;
      case "Draft":
        return <UIBadge variant="soft" intent="neutral">Draft</UIBadge>;
      case "Cancelled":
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

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PURCHASES_STATS.map((stat) => (
            <UIStatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              trend={stat.trend}
              color={stat.color}
              icon={statIconMap[stat.iconName]}
            />
          ))}
        </div>

        {/* Purchase Orders Table Card */}
        <UICard variant="default" className="p-5 sm:p-6 rounded-2xl bg-surface border-border shadow-xs space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/70">
            {/* Search Input */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PO # or supplier..."
                className="w-full rounded-xl border border-border bg-surface-alt/70 pl-9 pr-3 py-2 text-xs text-text placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none"
              />
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
                  <th className="py-3 px-4 font-semibold">PO Number</th>
                  <th className="py-3 px-4 font-semibold">Supplier Vendor</th>
                  <th className="py-3 px-3 font-semibold">Order Date</th>
                  <th className="py-3 px-3 font-semibold">Expected Delivery</th>
                  <th className="py-3 px-3 font-semibold text-center">Items</th>
                  <th className="py-3 px-4 font-semibold text-right">PO Total</th>
                  <th className="py-3 px-3 font-semibold text-center">Status</th>
                  <th className="py-3 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((po) => (
                    <tr
                      key={po.id}
                      className="group hover:bg-surface-hover/70 transition-colors"
                    >
                      {/* PO Number */}
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {po.poNumber}
                      </td>

                      {/* Supplier */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-text">{po.supplier}</span>
                          <span className="text-[11px] text-text-muted font-mono">{po.supplierPhone}</span>
                        </div>
                      </td>

                      {/* Order Date */}
                      <td className="py-3 px-3 text-text-muted font-medium">
                        {po.orderDate}
                      </td>

                      {/* Expected Date */}
                      <td className="py-3 px-3 text-text-muted font-medium">
                        {po.expectedDate}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3 text-center font-mono text-text">
                        {po.itemCount}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-text tabular-nums">
                        ₹{po.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {getStatusBadge(po.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <UIButton
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedPO(po)}
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
                      No purchase orders found matching &ldquo;{searchQuery}&rdquo;.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/70 text-xs text-text-muted">
            <span className="font-mono tabular-nums">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
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
      <PurchaseOrderDetailsModal
        po={selectedPO}
        isOpen={Boolean(selectedPO)}
        onClose={() => setSelectedPO(null)}
        onMarkReceived={handleMarkReceived}
        onCancelPO={handleCancelPO}
      />
    </section>
  );
};

export default PurchasesDesktopPage;
