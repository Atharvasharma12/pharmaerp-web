import React, { useMemo } from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiSlash,
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

const chequeTypeOptions = [
  { label: "All Cheque Types", value: "all" },
  { label: "Received Cheques", value: "RECEIVED" },
  { label: "Issued Cheques", value: "ISSUED" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Deposited", value: "DEPOSITED" },
  { label: "Cleared", value: "CLEARED" },
  { label: "Bounced", value: "BOUNCED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const ChequesDesktopPage = ({
  cheques = [],
  searchParams,
  currentPage,
  pageSize,
  totalCheques,
  isLoading = false,
  error,
  message,
  clearFeedback,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleDeposit,
  handleClear,
  handleBounce,
  handleCancel,
  handleViewDetails,
  handleCreateNew,
}) => {
  // Aggregate stats
  const stats = useMemo(() => {
    let pendingAmt = 0;
    let bouncedCount = 0;

    cheques.forEach((c) => {
      if (c.status === "PENDING" || c.status === "DEPOSITED") {
        pendingAmt += c.amount || 0;
      } else if (c.status === "BOUNCED") {
        bouncedCount++;
      }
    });

    return { pendingAmt, bouncedCount, count: totalCheques };
  }, [cheques, totalCheques]);

  const showPagination = cheques.length > 0;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "CLEARED":
        return "bg-success-soft text-success border border-success/20";
      case "BOUNCED":
        return "bg-danger-soft text-danger border border-danger/20";
      case "CANCELLED":
        return "bg-neutral-soft text-text-muted border border-border";
      case "DEPOSITED":
        return "bg-primary-soft text-primary border border-primary/20";
      default:
        return "bg-warning-soft text-warning border border-warning/20";
    }
  };

  const getBankName = (c) => {
    return c.bankAccountId?.bankName || "Unknown Bank";
  };

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Cheque Management"
          subtitle="Record incoming customer cheques and outgoing vendor cheque payments."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard" },
                  { label: "Finance & Accounting" },
                  { label: "Treasury" },
                  { label: "Cheques", current: true },
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
                New Cheque
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
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Total Cheques</span>
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
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">In Clearance Pipeline</span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] mt-1 block">
                  ₹ {Number(stats.pendingAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">Bounced Items</span>
                <span className="text-[20px] font-extrabold text-danger mt-1 block">{stats.bouncedCount}</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-danger-soft text-danger flex items-center justify-center border border-danger/20">
                <FiAlertTriangle className="text-[18px]" />
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
                label="Search Cheques"
                name="search"
                value={searchParams.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search number, drawer..."
                startIcon={<FiSearch />}
                size="small"
                fullWidth={false}
                formControlSx={{ width: 260 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />

              <AppSelect
                label="Cheque Type"
                name="chequeType"
                value={searchParams.chequeType}
                onChange={(e) => handleFilterChange("chequeType", e.target.value)}
                options={chequeTypeOptions}
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
                  Retrieving cheques ledger...
                </AppText>
              </div>
            ) : cheques.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiClock className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                  No Cheques Found
                </AppHeading>
                <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                  There are no cheque records matching your filter parameters.
                </AppText>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/10 text-text-muted font-bold">
                    <th className="py-3 px-4 font-bold">Cheque Number</th>
                    <th className="py-3 px-4 font-bold">Cheque Date</th>
                    <th className="py-3 px-4 font-bold">Cheque Type</th>
                    <th className="py-3 px-4 font-bold">Drawn Bank Account</th>
                    <th className="py-3 px-4 font-bold">Party / Payee Name</th>
                    <th className="py-3 px-4 text-right font-bold">Amount</th>
                    <th className="py-3 px-4 text-center font-bold">Status</th>
                    <th className="py-3 px-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cheques.map((c) => {
                    const isReceived = c.chequeType === "RECEIVED";
                    const isPending = c.status === "PENDING";
                    const isDeposited = c.status === "DEPOSITED";
                    const isCleared = c.status === "CLEARED";
                    const isBounced = c.status === "BOUNCED";
                    const isCancelled = c.status === "CANCELLED";

                    return (
                      <tr
                        key={c._id}
                        className="border-b border-border hover:bg-surface-hover/20 transition"
                      >
                        <td className="py-3.5 px-4 font-bold text-text font-mono">
                          {c.chequeNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text">
                          {formatDate(c.chequeDate)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isReceived
                              ? "bg-primary-soft text-primary border border-primary/20"
                              : "bg-purple-soft text-purple border border-purple/20"
                          }`}>
                            {c.chequeType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-text">
                          {getBankName(c)}
                        </td>
                        <td className="py-3.5 px-4 text-text font-semibold">
                          {c.partyName}
                        </td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-text">
                          ₹ {Number(c.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusBadgeClass(c.status)}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <AppStack direction="row" gap={1} justify="center" align="center">
                            <AppIconButton
                              icon={<FiEye />}
                              variant="outlined"
                              colorVariant="primary"
                              size="small"
                              onClick={() => handleViewDetails(c._id)}
                              title="Details"
                            />

                            {/* received + pending -> deposit */}
                            {isReceived && isPending && (
                              <AppButton
                                size="tiny"
                                variant="text"
                                colorVariant="primary"
                                onClick={() => handleDeposit(c._id)}
                              >
                                Deposit
                              </AppButton>
                            )}

                            {/* deposited (received) or pending (issued) -> clear & bounce */}
                            {((isReceived && isDeposited) || (!isReceived && isPending)) && (
                              <>
                                <AppButton
                                  size="tiny"
                                  variant="text"
                                  colorVariant="success"
                                  onClick={() => {
                                    const date = prompt("Enter clearance date (YYYY-MM-DD) or leave empty:");
                                    if (date !== null) handleClear(c._id, date);
                                  }}
                                >
                                  Clear
                                </AppButton>
                                <AppButton
                                  size="tiny"
                                  variant="text"
                                  colorVariant="error"
                                  onClick={() => {
                                    const reason = prompt("Enter bounce reason:");
                                    if (reason) {
                                      const charges = prompt("Enter bounce charges (INR):", "0");
                                      handleBounce(c._id, reason, Number(charges) || 0);
                                    }
                                  }}
                                >
                                  Bounce
                                </AppButton>
                              </>
                            )}

                            {/* cancelable if not cleared, bounced or cancelled */}
                            {!isCleared && !isBounced && !isCancelled && (
                              <AppIconButton
                                icon={<FiSlash />}
                                variant="outlined"
                                colorVariant="neutral"
                                size="small"
                                onClick={() => {
                                  const reason = prompt("Enter cancellation reason:");
                                  if (reason !== null) handleCancel(c._id, reason);
                                }}
                                title="Cancel Cheque"
                              />
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
                totalItems={totalCheques}
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

export default ChequesDesktopPage;
