import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  RotateCcw,
  Search,
  RefreshCw,
  Plus,
  Eye,
  Printer,
  Calendar,
  Banknote,
  Wallet,
  Receipt,
  Boxes,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import {
  UIButton,
  UIInput,
  UISelect,
  UIBadge,
  UITable,
  UITableHeader,
  UITableBody,
  UITableRow,
  UITableHead,
  UITableCell,
  UITableEmpty,
  UITableLoading,
} from "@/components/ui";
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
    year: "numeric",
  });
};

const formatTime = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DATE_RANGE_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last 7 Days", value: "last7days" },
  { label: "This Month", value: "thisMonth" },
  { label: "All Time", value: "all" },
];

const REFUND_TYPE_OPTIONS = [
  { label: "All Refund Types", value: "all" },
  { label: "Cash Refund", value: "cash_refund" },
  { label: "Advance Balance", value: "advance_credit" },
  { label: "Credit Note", value: "credit_note" },
];

export const SalesReturnDesktopPage = () => {
  const { currentBranch } = useBranch();
  const { currentCompany } = useWorkspace();

  const [returns, setReturns] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [refundType, setRefundType] = useState("all");
  const [billingMode, setBillingMode] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 25;

  // Selected for Details Drawer
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Print Modal
  const [printReturn, setPrintReturn] = useState(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Create Return Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch Returns
  const fetchReturns = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit,
        branchId: currentBranch?._id || currentBranch?.id || undefined,
        search: searchQuery.trim() || undefined,
        returnType: refundType !== "all" ? refundType : undefined,
        billingMode: billingMode !== "all" ? billingMode : undefined,
      };

      // Date range calculation
      const now = new Date();
      if (dateRange === "today") {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        params.dateFrom = start.toISOString();
      } else if (dateRange === "yesterday") {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
        params.dateFrom = start.toISOString();
        params.dateTo = end.toISOString();
      } else if (dateRange === "last7days") {
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        params.dateFrom = start.toISOString();
      } else if (dateRange === "thisMonth") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        params.dateFrom = start.toISOString();
      }

      const res = await salesReturnService.getAllSalesReturns(params);
      const data = res?.data?.data || res?.data;

      setReturns(data?.returns || []);
      setTotalCount(data?.meta?.total || 0);
    } catch (err) {
      console.error("Failed to fetch sales returns:", err);
      setError("Unable to load sales returns. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch, searchQuery, dateRange, refundType, billingMode, page]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalRefundAmt = 0;
    let cashRefundAmt = 0;
    let advanceRefundAmt = 0;
    let creditNoteAmt = 0;

    returns.forEach((r) => {
      const amt = Math.abs(Number(r.grandTotal || r.returnAmount || 0));
      totalRefundAmt += amt;
      const rType = String(r.returnType || "").toLowerCase();
      if (rType.includes("advance")) {
        advanceRefundAmt += amt;
      } else if (rType.includes("credit")) {
        creditNoteAmt += amt;
      } else {
        cashRefundAmt += amt;
      }
    });

    return {
      count: totalCount || returns.length,
      totalRefundAmt,
      cashRefundAmt,
      advanceRefundAmt,
      creditNoteAmt,
    };
  }, [returns, totalCount]);

  const handleOpenDrawer = (item) => {
    setSelectedReturn(item);
    setIsDrawerOpen(true);
  };

  const handleOpenPrint = (item, e) => {
    if (e) e.stopPropagation();
    setPrintReturn(item);
    setIsPrintOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-alt/30 overflow-hidden">
      {/* Top Banner / Actions */}
      <div className="shrink-0 px-6 py-4 bg-surface border-b border-border flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-text-primary tracking-tight">Sales Returns</h1>
            <UIBadge variant="destructive" size="sm">
              Credit Notes
            </UIBadge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Process customer medicine returns, restock inventory, and issue cash refunds or advance credit.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <UIButton
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchReturns}
            loading={isLoading}
          >
            Refresh
          </UIButton>
          <UIButton
            variant="destructive"
            size="sm"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Sales Return
          </UIButton>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="shrink-0 px-6 py-3 border-b border-border bg-surface grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-border bg-surface-alt/30">
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Returns</span>
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-mono font-extrabold text-text-primary">
            {metrics.count}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border bg-surface-alt/30">
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Refund Value</span>
            <Receipt className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-mono font-extrabold text-rose-600 dark:text-rose-400">
            {formatCurrency(metrics.totalRefundAmt)}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border bg-surface-alt/30">
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Cash Disbursed</span>
            <Banknote className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(metrics.cashRefundAmt)}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-border bg-surface-alt/30">
          <div className="flex items-center justify-between text-text-muted mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Advance Credited</span>
            <Wallet className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(metrics.advanceRefundAmt)}
          </div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="shrink-0 px-6 py-2.5 bg-surface border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Return No, Bill No, Customer name/phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-surface-alt/40 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <UISelect
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            options={DATE_RANGE_OPTIONS}
            className="w-36 text-xs h-8"
          />

          <UISelect
            value={refundType}
            onChange={(e) => setRefundType(e.target.value)}
            options={REFUND_TYPE_OPTIONS}
            className="w-40 text-xs h-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <UISelect
            value={billingMode}
            onChange={(e) => setBillingMode(e.target.value)}
            options={[
              { label: "All Modes", value: "all" },
              { label: "B2C Retail", value: "B2C" },
              { label: "B2B Commercial", value: "B2B" },
            ]}
            className="w-32 text-xs h-8"
          />
        </div>
      </div>

      {/* Returns Data Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="border border-border rounded-xl bg-surface overflow-hidden shadow-sm">
          <UITable>
            <UITableHeader>
              <UITableRow className="bg-surface-alt/40 border-b border-border">
                <UITableHead className="py-2.5 px-3 text-[10.5px] uppercase font-bold text-text-muted">
                  Return Date
                </UITableHead>
                <UITableHead className="py-2.5 px-3 text-[10.5px] uppercase font-bold text-text-muted">
                  Return Memo No
                </UITableHead>
                <UITableHead className="py-2.5 px-3 text-[10.5px] uppercase font-bold text-text-muted">
                  Original Invoice
                </UITableHead>
                <UITableHead className="py-2.5 px-3 text-[10.5px] uppercase font-bold text-text-muted">
                  Customer
                </UITableHead>
                <UITableHead className="py-2.5 px-3 text-[10.5px] uppercase font-bold text-text-muted">
                  Refund Mode
                </UITableHead>
                <UITableHead className="py-2.5 px-3 text-right text-[10.5px] uppercase font-bold text-text-muted">
                  Taxable
                </UITableHead>
                <UITableHead className="py-2.5 px-3 text-right text-[10.5px] uppercase font-bold text-text-muted">
                  GST Adj.
                </UITableHead>
                <UITableHead className="py-2.5 px-3 text-right text-[10.5px] uppercase font-bold text-text-muted">
                  Total Refund
                </UITableHead>
                <UITableHead className="py-2.5 px-3 text-center text-[10.5px] uppercase font-bold text-text-muted">
                  Actions
                </UITableHead>
              </UITableRow>
            </UITableHeader>

            <UITableBody>
              {isLoading ? (
                <UITableLoading colSpan={9} text="Loading sales return memos..." />
              ) : returns.length === 0 ? (
                <UITableEmpty
                  colSpan={9}
                  title="No sales return records found"
                  description="When items are returned, credit memos and refund transactions appear here."
                />
              ) : (
                returns.map((item) => {
                  const returnNo = item.returnNo || item.invoiceNo || "RET-MEMO";
                  const origBill = item.originalInvoiceNo || item.originalInvoiceId?.invoiceNo || "—";
                  const cName =
                    item.customerId?.name ||
                    item.customerName ||
                    item.customer?.name ||
                    "Walk-in Customer";
                  const cPhone = item.customerId?.mobile || item.customerPhone || "";
                  const rType = String(item.returnType || "").toLowerCase();
                  const isAdv = rType.includes("advance");
                  const isCred = rType.includes("credit");
                  const gTotal = Math.abs(Number(item.grandTotal || item.returnAmount || 0));
                  const tax = Math.abs(Number(item.tax || 0));
                  const sub = Math.abs(Number(item.subtotal || gTotal - tax));

                  return (
                    <UITableRow
                      key={item._id}
                      onClick={() => handleOpenDrawer(item)}
                      className="cursor-pointer hover:bg-surface-alt/40 transition-colors border-b border-border"
                    >
                      {/* Date */}
                      <UITableCell className="py-2.5 px-3 text-xs">
                        <div className="font-semibold text-text-primary">{formatDate(item.date)}</div>
                        <div className="text-[10px] text-text-muted font-mono">{formatTime(item.date)}</div>
                      </UITableCell>

                      {/* Memo No */}
                      <UITableCell className="py-2.5 px-3">
                        <div className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">
                          {returnNo}
                        </div>
                        <div className="text-[10px] text-text-muted">{item.billingMode || "B2C"}</div>
                      </UITableCell>

                      {/* Original Invoice */}
                      <UITableCell className="py-2.5 px-3 font-mono text-xs font-semibold text-primary">
                        {origBill}
                      </UITableCell>

                      {/* Customer */}
                      <UITableCell className="py-2.5 px-3 text-xs">
                        <div className="font-semibold text-text-primary truncate max-w-[140px]">{cName}</div>
                        {cPhone && (
                          <div className="text-[10px] text-text-muted font-mono">{cPhone}</div>
                        )}
                      </UITableCell>

                      {/* Refund Mode */}
                      <UITableCell className="py-2.5 px-3">
                        {isAdv ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                            <Wallet className="w-3 h-3" /> Advance
                          </span>
                        ) : isCred ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                            <Receipt className="w-3 h-3" /> Credit Note
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                            <Banknote className="w-3 h-3" /> Cash
                          </span>
                        )}
                      </UITableCell>

                      {/* Taxable */}
                      <UITableCell className="py-2.5 px-3 text-right font-mono text-xs text-text-muted">
                        {formatCurrency(sub)}
                      </UITableCell>

                      {/* GST */}
                      <UITableCell className="py-2.5 px-3 text-right font-mono text-xs text-text-muted">
                        {formatCurrency(tax)}
                      </UITableCell>

                      {/* Grand Total */}
                      <UITableCell className="py-2.5 px-3 text-right font-mono font-extrabold text-sm text-rose-600 dark:text-rose-400">
                        {formatCurrency(gTotal)}
                      </UITableCell>

                      {/* Actions */}
                      <UITableCell className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <UIButton
                            variant="ghost"
                            size="icon-sm"
                            title="Inspect Details"
                            onClick={() => handleOpenDrawer(item)}
                          >
                            <Eye className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
                          </UIButton>
                          <UIButton
                            variant="ghost"
                            size="icon-sm"
                            title="Print Return Memo"
                            onClick={(e) => handleOpenPrint(item, e)}
                          >
                            <Printer className="w-3.5 h-3.5 text-text-muted hover:text-text-primary" />
                          </UIButton>
                        </div>
                      </UITableCell>
                    </UITableRow>
                  );
                })
              )}
            </UITableBody>
          </UITable>
        </div>
      </div>

      {/* Details Slide-Over Drawer */}
      <SalesReturnDetailsDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        returnItem={selectedReturn}
      />

      {/* Create Sales Return Modal */}
      <CreateSalesReturnModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(saved) => {
          fetchReturns();
          if (saved) {
            handleOpenPrint(saved);
          }
        }}
      />

      {/* Printable Receipt Modal */}
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

export default SalesReturnDesktopPage;
