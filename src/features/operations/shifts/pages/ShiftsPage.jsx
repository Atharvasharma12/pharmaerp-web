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
            <UIButton
              variant="outline"
              onClick={() => navigate("/operations/day-closings")}
            >
              <CalendarDays className="w-4 h-4 mr-1.5" />
              Day Closing
            </UIButton>
            <UIButton
              variant="outline"
              onClick={() => navigate("/finance/treasury/bank-deposit-slips/create")}
            >
              <Landmark className="w-4 h-4 mr-1.5" />
              Create Bank Slip
            </UIButton>
            <UIButton
              variant="primary"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Open New Shift
            </UIButton>
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
                    Loading shifts...
                  </td>
                </tr>
              ) : shifts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-text-muted">
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
                    {/* Withdrawals column */}
                    <td className="p-4 text-right">
                      {shift.status === 'closed' && (shift.totalFundWithdrawals || 0) > 0
                        ? <span className="font-medium text-error tabular-nums">−₹{Number(shift.totalFundWithdrawals).toLocaleString("en-IN")}</span>
                        : <span className="text-text-muted text-xs">—</span>}
                    </td>
                    {/* Deposits column */}
                    <td className="p-4 text-right">
                      {shift.status === 'closed' && (shift.totalFundDeposits || 0) > 0
                        ? <span className="font-medium text-success tabular-nums">+₹{Number(shift.totalFundDeposits).toLocaleString("en-IN")}</span>
                        : <span className="text-text-muted text-xs">—</span>}
                    </td>
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
      <CloseShiftDialog isOpen={!!closeShift} onClose={() => setCloseShift(null)} shift={closeShift} />
    </div>

// src/features/operations/shifts/pages/ShiftsPage.jsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";
import { UI_TOOLBAR_VIEWS } from "@/components/ui";

import { listShifts } from "../store/shiftThunk";
import { clearShiftError, clearShiftMessage } from "../store/shiftSlice";
import useBranch from "@/features/branch/hooks/useBranch";
import {
  getOpenBusinessDay,
  listBusinessDays,
} from "@/features/operations/business-days/store/businessDayThunk";

import { ShiftsMobilePage } from "./mobile";
import { ShiftsDesktopPage } from "./desktop";

const statusOptions = [
  { label: "Status: All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Cancelled", value: "cancelled" },
];

