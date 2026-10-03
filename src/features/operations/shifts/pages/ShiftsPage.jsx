import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { listShifts } from "../store/shiftThunk";
import { clearShiftError, clearShiftMessage } from "../store/shiftSlice";
import { API_STATUS } from "@/constants";
import {
  UIButton,
  UIAlert,
  UIPageHeader,
  UIInput,
} from "@/components/ui";
import { Clock, CalendarDays, Landmark, Plus } from "lucide-react";
import { CreateShiftDialog } from "../components/CreateShiftDialog";
import { ViewShiftDialog } from "../components/ViewShiftDialog";
import { CloseShiftDialog } from "../components/CloseShiftDialog";
import useBranch from "@/features/branch/hooks/useBranch";

const ShiftsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shifts, listShiftsStatus, error, message } =
    useSelector((state) => state.shift);
  
  const { currentBranch } = useBranch();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewShift, setViewShift] = useState(null);
  const [closeShift, setCloseShift] = useState(null);

  const getFallbackShiftName = (s) => {
    if (s.shiftName) return s.shiftName;
    const hour = new Date(s.openedAt || s.createdAt || new Date()).getHours();
    if (hour < 12) return "Morning Shift";
    if (hour < 17) return "Afternoon Shift";
    if (hour < 20) return "Evening Shift";
    return "Night Shift";
  };

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
    dispatch(listShifts(params));
  }, [dispatch, dateFilter, statusFilter, sortOrder, currentBranch?._id]);

  const isLoading = listShiftsStatus === API_STATUS.LOADING;

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-0 max-w-[1440px] mx-auto space-y-4">
      <UIPageHeader
        title="Shift Management"
        description="Manage daily POS operational shifts."
        icon={Clock}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Hide "Day Closing" if a shift is open because we cannot create a day close with an open shift */}
            {!shifts.some((s) => s.status === "open") && (
              <UIButton
                variant="outline"
                onClick={() => navigate("/operations/day-closings")}
              >
                <CalendarDays className="w-4 h-4 mr-1.5" />
                Day Closing
              </UIButton>
            )}
            <UIButton
              variant="outline"
              onClick={() => navigate("/finance/treasury/bank-deposit-slips/create")}
            >
              <Landmark className="w-4 h-4 mr-1.5" />
              Create Bank Slip
            </UIButton>
            {/* Only show "Open New Shift" if there are no open shifts */}
            {!shifts.some((s) => s.status === "open") && (
              <UIButton
                variant="primary"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Open New Shift
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
          onClose={() => dispatch(clearShiftError())}
        />
      )}

      {message && (
        <UIAlert
          intent="success"
          title="Success"
          description={message}
          onClose={() => dispatch(clearShiftMessage())}
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
          <option value="open">Open</option>
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
                <th className="p-4 font-semibold whitespace-nowrap">Shift Details</th>
                <th className="p-4 font-semibold whitespace-nowrap">Date & Time</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap">Opened By</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Opening Float</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Closing Amount</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-text-muted">
                    Loading shifts...
                  </td>
                </tr>
              ) : shifts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-text-muted">
                    No shifts found.
                  </td>
                </tr>
              ) : (
                shifts.map((shift) => (
                  <tr
                    key={shift._id}
                    className="border-b border-border hover:bg-bg/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-semibold">{getFallbackShiftName(shift)}</div>
                      <div className="font-mono text-xs text-text-muted">{shift.shiftNo}</div>
                    </td>
                    <td className="p-4">
                      <div>{new Date(shift.date).toLocaleDateString()}</div>
                      <div className="text-sm text-text-muted">
                        {new Date(shift.openedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                        {" → "} 
                        {shift.closedAt ? new Date(shift.closedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Open"}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          shift.status === "open"
                            ? "bg-success/10 text-success border-success/20"
                            : shift.status === "closed"
                            ? "bg-border/20 text-text border-border"
                            : "bg-error/10 text-error border-error/20"
                        }`}
                      >
                        {shift.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-text-muted">{shift.openedBy?.fullName || shift.openedBy?.name || "System"}</td>
                    <td className="p-4 font-medium text-right">₹{shift.openingFloatAmount || 0}</td>
                    <td className="p-4 font-medium text-right text-primary">
                      {shift.status === 'closed' ? `₹${shift.actualClosingCashAmount || 0}` : "-"}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <UIButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewShift(shift)}
                      >
                        View
                      </UIButton>
                      {shift.status === "open" && (
                        <UIButton
                          variant="outline"
                          size="sm"
                          onClick={() => setCloseShift(shift)}
                        >
                          Lock Shift
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

      <CreateShiftDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <ViewShiftDialog isOpen={!!viewShift} onClose={() => setViewShift(null)} shift={viewShift} />
      <CloseShiftDialog 
        isOpen={!!closeShift} 
        onClose={() => setCloseShift(null)} 
        shift={closeShift} 
        onOpenNewShift={() => setIsCreateOpen(true)}
        onCreateDayClosing={() => navigate("/operations/day-closings", { state: { openCreateDayClosing: true } })}
      />
    </div>
  );
};

export default ShiftsPage;
