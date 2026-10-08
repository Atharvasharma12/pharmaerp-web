import React from "react";
import { FiRefreshCw, FiChevronRight } from "react-icons/fi";
import dayjs from "dayjs";
import { AppText, AppEmptyState } from "@/components";
import { Truck } from "lucide-react";

const CashInTransitDesktopPage = ({
  cashInTransitSlips,
  isLoading,
  error,
  handleRefresh,
  handleViewDetails,
}) => {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-none px-6 py-5 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <AppText variant="h6" className="font-bold text-text">
                Cash In Transit
              </AppText>
              <AppText variant="body2" className="text-text-muted mt-1">
                Company-wide view of all cash currently in transit to bank
              </AppText>
            </div>
          </div>
          <div>
            <button
              onClick={handleRefresh}
              className="p-2 text-text-muted hover:text-text hover:bg-surface-alt rounded-lg transition"
              title="Refresh"
            >
              <FiRefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-danger-soft text-danger border border-danger/20 rounded-lg text-[13px] flex justify-between items-center">
            <span>{error}</span>
          </div>
        )}

        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt border-b border-border text-[12px] text-text-muted font-medium uppercase tracking-wider">
                <th className="px-5 py-3">Slip No & Date</th>
                <th className="px-5 py-3">Source Branch</th>
                <th className="px-5 py-3">To Bank A/c</th>
                <th className="px-5 py-3 text-right">In Transit Amount</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-text divide-y divide-border">
              {isLoading && cashInTransitSlips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-text-muted">
                    Loading cash in transit records...
                  </td>
                </tr>
              ) : cashInTransitSlips.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8">
                    <AppEmptyState
                      title="No cash in transit"
                      description="There are currently no prepared bank deposit slips in transit."
                    />
                  </td>
                </tr>
              ) : (
                cashInTransitSlips.map((slip) => (
                  <tr
                    key={slip._id}
                    onClick={() => handleViewDetails(slip._id)}
                    className="hover:bg-surface-alt/50 transition cursor-pointer group"
                  >
                    <td className="px-5 py-3.5 align-top">
                      <div className="font-medium text-text">{slip.slipNumber}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">
                        {dayjs(slip.slipDate).format("DD MMM YYYY")}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <div className="text-text font-medium">
                        {slip.branchId?.name ? `${slip.branchId.name} Cash` : "Branch Cash"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      <div className="text-text font-medium">
                        {slip.toBankAccountId?.accountName ||
                          slip.toBankAccountId?.bankMasterId?.name ||
                          slip.toBankAccountId?.bankName ||
                          slip.toBankAccount?.bankName ||
                          "-"}
                      </div>
                      <div className="text-[11px] text-text-muted mt-0.5">
                        A/c:{" "}
                        {slip.toBankAccountId?.accountNumber
                          ? `*${slip.toBankAccountId.accountNumber.slice(-4)}`
                          : slip.toBankAccount?.accountNumber
                            ? `*${slip.toBankAccount.accountNumber.slice(-4)}`
                            : "-"}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 align-top text-right font-bold text-warning-dark">
                      ₹{(slip.remainingAmount || slip.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 align-top text-right">
                      <div className="flex items-center justify-end gap-3">
                        <FiChevronRight className="text-border group-hover:text-primary transition" size={18} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CashInTransitDesktopPage;
