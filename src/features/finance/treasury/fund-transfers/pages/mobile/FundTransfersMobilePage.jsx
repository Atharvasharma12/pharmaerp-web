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
  FiMoreVertical,
  FiRefreshCw,
} from "react-icons/fi";
import { LuWallet } from "react-icons/lu";

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
  AppMenu,
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
  handleRefresh,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const hasFilteredTransfers = fundTransfers.length > 0;
  const shouldRenderPagination = hasFilteredTransfers && totalTransfers > pageSize;

  const getSourceAccountName = (t) => {
    if (t.fromAccountType === "BANK") {
      return t.fromBankAccountId?.accountName || t.fromBankAccountId?.bankName || "Bank";
    }
    return "Branch Cash";
  };

  const getDestAccountName = (t) => {
    if (t.toAccountType === "BANK") {
      return t.toBankAccountId?.accountName || t.toBankAccountId?.bankName || "Bank";
    }
    return "Branch Cash";
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

  const getTransferTypeLabel = (type) => {
    switch (type) {
      case "BANK_TO_BANK":
        return "Bank to Bank";
      case "CASH_TO_BANK":
        return "Cash to Bank";
      case "BANK_TO_CASH":
        return "Bank to Cash";
      case "CASH_TO_CASH":
        return "Cash to Cash";
      default:
        return type;
    }
  };

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between">
            <AppBox sx={{ minWidth: 0, flex: 1, pr: 1.5 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Fund Transfers
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Manage cash & bank internal balance transfers
              </AppText>
            </AppBox>
            <AppStack direction="row" gap={1} align="center" sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
              <AppIconButton
                icon={<FiRefreshCw className={isLoading ? "animate-spin" : ""} />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleRefresh}
                disabled={isLoading}
                sx={refreshMobileBtnSx}
              />
              <AppIconButton
                icon={<FiPlus />}
                variant="filled"
                colorVariant="success"
                size="small"
                rounded="md"
                onClick={handleCreateNew}
                sx={createNewBtnSx}
              />
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Feedback alerts */}
        {(error || message) && (
          <div
            className={`mx-0 mb-3 p-3 text-[11.5px] font-semibold rounded-md flex justify-between items-center ${
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

        {/* Search & Filters Toolbar */}
        <div className="px-0 mb-3 flex gap-2">
          <AppInput
            name="search"
            value={searchParams.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search transfers..."
            startIcon={<FiSearch />}
            size="small"
            inputSx={searchMobileInputSx}
            sx={{ flex: 1 }}
          />

          <AppButton
            variant="outlined"
            colorVariant="neutral"
            size="medium"
            rounded="md"
            startIcon={<FiFilter />}
            onClick={() => setShowFilters(!showFilters)}
            sx={filterBtnSx}
          >
            Filter
          </AppButton>
        </div>

        {/* Collapsible Filters Panel */}
        {showFilters && (
          <div className="px-0 mb-3">
            <AppCard
              variant="default"
              rounded="lg"
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
          </div>
        )}

        {/* Content List */}
        <div className="px-0 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                Querying transfers list...
              </AppText>
            </div>
          ) : fundTransfers.length === 0 ? (
            <AppCard variant="default" rounded="lg" bordered padding="md" sx={emptyCardSx}>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FiClock className="text-[40px] text-text-muted/40 mb-2" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                  No Transfers Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  There are no matches for your query parameters.
                </AppText>
              </div>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1.2}>
              {fundTransfers.map((t) => {
                const isCancelled = t.status === "CANCELLED";

                return (
                  <AppCard
                    key={t._id}
                    variant="default"
                    rounded="lg"
                    bordered
                    shadow="sm"
                    padding="none"
                    sx={transferCardSx}
                  >
                    <AppStack direction="row" align="center" gap={1.5} justify="space-between" sx={{ width: "100%", p: 1.5 }}>
                      {/* Left Side Clickable Details Block */}
                      <AppStack
                        direction="row"
                        align="center"
                        gap={1.5}
                        sx={{ minWidth: 0, flex: 1, cursor: "pointer" }}
                        onClick={() => handleViewDetails(t._id)}
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center text-primary shrink-0 shadow-sm border border-primary/10">
                          <LuWallet className="text-[20px]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <AppHeading level={3} weight={700} sx={transferTitleSx}>
                              {t.transferNumber}
                            </AppHeading>
                            <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-bold uppercase ${getStatusBadgeClass(t.status)}`}>
                              {t.status}
                            </span>
                          </div>
                          <AppText variant="body2" sx={descriptionTextSx}>
                            {formatDate(t.transferDate)} • {getTransferTypeLabel(t.transferType)}
                          </AppText>
                        </div>
                      </AppStack>

                      {/* Right Side Stack */}
                      <AppStack direction="row" align="center" gap={1} sx={{ flexShrink: 0 }}>
                        <AppStack
                          direction="column"
                          align="flex-end"
                          gap={0.5}
                          sx={rightMetadataStackSx}
                        >
                          <span className="text-[9.5px] text-text-muted block">Amount</span>
                          <span className="text-[12.5px] font-extrabold text-text block mt-0.5">
                            ₹{Number(t.amount || 0).toLocaleString("en-IN")}
                          </span>
                        </AppStack>

                        {/* Action Menu Dropdown */}
                        <AppMenu
                          triggerIcon={<FiMoreVertical />}
                          items={[
                            {
                              label: "View Details",
                              icon: <FiEye />,
                              onClick: (e) => {
                                e.stopPropagation();
                                handleViewDetails(t._id);
                              },
                            },
                            !isCancelled && {
                              label: "Cancel Transfer",
                              icon: <FiSlash />,
                              danger: true,
                              onClick: (e) => {
                                e.stopPropagation();
                                const reason = prompt("Enter cancellation reason:");
                                if (reason !== null) {
                                  handleCancelTransfer(t._id, reason);
                                }
                              },
                            },
                          ].filter(Boolean)}
                          triggerProps={{
                            size: "small",
                            sx: {
                              color: "var(--app-color-text-muted)",
                              backgroundColor: "transparent",
                              border: "none",
                              p: 0.5,
                              minWidth: 0,
                              "&:hover": {
                                backgroundColor: "var(--app-color-surface-hover, #f1f5f9)",
                              },
                            },
                          }}
                        />
                      </AppStack>
                    </AppStack>

                    {/* Mid segment details */}
                    <div className="px-3.5 pb-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] border-t border-dashed border-border/80 pt-3">
                      <div>
                        <span className="text-text-muted block font-semibold">From Account</span>
                        <span className="font-bold text-text block mt-0.5">
                          {getSourceAccountName(t)}
                        </span>
                      </div>

                      <div>
                        <span className="text-text-muted block font-semibold">To Account</span>
                        <span className="font-bold text-text block mt-0.5">
                          {getDestAccountName(t)}
                        </span>
                      </div>
                    </div>
                  </AppCard>
                );
              })}
            </AppStack>
          )}

          {/* Conditional Pagination Footer */}
          {shouldRenderPagination && (
            <AppBox sx={paginationFooterWrapperSx}>
              <AppTablePagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={totalTransfers}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showPageSize={false}
                showSummary={true}
                showFirstLast={false}
                compact={true}
                size="small"
                align="center"
                rounded="md"
                sx={{
                  width: "100%",
                  justifyContent: "center !important",
                  alignItems: "center",
                  textAlign: "center",
                  "& .MuiPagination-root": {
                    display: "flex !important",
                    justifyContent: "center !important",
                    width: "100%",
                  },
                  "& .MuiPagination-ul": {
                    justifyContent: "center !important",
                    width: "100%",
                  },
                }}
                summarySx={{
                  textAlign: "center",
                  width: "100%",
                  mb: 0.5,
                }}
                paginationSx={{
                  display: "flex !important",
                  justifyContent: "center !important",
                  alignItems: "center",
                  width: "100%",
                  "& .MuiPagination-ul": {
                    justifyContent: "center !important",
                    width: "100%",
                  },
                }}
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
  px: 0,
  pt: 0,
  pb: 0,
};

const headerWrapperSx = {
  pt: 1,
  pb: 1.5,
  px: 0,
};

const pageTitleSx = {
  m: 0,
  fontSize: "21px",
  fontWeight: 800,
  color: "var(--app-color-text)",
  letterSpacing: "-0.5px",
};

const pageSubtitleSx = {
  mt: 0.4,
  fontSize: "11.5px",
  color: "var(--app-color-text-muted)",
};

const createNewBtnSx = {
  height: 36,
  width: 36,
  minWidth: 36,
  p: 0,
};

const refreshMobileBtnSx = {
  height: 36,
  width: 36,
  minWidth: 36,
  p: 0,
};

const searchMobileInputSx = {
  height: 42,
  fontSize: "13px",
  bgcolor: "var(--app-color-surface)",
};

const filterBtnSx = {
  height: 42,
  px: 2,
  fontSize: "13px",
  fontWeight: 650,
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  flexShrink: 0,
};

const filterCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const labelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const transferCardSx = {
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  boxShadow:
    "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
  },
};

const transferTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 160,
};

const descriptionTextSx = {
  mt: 0.25,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const rightMetadataStackSx = {
  pl: 1.5,
  borderLeft:
    "1px solid color-mix(in_srgb, var(--app-color-border) 60%, transparent)",
  minWidth: { xs: 85, sm: 100 },
  maxWidth: { xs: 100, sm: 120 },
  flexShrink: 0,
};

const emptyCardSx = {
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  width: "100%",
};

const paginationFooterWrapperSx = {
  px: 0,
  pt: 2,
  pb: 2,
  borderTop: "1px solid var(--app-color-divider)",
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": {
    width: "100%",
    display: "flex !important",
    justifyContent: "center !important",
    alignItems: "center",
    "& .MuiPagination-ul": {
      justifyContent: "center !important",
    },
    "& .MuiPagination-root": {
      display: "flex !important",
      justifyContent: "center !important",
    },
  },
};

export default FundTransfersMobilePage;
