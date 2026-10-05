// src/features/operations/business-days/components/OpenBusinessDayDialog.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openBusinessDay, getSuggestedBusinessDate } from "../store/businessDayThunk";
import { clearBusinessDayError, resetOpenBusinessDayStatus } from "../store/businessDaySlice";
import { API_STATUS } from "@/constants";
import { UIModal, UIModalHeader, UIModalTitle, UIModalBody, UIModalFooter, UIButton, UIAlert, UIBadge } from "@/components/ui";
import { CalendarDays, AlertTriangle, Stethoscope, ChevronRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import useBranch from "@/features/branch/hooks/useBranch";

export const OpenBusinessDayDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentBranch } = useBranch();

  const {
    openBusinessDayStatus,
    suggestedBusinessDate,
    openBusinessDay: currentOpenDay,
    error,
  } = useSelector((state) => state.businessDay);

  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (isOpen && currentBranch?._id) {
      dispatch(getSuggestedBusinessDate(currentBranch._id));
    }
  }, [isOpen, currentBranch?._id, dispatch]);

  useEffect(() => {
    if (suggestedBusinessDate?.suggestedDate) {
      const d = new Date(suggestedBusinessDate.suggestedDate);
      setSelectedDate(d.toISOString().split("T")[0]);
    }
  }, [suggestedBusinessDate]);

  useEffect(() => {
    if (openBusinessDayStatus === API_STATUS.SUCCESS) {
      setNote("");
      dispatch(resetOpenBusinessDayStatus());
      onClose();
    }
  }, [openBusinessDayStatus, dispatch, onClose]);

  const handleSubmit = () => {
    if (!selectedDate) return;
    dispatch(openBusinessDay({ businessDate: selectedDate, note, branchId: currentBranch?._id }));
  };

  const isLoading = openBusinessDayStatus === API_STATUS.LOADING;
  const hasOpenDay = suggestedBusinessDate?.hasOpenDay;

  const parsedDate = selectedDate ? new Date(selectedDate + "T00:00:00") : null;
  const displayDate = parsedDate
    ? parsedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";
  const isToday = parsedDate && parsedDate.toDateString() === new Date().toDateString();

  return (
    <UIModal isOpen={isOpen} onClose={onClose} size="md">
      <UIModalHeader>
        <UIModalTitle>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20">
              <CalendarDays className="h-5.5 w-5.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-text tracking-tight">
                Open Business Day Session
              </h3>
              <p className="text-xs font-medium text-text-muted mt-0.5">
                Initialize daily pharmacy business operations
              </p>
            </div>
          </div>
        </UIModalTitle>
      </UIModalHeader>

      <UIModalBody className="max-h-[75vh] overflow-y-auto">
        <div className="space-y-4 py-1">
          {/* Already open warning */}
          {hasOpenDay && (
            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="size-5 shrink-0 text-amber-500 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-bold">Active Business Day Exists</h4>
                <p className="mt-0.5 opacity-90">{suggestedBusinessDate?.reason}</p>
              </div>
            </div>
          )}

          {error && (
            <UIAlert
              intent="danger"
              title="Error"
              description={error}
              onClose={() => dispatch(clearBusinessDayError())}
            />
          )}

          {/* Scheduled Business Date */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-text block">
              Scheduled Business Date
            </span>
            <div className="bg-surface-alt/60 border border-border/80 rounded-xl p-3.5 flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-sm font-bold text-primary font-mono">
                  {displayDate || "Determining scheduled date..."}
                </p>
                {suggestedBusinessDate?.reason && !hasOpenDay && (
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {suggestedBusinessDate.reason}
                  </p>
                )}
              </div>
              {selectedDate && (
                <UIBadge
                  variant="soft"
                  color={isToday ? "success" : "warning"}
                  className="text-[10px] font-bold py-0.5 px-2.5"
                >
                  {isToday ? "TODAY" : "NEXT DAY"}
                </UIBadge>
              )}
            </div>
          </div>

          {/* Session Rules Checklist */}
          {!hasOpenDay && (
            <div className="bg-surface-alt/50 border border-border/70 rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                Session Workflow & Rules
              </span>
              {[
                {
                  icon: Clock,
                  text: "All cashier shifts created today automatically link to this Business Day",
                },
                {
                  icon: Stethoscope,
                  text: "Sales, treasury deposits, and bank slip transfers track under this date",
                },
                {
                  icon: ShieldCheck,
                  text: "Day-end closing locks financial records after all shifts complete",
                },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-text-muted">
                  <Icon className="size-3.5 shrink-0 mt-0.5 text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Note Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text block">
              Opening Note <span className="text-text-muted font-normal">(Optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading || hasOpenDay}
              placeholder="e.g., Festival sales promotion, double shift schedule..."
              rows={2}
              className="w-full bg-surface border border-border/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none outline-none disabled:opacity-50"
            />
          </div>
        </div>
      </UIModalBody>

      <UIModalFooter>
        <UIButton variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancel
        </UIButton>
        <UIButton
          variant="primary"
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={!selectedDate || hasOpenDay}
        >
          <CalendarDays className="size-4 mr-1.5" />
          <span>Open Business Day</span>
          {!isLoading && <ChevronRight className="size-4 ml-1 opacity-60" />}
        </UIButton>
      </UIModalFooter>
    </UIModal>
  );
};

export default OpenBusinessDayDialog;
