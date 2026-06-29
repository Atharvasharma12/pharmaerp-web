import React, { useMemo } from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiSlash,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppTablePagination,
  AppText,
  AppIconButton,
  PageHeader,
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

const FundTransfersDesktopPage = ({
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
  // Aggregate stats
  const stats = useMemo(() => {
    let totalAmt = 0;
    let drafts = 0;
    let posted = 0;

    fundTransfers.forEach((t) => {
      if (t.status === "POSTED") {
        totalAmt += t.amount || 0;
        posted++;
      } else if (t.status === "DRAFT") {
        drafts++;
      }
    });

    return { totalAmt, drafts, posted, count: totalTransfers };
  }, [fundTransfers, totalTransfers]);

  const showPagination = fundTransfers.length > 0;

  const getTransferTypeLabel = (type) => {
    switch (type) {
      case "BANK_TO_BANK":
        return "Bank to Bank";
      case "CASH_TO_BANK":
        return "Cash to Bank (Deposit)";
      case "BANK_TO_CASH":
        return "Bank to Cash (Withdrawal)";
      case "CASH_TO_CASH":
        return "Cash to Cash";
      default:
        return type;
    }
  };

  const getSourceAccountName = (t) => {
    if (t.fromAccountType === "BANK") {
      return t.fromBankAccountId?.accountName || t.fromBankAccountId?.bankName || "Bank Account";
    }
    return t.fromCashAccountId?.accountName || "Cash Account";
  };

  const getDestAccountName = (t) => {
    if (t.toAccountType === "BANK") {
      return t.toBankAccountId?.accountName || t.toBankAccountId?.bankName || "Bank Account";
    }
    return t.toCashAccountId?.accountName || "Cash Account";
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
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Fund Transfers"
          subtitle="Record and monitor multi-mode internal cash/bank liquid balance transfers."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard" },
                  { label: "Finance & Accounting" },
                  { label: "Treasury" },
                  { label: "Fund Transfers", current: true },
                ]}
                sx={breadcrumbSx}
                itemSx={breadcrumbItemSx}
                currentItemSx={breadcrumbCurrentSx}
              />
              <AppButton
                variant="contained"
                colorVariant="primary"
                size="small"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleCreateNew}
              >
                New Transfer
              </AppButton>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Stats Grid */}
        <div className="mt-5 grid grid-cols-3 gap-4">
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Transfers Count</span>
                <span className="text-[20px] font-extrabold text-text mt-1 block">{stats.count}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-alt text-text flex items-center justify-center border border-border">
                <FiClock className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Posted Volume</span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] mt-1 block">
                  ₹ {Number(stats.totalAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                <FiTrendingUp className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Draft Items</span>
                <span className="text-[20px] font-extrabold text-warning mt-1 block">{stats.drafts}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-warning-soft text-warning flex items-center justify-center border border-warning/20">
                <FiCheckCircle className="text-[18px]" />
              </div>
            </div>
          </AppCard>
        </div>

        {/* Feedback alerts */}
        {(error || message) && (
          <div
            className={`mt-4 p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
              error ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
            }`}
          >
            <span>{error || message}</span>
            <button
              onClick={clearFeedback}
              className={`font-bold hover:underline ${error ? "text-danger" : "text-success"}`}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Table & Filters Card */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={mainCardSx}
        >
          {/* Filters Toolbar */}
          <div className="p-4 border-b border-border bg-surface-hover/20 flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <AppInput
                label="Search Transfers"
                name="search"
                value={searchParams.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search ref, description..."
                startIcon={<FiSearch />}
                size="small"
                fullWidth={false}
                formControlSx={{ width: 260 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />

              <AppSelect
                label="Transfer Type"
                name="transferType"
                value={searchParams.transferType}
                onChange={(e) => handleFilterChange("transferType", e.target.value)}
                options={transferTypeOptions}
                size="small"
                variant="bordered"
                rounded="md"
                fullWidth={false}
                formControlSx={{ width: 180 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
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
                fullWidth={false}
                formControlSx={{ width: 140 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText variant="body1" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                  Retrieving transfers history...
                </AppText>
              </div>
            ) : fundTransfers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiClock className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Fund Transfers Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  There are no internal transfers recorded for this company.
                </AppText>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/10 text-text-muted font-bold">
                    <th className="py-3 px-4 font-bold">Transfer Number</th>
                    <th className="py-3 px-4 font-bold">Transfer Date</th>
                    <th className="py-3 px-4 font-bold">Transfer Type</th>
                    <th className="py-3 px-4 font-bold">Source Account</th>
                    <th className="py-3 px-4 font-bold">Destination Account</th>
                    <th className="py-3 px-4 text-right font-bold">Amount</th>
                    <th className="py-3 px-4 text-center font-bold">Status</th>
                    <th className="py-3 px-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fundTransfers.map((t) => {
                    const isCancelled = t.status === "CANCELLED";

                    return (
                      <tr
                        key={t._id}
                        className="border-b border-border hover:bg-surface-hover/20 transition"
                      >
                        <td className="py-3.5 px-4 font-bold text-text font-mono">
                          {t.transferNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text">
                          {formatDate(t.transferDate)}
                        </td>
                        <td className="py-3.5 px-4 text-text-muted font-semibold">
                          {getTransferTypeLabel(t.transferType)}
                        </td>
                        <td className="py-3.5 px-4 text-text">
                          {getSourceAccountName(t)}
                        </td>
                        <td className="py-3.5 px-4 text-text">
                          {getDestAccountName(t)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-text">
                          ₹ {Number(t.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusBadgeClass(t.status)}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <AppStack direction="row" gap={1} justify="center" align="center">
                            <AppIconButton
                              icon={<FiEye />}
                              variant="outlined"
                              colorVariant="primary"
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
                          </AppStack>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Footer */}
          {showPagination && (
            <AppBox sx={paginationFooterWrapperSx}>
              <AppTablePagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={totalTransfers}
                onPageChange={handlePageChange}
              />
            </AppBox>
          )}
        </AppCard>
      </div>
    </section>
  );
};

// Styling variables
const breadcrumbSx = { mt: 0 };
const breadcrumbItemSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  cursor: "pointer",
  "&:hover": { color: "var(--app-color-primary)" },
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const pageHeaderSx = { width: "100%" };
const pageHeaderContentSx = {
  minWidth: 0,
  "& h1, & h2, & h3, & h4": {
    m: 0,
    fontSize: "23px",
    lineHeight: 1.15,
    letterSpacing: "-0.4px",
    color: "var(--app-color-text)",
  },
};

const statCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const mainCardSx = {
  mt: 5,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

const filterLabelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const paginationFooterWrapperSx = {
  px: 2,
  pt: 2,
  pb: 2,
  borderTop: "1px solid var(--app-color-divider)",
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": { width: "100%" },
};

export default FundTransfersDesktopPage;