const initialFilters = {
  search: "",
  date: "",
  status: "all",
};

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const formatDateString = (dateInput) => {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput).slice(0, 10);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ShiftsPage = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const { shifts, listShiftsStatus, error, message } = useSelector(
    (state) => state.shift
  );
  const { currentBranch } = useBranch();
  const { openBusinessDay, businessDays } = useSelector((state) => state.businessDay);

  const [filters, setFilters] = useState(initialFilters);
  const [dateUserSelected, setDateUserSelected] = useState(false);
  const [sortBy, setSortBy] = useState("desc");
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewShift, setViewShift] = useState(null);
  const [closeShift, setCloseShift] = useState(null);
  const [isCloseBusinessDayOpen, setIsCloseBusinessDayOpen] = useState(false);

  const isLoading = listShiftsStatus === API_STATUS.LOADING;
  const hasError = listShiftsStatus === API_STATUS.ERROR;

  // Fetch open business day and business day history for default date calculation
  useEffect(() => {
    if (currentBranch?._id) {
      dispatch(getOpenBusinessDay(currentBranch._id));
      dispatch(listBusinessDays({ branchId: currentBranch._id }));
    }
  }, [dispatch, currentBranch?._id]);

  // Set default shift filter date: Open Business Day -> Last Business Day -> Today
  useEffect(() => {
    if (dateUserSelected) return;

    let defaultDate = "";
    if (openBusinessDay?.businessDate) {
      defaultDate = formatDateString(openBusinessDay.businessDate);
    } else if (Array.isArray(businessDays) && businessDays.length > 0) {
      const sorted = [...businessDays].sort(
        (a, b) =>
          new Date(b.businessDate || b.createdAt).getTime() -
          new Date(a.businessDate || a.createdAt).getTime()
      );
      if (sorted[0]?.businessDate) {
        defaultDate = formatDateString(sorted[0].businessDate);
      }
    } else {
      defaultDate = formatDateString(new Date());
    }

    if (defaultDate) {
      setFilters((prev) => ({ ...prev, date: defaultDate }));
    }
  }, [openBusinessDay, businessDays, dateUserSelected]);

  const fetchShiftsData = useCallback(() => {
    const params = {};
    if (currentBranch?._id) params.branchId = currentBranch._id;
    if (filters.date) params.date = filters.date;
    if (filters.status !== "all") params.status = filters.status;
    params.sort = sortBy;
    dispatch(listShifts(params));
  }, [dispatch, currentBranch?._id, filters.date, filters.status, sortBy]);

  useEffect(() => {
    fetchShiftsData();
  }, [fetchShiftsData]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => {
      dispatch(clearShiftMessage());
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [message, dispatch]);

  const mappedShifts = useMemo(
    () => (Array.isArray(shifts) ? shifts : []),
    [shifts]
  );

  const filteredAndSortedShifts = useMemo(() => {
    const search = normalizeText(filters.search);

    const filtered = mappedShifts.filter((shift) => {
      const staffName =
        shift.openedBy?.fullName ||
        shift.openedBy?.name ||
        shift.openedBy?.email ||
        "";
      const shiftNo = shift.shiftNo || "";
      const shiftName = shift.shiftName || "";

      const matchesSearch =
        !search ||
        normalizeText(shiftNo).includes(search) ||
        normalizeText(shiftName).includes(search) ||
        normalizeText(staffName).includes(search);

      const matchesStatus =
        filters.status === "all" || shift.status === filters.status;

      let matchesDate = !filters.date;
      if (filters.date) {
        // 1. Check if shift belongs to openBusinessDay for this date
        if (
          openBusinessDay &&
          formatDateString(openBusinessDay.businessDate) === filters.date
        ) {
          const bDayId =
            shift.businessDayId?._id ||
            shift.businessDayId ||
            shift.businessDay?._id ||
            shift.businessDay;
          if (bDayId && String(bDayId) === String(openBusinessDay._id)) {
            matchesDate = true;
          }
        }

        if (!matchesDate) {
          const shiftBusinessDateStr = formatDateString(shift.businessDate);
          const shiftDateStr = formatDateString(shift.date);
          const shiftOpenedAtStr = formatDateString(shift.openedAt);

          matchesDate =
            shiftBusinessDateStr === filters.date ||
            shiftDateStr === filters.date ||
            shiftOpenedAtStr === filters.date ||
            (shift.date && String(shift.date).startsWith(filters.date)) ||
            (shift.openedAt && String(shift.openedAt).startsWith(filters.date)) ||
            (shift.businessDate && String(shift.businessDate).startsWith(filters.date));
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    return filtered.sort((a, b) => {
      const timeA = new Date(a.openedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.openedAt || b.createdAt || 0).getTime();
      return sortBy === "desc" ? timeB - timeA : timeA - timeB;
    });
  }, [mappedShifts, filters, sortBy, openBusinessDay]);

  const totalPages = Math.ceil(filteredAndSortedShifts.length / pageSize) || 1;

  const paginatedShifts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedShifts.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedShifts, currentPage, pageSize]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  }, []);

  const stats = useMemo(() => {
    const total = mappedShifts.length;
    const openCount = mappedShifts.filter((s) => s.status === "open").length;
    const closedCount = mappedShifts.filter((s) => s.status === "closed").length;

    return [
      {
        id: "total",
        title: "Total Shifts",
        value: total,
        colorVariant: "primary",
      },
      {
        id: "open",
        title: "Open Shifts",
        value: openCount,
        colorVariant: "success",
      },
      {
        id: "closed",
        title: "Closed Shifts",
        value: closedCount,
        colorVariant: "neutral",
      },
    ];
  }, [mappedShifts]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.search) {
      chips.push({ key: "search", label: `Search: ${filters.search}` });
    }
    if (filters.date) {
      chips.push({ key: "date", label: `Date: ${filters.date}` });
    }
    if (filters.status !== "all") {
      chips.push({
        key: "status",
        label:
          statusOptions.find((o) => o.value === filters.status)?.label ||
          filters.status,
      });
    }
    return chips;
  }, [filters]);

  const handleFilterChange = useCallback((eventOrValue) => {
    setCurrentPage(1);
    if (eventOrValue?.target) {
      const { name, value } = eventOrValue.target;
      if (name === "date") setDateUserSelected(true);
      setFilters((prev) => ({ ...prev, [name]: value }));
      return;
    }
    if (eventOrValue?.date !== undefined) {
      setDateUserSelected(true);
    }
    setFilters((prev) => ({ ...prev, ...eventOrValue }));
  }, []);

  const handleSearchChange = useCallback((value) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, search: value ?? "" }));
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setCurrentPage(1);
    if (key === "date") setDateUserSelected(false);
    setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setCurrentPage(1);
    setDateUserSelected(false);
    setFilters(initialFilters);
  }, []);

  const handleRefresh = useCallback(() => {
    dispatch(clearShiftError());
    dispatch(clearShiftMessage());
    fetchShiftsData();
  }, [dispatch, fetchShiftsData]);

  const pageProps = {
    shifts: filteredAndSortedShifts,
    paginatedShifts,
    allShifts: mappedShifts,
    stats,

    filters,
    sortBy,
    onSortChange: (val) => {
      setSortBy(val);
      setCurrentPage(1);
    },
    viewMode,
    onViewModeChange: setViewMode,

    currentPage,
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,

    activeFilterChips,
    statusOptions,

    isLoading,
    hasError,
    error,
    message,

    totalShifts: mappedShifts.length,
    filteredShiftsCount: filteredAndSortedShifts.length,
    hasShifts: mappedShifts.length > 0,
    hasFilteredShifts: filteredAndSortedShifts.length > 0,

    handleFilterChange,
    handleSearchChange,
    handleRemoveFilter,
    handleClearFilters,
    handleRefresh,
    clearMessage: () => dispatch(clearShiftMessage()),

    // Dialog state handlers
    openBusinessDay,
    isCreateOpen,
    setIsCreateOpen,
    viewShift,
    setViewShift,
    closeShift,
    setCloseShift,
    isCloseBusinessDayOpen,
    setIsCloseBusinessDayOpen,
  };

  return isMobile ? (
    <ShiftsMobilePage {...pageProps} />
  ) : (
    <ShiftsDesktopPage {...pageProps} />
  );
};

export default ShiftsPage;

