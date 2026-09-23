import React, { useState } from "react";
import {
  FileSpreadsheet,
  X,
  Printer,
  Edit2,
  PackagePlus,
  Loader2
} from "lucide-react";
import {
  UIModal,
  UIModalHeader,
  UIModalTitle,
  UIModalDescription,
  UIModalBody,
  UIButton,
  UIModalFooter
} from "@/components/ui";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import purchaseBillService from "../services/purchaseBillService";

export const PurchaseBillPreviewModal = ({ bill, isOpen, onClose, onRefresh }) => {
  const navigate = useNavigate();
  const [isIngesting, setIsIngesting] = useState(false);

  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleIngest = async () => {
    try {
      setIsIngesting(true);
      await purchaseBillService.ingestPurchaseBill(bill._id || bill.id);
      if (onRefresh) onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to ingest stock", error);
      alert(error?.response?.data?.message || "Failed to ingest stock. Please try again.");
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="3xl">
      <UIModalHeader>
        <div className="flex items-center justify-between w-full">
          <div>
            <UIModalTitle className="flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-emerald-600" />
              <span>Purchase Bill Preview</span>
            </UIModalTitle>
            <UIModalDescription>
              View inwards bill details, rates, and scheme discounts
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

      <UIModalBody className="space-y-4">
        {/* Summary Header */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 bg-surface-alt/70 p-3.5 rounded-2xl border border-border text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Supplier</span>
            <span className="font-extrabold text-emerald-700 block truncate">
              {bill.supplierId?.businessName || bill.supplierId?.name || "-"}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Bill Number</span>
            <span className="font-mono font-bold text-text block">{bill.purchaseBillNo || "-"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Invoice Date</span>
            <span className="font-mono font-bold text-text block">
              {bill.invoiceDate || new Date(bill.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted block">Rate Basis</span>
            <span className="font-bold text-primary block">{bill.rateBasis || "PTS"}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Amount Paid</span>
            <span className="font-mono font-bold text-emerald-600 block">₹{(bill.amountPaid || 0).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-700 block">Amount Due</span>
            <span className="font-mono font-bold text-rose-600 block">₹{(bill.amountDue || 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Main Content: Items Table (Left) + Summary & GST Slab (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left: Cart Items Table */}
          <div className="lg:col-span-8 overflow-x-auto rounded-xl border border-border bg-surface max-h-[380px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-alt/80 text-[10px] font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">
                  <th className="py-2 px-2.5">Product</th>
                  <th className="py-2 px-2 font-mono">Batch</th>
                  <th className="py-2 px-2 font-mono">Expiry</th>
                  <th className="py-2 px-2 font-mono text-center">Qty</th>
                  <th className="py-2 px-2 font-mono text-center">Free</th>
                  <th className="py-2 px-2 font-mono text-center">SCH%</th>
                  <th className="py-2 px-2 font-mono text-center">Disc%</th>
                  <th className="py-2 px-2 font-mono text-right">MRP</th>
                  <th className="py-2 px-2 font-mono">HSN</th>
                  <th className="py-2 px-2 font-mono text-center">GST%</th>
                  <th className="py-2 px-2 font-mono text-right">Rate</th>
                  <th className="py-2 px-2 font-mono text-center">CRate%</th>
                  <th className="py-2 px-2.5 font-mono text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(bill.items || []).map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-surface-hover/50">
                    <td className="py-2 px-2.5 font-bold text-text truncate max-w-[130px]">{item.name}</td>
                    <td className="py-2 px-2 font-mono text-[11px] text-text-muted">{item.batch || "-"}</td>
                    <td className="py-2 px-2 font-mono text-[11px] text-text-muted">{item.expiry || "-"}</td>
                    <td className="py-2 px-2 font-mono text-center font-bold text-text">{item.qty}</td>
                    <td className="py-2 px-2 font-mono text-center text-text-muted">{item.freeQty || 0}</td>
                    <td className="py-2 px-2 font-mono text-center text-text">{item.schPct || 0}%</td>
                    <td className="py-2 px-2 font-mono text-center text-text">{item.disc || 0}%</td>
                    <td className="py-2 px-2 font-mono text-right text-text">₹{Number(item.mrp || 0).toFixed(2)}</td>
                    <td className="py-2 px-2 font-mono text-[11px] text-text-muted">{item.hsn || "-"}</td>
                    <td className="py-2 px-2 font-mono text-center font-bold text-purple-600">{item.gst || 12}%</td>
                    <td className="py-2 px-2 font-mono text-right font-bold text-text">₹{Number(item.rate || 0).toFixed(2)}</td>
                    <td className="py-2 px-2 font-mono text-center text-text">{item.cRatePct || 0}%</td>
                    <td className="py-2 px-2.5 font-mono text-right font-extrabold text-emerald-600">
                      ₹{Number(item.amount || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right: Bill Summary + GST Slab */}
          <div className="lg:col-span-4 space-y-4">
            {/* Bill Financial Summary */}
            <div className="space-y-2 flex flex-col justify-between bg-surface-alt/60 p-3.5 rounded-2xl border border-border">
              <span className="text-[11px] font-bold text-text uppercase tracking-wider block border-b border-border/60 pb-1">
                Bill Financial Summary
              </span>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-text-muted">
                  <span>Gross Total:</span>
                  <span className="font-bold font-mono text-text">₹{(bill.grossTotal || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-text-muted ">
                  <span>Scheme Disc:</span>
                  <span className="font-bold font-mono">-₹{(bill.schemeDiscount || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-text-muted">
                  <span>Trade Disc:</span>
                  <span className="font-bold font-mono">-₹{(bill.tradeDiscount || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-text-muted">
                  <span className="flex items-center gap-1.5">
                    Extra Disc ({bill.extraDiscountPct || 0}%):
                  </span>
                  <span className="font-bold font-mono">-₹{(bill.extraDiscountAmt || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-text font-semibold pt-1 border-t border-border/60">
                  <span>Taxable After Extra Disc:</span>
                  <span className="font-extrabold font-mono">₹{(bill.taxableAfterExtraDisc || bill.taxableSubtotal || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-purple-600">
                  <span>Total GST Tax:</span>
                  <span className="font-bold font-mono">+₹{(bill.totalGst || 0).toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <span className="text-xs font-black text-text">Grand Total:</span>
                  <span className="text-lg font-black font-mono text-emerald-600">
                    ₹{(bill.grandTotal || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* GST Tax Slab Breakdown */}
            <div className="space-y-1.5 flex flex-col justify-between bg-surface-alt/40 p-3 rounded-2xl border border-border">
              <span className="text-[11px] font-bold text-text uppercase tracking-wider block">
                GST Tax Slab Breakdown
              </span>
              <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border bg-surface-alt/80 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      <th className="py-2 px-2.5">Slab</th>
                      <th className="py-2 px-2 font-mono text-right">Taxable</th>
                      <th className="py-2 px-2 font-mono text-right">CGST</th>
                      <th className="py-2 px-2 font-mono text-right">SGST</th>
                      <th className="py-2 px-2.5 font-mono text-right">Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 font-mono text-[11px]">
                    {(bill.gstSlabs || []).map((slab) => (
                      <tr key={slab.gstPct} className="hover:bg-surface-hover/50">
                        <td className="py-1.5 px-2.5 font-bold text-purple-600 font-sans">
                          {slab.gstPct}%
                        </td>
                        <td className="py-1.5 px-2 text-right font-medium text-text">
                          ₹{Number(slab.taxable || 0).toFixed(2)}
                        </td>
                        <td className="py-1.5 px-2 text-right text-text-muted">
                          ₹{Number(slab.cgstAmt || 0).toFixed(2)}
                        </td>
                        <td className="py-1.5 px-2 text-right text-text-muted">
                          ₹{Number(slab.sgstAmt || 0).toFixed(2)}
                        </td>
                        <td className="py-1.5 px-2.5 text-right font-bold text-emerald-600">
                          ₹{Number(slab.totalTax || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {(!bill.gstSlabs || bill.gstSlabs.length === 0) && (
                      <tr>
                        <td colSpan={5} className="py-2 text-center text-text-muted font-sans text-xs">
                          No tax slabs available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </UIModalBody>
      <UIModalFooter className="justify-end bg-surface-alt/40 border-t border-border gap-2">
        <UIButton variant="outline" size="sm" onClick={onClose} className="font-bold text-xs" disabled={isIngesting}>
          Close Preview
        </UIButton>
        
        {(bill.status === "CONFIRMED" || bill.status === "DRAFT") && (
          <UIButton
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              navigate(ROUTES.EDIT_PURCHASE_BILL(bill._id || bill.id));
            }}
            className="font-bold text-xs hover:text-primary"
            leftIcon={<Edit2 className="size-4" />}
            disabled={isIngesting}
          >
            Edit Bill
          </UIButton>
        )}

        {(bill.status === "CONFIRMED" || bill.status === "DRAFT") && (
          <UIButton
            variant="primary"
            size="sm"
            onClick={handleIngest}
            className="font-bold text-xs bg-emerald-600 hover:bg-emerald-700 border-emerald-600 hover:border-emerald-700 text-white"
            leftIcon={isIngesting ? <Loader2 className="size-4 animate-spin" /> : <PackagePlus className="size-4" />}
            disabled={isIngesting}
          >
            {isIngesting ? "Ingesting..." : "Ingest Stock"}
          </UIButton>
        )}

        <UIButton variant="outline" size="sm" onClick={handlePrint} className="font-bold text-xs" leftIcon={<Printer className="size-4" />} disabled={isIngesting}>
          Print Bill
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};
