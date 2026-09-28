import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listShifts } from "../store/shiftThunk";
import { clearShiftError, clearShiftMessage } from "../store/shiftSlice";
import { API_STATUS } from "@/constants";
import {
  UIButton,
  UIAlert,
  UIPageHeader,
} from "@/components/ui";
import { Clock } from "lucide-react";
import { CreateShiftDialog } from "../components/CreateShiftDialog";
import { ViewShiftDialog } from "../components/ViewShiftDialog";
import { CloseShiftDialog } from "../components/CloseShiftDialog";

const ShiftsPage = () => {
  const dispatch = useDispatch();
  const { shifts, listShiftsStatus, error, message } =
    useSelector((state) => state.shift);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewShift, setViewShift] = useState(null);
  const [closeShift, setCloseShift] = useState(null);

  useEffect(() => {
    dispatch(listShifts());
  }, [dispatch]);

  const isLoading = listShiftsStatus === API_STATUS.LOADING;

  return (
    <div className="min-h-screen bg-bg text-text p-3 sm:p-4 lg:p-0 max-w-[1440px] mx-auto space-y-4">
      <UIPageHeader
        title="Shift Management"
        description="Manage daily POS operational shifts."
        icon={Clock}
        actions={
          <UIButton
            variant="primary"
            onClick={() => setIsCreateOpen(true)}
          >
            Open New Shift
          </UIButton>
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

      <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-bg/50 border-b border-border text-sm text-text-muted">
                <th className="p-4 font-semibold whitespace-nowrap">Shift No</th>
                <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                <th className="p-4 font-semibold whitespace-nowrap">Status</th>
                <th className="p-4 font-semibold whitespace-nowrap">Opened By</th>
                <th className="p-4 font-semibold whitespace-nowrap">Opening Float</th>
                <th className="p-4 font-semibold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">
                    Loading shifts...
                  </td>
                </tr>
              ) : shifts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-text-muted">
                    No shifts found.
                  </td>
                </tr>
              ) : (
                shifts.map((shift) => (
                  <tr
                    key={shift._id}
                    className="border-b border-border hover:bg-bg/40 transition-colors"
                  >
                    <td className="p-4 font-mono text-sm">{shift.shiftNo}</td>
                    <td className="p-4">{new Date(shift.date).toLocaleDateString()}</td>
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
                    <td className="p-4 text-text-muted">{shift.openedBy?.name || "System"}</td>
                    <td className="p-4 font-medium">₹{shift.openingFloatAmount || 0}</td>
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
      <CloseShiftDialog isOpen={!!closeShift} onClose={() => setCloseShift(null)} shift={closeShift} />
    </div>
  );
};

export default ShiftsPage;
