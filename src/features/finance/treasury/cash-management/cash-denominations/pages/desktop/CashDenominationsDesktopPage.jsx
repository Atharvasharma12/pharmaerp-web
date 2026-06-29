import React from "react";
import { FiSearch, FiPlus, FiEye, FiClock, FiInbox } from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppTablePagination,
  AppText,
  AppIconButton,
  PageHeader,
  AppStack,
} from "@/components";
import { formatDate } from "@/utils";

const statusFilterOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const CashDenominationsDesktopPage = ({
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
    return d.cashAccountId?.accountName || "Unknown Cash Register";
  };

  const getBranchName = (d) => {
    return (
      d.branchId?.name || d.cashAccountId?.branchId?.name || "Central Office"
    );
  };

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Physical Cash Counts"
          subtitle="Audit cash ledger entries against physical denomination calculations."
          extra={
            <AppStack direction="row" gap={2} align="center">
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard" },
                  { label: "Finance & Accounting" },
                  { label: "Treasury" },
                  { label: "Cash Counts", current: true },
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
                New Cash Count
              </AppButton>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Feedback alerts */}
        {(error || message) && (
          <div
            className={`mt-4 p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center ${
              error
                ? "bg-danger-soft text-danger"
                : "bg-success-soft text-success"
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

        {/* Table Card */}
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
                label="Search Counts"
                name="search"
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search count number, notes..."
                startIcon={<FiSearch />}
                size="small"
                fullWidth={false}
                formControlSx={{ width: 220 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />

              <AppSelect
                label="Cash Register"
                name="cashAccountId"
                value={filters.cashAccountId}
                onChange={(e) =>
                  handleFilterChange("cashAccountId", e.target.value)
                }
                options={cashAccountOptions}
                size="small"
                variant="bordered"
                rounded="md"
                fullWidth={false}
                formControlSx={{ width: 180 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />

              <AppSelect
                label="Linked Branch"
                name="branchId"
                value={filters.branchId}
                onChange={(e) => handleFilterChange("branchId", e.target.value)}
                options={branchOptions}
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
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                options={statusFilterOptions}
                size="small"
                variant="bordered"
                rounded="md"
                fullWidth={false}
                formControlSx={{ width: 130 }}
                inputSx={compactFilterInputSx}
                labelSx={filterLabelSx}
              />
            </div>
          </div>

          {/* Table container */}
          <div className="overflow-x-auto w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText
                  variant="body1"
                  sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}
                >
                  Retrieving physical cash count ledger...
                </AppText>
              </div>
            ) : denominations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiInbox className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading
                  level={3}
                  weight={600}
                  sx={{
                    m: 0,
                    fontSize: "14px",
                    color: "var(--app-color-text)",
                  }}
                >
                  No Count Records Found
                </AppHeading>
                <AppText
                  variant="body2"
                  sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}
                >
                  Add a new cash audit or adjust filters.
                </AppText>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/10 text-text-muted font-bold">
                    <th className="py-3 px-4 font-bold">Count Number</th>
                    <th className="py-3 px-4 font-bold">Count Date</th>
                    <th className="py-3 px-4 font-bold">Cash Register</th>
                    <th className="py-3 px-4 font-bold">
                      Linked Location / Branch
                    </th>
                    <th className="py-3 px-4 text-right font-bold">
                      Expected Balance
                    </th>
                    <th className="py-3 px-4 text-right font-bold">
                      Physical Counted
                    </th>
                    <th className="py-3 px-4 text-right font-bold">Variance</th>
                    <th className="py-3 px-4 text-center font-bold">Status</th>
                    <th className="py-3 px-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {denominations.map((d) => {
                    const varianceVal = d.variance || 0;
                    const isShort = varianceVal < 0;
                    const isExcess = varianceVal > 0;

                    return (
                      <tr
                        key={d._id}
                        className="border-b border-border hover:bg-surface-hover/20 transition"
                      >
                        <td className="py-3.5 px-4 font-bold text-text font-mono">
                          {d.countNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text">
                          {formatDate(d.countDate)}
                        </td>
                        <td className="py-3.5 px-4 text-text font-semibold">
                          {getRegisterName(d)}
                        </td>
                        <td className="py-3.5 px-4 text-text font-semibold font-mono">
                          {getBranchName(d)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-text-muted">
                          ₹{" "}
                          {Number(d.expectedBalance || 0).toLocaleString(
                            "en-IN",
                            { minimumFractionDigits: 2 },
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-text">
                          ₹{" "}
                          {Number(d.physicalTotal || 0).toLocaleString(
                            "en-IN",
                            { minimumFractionDigits: 2 },
                          )}
                        </td>
                        <td
                          className={`py-3.5 px-4 text-right font-black ${
                            isShort
                              ? "text-danger"
                              : isExcess
                                ? "text-success"
                                : "text-text"
                          }`}
                        >
                          {isExcess ? "+" : ""} ₹{" "}
                          {Number(varianceVal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusBadgeClass(d.status)}`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <AppIconButton
                            icon={<FiEye />}
                            variant="outlined"
                            colorVariant="primary"
                            size="small"
                            onClick={() => handleViewDetails(d._id)}
                            title="View Details"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {showPagination && (
            <div className="px-4 py-3 border-t border-divider">
              <AppTablePagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </AppCard>
      </div>
    </section>
  );
};

// Styles variables
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

export default CashDenominationsDesktopPage;
