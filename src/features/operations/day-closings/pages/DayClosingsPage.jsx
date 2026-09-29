import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { CalendarDays, Eye, Lock } from "lucide-react";
import {
  CreateDayClosingDialog,
  CloseDayClosingDialog,
  ViewDayClosingDialog,
} from "../components";
import useBranch from "@/features/branch/hooks/useBranch";

const DayClosingsPage = () => {
  const dispatch = useDispatch();
  const { dayClosings, listDayClosingsStatus, error, message } =
    useSelector((state) => state.dayClosing);
  const { currentBranch } = useBranch();

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
        description="Manage end-of-day financial closures."
        icon={CalendarDays}
        actions={
          <UIButton
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
          >
            Create Day Closing
          </UIButton>
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
                <th className="p-4 font-semibold whitespace-nowrap">Closing No</th>
                <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap text-center">Shifts</th>
                <th className="p-4 font-semibold whitespace-nowrap">Processed By</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Expected Cash</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Actual Cash</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-text-muted">
                    Loading day closings...
                  </td>
                </tr>
              ) : dayClosings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-text-muted">
                    No day closings found.
                  </td>
                </tr>
              ) : (
                dayClosings.map((dc) => (
                  <tr
                    key={dc._id}
                    className="border-b border-border hover:bg-bg/40 transition-colors"
                  >
                    <td className="p-4 font-mono text-sm">{dc.dayClosingNo}</td>
                    <td className="p-4">{new Date(dc.date).toLocaleDateString()}</td>
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
                    <td className="p-4 text-center font-medium">
                      {dc.shifts?.length || 0}
                    </td>
                    <td className="p-4 text-text-muted">{dc.createdBy?.fullName || dc.createdBy?.name || "System"}</td>
                    <td className="p-4 font-medium text-right text-primary">₹{dc.expectedClosingCashAmount || 0}</td>
                    <td className="p-4 font-medium text-right">₹{dc.status === 'closed' ? dc.actualClosingCashAmount : "-"}</td>
                    <td className="p-4 text-right space-x-2">
                      <UIButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(dc, "view")}
                      >
                        <Eye className="w-4 h-4 text-text-muted" />
                      </UIButton>
                      {dc.status === "draft" && (
                        <UIButton
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(dc, "close")}
                        >
                          <Lock className="w-4 h-4 text-error" />
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
