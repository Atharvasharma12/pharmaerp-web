// src/features/dashboard/components/QuickAddMedicineModal.jsx

import React, { useState } from "react";
import { Plus, Package, Calendar, DollarSign, Layers } from "lucide-react";
import { UIModal, UIButton, UIInput, UISelect } from "@/components/ui";

export const QuickAddMedicineModal = ({ isOpen, onClose, onAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    category: "Tablet",
    stock: "",
    reorderLevel: "",
    expiryDate: "",
    price: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onAdded) onAdded(formData);
      onClose();
    }, 600);
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="p-6 font-sans space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <Package className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Quick Add Medicine</h2>
              <p className="text-xs text-text-muted">
                Add an active medicine batch directly to inventory stock.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Medicine Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Paracetamol 500mg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Batch Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. B-99824"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text font-mono focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text focus:border-primary focus:outline-none"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Ointment">Ointment</option>
                <option value="Drops">Drops</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Initial Stock *</label>
              <input
                type="number"
                required
                placeholder="1000"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text font-mono tabular-nums focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Reorder Threshold</label>
              <input
                type="number"
                placeholder="250"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text font-mono tabular-nums focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Expiry Date *</label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text">Unit Price (₹)</label>
              <input
                type="text"
                placeholder="12.50"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full rounded-xl border border-border bg-surface-alt/60 p-2.5 text-xs text-text font-mono tabular-nums focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <UIButton type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </UIButton>
          <UIButton
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Plus className="size-4" />}
          >
            Add to Inventory
          </UIButton>
        </div>
      </form>
    </UIModal>
  );
};

export default QuickAddMedicineModal;
