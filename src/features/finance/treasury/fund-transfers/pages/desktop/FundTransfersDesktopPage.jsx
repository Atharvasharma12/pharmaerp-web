import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiSlash,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiMoreVertical,
  FiRefreshCw,
} from "react-icons/fi";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppTable,
  AppTag,
  AppText,
  AppMenu,
  PageHeader,
  PermissionGate,
} from "@/components";
import { usePermission } from "@/hooks";
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
  handleRefresh,
}) => {
  const navigate = useNavigate();
  const { can } = usePermission();

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

  const showPagination = totalTransfers > pageSize;

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
      return (
        t.fromBankAccountId?.accountName ||
        t.fromBankAccountId?.bankName ||
        "Bank Account"
      );
    }
    return "Branch Cash";
  };

  const getDestAccountName = (t) => {
    if (t.toAccountType === "BANK") {
      return (
        t.toBankAccountId?.accountName ||
        t.toBankAccountId?.bankName ||
        "Bank Account"
      );
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

  const columns = useMemo(
    () => [
      {
        id: "transferNumber",
        key: "transferNumber",
        label: "Transfer Number",
        minWidth: 150,
        render: (_, t) => (
          <AppText variant="body2" sx={tableValueMonoSx}>
            {t.transferNumber}
          </AppText>
        ),
      },
      {
        id: "transferDate",
        key: "transferDate",
        label: "Transfer Date",
        minWidth: 120,
        render: (_, t) => (
          <AppText variant="body2" sx={tableValueSx}>
            {formatDate(t.transferDate)}
          </AppText>
        ),
      },
      {
        id: "transferType",
        key: "transferType",
        label: "Transfer Type",
        minWidth: 180,
        render: (_, t) => (
          <AppText variant="body2" sx={tableValueMutedSx}>
            {getTransferTypeLabel(t.transferType)}
          </AppText>
        ),
      },
      {
        id: "sourceAccount",
        key: "sourceAccount",
        label: "Source Account",
        minWidth: 180,
        render: (_, t) => (
          <AppText variant="body2" sx={tableValueSx}>
            {getSourceAccountName(t)}
          </AppText>
        ),
      },
      {
        id: "destAccount",
        key: "destAccount",
        label: "Destination Account",
        minWidth: 180,
        render: (_, t) => (
          <AppText variant="body2" sx={tableValueSx}>
            {getDestAccountName(t)}
          </AppText>
        ),
      },
      {
        id: "amount",
        key: "amount",
        label: "Amount",
        align: "right",
        minWidth: 130,
        render: (_, t) => (
          <AppText variant="body2" sx={balanceSx}>
            ₹{" "}
            {Number(t.amount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </AppText>
        ),
      },
      {
        id: "status",
        key: "status",
        label: "Status",
        align: "center",
        minWidth: 120,
        render: (_, t) => (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${getStatusBadgeClass(t.status)}`}
          >
            {t.status}
          </span>
        ),
      },
      {
        id: "actions",
        label: "Actions",
        align: "right",
        width: 80,
        render: (_, t) => {
          const menuItems = [
            {
              id: "view",
              label: "View Details",
              icon: <FiEye />,
              onClick: () => handleViewDetails(t._id),
            },
          ];

          if (t.status !== "CANCELLED" && can("fund-transfer:update")) {
            menuItems.push({
              id: "cancel",
              label: "Cancel Transfer",
              icon: <FiSlash />,
              danger: true,
              onClick: () => {
                const reason = prompt("Enter cancellation reason:");
                if (reason !== null) {
                  handleCancelTransfer(t._id, reason);
                }
              },
            });
          }

          return (
            <AppStack
              direction="row"
              gap={0.5}
              justify="flex-end"
              align="center"
            >
              <AppMenu
                trigger={
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-transparent text-text-muted hover:text-text hover:bg-surface-hover focus:outline-none cursor-pointer"
                  >
                    <FiMoreVertical className="text-[16px]" />
                  </button>
                }
                items={menuItems}
                dense
                minWidth={150}
              />
            </AppStack>
          );
        },
      },
    ],
    [handleViewDetails, handleCancelTransfer, can],
  );

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
                  {
                    label: "Dashboard",
                    onClick: () => navigate(ROUTES.DASHBOARD),
                  },
                  {
                    label: "Finance & Accounting",
                    onClick: () => navigate(ROUTES.FINANCE),
                  },
                  {
                    label: "Treasury",
                    onClick: () => navigate(ROUTES.TREASURY),
                  },
                  { label: "Fund Transfers", current: true },
                ]}
                sx={breadcrumbSx}
                itemSx={breadcrumbItemSx}
                currentItemSx={breadcrumbCurrentSx}
              />
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                startIcon={<FiRefreshCw />}
                onClick={handleRefresh}
                loading={isLoading}
                sx={importButtonSx}
              >
                Refresh
              </AppButton>
              <PermissionGate permission="fund-transfer:create">
                <AppButton
                  variant="filled"
                  colorVariant="success"
                  size="small"
                  rounded="md"
                  startIcon={<FiPlus />}
                  onClick={handleCreateNew}
                  sx={primaryButtonSx}
                >
                  New Transfer
                </AppButton>
              </PermissionGate>
            </AppStack>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* Stats Grid */}
        <div className="mt-5 grid grid-cols-3 gap-4">
          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">
                  Transfers Count
                </span>
                <span className="text-[20px] font-extrabold text-text mt-1 block">
                  {stats.count}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-alt text-text flex items-center justify-center border border-border">
                <FiClock className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">
                  Posted Volume
                </span>
                <span className="text-[20px] font-extrabold text-[#2b8a3e] mt-1 block">
                  ₹{" "}
                  {Number(stats.totalAmt).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#ebfbee] text-[#2b8a3e] flex items-center justify-center border border-[#c3fae8]">
                <FiTrendingUp className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard
            variant="default"
            rounded="lg"
            bordered
            shadow="sm"
            sx={statCardSx}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-text-muted tracking-wider block">
                  Draft Items
                </span>
                <span className="text-[20px] font-extrabold text-warning mt-1 block">
                  {stats.drafts}
                </span>
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
                onChange={(e) =>
                  handleFilterChange("transferType", e.target.value)
                }
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
          <div className="w-full relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <AppText
                  variant="body1"
                  sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}
                >
                  Retrieving transfers history...
                </AppText>
              </div>
            ) : fundTransfers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiClock className="text-[40px] text-text-muted/40 mb-3" />
                <AppHeading
                  level={3}
                  weight={600}
                  sx={{
                    m: 0,
                    fontSize: "14px",
                    color: "var(--app-color-text)",
                  }}
                >
                  No Fund Transfers Found
                </AppHeading>
                <AppText
                  variant="body2"
                  sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}
                >
                  There are no internal transfers recorded for this company.
                </AppText>
              </div>
            ) : (
              <AppTable
                columns={columns}
                rows={fundTransfers}
                getRowId={(row) => row._id}
                sx={tableSx}
                headSx={tableHeadSx}
                cellSx={tableCellSx}
              />
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
                onPageSizeChange={handlePageSizeChange}
              />
            </AppBox>
          )}
        </AppCard>
      </div>
    </section>
  );
};

// MUI style variables
const pageHeaderSx = { mb: 3 };
const pageHeaderContentSx = { flex: 1 };
const breadcrumbSx = { mt: 0.5 };
const breadcrumbItemSx = {
  fontSize: "12px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};
const breadcrumbCurrentSx = {
  fontSize: "12px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const statCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const mainCardSx = {
  mt: 3,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const compactFilterInputSx = {
  height: 36,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
};

const filterLabelSx = {
  fontSize: "11.5px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

const tableSx = {
  width: "100%",
  "& .MuiTable-root": {
    width: "100%",
  },
};

const tableHeadSx = {
  bgcolor:
    "color-mix(in_srgb, var(--app-color-surface-alt) 25%, var(--app-color-surface))",
  "& th": {
    fontSize: "11px",
    fontWeight: 750,
    textTransform: "uppercase",
    color: "var(--app-color-text-muted)",
    py: 1.5,
    borderBottom: "1px solid var(--app-color-divider)",
  },
};

const tableCellSx = {
  py: 1.5,
  fontSize: "12.5px",
  borderBottom: "1px solid var(--app-color-divider)",
};

const tableValueSx = {
  fontSize: "12.5px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const tableValueMutedSx = {
  fontSize: "12.5px",
  fontWeight: 650,
  color: "var(--app-color-text-muted)",
};

const tableValueMonoSx = {
  fontSize: "12px",
  fontFamily: "var(--font-mono, monospace)",
  fontWeight: 750,
  color: "var(--app-color-text)",
};

const balanceSx = {
  fontSize: "12.5px",
  fontWeight: 800,
  color: "var(--app-color-text)",
};

const paginationFooterWrapperSx = {
  px: 2,
  py: 2,
  borderTop: "1px solid var(--app-color-divider)",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  width: "100%",
  "& > div": {
    width: "auto",
  },
};

const primaryButtonSx = {
  height: 38,
  px: 2.5,
  fontSize: "12.5px",
  fontWeight: 700,
  bgcolor: "#00b85c",
  color: "white",
  whiteSpace: "nowrap",
  "&:hover": { bgcolor: "#009e4f" },
};

const importButtonSx = {
  height: 38,
  px: 2.5,
  fontSize: "12.5px",
  fontWeight: 650,
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
  bgcolor: "white",
  whiteSpace: "nowrap",
};

export default FundTransfersDesktopPage;
