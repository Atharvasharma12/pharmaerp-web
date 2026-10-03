import React, { useState, useEffect, useMemo } from "react";
import {
  Layers,
  X,
  CreditCard,
  Building,
  Banknote,
  CheckCircle2,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIButton,
  UIModalFooter,
  UIBadge
} from "@/components/ui";
import purchaseBillService from "../services/purchaseBillService";
import supplierService from "../../parties/suppliers/services/supplierService";
import { Search } from "lucide-react";

export const BulkPaymentModal = ({ isOpen, onClose, onRefresh }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [supplierOutstanding, setSupplierOutstanding] = useState(null);
  const [supplierBalances, setSupplierBalances] = useState({});
  const [unpaidBills, setUnpaidBills] = useState([]);
  const [isLoadingBills, setIsLoadingBills] = useState(false);
  
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [reference, setReference] = useState("");

  // Fetch suppliers whenever search changes
  useEffect(() => {
    if (isOpen) {
      const delay = setTimeout(() => {
        supplierService.getSuppliers({ limit: 10, search: supplierSearch }).then(res => {
          const suppliersData = res.data?.data?.suppliers || res.data?.data || [];
          setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
        }).catch(console.error);
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [isOpen, supplierSearch]);

  // Fetch balances for suppliers in the dropdown
  useEffect(() => {
    if (suppliers.length > 0) {
      suppliers.forEach(s => {
        const id = s._id || s.id;
        if (supplierBalances[id] === undefined) {
          supplierService.getSupplierOutstanding(id).then(res => {
            setSupplierBalances(prev => ({
              ...prev,
              [id]: res.data?.data || { outstandingAmount: 0, balanceType: "cr" }
            }));
          }).catch(() => {
            setSupplierBalances(prev => ({ ...prev, [id]: { outstandingAmount: 0, balanceType: "cr" } }));
          });
        }
      });
    }
  }, [suppliers]);

  useEffect(() => {
    if (selectedSupplierId) {
      setIsLoadingBills(true);
      // Fetch unpaid bills (max 10 for now)
      purchaseBillService.getPurchaseBills({ supplierId: selectedSupplierId, limit: 10 })
        .then(res => {
          const allBills = res.data?.data?.bills || res.data?.data || [];
          const pending = (Array.isArray(allBills) ? allBills : []).filter(b => b.amountDue > 0 && b.status !== "CANCELLED");
          pending.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setUnpaidBills(pending);
        })
        .catch(console.error)
        .finally(() => setIsLoadingBills(false));
        
      // Fetch outstanding balance
      supplierService.getSupplierOutstanding(selectedSupplierId).then(res => {
         setSupplierOutstanding(res.data?.data || { outstandingAmount: 0, balanceType: "cr" });
      }).catch(console.error);

    } else {
      setUnpaidBills([]);
      setSupplierOutstanding(null);
    }
  }, [selectedSupplierId]);

  // Calculate Auto Allocation
  const allocations = useMemo(() => {
    const list = [];
    let remaining = Number(paymentAmount) || 0;

    unpaidBills.forEach(b => {
      if (remaining > 0) {
        const allocate = Math.min(b.amountDue, remaining);
        list.push({ billId: b._id || b.id, purchaseBillNo: b.purchaseBillNo, amountDue: b.amountDue, amountAllocated: allocate });
        remaining -= allocate;
      }
    });

    return { list, unallocated: Math.max(0, remaining) };
  }, [unpaidBills, paymentAmount]);

  const totalDue = unpaidBills.reduce((sum, b) => sum + (b.amountDue || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplierId) return alert("Please select a supplier");
    if (Number(paymentAmount) <= 0) return alert("Payment amount must be greater than zero.");
    if (allocations.list.length === 0) return alert("No bills to allocate this payment to.");

    try {
      setIsSubmitting(true);
      await purchaseBillService.bulkPayPurchaseBills({
        supplierId: selectedSupplierId,
        totalAmount: Number(paymentAmount),
        paymentMode,
        referenceNumber: reference,
        narration: `Bulk Paid via ${paymentMode} - Ref: ${reference}`,
        allocations: allocations.list.map(a => ({ billId: a.billId, amountPaid: a.amountAllocated }))
      });
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to process bulk payment", error);
      alert(error?.response?.data?.message || "Failed to process bulk payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="2xl">
      <UIModalHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <UIModalTitle className="flex items-center gap-2">
              <Layers className="size-5 text-primary" />
              <span>Bulk Supplier Payment (FIFO)</span>
            </UIModalTitle>
            <UIModalDescription>
              Auto-allocate a single payment amount to the oldest unpaid bills first.
            </UIModalDescription>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
      </UIModalHeader>

      <UIModalBody className="space-y-5">
        <form id="bulk-payment-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Left Column: Form Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-text">Select Supplier</label>
              
              {!selectedSupplierId ? (
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                  <input 
                    type="text" 
                    placeholder="Search supplier by name or code..."
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
                  />
                  <div className="mt-1 max-h-[160px] overflow-y-auto border border-border rounded-xl bg-surface shadow-sm absolute w-full z-10">
                    {suppliers.map(s => (
                      <div 
                        key={s._id || s.id} 
                        onClick={() => {
                          setSelectedSupplierId(s._id || s.id);
                          setSupplierSearch("");
                        }}
                        className="px-3 py-2 text-xs hover:bg-surface-hover cursor-pointer border-b border-border/50 last:border-b-0"
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-bold text-text">{s.businessName || s.name || "Unknown"}</div>
                          {supplierBalances[s._id || s.id] !== undefined && (
                            <div className="text-[10px] font-mono font-bold text-text-muted">
                              ₹{(supplierBalances[s._id || s.id].outstandingAmount || 0).toFixed(2)} {supplierBalances[s._id || s.id].balanceType?.toUpperCase() || "CR"}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-text-muted">{s.supplierCode || ""}</div>
                      </div>
                    ))}
                    {suppliers.length === 0 && (
                      <div className="px-3 py-4 text-center text-xs text-text-muted">No suppliers found</div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2.5 border border-primary/30 bg-primary-soft/10 rounded-xl">
                  <div>
                    <div className="text-xs font-bold text-primary">
                      {suppliers.find(s => (s._id || s.id) === selectedSupplierId)?.businessName || "Selected Supplier"}
                    </div>
                  </div>
                  <UIButton size="xs" variant="ghost" onClick={() => setSelectedSupplierId("")} className="text-text-muted hover:text-text">
                    Change
                  </UIButton>
                </div>
              )}

              {selectedSupplierId && supplierOutstanding !== null && (
                <div className="text-[10px] text-text-muted mt-1">
                  Supplier Running Balance: <span className="font-bold font-mono text-text">₹{(supplierOutstanding.outstandingAmount || 0).toFixed(2)}</span> {supplierOutstanding.balanceType?.toLowerCase() === "dr" ? "(Dr/Receivable)" : "(Cr/Payable)"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text">Total Bulk Amount (₹)</label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount to allocate..."
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
                disabled={!selectedSupplierId || unpaidBills.length === 0}
              />
              {unpaidBills.length > 0 && (
                <div className="text-[10px] text-text-muted">
                  Total outstanding for this supplier: <span className="font-bold text-rose-600">₹{totalDue.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text">Payment Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "CASH", label: "Cash", icon: <Banknote className="size-3.5" /> },
                  { id: "UPI", label: "UPI", icon: <CreditCard className="size-3.5" /> },
                  { id: "BANK", label: "Bank Transfer", icon: <Building className="size-3.5" /> },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMode(mode.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all ${
                      paymentMode === mode.id
                        ? "bg-primary-soft/30 border-primary text-primary"
                        : "bg-surface border-border text-text-muted hover:border-text-muted"
                    }`}
                  >
                    {mode.icon}
                    <span className="text-[10px] font-bold">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-text">Reference / Transaction Number</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g., UTR / Cheque Number"
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column: Allocation Preview */}
          <div className="bg-surface-alt/50 border border-border rounded-xl p-4 flex flex-col h-full">
            <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
              Allocation Preview
              {isLoadingBills && <Loader2 className="size-3 animate-spin text-primary" />}
            </div>

            {selectedSupplierId ? (
              unpaidBills.length > 0 ? (
                <div className="flex-1 overflow-y-auto pr-2 space-y-2 max-h-[250px]">
                  {unpaidBills.map((bill, idx) => {
                    const alloc = allocations.list.find(a => a.billId === (bill._id || bill.id));
                    const isAllocated = Boolean(alloc);
                    const isFullyPaid = isAllocated && alloc.amountAllocated >= bill.amountDue;

                    return (
                      <div key={bill._id || bill.id} className={`flex justify-between items-center p-2.5 rounded-lg border text-xs ${isAllocated ? 'bg-primary-soft/20 border-primary/30' : 'bg-surface border-border/50'}`}>
                        <div>
                          <div className="font-mono font-bold text-text">{bill.purchaseBillNo}</div>
                          <div className="text-[10px] text-text-muted mt-0.5">Due: ₹{bill.amountDue.toFixed(2)}</div>
                        </div>
                        <div className="text-right">
                          {isAllocated ? (
                            <>
                              <div className="font-bold text-emerald-600 tabular-nums">-₹{alloc.amountAllocated.toFixed(2)}</div>
                              {isFullyPaid && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-bold uppercase">Fully Paid</span>}
                            </>
                          ) : (
                            <span className="text-text-muted text-[10px]">Unpaid</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-text-muted text-center h-[200px]">
                  No unpaid bills found for this supplier.
                </div>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-text-muted text-center h-[200px]">
                Select a supplier to see auto-allocation preview.
              </div>
            )}

            {allocations.unallocated > 0 && (
              <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex gap-2 items-start text-amber-800 text-xs">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p>
                  <strong>₹{allocations.unallocated.toFixed(2)} will remain unallocated.</strong> You are paying more than the total outstanding balance.
                </p>
              </div>
            )}
          </div>

        </form>
      </UIModalBody>

      <UIModalFooter className="justify-end bg-surface-alt/40 border-t border-border gap-2">
        <UIButton variant="outline" size="sm" onClick={onClose} className="font-bold text-xs" disabled={isSubmitting}>
          Cancel
        </UIButton>
        
        <UIButton
          type="submit"
          form="bulk-payment-form"
          variant="primary"
          size="sm"
          className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
          leftIcon={isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
          disabled={isSubmitting || !selectedSupplierId || Number(paymentAmount) <= 0 || unpaidBills.length === 0}
        >
          {isSubmitting ? "Processing Bulk Payment..." : "Confirm Bulk Payment"}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};
