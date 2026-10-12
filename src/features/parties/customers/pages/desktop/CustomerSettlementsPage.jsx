import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UIButton,
  UIInput,
  UIBadge,
  UIAlert,
} from "@/components/ui";
import {
  CreditCard,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Receipt,
  Phone,
  ArrowRight,
  RefreshCw,
  Users,
  ShieldAlert,
  ArrowLeft,
  Building2,
} from "lucide-react";
import customerService from "../../services/customerService";
import CustomerSettlementDialog from "../../components/CustomerSettlementDialog";

export default function CustomerSettlementsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ stats: {}, customers: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // 'all' | 'overdue'
  const [sortBy, setSortBy] = useState("outstanding"); // 'outstanding' | 'oldestDue' | 'name'
  const [error, setError] = useState(null);

  // Settlement dialog
  const [settlingCustomer, setSettlingCustomer] = useState(null);

  const fetchSettlements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await customerService.getAllPendingCredits();
      setData(res?.data?.data || res?.data || { stats: {}, customers: [] });
    } catch (err) {
      console.error("Failed to load customer settlements:", err);
      setError("Failed to fetch pending credit settlements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const stats = data.stats || {};
  const customers = data.customers || [];
  const now = new Date();

  // Filter and sort
  const filteredCustomers = useMemo(() => {
    let list = [...customers];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.customerName?.toLowerCase().includes(term) ||
          c.customerCode?.toLowerCase().includes(term) ||
          c.mobile?.includes(term)
      );
    }

    if (filterMode === "overdue") {
      list = list.filter((c) =>
        c.invoices?.some((inv) => inv.dueDate && new Date(inv.dueDate) < now)
      );
    }

    if (sortBy === "outstanding") {
      list.sort((a, b) => (b.totalOutstanding || 0) - (a.totalOutstanding || 0));
    } else if (sortBy === "oldestDue") {
      list.sort((a, b) => new Date(a.oldestDueDate || 0) - new Date(b.oldestDueDate || 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.customerName || "").localeCompare(b.customerName || ""));
    }

    return list;
  }, [customers, searchTerm, filterMode, sortBy, now]);

  return (
    <div className="min-h-screen bg-background text-text p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/parties/customers")}
            className="size-10 rounded-xl border border-border bg-surface flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-alt transition-colors cursor-pointer"
            title="Back to Customers"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
                Customer Credit Settlements & Receivables
              </h1>
              <UIBadge variant="danger" size="sm">
                Collections
              </UIBadge>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Company-wide outstanding credit debt tracking, aging, and settlement ledger.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <UIButton
            variant="outline"
            size="sm"
            startIcon={<RefreshCw className="size-3.5" />}
            onClick={fetchSettlements}
            isLoading={loading}
          >
            Refresh
          </UIButton>
        </div>
      </div>

      {error && <UIAlert variant="danger">{error}</UIAlert>}

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-red-500/20 bg-linear-to-br from-red-500/5 to-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
            <span>Total Receivables Debt</span>
            <div className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <CreditCard className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-red-600 dark:text-red-400">
            ₹{Number(stats.grandTotalOutstanding || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-text-muted">Total unpaid credit invoice value</div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-linear-to-br from-amber-500/5 to-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
            <span>Overdue Amount</span>
            <div className="size-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldAlert className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            ₹{Number(stats.overdueAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-text-muted">Past agreed credit maturity date</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
            <span>Overdue Invoices</span>
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-text">
            {stats.overdueInvoicesCount || 0} <span className="text-sm font-normal text-text-muted">Bills</span>
          </div>
          <div className="mt-2 text-xs text-text-muted">Require payment follow-up</div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted uppercase tracking-wider">
            <span>Debtor Customers</span>
            <div className="size-8 rounded-lg bg-surface-alt text-text flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-text">
            {stats.totalCustomers || 0}
          </div>
          <div className="mt-2 text-xs text-text-muted">Active customers carrying debt</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-surface">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search by customer, code, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-alt/40 text-xs text-text focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-surface-alt/60 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterMode === "all"
                  ? "bg-surface text-text shadow-2xs font-bold"
                  : "text-text-muted hover:text-text"
              }`}
            >
              All Debtors ({customers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode("overdue")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterMode === "overdue"
                  ? "bg-surface text-amber-600 dark:text-amber-400 shadow-2xs font-bold"
                  : "text-text-muted hover:text-text"
              }`}
            >
              Overdue Only
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted shrink-0">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-border bg-surface text-xs text-text"
          >
            <option value="outstanding">Highest Debt</option>
            <option value="oldestDue">Oldest Due Date</option>
            <option value="name">Customer Name</option>
          </select>
        </div>
      </div>

      {/* Customer Settlements Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-alt/60 text-text-muted uppercase font-bold border-b border-border">
            <tr>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Contact</th>
              <th className="p-3.5 text-center">Unpaid Bills</th>
              <th className="p-3.5 text-right">Total Debt Due</th>
              <th className="p-3.5">Oldest Due Date</th>
              <th className="p-3.5 text-right">Credit Limit</th>
              <th className="p-3.5 text-center">Aging Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-text-muted">
                  Loading receivables data...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-text-muted">
                  No customers found matching the search criteria.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => {
                const isOverdue = c.oldestDueDate && new Date(c.oldestDueDate) < now;

                return (
                  <tr key={c.customerId} className="hover:bg-surface-alt/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-text text-sm">{c.customerName}</div>
                      {c.customerCode && (
                        <span className="font-mono text-[11px] text-text-muted">
                          {c.customerCode}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {c.mobile ? (
                        <div className="font-mono text-text flex items-center gap-1">
                          <Phone className="size-3 text-text-muted" /> {c.mobile}
                        </div>
                      ) : (
                        <span className="text-text-muted">-</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <UIBadge variant="neutral" size="sm">
                        {c.invoiceCount} Bills
                      </UIBadge>
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-sm text-red-600 dark:text-red-400">
                      ₹{Number(c.totalOutstanding || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5 font-mono">
                      {c.oldestDueDate ? (
                        <span
                          className={`flex items-center gap-1 ${
                            isOverdue ? "text-amber-600 dark:text-amber-400 font-bold" : "text-text-muted"
                          }`}
                        >
                          {new Date(c.oldestDueDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          {isOverdue && <AlertTriangle className="size-3 text-amber-500" />}
                        </span>
                      ) : (
                        <span className="text-text-muted">N/A</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right font-mono text-text">
                      ₹{Number(c.creditLimit || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5 text-center">
                      <UIBadge variant={isOverdue ? "warning" : "danger"} size="sm">
                        {isOverdue ? "OVERDUE" : "ACTIVE DEBT"}
                      </UIBadge>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end">
                        <UIButton
                          variant="primary"
                          size="sm"
                          startIcon={<CheckCircle2 className="size-3.5" />}
                          onClick={() =>
                            setSettlingCustomer({
                              _id: c.customerId,
                              name: c.customerName,
                              customerCode: c.customerCode,
                            })
                          }
                        >
                          Settle
                        </UIButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Settle Dialog Modal */}
      {settlingCustomer && (
        <CustomerSettlementDialog
          isOpen={Boolean(settlingCustomer)}
          onClose={() => setSettlingCustomer(null)}
          customer={settlingCustomer}
          onSuccess={() => {
            fetchSettlements();
          }}
        />
      )}
    </div>
  );
}
