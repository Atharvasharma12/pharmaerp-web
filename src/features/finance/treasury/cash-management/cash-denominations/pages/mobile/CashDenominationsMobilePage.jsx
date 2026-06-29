import React, { useState } from "react";
import { FiSearch, FiPlus, FiEye, FiSliders, FiClock, FiInbox } from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppTablePagination,
  AppText,
} from "@/components";
import { formatDate } from "@/utils";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const CashDenominationsMobilePage = ({
  denominations = [],
  filters,
  cashAccountOptions = [],
  branchOptions = [],
  currentPage,
  pageSize,
  totalItems,
  isLoading = false,
  error,
  message,
  clearFeedback,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleCreateNew,
  handleViewDetails,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const showPagination = denominations.length > 0;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-success-soft text-success border border-success/20";
      case "CANCELLED":
        return "bg-danger-soft text-danger border border-danger/20";
      default:
        return "bg-warning-soft text-warning border border-warning/20";
    }
  };

  const getRegisterName = (d) => {
    return d.cashAccountId?.accountName || "Unknown Register";
  };

  const getBranchName = (d) => {
    return d.branchId?.name || d.cashAccountId?.branchId?.name || "Central Office";
  };

  return (
    <section className="w-full bg-bg pb-20">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Physical Counts
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Verify drawer physical balances
              </AppText>
            </AppBox>

            <AppStack direction="row" gap={0.8} align="center">
              <AppIconButton
                icon={<FiSliders />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={() => setShowFilters(!showFilters)}
                sx={actionHeaderIconBtnSx}
              />
              <AppIconButton
                icon={<FiPlus />}
                variant="contained"
                colorVariant="primary"
                size="small"
                rounded="md"
                onClick={handleCreateNew}
                sx={actionHeaderIconBtnSx}
              />
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Feedback Alert */}
        {(error || message) && (
          <div
            className={`mx-2 mb-3 p-3 text-[11px] font-semibold rounded-md flex justify-between items-center ${
              error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
            }`}
          >
            <span className="flex-1">{error || message}</span>
            <button
              onClick={clearFeedback}
              className={`font-bold hover:underline ml-2 ${error ? "text-danger" : "text-success"}`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Collapse Filters */}
        <div className="px-2 mb-3 space-y-2">
          <AppInput
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search counts, notes..."
            startIcon={<FiSearch />}
            size="small"
          />

          {showFilters && (
            <div className="p-3 bg-surface rounded-md border border-border space-y-2">
              <AppSelect
                label="Cash Register"
                name="cashAccountId"
                value={filters.cashAccountId}
                onChange={(e) => handleFilterChange("cashAccountId", e.target.value)}
                options={cashAccountOptions}
                size="small"
              />

              <AppSelect
                label="Linked Branch"
                name="branchId"
                value={filters.branchId}
                onChange={(e) => handleFilterChange("branchId", e.target.value)}
                options={branchOptions}
                size="small"
              />

              <AppSelect
                label="Status"
                name="status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={statusFilterOptions}
                size="small"
              />
            </div>
          )}
        </div>

        {/* Cards list */}
        <div className="px-2 space-y-2.5">
          {isLoading ? (
            <div className="py-12 text-center text-text-muted font-bold text-[12px]">
              Loading cash counts...
            </div>
          ) : denominations.length === 0 ? (
            <div className="py-12 text-center bg-surface rounded-md border border-border">
              <FiInbox className="mx-auto text-[32px] text-text-muted/30 mb-2" />
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}>
                No Counts Recorded
              </AppText>
            </div>
          ) : (
            denominations.map((d) => {
              const varianceVal = d.variance || 0;
              const isShort = varianceVal < 0;
              const isExcess = varianceVal > 0;

              return (
                <AppCard
                  key={d._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  sx={countCardSx}
                >
                  <div className="p-3 border-b border-border bg-surface-alt/10 flex justify-between items-center">
                    <span className="text-[11.5px] font-black font-mono text-text">
                      {d.countNumber}
                    </span>
                    <span className="text-[10px] text-text-muted font-semibold font-mono">
                      {getBranchName(d)}
                    </span>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-[12px] text-text block font-bold">
                          {getRegisterName(d)}
                        </strong>
                        <span className="text-[9.5px] text-text-muted block mt-0.5 font-mono">
                          Date: {formatDate(d.countDate)}
                        </span>
                      </div>
                      <div className="text-right">
                        <strong className="text-[12.5px] text-text font-black block">
                          ₹{Number(d.physicalTotal || 0).toLocaleString("en-IN")}
                        </strong>
                        <span className={`text-[9.5px] font-bold block mt-0.5 ${
                          isShort ? "text-danger" : isExcess ? "text-success" : "text-text-muted"
                        }`}>
                          Var: {isExcess ? "+" : ""}₹{Number(varianceVal).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-border/50 pt-2.5 mt-1">
                      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase ${getStatusBadgeClass(d.status)}`}>
                        {d.status}
                      </span>

                      <AppIconButton
                        icon={<FiEye />}
                        variant="outlined"
                        colorVariant="primary"
                        size="small"
                        onClick={() => handleViewDetails(d._id)}
                        title="View Details"
                        sx={cardIconButtonSx}
                      />
                    </div>
                  </div>
                </AppCard>
              );
            })
          )}
        </div>

        {/* Mobile Pagination */}
        {showPagination && (
          <div className="px-2 py-4">
            <AppTablePagination
              page={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </AppBox>
    </section>
  );
};

// Layout variables
const containerSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 430, sm: 460 },
  mx: "auto",
  px: 0.5,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1.5,
  pb: 1.5,
  px: 0.5,
};

const pageTitleSx = {
  m: 0,
  fontSize: "18.5px",
  lineHeight: 1.15,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const pageSubtitleSx = {
  mt: 0.2,
  fontSize: "11px",
  lineHeight: "15px",
  color: "var(--app-color-text-muted)",
};

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const countCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  overflow: "hidden",
};

const cardIconButtonSx = {
  height: 24,
  width: 24,
  minWidth: 24,
  p: 0,
  "& svg": { fontSize: "12px" },
};

export default CashDenominationsMobilePage;
