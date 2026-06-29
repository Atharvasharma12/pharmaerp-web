import React, { useState } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
  AppTablePagination,
  AppButton,
} from "@/components";
import { formatDate } from "@/utils";

const typeOptions = [
  { label: "All Types", value: "all" },
  { label: "Financial Year", value: "YEAR" },
  { label: "Quarterly Period", value: "QUARTER" },
  { label: "Monthly Period", value: "MONTH" },
  { label: "Adjustment Period", value: "ADJUSTMENT" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Open Period", value: "OPEN" },
  { label: "Closed Period", value: "CLOSED" },
  { label: "Locked Period", value: "LOCKED" },
];

const FinancialPeriodsMobilePage = ({
  financialPeriods = [],
  searchParams,
  currentPage,
  pageSize,
  totalPeriods,
  isLoading = false,
  isUpdating = false,
  error,
  clearError,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleUpdateStatus,
  handleCreate,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "OPEN") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CLOSED") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "LOCKED") bg = "bg-[#f1f3f5] text-[#868e96] border-[#e9ecef]";

    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const shouldRenderPagination = financialPeriods.length > 0;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Financial Periods
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Define and manage fiscal calendar bounds
              </AppText>
            </AppBox>

            <AppIconButton
              icon={<FiPlus />}
              variant="filled"
              colorVariant="primary"
              size="small"
              rounded="md"
              onClick={handleCreate}
              disabled={isLoading}
              sx={actionHeaderIconBtnSx}
            />
          </AppStack>
        </AppBox>

        {/* Action errors */}
        {error && (
          <div className="mx-2 mb-3 p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md flex justify-between items-center">
            <span className="flex-1">{error}</span>
            <button
              onClick={clearError}
              className="text-danger font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filters Toolbar */}
        <div className="px-2 mb-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <AppInput
                name="search"
                value={searchParams.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search period code..."
                startIcon={<FiSearch />}
                size="small"
                inputSx={compactFilterInputSx}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 border rounded-md flex items-center gap-1.5 text-[11.5px] font-bold transition ${
                showFilters
                  ? "bg-primary-soft border-primary/40 text-primary"
                  : "bg-surface border-border text-text"
              }`}
            >
              <FiFilter />
              <span>Filters</span>
              {showFilters ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          </div>

          {/* Collapsible Panel */}
          {showFilters && (
            <AppCard
              variant="default"
              rounded="md"
              bordered
              shadow="none"
              padding="none"
              sx={filterCardSx}
            >
              <div className="p-3.5 space-y-3.5">
                <AppSelect
                  label="Period Type"
                  name="periodType"
                  value={searchParams.periodType}
                  onChange={(e) => handleFilterChange("periodType", e.target.value)}
                  options={typeOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />

                <AppSelect
                  label="Status"
                  name="status"
                  value={searchParams.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  options={statusOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />
              </div>
            </AppCard>
          )}
        </div>

        {/* Content list */}
        <div className="px-2 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                Querying fiscal periods...
              </AppText>
            </div>
          ) : financialPeriods.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiCalendar className="text-[40px] text-text-muted/40 mb-2" />
              <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                No Periods Found
              </AppHeading>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                Initialize new calendar slots from desktop.
              </AppText>
            </div>
          ) : (
            financialPeriods.map((p) => {
              const isOpen = p.status === "OPEN";
              const isClosed = p.status === "CLOSED";
              const isLocked = p.status === "LOCKED";

              return (
                <AppCard
                  key={p._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  sx={periodCardSx}
                >
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-text font-mono text-[12.5px]">
                        {p.periodCode}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {p.isCurrent && (
                          <span className="inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-black bg-[#ebfbee] text-[#2b8a3e] border border-[#c3fae8]">
                            ACTIVE
                          </span>
                        )}
                        {getStatusBadge(p.status)}
                      </div>
                    </div>

                    <div className="text-[11.5px] leading-relaxed text-text-muted">
                      <div>
                        <strong>Type:</strong> {p.periodType}
                      </div>
                      <div className="mt-0.5">
                        <strong>Duration:</strong> {formatDate(p.startDate)} - {formatDate(p.endDate)}
                      </div>
                    </div>

                    {/* Touch Action Controls */}
                    <div className="border-t border-border/50 pt-2 flex gap-2 justify-end">
                      {isOpen && (
                        <AppButton
                          size="tiny"
                          variant="outlined"
                          colorVariant="warning"
                          onClick={() => handleUpdateStatus(p._id, "CLOSED")}
                          disabled={isUpdating}
                        >
                          Close Period
                        </AppButton>
                      )}

                      {isClosed && (
                        <>
                          <AppButton
                            size="tiny"
                            variant="outlined"
                            colorVariant="danger"
                            onClick={() => handleUpdateStatus(p._id, "LOCKED")}
                            disabled={isUpdating}
                          >
                            Lock
                          </AppButton>
                          <AppButton
                            size="tiny"
                            variant="outlined"
                            colorVariant="neutral"
                            onClick={() => handleUpdateStatus(p._id, "OPEN")}
                            disabled={isUpdating}
                          >
                            Reopen
                          </AppButton>
                        </>
                      )}
                    </div>
                  </div>
                </AppCard>
              );
            })
          )}

          {/* Conditional Pagination Footer */}
          {shouldRenderPagination && (
            <AppBox sx={paginationFooterWrapperSx}>
              <AppTablePagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={totalPeriods}
                onPageChange={handlePageChange}
              />
            </AppBox>
          )}
        </div>
      </AppBox>
    </section>
  );
};

// MUI style configurations
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
  pb: 1,
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
  bgcolor: "var(--app-color-primary)",
  color: "white",
  "&:hover": { bgcolor: "var(--app-color-primary-hover)" },
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const filterCardSx = {
  mt: 1.5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const labelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  mb: 0.5,
};

const periodCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const paginationFooterWrapperSx = {
  pt: 2,
  pb: 2,
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": { width: "100%" },
};

export default FinancialPeriodsMobilePage;
