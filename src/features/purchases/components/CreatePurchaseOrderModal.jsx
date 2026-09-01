// src/features/purchases/components/CreatePurchaseOrderModal.jsx

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Truck,
  Building2,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { UIModal, UIButton } from "@/components/ui";
import { PermissionGate } from "@/components/common/PermissionGate";
import { PURCHASE_SUPPLIERS } from "../constants/purchasesData";

export const CreatePurchaseOrderModal = ({ isOpen, onClose, onCreated }) => {
  const [supplierId, setSupplierId] = useState(PURCHASE_SUPPLIERS[0].id);
  const [expectedDate, setExpectedDate] = useState("");
  const [items, setItems] = useState([
    { name: "Paracetamol 500mg (Box of 1000)", qty: 10, unitCost: 12.0 },
  ]);

  const selectedSupplier = PURCHASE_SUPPLIERS.find((s) => s.id === supplierId);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { name: "", qty: 1, unitCost: 0 }]);
  };

  const handleUpdateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (acc, it) => acc + (Number(it.qty) || 0) * (Number(it.unitCost) || 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPO = {
      id: `po-${Date.now()}`,
      poNumber: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier: selectedSupplier?.name || "Supplier",
      supplierPhone: selectedSupplier?.phone || "9800000000",
      orderDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      expectedDate: expectedDate || "Within 7 days",
      itemCount: items.length,
      totalAmount,
      status: "Ordered",
      paymentStatus: "Pending",
      items: items.map((it) => ({
        ...it,
        total: (Number(it.qty) || 0) * (Number(it.unitCost) || 0),
      })),
    };

    onCreated(newPO);
    onClose();
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="p-6 font-sans space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <Truck className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Create Purchase Order (PO)</h2>
              <p className="text-xs text-text-muted">Procure medicine inventory from registered suppliers</p>
            </div>
          </div>
        </div>

        {/* Supplier & Delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Select Supplier Vendor</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs font-semibold text-text focus:border-primary focus:outline-none"
            >
              {PURCHASE_SUPPLIERS.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name} ({sup.gst})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text">Expected Delivery Date</label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Line Items Repeater */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Procurement Line Items
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Medicine Item</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-surface-alt/50 border border-border/70 text-xs"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    required
                    placeholder="Medicine Name / Strength / Packing"
                    value={it.name}
                    onChange={(e) => handleUpdateItem(idx, "name", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface p-1.5 text-xs text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Quantity"
                    value={it.qty}
                    onChange={(e) => handleUpdateItem(idx, "qty", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface p-1.5 text-xs text-text font-mono text-center focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="Unit Cost (₹)"
                    value={it.unitCost}
                    onChange={(e) => handleUpdateItem(idx, "unitCost", e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface p-1.5 text-xs text-text font-mono text-right focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="col-span-1 text-center">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-text-muted hover:text-error p-1"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="p-4 rounded-xl border border-border bg-surface-alt/50 flex items-center justify-between font-mono">
          <span className="text-xs text-text-muted">Total Purchase Order Estimate:</span>
          <span className="text-base font-extrabold text-primary">
            ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <UIButton type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </UIButton>

          <PermissionGate
            permission="purchase:create"
            fallback={
              <UIButton type="button" variant="primary" size="sm" disabled>
                Issue PO (Requires purchase:create)
              </UIButton>
            }
          >
            <UIButton type="submit" variant="primary" size="sm">
              Confirm & Issue Purchase Order
            </UIButton>
          </PermissionGate>
        </div>
      </form>
    </UIModal>
  );
};

export default CreatePurchaseOrderModal;
