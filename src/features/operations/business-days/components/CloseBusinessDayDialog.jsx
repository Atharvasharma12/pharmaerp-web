// src/features/operations/business-days/components/CloseBusinessDayDialog.jsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeBusinessDay } from "../store/businessDayThunk";
import { clearBusinessDayError, resetCloseBusinessDayStatus } from "../store/businessDaySlice";
import { API_STATUS } from "@/constants";
import { UIModal, UIModalHeader, UIModalTitle, UIModalBody, UIModalFooter, UIButton, UIAlert, UIBadge } from "@/components/ui";
import { LockKeyhole, AlertTriangle, CalendarDays, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { ViewShiftDialog } from "../../shifts/components/ViewShiftDialog";

const fmt = (n) => (Number(n) || 0).toLocaleString("en-IN");

const InfoRow = ({ label, value, mono = false, color = "" }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0 text-xs">
    <span className="text-text-muted font-medium">{label}</span>
    <span className={`font-bold ${mono ? "font-mono" : ""} ${color}`}>{value}</span>
  </div>
);

export const CloseBusinessDayDialog = ({ isOpen, onClose, businessDay }) => {
  const dispatch = useDispatch();
  const { closeBusinessDayStatus, error } = useSelector((state) => state.businessDay);
  const [note, setNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [viewShift, setViewShift] = useState(null);

  useEffect(() => {
    if (!isOpen) { setNote(""); setConfirmed(false); }
  }, [isOpen]);

  useEffect(() => {
    if (closeBusinessDayStatus === API_STATUS.SUCCESS) {
      dispatch(resetCloseBusinessDayStatus());
      onClose();
    }
  }, [closeBusinessDayStatus, dispatch, onClose]);

  const handleClose = () => {
    if (!businessDay?._id || !confirmed) return;
    dispatch(closeBusinessDay({ id: businessDay._id, payload: { note } }));
  };

  const isLoading = closeBusinessDayStatus === API_STATUS.LOADING;

  const openShifts = (businessDay?.shifts || []).filter((s) => s.status === "open");
  const totalShifts = (businessDay?.shifts || []).length;
  const hasOpenShifts = openShifts.length > 0;

  const displayDate = businessDay?.businessDate
    ? new Date(businessDay.businessDate).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "";

  const openedAt = businessDay?.actualOpenedAt
    ? new Date(businessDay.actualOpenedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    : "—";

  if (!businessDay) return null;

  return (
    <>
      <UIModal isOpen={isOpen} onClose={onClose} size="md">
        <UIModalHeader>
          <UIModalTitle>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md ${
                  hasOpenShifts
                    ? "bg-gradient-to-br from-rose-600 to-red-700 text-white shadow-rose-500/20"
                    : "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20"
                }`}
              >
                <LockKeyhole className="h-5.5 w-5.5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-text tracking-tight">
                  Close Business Day Session
                </h3>
                <p className="text-xs font-medium text-text-muted mt-0.5">
                  {displayDate}
                </p>
              </div>
            </div>
          </UIModalTitle>
        </UIModalHeader>

        <UIModalBody className="max-h-[75vh] overflow-y-auto">
          <div className="space-y-4 py-1">
            {error && (
              <UIAlert
                intent="danger"
                title="Error"
                description={error}
                onClose={() => dispatch(clearBusinessDayError())}
              />
            )}

            {/* Open Shift Blocker */}
            {hasOpenShifts && (
              <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5 text-rose-700 dark:text-rose-400">
                <AlertTriangle className="size-5 shrink-0 text-rose-500 mt-0.5" />
                <div className="text-xs">
                  <h4 className="font-bold">Active Shift Blocker</h4>
                  <p className="mt-0.5 opacity-90">
                    {openShifts.length} shift{openShifts.length > 1 ? "s are" : " is"} still active. You must lock and close all register shifts before ending the Business Day session.
                  </p>
                </div>
              </div>
            )}

            {/* Session Audit Summary Card */}
            <div className="bg-surface-alt/60 border border-border/80 rounded-xl overflow-hidden p-3.5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block border-b border-border/60 pb-1.5 mb-1">
                Session Audit Summary
              </span>
              <InfoRow label="Business Day No." value={businessDay.businessDayNo || "—"} mono />
              <InfoRow label="Scheduled Date" value={displayDate} />
              <InfoRow label="Opened At" value={openedAt} />
              <InfoRow
                label="Shifts Run"
                value={`${totalShifts} shift${totalShifts !== 1 ? "s" : ""}`}
                color={hasOpenShifts ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}
              />
            </div>

            {/* Shift Checklist */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                Shift Session Verification
              </span>
              {(businessDay?.shifts || []).length === 0 ? (
                <p className="text-xs text-text-muted italic py-2">
                  No register shifts were opened under this session today.
                </p>
              ) : (
                [...(businessDay.shifts || [])].reverse().map((shift, i) => {
                  const openTime = shift.openedAt
                    ? new Date(shift.openedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "—";
                  const closeTime = shift.closedAt
                    ? new Date(shift.closedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "Ongoing";
                  const totalShiftsCount = (businessDay.shifts || []).length;

                  return (
                    <div
                      key={shift._id || i}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                        shift.status === "open"
                          ? "bg-rose-500/5 border-rose-500/30"
                          : "bg-surface-alt/50 border-border/70"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {shift.status === "open" ? (
                          <XCircle className="size-4 text-rose-500 shrink-0" />
                        ) : (
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-xs text-text truncate">
                              {shift.shiftName || `Shift ${totalShiftsCount - i}`}
                            </p>
                            <span className="font-mono text-[10px] text-text-muted font-semibold">
                              {shift.shiftNo}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-muted font-mono mt-0.5">
                            {openTime} → {closeTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <UIBadge
                          variant="soft"
                          color={shift.status === "open" ? "error" : "success"}
                          className="text-[10px] font-bold uppercase py-0 px-1.5"
                        >
                          {shift.status?.toUpperCase()}
                        </UIBadge>

                        <button
                          type="button"
                          onClick={() => setViewShift(shift)}
                          className="p-1 rounded-md bg-surface border border-border/80 text-text-muted hover:text-primary transition-colors cursor-pointer"
                          title="View Shift Details"
                        >
                          <Eye className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Irreversible Action Callout */}
            {!hasOpenShifts && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-amber-700 dark:text-amber-400 text-xs space-y-1">
                <h4 className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-amber-500 shrink-0" /> Irreversible Day-End Lock
                </h4>
                <p className="opacity-90">
                  Closing the Business Day locks all sales, treasury slips, and cashier sessions for <strong className="text-text">{displayDate}</strong>.
                </p>
              </div>
            )}

            {/* Closing Note */}
            {!hasOpenShifts && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text block">
                  End-of-Day Remarks <span className="text-text-muted font-normal">(Optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="End of day sales remarks or counter notes..."
                  rows={2}
                  className="w-full bg-surface border border-border/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none outline-none"
                />
              </div>
            )}

            {/* Confirmation Checkbox */}
            {!hasOpenShifts && (
              <label className="flex items-start gap-3 cursor-pointer select-none group pt-1">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-xs text-text-muted leading-relaxed">
                  I verify that all register shifts are closed and confirm day-end lock for <strong className="text-text">{displayDate}</strong>.
                </span>
              </label>
            )}
          </div>
        </UIModalBody>

        <UIModalFooter>
          <UIButton variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </UIButton>
          {!hasOpenShifts && (
            <UIButton
              variant="danger"
              onClick={handleClose}
              isLoading={isLoading}
              disabled={!confirmed}
            >
              <LockKeyhole className="size-4 mr-1.5" />
              <span>Close Business Day</span>
            </UIButton>
          )}
        </UIModalFooter>
      </UIModal>

      {/* Shift details overlay */}
      {viewShift && (
        <ViewShiftDialog
          isOpen={!!viewShift}
          onClose={() => setViewShift(null)}
          shift={viewShift}
        />
      )}
    </>
  );
};

export default CloseBusinessDayDialog;
