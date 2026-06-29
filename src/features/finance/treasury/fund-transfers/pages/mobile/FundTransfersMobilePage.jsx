import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiPlus,
  FiEye,
  FiSlash,
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

const transferTypeOptions = [
  { label: "All Transfer Types", value: "all" },
  { label: "Bank to Bank", value: "BANK_TO_BANK" },
  { label: "Cash to Bank", value: "CASH_TO_BANK" },
  { label: "Bank to Cash", value: "BANK_TO_CASH" },
  { label: "Cash to Cash", value: "CASH_TO_CASH" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Posted", value: "POSTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const FundTransfersMobilePage = ({
  fundTransfers = [],
  searchParams,
  currentPage,
  pageSize,
  totalTransfers,
  isLoading = false,
  isCancelling = false,
  error,
  message,
  clearFeedback,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleCancelTransfer,
  handleViewDetails,
  handleCreateNew,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const shouldRenderPagination = fundTransfers.length > 0;

  const getSourceAccountName = (t) => {
    if (t.fromAccountType === "BANK") {
      return t.fromBankAccountId?.accountName || t.fromBankAccountId?.bankName || "Bank";
    }
    return t.fromCashAccountId?.accountName || "Cash";
  };

  const getDestAccountName = (t) => {
    if (t.toAccountType === "BANK") {
      return t.toBankAccountId?.accountName || t.toBankAccountId?.bankName || "Bank";
    }
    return t.toCashAccountId?.accountName || "Cash";
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "POSTED":
        return "bg-success-soft text-success border border-success/20";
      case "CANCELLED":
        return "bg-danger-soft text-danger border border-danger/20";
      default:
        return "bg-warning-soft text-warning border border-warning/20";
    }
  };

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between">
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Fund Transfers
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Manage cash & bank internal balance transfers
              </AppText>
            </AppBox>
            <AppButton
              variant="contained"
              colorVariant="primary"
              size="small"
              rounded="md"
              startIcon={<FiPlus />}
              onClick={handleCreateNew}
              sx={createNewBtnSx}
            >
              New
            </AppButton>
          </AppStack>
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
                placeholder="Search reference/notes..."
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
                  label="Transfer Type"
                  name="transferType"
                  value={searchParams.transferType}
                  onChange={(e) => handleFilterChange("transferType", e.target.value)}
                  options={transferTypeOptions}
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
                Querying transfers list...
              </AppText>
            </div>
          ) : fundTransfers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiClock className="text-[40px] text-text-muted/40 mb-2" />
              <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                No Transfers Found
              </AppHeading>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                There are no matches for your query parameters.
              </AppText>
            </div>
          ) : (
            fundTransfers.map((t) => {
              const isCancelled = t.status === "CANCELLED";

              return (
                <AppCard
                  key={t._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  sx={transferCardSx}
                >
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-text-muted font-bold block tracking-wider font-mono">
                          {t.transferNumber}
                        </span>
                        <span className="text-[10.5px] text-text-muted block mt-0.5">
                          {formatDate(t.transferDate)}
                        </span>
                      </div>
                      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8.5px] font-bold uppercase ${getStatusBadgeClass(t.status)}`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="text-[12.5px] font-semibold text-text">
                      <span className="text-text-muted font-normal mr-1">From:</span>
                      {getSourceAccountName(t)}
                      <span className="text-text-muted font-normal mx-1">→ To:</span>
                      {getDestAccountName(t)}
                    </div>

                    <div className="border-t border-border/50 pt-2 flex items-center justify-between text-[11px] text-text-muted">
                      <div>
                        <span>Amount:</span>
                        <strong className="text-text font-black ml-1 text-[12px]">
                          ₹{Number(t.amount || 0).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    {/* Touch Action Controls */}
                    <div className="border-t border-border/50 pt-2 flex gap-2 justify-end">
                      <AppIconButton
                        icon={<FiEye />}
                        variant="outlined"
                        colorVariant="neutral"
                        size="small"
                        onClick={() => handleViewDetails(t._id)}
                        title="View Details"
                      />
                      {!isCancelled && (
                        <AppButton
                          size="tiny"
                          variant="text"
                          colorVariant="error"
                          startIcon={<FiSlash />}
                          onClick={() => {
                            const reason = prompt("Enter cancellation reason:");
                            if (reason !== null) {
                              handleCancelTransfer(t._id, reason);
                            }
                          }}
                          disabled={isCancelling}
                        >
                          Cancel
                        </AppButton>
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
                totalItems={totalTransfers}
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

const createNewBtnSx = {
  height: 30,
  fontSize: "11.5px",
  fontWeight: 700,
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

const transferCardSx = {
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

export default FundTransfersMobilePage;
