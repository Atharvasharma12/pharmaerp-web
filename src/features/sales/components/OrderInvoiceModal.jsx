// src/features/sales/components/OrderInvoiceModal.jsx

import React, { useEffect, useCallback } from "react";
import {
  Printer,
  X,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";
import { UIButton } from "@/components/ui";
import { OrderInvoiceDocument } from "./OrderInvoiceDocument";
import useBranch from "@/features/branch/hooks/useBranch";
import useCompany from "@/features/company/hooks/useCompany";

export const OrderInvoiceModal = ({
  isOpen,
  onClose,
  saleData,
  branch: branchProp,
  company: companyProp,
  onNewSale,
}) => {
  const { currentBranch } = useBranch();
  const { currentCompany } = useCompany();

  const activeBranch = branchProp || currentBranch;
  const activeCompany = companyProp || currentCompany;

  // Keyboard shortcut listener: Enter / Ctrl+P to trigger print, Esc to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        window.print();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleClose = useCallback(() => {
    if (onNewSale) {
      onNewSale();
    } else {
      onClose?.();
    }
  }, [onNewSale, onClose]);

  if (!isOpen || !saleData) return null;

  const invoiceNo = saleData.invoiceNo || "INV-PREVIEW";
  const isCredit = saleData.paymentMethod === "Credit" || saleData.creditStatus === "PENDING" || saleData.status === "Pending";

  return (
    <div
      id="order-invoice-modal-portal"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 select-none"
    >
      {/* ── BACKDROP ── */}
      <div
        id="order-invoice-backdrop"
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* ══════════════════════════════════════════════════════════════════════
          COMPACT VERTICAL MODAL WINDOW WITH WORKING SCROLLBAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        id="order-invoice-window"
        className="relative z-10 w-full max-w-[800px] h-[92vh] max-h-[880px] min-h-0 flex flex-col rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* ── TOP HEADER TOOLBAR ── */}
        <header className="print-toolbar shrink-0 h-13 bg-surface-alt/90 border-b border-border px-4 sm:px-5 flex items-center justify-between z-20">
          {/* Left: Metadata info */}
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-text tracking-tight">
                Bill Invoice Preview
              </h2>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface border border-border text-text font-semibold">
                {invoiceNo}
              </span>
              {isCredit ? (
                <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25">
                  Credit
                </span>
              ) : (
                <span className="text-[9.5px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
                  Paid
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <UIButton
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="h-8 text-xs px-2.5"
              startIcon={<PlusCircle className="size-3.5" />}
            >
              Close
            </UIButton>

            <UIButton
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs bg-teal-600 hover:bg-teal-500 text-white font-bold px-3.5 shadow-sm"
              startIcon={<Printer className="size-3.5" />}
            >
              Print Bill
            </UIButton>

            <button
              type="button"
              onClick={handleClose}
              className="size-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-hover transition-colors ml-0.5 cursor-pointer"
              title="Close Preview (Esc)"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        {/* ── SCROLLABLE A4 PAPER PREVIEW AREA (BULLETPROOF SCROLLBAR) ── */}
        <div
          id="order-invoice-scroll-area"
          className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 pb-20 flex justify-center bg-slate-200/90 dark:bg-slate-950"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            id="order-invoice-paper-wrapper"
            className="w-full max-w-[210mm] bg-white rounded-xs shadow-xl border border-slate-300 shrink-0 mb-6 print:mb-0 print:border-none print:shadow-none print:rounded-none print:max-w-none print:w-full"
          >
            <OrderInvoiceDocument
              saleData={saleData}
              branch={activeBranch}
              company={activeCompany}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CUSTOM SCROLLBAR & FULL-PAGE A4 PRINT CSS
      ══════════════════════════════════════════════════════════════════════ */}
      <style>{`
        /* Visible, smooth custom scrollbar for the preview window */
        #order-invoice-scroll-area {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.6) rgba(0, 0, 0, 0.06);
        }

        #order-invoice-scroll-area::-webkit-scrollbar {
          width: 9px;
        }

        #order-invoice-scroll-area::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.06);
          border-radius: 6px;
        }

        #order-invoice-scroll-area::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.55);
          border-radius: 6px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        #order-invoice-scroll-area::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.85);
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm 8mm 10mm;
          }

          html, body {
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
          }

          /* Hide UI elements */
          body * {
            visibility: hidden !important;
          }

          /* Make invoice visible and span the entire page width */
          #pharma-printable-invoice,
          #pharma-printable-invoice * {
            visibility: visible !important;
          }

          #order-invoice-modal-portal,
          #order-invoice-window,
          #order-invoice-scroll-area,
          #order-invoice-paper-wrapper {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: none !important;
            min-width: 0 !important;
            height: auto !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          #order-invoice-backdrop,
          .print-toolbar {
            display: none !important;
            visibility: hidden !important;
          }

          #pharma-printable-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #0f172a !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderInvoiceModal;
