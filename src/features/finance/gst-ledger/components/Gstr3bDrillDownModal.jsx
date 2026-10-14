import React, { useState, useMemo } from "react";
import { FiX, FiSearch, FiFileText, FiCalendar, FiArrowUpRight } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const Gstr3bDrillDownModal = ({ isOpen, onClose, data }) => {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen || !data) return null;

  const { code, description, vouchers = [], taxable, igst, cgst, sgst, cess, totalTax, totalItc } = data;

  const filteredVouchers = useMemo(() => {
    if (!searchTerm.trim()) return vouchers;
    const q = searchTerm.toLowerCase().trim();
    return vouchers.filter((v) => {
      const vNo = String(v.voucherNumber || v.voucherNo || "").toLowerCase();
      const narration = String(v.narration || "").toLowerCase();
      const party = String(v.partyId?.name || v.partyName || "").toLowerCase();
      const gstin = String(v.partyId?.gstNumber || v.partyGstin || "").toLowerCase();
      return vNo.includes(q) || narration.includes(q) || party.includes(q) || gstin.includes(q);
    });
  }, [vouchers, searchTerm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-surface border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-alt/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <FiFileText className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded-md font-bold bg-primary text-white">
                  {code}
                </span>
                <h3 className="text-base font-bold text-text truncate max-w-[600px]">{description}</h3>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Underlying Vouchers & Documents · <span className="font-semibold text-text">{vouchers.length}</span> total entries
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-xl transition-colors cursor-pointer"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Aggregate Mini-Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 px-6 py-3 bg-surface-alt/30 border-b border-border text-xs shrink-0">
          <div>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Taxable Value</span>
            <span className="font-mono font-bold text-text">{formatCurrency(taxable || 0)}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">IGST</span>
            <span className="font-mono font-bold text-primary">{formatCurrency(igst || 0)}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">CGST</span>
            <span className="font-mono font-bold text-text">{formatCurrency(cgst || 0)}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">SGST</span>
            <span className="font-mono font-bold text-text">{formatCurrency(sgst || 0)}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Cess</span>
            <span className="font-mono font-bold text-text">{formatCurrency(cess || 0)}</span>
          </div>
          <div>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Total Tax / ITC</span>
            <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
              {formatCurrency(totalTax !== undefined ? totalTax : (totalItc || 0))}
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-border bg-surface shrink-0 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted size-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search voucher number, party, GSTIN..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-alt border border-border rounded-xl text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <span className="text-xs text-text-muted">
            Showing <strong className="text-text">{filteredVouchers.length}</strong> of {vouchers.length}
          </span>
        </div>

        {/* Vouchers Table */}
        <div className="flex-1 overflow-y-auto">
          {filteredVouchers.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-surface-alt/90 backdrop-blur-xs border-b border-border z-10 text-[11px] font-bold text-text-muted">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-3">Voucher No</th>
                  <th className="py-2.5 px-3">Party / GSTIN</th>
                  <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                  <th className="py-2.5 px-3 text-right">IGST (₹)</th>
                  <th className="py-2.5 px-3 text-right">CGST (₹)</th>
                  <th className="py-2.5 px-3 text-right">SGST (₹)</th>
                  <th className="py-2.5 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredVouchers.map((v, idx) => {
                  const partyName = v.partyId?.name || v.partyName || v.narration || "-";
                  const gstin = v.partyId?.gstNumber || v.partyGstin || "";
                  const total = v.totalAmount !== undefined ? v.totalAmount : (Number(v.taxableAmount || 0) + Number(v.cgst || 0) + Number(v.sgst || 0) + Number(v.igst || 0));

                  return (
                    <tr key={v._id || v.voucherId || idx} className="hover:bg-surface-hover/70 transition-colors">
                      <td className="py-2.5 px-4 text-text-muted whitespace-nowrap font-mono text-[11px]">
                        {formatDate(v.voucherDate || v.date)}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-text whitespace-nowrap">
                        {v.voucherNumber || v.voucherNo || "-"}
                      </td>
                      <td className="py-2.5 px-3 max-w-[240px]">
                        <div className="font-medium text-text truncate" title={partyName}>{partyName}</div>
                        {gstin && <div className="text-[10px] font-mono text-primary truncate">{gstin}</div>}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-text">
                        {formatCurrency(v.taxableAmount || v.taxable || 0)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-primary">
                        {formatCurrency(v.igst || 0)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-text">
                        {formatCurrency(v.cgst || 0)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-text">
                        {formatCurrency(v.sgst || 0)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-text">
                        {formatCurrency(total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-16 text-center text-text-muted">
              <FiFileText className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-text">No voucher records available</p>
              <p className="text-xs text-text-muted mt-0.5">
                {searchTerm ? "No vouchers matched your search." : "No individual vouchers were found for this section in the selected period."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-surface-alt/40 shrink-0">
          <span className="text-xs text-text-muted">
            Displaying detailed breakdown for section <strong className="text-text">{code}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-text hover:bg-surface-hover transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gstr3bDrillDownModal;
