// src/features/operations/business-days/components/OpenBusinessDayDialog.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openBusinessDay,
  getSuggestedBusinessDate,
} from "../store/businessDayThunk";
import {
  clearBusinessDayError,
  resetOpenBusinessDayStatus,
} from "../store/businessDaySlice";
import { API_STATUS } from "@/constants";
import {
  UIModal,
  UIButton,
  UIAlert,
} from "@/components/ui";
import {
  CalendarDays,
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  Info,
  FileText,
  ArrowRight,
  X,
  Stethoscope,
  CheckCircle2,
} from "lucide-react";
import useBranch from "@/features/branch/hooks/useBranch";

/** Local calendar date formatted as YYYY-MM-DD */
const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Tomorrow's local date formatted as YYYY-MM-DD */
const getTomorrowDateString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getLocalDateString(tomorrow);
};

/** Format YYYY-MM-DD to human friendly string */
const formatDisplayDateFromStr = (dateStr) => {
  if (!dateStr) return "Determining scheduled date...";
  const parts = dateStr.split("T")[0].split("-").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
};

/** Short format e.g. "Thu, 8 Oct" */
const formatShortDateFromStr = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("T")[0].split("-").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "short" });
  return `${weekday}, ${day} ${month}`;
};

export const OpenBusinessDayDialog = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { currentBranch } = useBranch();

  const {
    openBusinessDayStatus,
    getSuggestedDateStatus,
    suggestedBusinessDate,
    openBusinessDay: currentOpenDay,
    error,
  } = useSelector((state) => state.businessDay);

  const todayStr = useMemo(() => getLocalDateString(new Date()), [isOpen]);
  const tomorrowStr = useMemo(() => getTomorrowDateString(), [isOpen]);

  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (isOpen && currentBranch?._id) {
      setSelectedDate(todayStr);
      dispatch(
        getSuggestedBusinessDate({
          branchId: currentBranch._id,
          clientDate: todayStr,
        })
      );
    }
  }, [isOpen, currentBranch?._id, todayStr, dispatch]);

  const isTodayClosed = Boolean(suggestedBusinessDate?.isTodayClosed);

  useEffect(() => {
    if (suggestedBusinessDate?.suggestedDate) {
      let raw = "";
      if (typeof suggestedBusinessDate.suggestedDate === "string") {
        raw = suggestedBusinessDate.suggestedDate.split("T")[0];
      } else {
        const d = new Date(suggestedBusinessDate.suggestedDate);
        raw = getLocalDateString(d);
      }

      // Strictly clamp: Never allow yesterday or past dates
      if (raw < todayStr) {
        raw = todayStr;
      }

      if (isTodayClosed) {
        setSelectedDate(tomorrowStr);
      } else {
        setSelectedDate(raw || todayStr);
      }
    }
  }, [suggestedBusinessDate, todayStr, tomorrowStr, isTodayClosed]);

  useEffect(() => {
    if (openBusinessDayStatus === API_STATUS.SUCCESS) {
      setNote("");
      setSelectedDate("");
      dispatch(resetOpenBusinessDayStatus());
      onClose();
    }
  }, [openBusinessDayStatus, dispatch, onClose]);

  const handleSubmit = () => {
    if (!selectedDate) return;
    dispatch(
      openBusinessDay({
        businessDate: selectedDate,
        clientDate: todayStr,
        note,
        branchId: currentBranch?._id,
      })
    );
  };

  const isLoading = openBusinessDayStatus === API_STATUS.LOADING;
  const isDateDetermining =
    getSuggestedDateStatus === API_STATUS.LOADING ||
    !selectedDate ||
    !suggestedBusinessDate;
  const hasOpenDay = suggestedBusinessDate?.hasOpenDay;

  const displayDateText = selectedDate
    ? formatDisplayDateFromStr(selectedDate)
    : "";
  const badgeText = selectedDate === todayStr ? "TODAY" : "TOMORROW";

  return (
    <UIModal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="max-w-[560px] sm:max-w-[570px] rounded-2xl border border-border bg-surface shadow-2xl p-4 sm:p-5 space-y-2.5 sm:space-y-3 overflow-hidden select-none"
    >
      {/* ── 1. Dialog Header (No Bottom Border) ───────────────────────────────── */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Emerald rounded-xl icon container */}
          <div className="size-9 sm:size-9.5 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs ring-1 ring-emerald-500/20">
            <CalendarDays className="size-4.5 stroke-[2]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-[17px] font-bold text-text tracking-tight leading-none">
                Open Business Day Session
              </h3>
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                NEW SESSION
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-text-muted mt-0.5 leading-tight">
              Initialize daily pharmacy business operations
            </p>
          </div>
        </div>

        {/* Circular Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="size-7 sm:size-7.5 rounded-full bg-surface-alt hover:bg-surface-hover text-text-muted hover:text-text flex items-center justify-center transition-colors cursor-pointer shrink-0"
          aria-label="Close dialog"
        >
          <X className="size-3.5 sm:size-4" />
        </button>
      </div>

      {/* Existing Open Day Warning (if any) */}
      {hasOpenDay && (
        <UIAlert
          intent="warning"
          title="Active Business Day Exists"
          description={suggestedBusinessDate?.reason}
        />
      )}

      {/* Global Error Banner (if any) */}
      {error && (
        <UIAlert
          intent="danger"
          title="Error opening business day"
          description={error}
          onClose={() => dispatch(clearBusinessDayError())}
        />
      )}

      {/* ── 2. Information Callout Banner ─────────────────────────────────── */}
      <div className="bg-emerald-500/[0.06] dark:bg-emerald-500/[0.12] border border-emerald-500/20 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 flex items-start gap-2.5">
        <div className="size-4.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="size-3" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-text leading-tight">
            Start a new business day
          </h4>
          <p className="text-[11px] sm:text-[11.5px] text-text-muted mt-0.5 leading-snug">
            Opening a business day will allow you to create cashier shifts,
            process sales, manage fund deposits, and track all financial
            activities under this date.
          </p>
        </div>
      </div>

      {/* ── 3. Scheduled Business Date Selection (Today or Tomorrow) ────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-text">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-text-muted" />
            <span>Select Business Date</span>
          </div>
          <span className="text-[10.5px] font-normal text-text-muted">
            Only Today and Tomorrow can be opened
          </span>
        </div>

        {/* Quick Date Switcher Buttons (Today vs Tomorrow) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Today Button */}
          <button
            type="button"
            disabled={isTodayClosed || hasOpenDay || isLoading}
            onClick={() => setSelectedDate(todayStr)}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
              selectedDate === todayStr
                ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-text ring-2 ring-emerald-500/20"
                : "border-border bg-surface hover:bg-surface-alt/80 text-text"
            } ${
              isTodayClosed
                ? "opacity-50 cursor-not-allowed bg-surface-alt/40"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {isTodayClosed ? "Closed" : "Today"}
              </span>
              {selectedDate === todayStr && !isTodayClosed && (
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="text-xs font-bold text-text mt-0.5">
              {formatShortDateFromStr(todayStr)}
            </div>
            <div className="text-[10px] text-text-muted truncate mt-0.5">
              {isTodayClosed ? "Session closed" : "Current day session"}
            </div>
          </button>

          {/* Tomorrow Button */}
          <button
            type="button"
            disabled={hasOpenDay || isLoading}
            onClick={() => setSelectedDate(tomorrowStr)}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
              selectedDate === tomorrowStr
                ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-text ring-2 ring-emerald-500/20"
                : "border-border bg-surface hover:bg-surface-alt/80 text-text"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {isTodayClosed ? "Recommended" : "Tomorrow"}
              </span>
              {selectedDate === tomorrowStr && (
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <div className="text-xs font-bold text-text mt-0.5">
              {formatShortDateFromStr(tomorrowStr)}
            </div>
            <div className="text-[10px] text-text-muted truncate mt-0.5">
              {isTodayClosed ? "Next available session" : "Advance session"}
            </div>
          </button>
        </div>

        {/* Selected Date Summary Card */}
        {isDateDetermining ? (
          <div className="bg-surface border border-border rounded-xl px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
            <div className="space-y-1.5 min-w-0 pr-2">
              <div className="h-4 w-44 rounded bg-surface-alt animate-pulse" />
              <div className="h-3 w-60 rounded bg-surface-alt/70 animate-pulse" />
            </div>
            <div className="h-6 w-18 rounded-md bg-surface-alt animate-pulse shrink-0" />
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl px-3.5 py-2 sm:py-2.5 flex items-center justify-between shadow-2xs">
            <div className="min-w-0 pr-2">
              <div className="text-sm sm:text-[14.5px] font-bold text-emerald-600 dark:text-emerald-400 font-sans tracking-tight">
                {displayDateText}
              </div>
              <div className="text-[10.5px] sm:text-[11px] text-text-muted mt-0.5 truncate">
                {selectedDate === tomorrowStr && isTodayClosed
                  ? "Today is closed. Starting session for tomorrow."
                  : suggestedBusinessDate?.reason ||
                    "Ready to start business operations for this date."}
              </div>
            </div>

            {/* Relative Day Badge (TODAY / TOMORROW) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bold text-[10.5px] tracking-wider shrink-0 select-none">
              <Calendar className="size-3" />
              <span>{badgeText}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. Session Workflow & Rules Highlighted Panel ─────────────────── */}
      <div className="bg-emerald-500/[0.03] dark:bg-surface-alt/30 border border-border/80 rounded-xl p-2.5 sm:p-3">
        <div className="flex items-center gap-2">
          <div className="size-5.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="size-3" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text leading-tight">
              Session Workflow & Rules
            </h4>
            <p className="text-[10px] sm:text-[10.5px] text-text-muted leading-tight">
              After opening the business day, the following will apply:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-2">
          {/* Column 1: Cashier Shifts */}
          <div className="space-y-0.5">
            <div className="size-5.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              <Clock className="size-3" />
            </div>
            <h5 className="text-[11px] font-bold text-text leading-tight">
              Cashier Shifts
            </h5>
            <p className="text-[9.5px] sm:text-[10px] text-text-muted leading-tight mt-0.5">
              All cashier shifts created today automatically link to this
              Business Day.
            </p>
          </div>

          {/* Column 2: Sales & Deposits */}
          <div className="space-y-0.5">
            <div className="size-5.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              <Stethoscope className="size-3" />
            </div>
            <h5 className="text-[11px] font-bold text-text leading-tight">
              Sales & Deposits
            </h5>
            <p className="text-[9.5px] sm:text-[10px] text-text-muted leading-tight mt-0.5">
              Sales, treasury deposits, and bank slip transfers track under
              this date.
            </p>
          </div>

          {/* Column 3: Day-end Closing */}
          <div className="space-y-0.5">
            <div className="size-5.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
              <ShieldCheck className="size-3" />
            </div>
            <h5 className="text-[11px] font-bold text-text leading-tight">
              Day-end Closing
            </h5>
            <p className="text-[9.5px] sm:text-[10px] text-text-muted leading-tight mt-0.5">
              Day-end closing locks financial records after all shifts
              complete.
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. Opening Note (Optional) ─────────────────────────────────────── */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-text">
          <FileText className="size-3.5 text-text-muted" />
          <span>Opening Note (Optional)</span>
        </div>

        <div className="relative">
          <textarea
            value={note}
            maxLength={500}
            onChange={(e) => setNote(e.target.value)}
            disabled={isLoading || hasOpenDay}
            placeholder="e.g., Festival sales promotion, double shift schedule, special remarks..."
            rows={2}
            className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-text placeholder:text-text-muted/60 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none outline-none disabled:opacity-50 select-text leading-normal"
          />
          <div className="text-[10px] font-mono text-text-muted text-right mt-0.5">
            {note.length}/500
          </div>
        </div>
      </div>

      {/* ── 6. Action Buttons (No Top Border / Clean Footer) ───────────────── */}
      <div className="flex items-center justify-end gap-2 pt-0.5">
        <UIButton
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
          className="h-8.5 px-3.5 text-xs font-medium rounded-lg"
        >
          Cancel
        </UIButton>

        <UIButton
          type="button"
          size="sm"
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={
            !selectedDate ||
            hasOpenDay ||
            isDateDetermining ||
            (selectedDate === todayStr && isTodayClosed)
          }
          startIcon={<Calendar className="size-3.5" />}
          endIcon={<ArrowRight className="size-3.5" />}
          className="h-8.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium border-none shadow-xs text-xs rounded-lg transition-all"
        >
          Open Business Day
        </UIButton>
      </div>
    </UIModal>
  );
};

export default OpenBusinessDayDialog;
