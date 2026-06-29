import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
  FiRefreshCw,
  FiEye,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
  AppTablePagination,
  AppButton,
  AppIconButton,
} from "@/components";
import { formatDate } from "@/utils";

const balanceTypeOptions = [
  { label: "All Balance Types", value: "all" },
  { label: "Debit Balances (DR)", value: "dr" },
  { label: "Credit Balances (CR)", value: "cr" },
];

const AccountBalancesMobilePage = ({
  accountBalances = [],
  searchParams,
  currentPage,
  pageSize,
  totalBalances,
  isLoading = false,
  isRecalculating = false,
  error,
  message,
  clearFeedback,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleRecalculate,
  handleViewDetails,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const shouldRenderPagination = accountBalances.length > 0;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppBox sx={{ minWidth: 0, flex: 1 }}>
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              Account Balances
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              Audit aggregate chart of account balances
            </AppText>
          </AppBox>
        </AppBox>

        {/* Feedback alerts */}
        {(error || message) && (
          <div
            className={`mx-2 mb-3 p-3 text-[11.5px] font-semibold rounded-md flex justify-between items-center ${
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

        {/* Filters Toolbar */}
        <div className="px-2 mb-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <AppInput
                name="search"
                value={searchParams.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search account name..."
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
                  label="Balance Type"
                  name="balanceType"
                  value={searchParams.balanceType}
                  onChange={(e) => handleFilterChange("balanceType", e.target.value)}
                  options={balanceTypeOptions}
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
                Querying account balances...
              </AppText>
            </div>
          ) : accountBalances.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiBookOpen className="text-[40px] text-text-muted/40 mb-2" />
              <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                No Balances Found
              </AppHeading>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                There are no balances matching your criteria.
              </AppText>
            </div>
          ) : (
            accountBalances.map((b) => {
              const accName = b.accountId?.accountName || "Unknown Account";
              const accCode = b.accountId?.accountCode || "-";

              return (
                <AppCard
                  key={b._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  sx={balanceCardSx}
                >
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-text-muted font-bold block tracking-wider font-mono">
                          {accCode}
                        </span>
                        <span className="font-extrabold text-text text-[12.5px] mt-0.5 block">
                          {accName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9.5px] text-text-muted font-normal block">Balance</span>
                        <strong className="text-text font-extrabold text-[12px]">
                          ₹{Number(b.balance || 0).toLocaleString("en-IN")}
                          <span className="text-[8.5px] text-text-muted font-black ml-0.5 uppercase">
                            {b.balanceType}
                          </span>
                        </strong>
                      </div>
                    </div>

                    <div className="border-t border-border/50 pt-2 flex items-center justify-between text-[11px] text-text-muted">
                      <div>
                        <span>Debits: ₹{Number(b.debitTotal || 0).toLocaleString("en-IN")}</span>
                        <span className="mx-1">|</span>
                        <span>Credits: ₹{Number(b.creditTotal || 0).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    {/* Touch Action Controls */}
                    <div className="border-t border-border/50 pt-2 flex gap-2 justify-end">
                      <AppIconButton
                        icon={<FiEye />}
                        variant="outlined"
                        colorVariant="neutral"
                        size="small"
                        onClick={() => handleViewDetails(b.accountId?._id || b.accountId)}
                        title="View Details"
                      />
                      <AppButton
                        size="tiny"
                        variant="text"
                        colorVariant="neutral"
                        startIcon={<FiRefreshCw />}
                        onClick={() => handleRecalculate(b.accountId?._id || b.accountId)}
                        disabled={isRecalculating}
                      >
                        Recalculate
                      </AppButton>
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
                totalItems={totalBalances}
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
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const balanceCardSx = {
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

export default AccountBalancesMobilePage;
