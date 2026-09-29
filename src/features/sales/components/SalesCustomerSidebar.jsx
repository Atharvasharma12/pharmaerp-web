import React, { useEffect, useState } from "react";
import { History, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import invoiceService from "@/features/sales/services/invoiceService";

const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

export const SalesCustomerSidebar = ({ customer, onAddProduct }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customer?.id && !customer?._id) {
      setInvoices([]);
      return;
    }

    const customerId = customer.id || customer._id;
    let isMounted = true;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        console.log("Fetching history for customerId:", customerId);
        const res = await invoiceService.getCustomerSales(customerId, { limit: 5 });
        console.log("Full history response:", res);
        if (isMounted) {
          console.log("Customer history response:", res.data);
          const apiResponseData = res.data?.data;
          const invoicesList = apiResponseData?.data || apiResponseData?.sales || apiResponseData?.invoices || [];
          setInvoices(invoicesList);
        }
      } catch (err) {
        console.error("Failed to fetch customer history", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [customer]);

  if (!customer?.id && !customer?._id) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center text-text-muted">
        <div className="flex flex-col items-center gap-2">
          <History className="size-8 opacity-20" />
          <p className="text-sm">Select a customer to view history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border bg-surface-alt/30">
        <h3 className="font-bold text-text mb-1 line-clamp-1">{customer.name || customer.companyName}</h3>
        {customer.mobile && <p className="text-xs text-text-muted">{customer.mobile}</p>}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 bg-surface-alt/10">
        <div className="px-2 py-3 flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider">
          <History className="size-4" />
          Past Purchases
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-4 text-center text-xs text-text-muted">
            No past purchases found.
          </div>
        ) : (
          <div className="space-y-3 p-1">
            {invoices.map((inv) => (
              <div key={inv._id} className="bg-surface border border-border shadow-2xs rounded-xl overflow-hidden">
                <div className="bg-surface-alt/50 px-3 py-2 flex items-center justify-between border-b border-border">
                  <span className="text-[10px] font-bold text-text-muted">{new Date(inv.date).toLocaleDateString()}</span>
                  <span className="text-[10px] font-bold text-text">{formatCurrency(inv.grandTotal)}</span>
                </div>
                <div className="divide-y divide-border/50">
                  {(inv.items || []).map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-start justify-between gap-2 hover:bg-surface-hover group transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text truncate">{item.name || item.productName || item.productId?.name || "Product"}</p>
                        <p className="text-[10px] text-text-muted truncate mt-0.5">
                          {item.qty} × {formatCurrency(item.rate || item.price || item.rateC || item.mrp || 0)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onAddProduct && onAddProduct(item.productId)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shrink-0"
                        title="Reorder item"
                      >
                        <ArrowRight className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesCustomerSidebar;
