import React from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiSlash,
  FiClock,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

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

const chequeTypeOptions = [
  { label: "All Types", value: "all" },
  { label: "Received", value: "RECEIVED" },
  { label: "Issued", value: "ISSUED" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Deposited", value: "DEPOSITED" },
  { label: "Cleared", value: "CLEARED" },
  { label: "Bounced", value: "BOUNCED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const ChequesMobilePage = ({
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

  return (
    <section className="w-full bg-bg pb-20">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Cheques Ledger
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Incoming & outgoing cheque instruments
              </AppText>
            </AppBox>
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

        {/* Filter segment */}
        <div className="px-2 mb-3 space-y-2">
          <AppInput
            value={searchParams.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search number, drawers..."
            startIcon={<FiSearch />}
            size="small"
          />

          <div className="grid grid-cols-2 gap-2">
            <AppSelect
              name="chequeType"
              value={searchParams.chequeType}
              onChange={(e) => handleFilterChange("chequeType", e.target.value)}
              options={chequeTypeOptions}
              size="small"
            />
            <AppSelect
              name="status"
              value={searchParams.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              options={statusOptions}
              size="small"
            />
          </div>
        </div>

        {/* Card Stream */}
        <div className="px-2 space-y-2.5">
          {isLoading ? (
            <div className="py-12 text-center text-text-muted font-bold text-[12px]">
              Loading cheques...
            </div>
          ) : cheques.length === 0 ? (
            <div className="py-12 text-center bg-surface rounded-md border border-border">
              <FiClock className="mx-auto text-[32px] text-text-muted/30 mb-2" />
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 600 }}>
                No Cheques Found
              </AppText>
            </div>
          ) : (
            cheques.map((c) => {
              const isReceived = c.chequeType === "RECEIVED";
              const isPending = c.status === "PENDING";
              const isDeposited = c.status === "DEPOSITED";
              const isCleared = c.status === "CLEARED";
              const isBounced = c.status === "BOUNCED";
              const isCancelled = c.status === "CANCELLED";

              return (
                <AppCard
                  key={c._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  sx={chequeCardSx}
                >
                  <div className="p-3 border-b border-border bg-surface-alt/10 flex justify-between items-center">
                    <span className="text-[11.5px] font-black font-mono text-text">
                      #{c.chequeNumber}
                    </span>
                    <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8px] font-extrabold uppercase ${
                      isReceived
                        ? "bg-primary-soft text-primary border border-primary/20"
                        : "bg-purple-soft text-purple border border-purple/20"
                    }`}>
                      {c.chequeType}
                    </span>
                  </div>

                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-[12.5px] text-text block font-bold">
                          {c.partyName}
                        </strong>
                        <span className="text-[10px] text-text-muted block mt-0.5">
                          {c.bankAccountId?.bankName || "Unknown Bank"}
                        </span>
                      </div>
                      <div className="text-right">
                        <strong className="text-[13px] text-text font-black block">
                          ₹{Number(c.amount || 0).toLocaleString("en-IN")}
                        </strong>
                        <span className="text-[9px] text-text-muted block mt-0.5 font-mono">
                          {formatDate(c.chequeDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-border/50 pt-2.5 mt-1">
                      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8.5px] font-bold uppercase ${getStatusBadgeClass(c.status)}`}>
                        {c.status}
                      </span>

                      <AppStack direction="row" gap={0.5} align="center">
                        <AppIconButton
                          icon={<FiEye />}
                          variant="outlined"
                          colorVariant="primary"
                          size="small"
                          onClick={() => handleViewDetails(c._id)}
                          title="Details"
                          sx={cardIconButtonSx}
                        />

                        {isReceived && isPending && (
                          <button
                            onClick={() => handleDeposit(c._id)}
                            className="px-2 py-1 text-[10px] font-bold bg-primary text-surface rounded hover:bg-primary-hover transition"
                          >
                            Deposit
                          </button>
                        )}

                        {((isReceived && isDeposited) || (!isReceived && isPending)) && (
                          <>
                            <button
                              onClick={() => {
                                const date = prompt("Clear Date (YYYY-MM-DD):");
                                if (date !== null) handleClear(c._id, date);
                              }}
                              className="px-2 py-1 text-[10px] font-bold bg-[#2b8a3e] text-surface rounded hover:bg-[#237032] transition"
                            >
                              Clear
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt("Bounce Reason:");
                                if (reason) {
                                  const charges = prompt("Charges (INR):", "0");
                                  handleBounce(c._id, reason, Number(charges) || 0);
                                }
                              }}
                              className="px-2 py-1 text-[10px] font-bold bg-danger text-surface rounded hover:bg-red-700 transition"
                            >
                              Bounce
                            </button>
                          </>
                        )}

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
                            sx={cardIconButtonSx}
                          />
                        )}
                      </AppStack>
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
              totalItems={totalCheques}
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
};

const chequeCardSx = {
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

export default ChequesMobilePage;
