// src/features/purchases/components/PurchaseOrderDetailsModal.jsx

import React from "react";
import {
  X,
  Printer,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  Calendar,
  FileText,
  Trash2,
} from "lucide-react";
import { UIModal, UIButton, UIBadge } from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";

export const PurchaseOrderDetailsModal = ({
  po,
  isOpen,
  onClose,
  onMarkReceived,
  onCancelPO,
}) => {
  if (!isOpen || !po) return null;

  const handlePrint = () => {
    window.print();
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
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6 font-sans space-y-5 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center font-bold">
              <Truck className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text">{po.poNumber}</h2>
              <p className="text-xs text-text-muted">Issued on {po.orderDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(po.status)}
          </div>
        </div>

        {/* Supplier & Delivery Info Card */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-surface-alt/50 border border-border/70">
          <div>
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Supplier Vendor
            </span>
            <p className="font-bold text-text text-sm mt-0.5">{po.supplier}</p>
            <p className="text-text-muted font-mono">{po.supplierPhone}</p>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Expected Delivery
            </span>
            <p className="font-bold text-text mt-0.5">{po.expectedDate}</p>
            <p className="text-text-muted">Payment: {po.paymentStatus}</p>
          </div>
        </div>

        {/* PO Line Items Table */}
        <div className="space-y-2">
          <h3 className="font-bold text-text text-xs uppercase tracking-wider text-text-muted">
            Ordered Line Items ({po.itemCount})
          </h3>
          <div className="overflow-x-auto rounded-xl border border-border/80 bg-surface">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-semibold text-text-muted bg-surface-alt/40">
                  <th className="py-2.5 px-3">Medicine Description</th>
                  <th className="py-2.5 px-3 text-right">Ordered Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {po.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-semibold text-text">{item.name}</td>
                    <td className="py-2.5 px-3 font-mono text-right text-text tabular-nums">
                      {item.qty}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-text-muted tabular-nums">
                      ₹{item.unitCost?.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-right text-text tabular-nums">
                      ₹{item.total?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Cost Box */}
        <div className="p-4 rounded-xl border border-border bg-surface-alt/60 flex items-center justify-between font-mono">
          <span className="text-text-muted">Total Purchase Amount:</span>
          <span className="text-base font-extrabold text-primary">
            ₹{po.totalAmount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <UIButton
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="size-3.5" />}
            >
              Print PO
            </UIButton>

            {po.status !== "Cancelled" && po.status !== "Received" && (
              <PermissionGate permission="purchase:delete">
                <UIButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onCancelPO(po.id);
                    onClose();
                  }}
                  className="text-error hover:bg-error-soft hover:border-error/30"
                  leftIcon={<Trash2 className="size-3.5" />}
                >
                  Cancel PO
                </UIButton>
              </PermissionGate>
            )}
          </div>

          <div className="flex items-center gap-2">
            <UIButton variant="outline" size="sm" onClick={onClose}>
              Close
            </UIButton>

            {po.status !== "Received" && po.status !== "Cancelled" && (
              <PermissionGate permission="purchase:update">
                <UIButton
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    onMarkReceived(po.id);
                    onClose();
                  }}
                  leftIcon={<CheckCircle2 className="size-3.5" />}
                >
                  Confirm Goods Received
                </UIButton>
              </PermissionGate>
            )}
          </div>
        </div>
      </div>
    </UIModal>
  );
};

export default PurchaseOrderDetailsModal;
