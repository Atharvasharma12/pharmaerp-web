// src/features/operations/shifts/pages/ShiftsPage.jsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_STATUS } from "@/constants";
import { useIsMobile } from "@/hooks";
import { UI_TOOLBAR_VIEWS } from "@/components/ui";

import { listShifts } from "../store/shiftThunk";
import { clearShiftError, clearShiftMessage } from "../store/shiftSlice";
import useBranch from "@/features/branch/hooks/useBranch";
import { getOpenBusinessDay } from "@/features/operations/business-days/store/businessDayThunk";

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

const ShiftsPage = () => {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const hasFetchedRef = useRef(false);

  const { shifts, listShiftsStatus, error, message } = useSelector(
    (state) => state.shift
  );
  const { currentBranch } = useBranch();
  const { openBusinessDay } = useSelector((state) => state.businessDay);

  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState("desc");
  const [viewMode, setViewMode] = useState(UI_TOOLBAR_VIEWS.GRID);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewShift, setViewShift] = useState(null);
  const [closeShift, setCloseShift] = useState(null);
  const [isCloseBusinessDayOpen, setIsCloseBusinessDayOpen] = useState(false);

  const isLoading = listShiftsStatus === API_STATUS.LOADING;
  const hasError = listShiftsStatus === API_STATUS.ERROR;

  const fetchShiftsData = useCallback(() => {
    const params = {};
    if (currentBranch?._id) params.branchId = currentBranch._id;
    if (filters.date) params.date = filters.date;
    if (filters.status !== "all") params.status = filters.status;
    params.sort = sortBy;
    dispatch(listShifts(params));
  }, [dispatch, currentBranch?._id, filters.date, filters.status, sortBy]);

  useEffect(() => {
    if (currentBranch?._id) {
      dispatch(getOpenBusinessDay(currentBranch._id));
    }
  }, [dispatch, currentBranch?._id]);

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

      const matchesDate =
        !filters.date ||
        (shift.date && shift.date.startsWith(filters.date)) ||
        (shift.openedAt && shift.openedAt.startsWith(filters.date));

      return matchesSearch && matchesStatus && matchesDate;
    });

    return filtered.sort((a, b) => {
      const timeA = new Date(a.openedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.openedAt || b.createdAt || 0).getTime();
      return sortBy === "desc" ? timeB - timeA : timeA - timeB;
    });
  }, [mappedShifts, filters, sortBy]);

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
      setFilters((prev) => ({ ...prev, [name]: value }));
      return;
    }
    setFilters((prev) => ({ ...prev, ...eventOrValue }));
  }, []);

  const handleSearchChange = useCallback((value) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, search: value ?? "" }));
  }, []);

  const handleRemoveFilter = useCallback((key) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setCurrentPage(1);
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
