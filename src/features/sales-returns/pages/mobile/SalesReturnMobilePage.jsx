import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  RotateCcw,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Printer,
  Wallet,
  Receipt,
  Banknote,
} from "lucide-react";
import { UIButton, UIBadge } from "@/components/ui";
import useBranch from "@/features/branch/hooks/useBranch";
import useWorkspace from "@/features/workspace/hooks/useWorkspace";
import salesReturnService from "../../services/salesReturnService";
import SalesReturnDetailsDrawer from "../../components/SalesReturnDetailsDrawer";
import CreateSalesReturnModal from "../../components/CreateSalesReturnModal";
import { OrderInvoiceModal } from "@/features/sales/components";

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

export const SalesReturnMobilePage = () => {
  const { currentBranch } = useBranch();
  const { currentCompany } = useWorkspace();

  const [returns, setReturns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [printReturn, setPrintReturn] = useState(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const fetchReturns = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await salesReturnService.getAllSalesReturns({
        branchId: currentBranch?._id || currentBranch?.id || undefined,
        search: searchQuery.trim() || undefined,
        limit: 30,
      });
      const data = res?.data?.data || res?.data;
      setReturns(data?.returns || []);
    } catch (err) {
      console.error("Mobile returns error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch, searchQuery]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  return (
    <div className="flex flex-col min-h-screen bg-surface-alt/40 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 py-3 bg-surface border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-text-primary">Sales Returns</h1>
            <p className="text-[11px] text-text-muted">Return memos & credit notes</p>
          </div>
        </div>

        <UIButton
          variant="destructive"
          size="sm"
          icon={Plus}
          onClick={() => setIsCreateOpen(true)}
        >
          New Return
        </UIButton>
      </div>

      {/* Search */}
      <div className="p-3 bg-surface border-b border-border">
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search return or bill no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-surface-alt/50 focus:outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="p-3 space-y-2.5">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-text-muted">Loading returns...</div>
        ) : returns.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-muted">No sales returns found.</div>
        ) : (
          returns.map((item) => {
            const returnNo = item.returnNo || item.invoiceNo || "RET-MEMO";
            const origBill = item.originalInvoiceNo || item.originalInvoiceId?.invoiceNo || "—";
            const cName =
              item.customerId?.name || item.customerName || item.customer?.name || "Walk-in";
            const gTotal = Math.abs(Number(item.grandTotal || item.returnAmount || 0));
            const rType = String(item.returnType || "").toLowerCase();
            const isAdv = rType.includes("advance");
            const isCred = rType.includes("credit");

            return (
              <div
                key={item._id}
                onClick={() => {
                  setSelectedReturn(item);
                  setIsDrawerOpen(true);
                }}
                className="p-3 rounded-xl border border-border bg-surface shadow-xs active:bg-surface-alt/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">
                      {returnNo}
                    </span>
                    <span className="text-[10px] text-text-muted">· {formatDate(item.date)}</span>
                  </div>
                  <div className="font-mono font-extrabold text-sm text-rose-600 dark:text-rose-400">
                    {formatCurrency(gTotal)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="text-text-primary font-medium truncate max-w-[200px]">{cName}</div>
                  <div>
                    {isAdv ? (
                      <span className="text-[10px] text-blue-600 font-semibold">Advance</span>
                    ) : isCred ? (
                      <span className="text-[10px] text-purple-600 font-semibold">Credit Note</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold">Cash</span>
                    )}
                  </div>
                </div>

                <div className="mt-1 text-[11px] text-text-muted font-mono">
                  Against Bill: <span className="text-primary font-semibold">{origBill}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Drawer */}
      <SalesReturnDetailsDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        returnItem={selectedReturn}
      />

      {/* Create Modal */}
      <CreateSalesReturnModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchReturns()}
      />

      {/* Print Modal */}
      {printReturn && (
        <OrderInvoiceModal
          open={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          saleData={{
            ...printReturn,
            isReturn: true,
            invoiceNo: printReturn.returnNo || printReturn.invoiceNo,
            customer: printReturn.customerId || {
              name: printReturn.customerName,
              mobile: printReturn.customerPhone,
            },
          }}
          branch={currentBranch}
          company={currentCompany}
        />
      )}
    </div>
  );
};

export default SalesReturnMobilePage;
