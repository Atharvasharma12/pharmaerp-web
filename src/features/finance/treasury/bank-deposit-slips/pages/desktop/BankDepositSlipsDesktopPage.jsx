import { useState } from "react";
import { FiPlus, FiSearch, FiRefreshCw, FiChevronRight } from "react-icons/fi";
import dayjs from "dayjs";
import { AppText, AppEmptyState } from "@/components";
import { ConfirmDepositModal, CancelSlipModal } from "../../components/BankDepositSlipActionModals";

const getStatusBadge = (status) => {
  switch (status) {
    case "PREPARED":
    case "PENDING":
      return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-warning-soft text-warning">Prepared</span>;
    case "DEPOSITED":
      return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-success-soft text-success">Deposited</span>;
    case "CANCELLED":
      return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-danger-soft text-danger">Cancelled</span>;
    default:
      return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-alt text-text-muted">{status}</span>;
  }
};

const BankDepositSlipsDesktopPage = ({
  bankDepositSlips,
  searchParams,
  currentPage,
  pageSize,
  totalSlips,
  isLoading,
  error,
  message,
  clearFeedback,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handleConfirmDeposit,
  handleCancelSlip,
  handleViewDetails,
  handleCreateNew,
  handleRefresh,
}) => {
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const totalPages = Math.ceil(totalSlips / pageSize) || 1;

  const openConfirmModal = (e, slip) => {
    e.stopPropagation();
    setSelectedSlip(slip);
    setIsConfirmModalOpen(true);
  };

  const openCancelModal = (e, slip) => {
    e.stopPropagation();
    setSelectedSlip(slip);
    setIsCancelModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-none px-6 py-5 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <div>
            <AppText variant="h6" className="font-bold text-text">
              Bank Deposit Slips
            </AppText>
            <AppText variant="body2" className="text-text-muted mt-1">
              Manage cash deposits to bank accounts
            </AppText>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 text-text-muted hover:text-text hover:bg-surface-alt rounded-lg transition"
              title="Refresh"
            >
              <FiRefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-[13px] font-medium transition"
            >
              <FiPlus size={16} />
              <span>Create Slip</span>
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="relative w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search by slip number..."
              value={searchParams.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-alt border border-border rounded-lg text-[13px] text-text focus:border-primary outline-none transition"
            />
          </div>

          <select
            value={searchParams.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 bg-surface-alt border border-border rounded-lg text-[13px] text-text outline-none focus:border-primary min-w-[140px]"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="DEPOSITED">Deposited</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-danger-soft text-danger border border-danger/20 rounded-lg text-[13px] flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearFeedback} className="font-bold">&times;</button>
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 bg-success-soft text-success border border-success/20 rounded-lg text-[13px] flex justify-between items-center">
            <span>{message}</span>
            <button onClick={clearFeedback} className="font-bold">&times;</button>
          </div>
        )}

        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt border-b border-border text-[12px] text-text-muted font-medium uppercase tracking-wider">
                <th className="px-5 py-3">Slip No & Date</th>
                <th className="px-5 py-3">Branch / Source</th>
                <th className="px-5 py-3">To Bank A/c</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-text divide-y divide-border">
              {isLoading && bankDepositSlips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-text-muted">
                    Loading bank deposit slips...
                  </td>
                </tr>
              ) : bankDepositSlips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8">
                    <AppEmptyState
                      title="No deposit slips found"
                      description="Create a new bank deposit slip to record cash deposits."
                      actionLabel="Create Slip"
                      onAction={handleCreateNew}
                    />
                  </td>
                </tr>
              ) : (
                bankDepositSlips.map((slip) => (
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
                      {slip.businessDayId?.businessDayNo && (
                        <div className="text-[10px] text-text-muted mt-1 font-mono">
                          BD: {slip.businessDayId.businessDayNo}
                        </div>
                      )}
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
                    <td className="px-5 py-3.5 align-top text-right font-medium text-text">
                      ₹{slip.amount?.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 align-top">
                      {getStatusBadge(slip.status)}
                    </td>
                    <td className="px-5 py-3.5 align-top text-right">
                      <div className="flex items-center justify-end gap-3">
                        {(slip.status === "PENDING" || slip.status === "PREPARED") && (
                          <>
                            <button
                              onClick={(e) => openConfirmModal(e, slip)}
                              className="text-[12px] font-medium text-success hover:underline"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={(e) => openCancelModal(e, slip)}
                              className="text-[12px] font-medium text-danger hover:underline"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <FiChevronRight className="text-border group-hover:text-primary transition" size={18} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalSlips > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface-alt">
              <div className="text-[12px] text-text-muted">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, totalSlips)} of {totalSlips} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 border border-border rounded text-[12px] text-text hover:bg-surface disabled:opacity-50"
                >
                  Prev
                </button>
                <div className="text-[12px] text-text font-medium px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 border border-border rounded text-[12px] text-text hover:bg-surface disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDepositModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={(payload) => {
          handleConfirmDeposit(selectedSlip?._id, payload);
          setIsConfirmModalOpen(false);
        }}
        isLoading={isLoading}
        slip={selectedSlip}
      />

      <CancelSlipModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={(payload) => {
          handleCancelSlip(selectedSlip?._id, payload);
          setIsCancelModalOpen(false);
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BankDepositSlipsDesktopPage;
