import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  listDayClosings,
  createDayClosing,
} from "../store/dayClosingThunk";
import { clearDayClosingError, clearDayClosingMessage } from "../store/dayClosingSlice";
import { API_STATUS } from "@/constants";
import {
  UIButton,
  UIAlert,
  UIPageHeader,
  UIInput,
} from "@/components/ui";
import { CalendarDays, Clock, Landmark, Plus } from "lucide-react";
import {
  CreateDayClosingDialog,
  CloseDayClosingDialog,
  ViewDayClosingDialog,
} from "../components";
import useBranch from "@/features/branch/hooks/useBranch";
import { useBranchCash } from "@/features/finance/treasury/cash-management/branch-cash/hooks/useBranchCash";

const DayClosingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dayClosings, listDayClosingsStatus, error, message } =
    useSelector((state) => state.dayClosing);
  const { currentBranch } = useBranch();
  const { currentBranchCash, fetchBranchCash } = useBranchCash();
  const location = useLocation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDayClosing, setSelectedDayClosing] = useState(null);
  const [dialogType, setDialogType] = useState(null); // 'view' or 'close'

  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const params = {};
    if (currentBranch?._id) params.branchId = currentBranch._id;
    if (dateFilter) params.date = dateFilter;
    if (statusFilter !== "all") params.status = statusFilter;
    params.sort = sortOrder;
    dispatch(listDayClosings(params));
  }, [dispatch, dateFilter, statusFilter, sortOrder, currentBranch?._id]);


  useEffect(() => {
    if (location.state?.openCreateDayClosing) {
      setIsCreateOpen(true);
      // Clean up state so a refresh doesn't reopen it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleOpenDialog = (dayClosing, type) => {
    setSelectedDayClosing(dayClosing);
    setDialogType(type);
  };

  const handleCloseDialog = () => {
    setSelectedDayClosing(null);
    setDialogType(null);
  };

  const isLoading = listDayClosingsStatus === API_STATUS.LOADING;

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-0 max-w-[1440px] mx-auto space-y-4">
      <UIPageHeader
        title="Day Closing"
        description="Manage daily POS operational and end-of-day closures."
        icon={CalendarDays}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <UIButton
              variant="outline"
              onClick={() => navigate("/operations/shifts")}
            >
              <Clock className="w-4 h-4 mr-1.5" />
              Shifts
            </UIButton>
            <UIButton
              variant="outline"
              onClick={() => navigate("/finance/treasury/bank-deposit-slips/create")}
            >
              <Landmark className="w-4 h-4 mr-1.5" />
              Create Bank Slip
            </UIButton>
            {!currentBranchCash?.currentShiftId && (
              <UIButton
                variant="primary"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create Day Closing
              </UIButton>
            )}
          </div>
        }
      />

      {error && (
        <UIAlert
          intent="danger"
          title="Error"
          description={error}
          onClose={() => dispatch(clearDayClosingError())}
        />
      )}

      {message && (
        <UIAlert
          intent="success"
          title="Success"
          description={message}
          onClose={() => dispatch(clearDayClosingMessage())}
        />
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-surface p-3 rounded-xl shadow-sm border border-border">
        <span className="text-sm font-medium text-text-muted px-1">Filters:</span>
        <UIInput
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          containerClassName="w-40"
          className="h-9 text-sm"
        />
        <select
          className="h-9 w-32 bg-bg border border-border rounded-lg px-3 py-1 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className="h-9 w-40 bg-bg border border-border rounded-lg px-3 py-1 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-bg/50 border-b border-border text-sm text-text-muted">
                <th className="p-4 font-semibold whitespace-nowrap">Closing Details</th>
                <th className="p-4 font-semibold whitespace-nowrap">Date & Time</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap">Processed By</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Opening Float</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right text-error">Withdrawals</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right text-success">Deposits</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Closing Amount</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-text-muted">
                    Loading day closings...
                  </td>
                </tr>
              ) : dayClosings.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-text-muted">
                    No day closings found.
                  </td>
                </tr>
              ) : (
                dayClosings.map((dc) => (
                  <tr
                    key={dc._id}
                    className="border-b border-border hover:bg-bg/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold font-mono text-sm">{dc.dayClosingNo || "Day Closing"}</div>
                      <div className="text-xs text-text-muted">
                        {dc.shifts?.length || 0} shift{dc.shifts?.length === 1 ? "" : "s"} included
                      </div>
                    </td>
                    <td className="p-4">
                      <div>{new Date(dc.date).toLocaleDateString()}</div>
                      <div className="text-sm text-text-muted">
                        {dc.closedAt
                          ? new Date(dc.closedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : new Date(dc.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          dc.status === "closed"
                            ? "bg-border/20 text-text border-border"
                            : dc.status === "draft"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-error/10 text-error border-error/20"
                        }`}
                      >
                        {dc.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted">
                      {dc.createdBy?.fullName || dc.createdBy?.name || "System"}
                    </td>
                    <td className="p-4 font-medium text-right">₹{dc.openingFloatAmount || 0}</td>
                    {/* Withdrawals column */}
                    <td className="p-4 text-right">
                      {dc.status === "closed" && (dc.totalFundWithdrawals || 0) > 0 ? (
                        <span className="font-medium text-error tabular-nums">
                          −₹{Number(dc.totalFundWithdrawals).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                    </td>
                    {/* Deposits column */}
                    <td className="p-4 text-right">
                      {dc.status === "closed" && (dc.totalFundDeposits || 0) > 0 ? (
                        <span className="font-medium text-success tabular-nums">
                          +₹{Number(dc.totalFundDeposits).toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-right text-primary">
                      {dc.status === "closed" ? `₹${dc.actualClosingCashAmount || 0}` : `₹${dc.expectedClosingCashAmount || 0} (Exp)`}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <UIButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(dc, "view")}
                      >
                        View
                      </UIButton>
                      {dc.status === "draft" && (
                        <UIButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(dc, "close")}
                        >
                          Lock Day Closing
                        </UIButton>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateDayClosingDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <ViewDayClosingDialog
        isOpen={dialogType === "view"}
        onClose={handleCloseDialog}
        dayClosing={selectedDayClosing}
      />
      <CloseDayClosingDialog
        isOpen={dialogType === "close"}
        onClose={handleCloseDialog}
        dayClosing={selectedDayClosing}
      />
    </div>
  );
};

export default DayClosingsPage;
