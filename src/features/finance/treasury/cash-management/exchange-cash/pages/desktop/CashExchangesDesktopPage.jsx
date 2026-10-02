import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiSlash,
  FiCheckCircle,
  FiRefreshCw,
  FiRepeat,
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

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const CashExchangesDesktopPage = ({
  cashExchanges = [],
  searchParams,
  currentPage,
  pageSize,
  totalExchanges,
  isLoading = false,
  isCancelling = false,
  error,
  message,
  clearFeedback,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleCancelExchange,
  handleViewDetails,
  handleCreateNew,
  handleRefresh,
}) => {
  const { can } = usePermission();
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState(null);

  const stats = useMemo(() => {
    let totalAmt = 0;
    let completed = 0;
    let cancelled = 0;
    cashExchanges.forEach((e) => {
      if (e.status === "COMPLETED") {
        totalAmt += e.totalReceived || 0;
        completed++;
      } else if (e.status === "CANCELLED") {
        cancelled++;
      }
    });
    return { totalAmt, completed, cancelled, count: totalExchanges };
  }, [cashExchanges, totalExchanges]);

  const showPagination = totalExchanges > pageSize;

  const getStatusTag = (status) => {
    switch (status) {
      case "COMPLETED":
        return (
          <AppTag color="success" size="sm">
            <FiCheckCircle className="mr-1 inline" /> Completed
          </AppTag>
        );
      case "CANCELLED":
        return (
          <AppTag color="danger" size="sm">
            <FiSlash className="mr-1 inline" /> Cancelled
          </AppTag>
        );
      default:
        return <AppTag size="sm">{status}</AppTag>;
    }
  };

  const handleConfirmCancel = async () => {
    if (!pendingCancelId) return;
    setCancellingId(pendingCancelId);
    setShowCancelModal(false);
    await handleCancelExchange(pendingCancelId, cancelReason);
    setCancellingId(null);
    setPendingCancelId(null);
    setCancelReason("");
  };

  const openCancelModal = (id) => {
    setPendingCancelId(id);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const columns = [
    {
      title: "Exchange #",
      key: "exchangeNumber",
      render: (_, row) => (
        <AppText size="sm" weight={600} sx={{ fontFamily: "monospace" }}>
          {row.exchangeNumber}
        </AppText>
      ),
    },
    {
      title: "Date",
      key: "exchangeDate",
      render: (_, row) => (
        <AppText size="sm">{formatDate(row.exchangeDate)}</AppText>
      ),
    },
    {
      title: "Cash Partition",
      key: "partition",
      render: (_, row) => (
        <AppText size="sm">
          {row.partition === "running" ? "Running Cash" : "Frozen Cash"}
        </AppText>
      ),
    },
    {
      title: "Received",
      key: "totalReceived",
      render: (_, row) => (
        <AppText size="sm" weight={600} sx={{ color: "var(--color-success)" }}>
          ₹{(row.totalReceived || 0).toLocaleString("en-IN")}
        </AppText>
      ),
    },
    {
      title: "Given",
      key: "totalGiven",
      render: (_, row) => (
        <AppText size="sm" weight={600} sx={{ color: "var(--color-warning)" }}>
          ₹{(row.totalGiven || 0).toLocaleString("en-IN")}
        </AppText>
      ),
    },
    {
      title: "Narration",
      key: "narration",
      render: (_, row) => (
        <AppText size="sm" sx={{ color: "var(--color-text-muted)" }}>
          {row.narration || "—"}
        </AppText>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, row) => getStatusTag(row.status),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, row) => (
        <AppMenu
          trigger={
            <AppButton size="xs" variant="ghost" iconOnly>
              ···
            </AppButton>
          }
          items={[
            {
              label: "View Details",
              icon: <FiEye />,
              onClick: () => handleViewDetails(row._id),
            },
            ...(row.status === "COMPLETED"
              ? [
                  {
                    label: "Cancel",
                    icon: <FiSlash />,
                    danger: true,
                    onClick: () => openCancelModal(row._id),
                  },
                ]
              : []),
          ]}
        />
      ),
    },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Cash Exchanges"
          subtitle="Record denomination swaps — give change to customers without affecting account balances."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard" },
                { label: "Finance" },
                { label: "Cash Exchanges", current: true },
              ]}
            />
          }
          align="flex-start"
          justify="space-between"
        />

        {/* Feedback */}
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
              type="button"
              onClick={clearFeedback}
              className="ml-4 text-xs underline opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="mt-5 grid grid-cols-4 gap-4">
          {[
            {
              label: "Total Exchanges",
              value: stats.count,
              color: "text-primary",
            },
            {
              label: "Completed",
              value: stats.completed,
              color: "text-success",
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              color: "text-danger",
            },
            {
              label: "Total Volume",
              value: `₹${stats.totalAmt.toLocaleString("en-IN")}`,
              color: "text-text",
            },
          ].map((s) => (
            <AppCard
              key={s.label}
              variant="default"
              rounded="lg"
              bordered
              shadow="sm"
              padding="md"
            >
              <AppText size="xs" sx={{ color: "var(--color-text-muted)" }}>
                {s.label}
              </AppText>
              <AppHeading
                level={3}
                weight={700}
                sx={{ marginTop: 4, fontSize: 22, color: `var(--color-${s.color.replace("text-", "")})` }}
              >
                {s.value}
              </AppHeading>
            </AppCard>
          ))}
        </div>

        {/* Filters + Table */}
        <AppCard
          variant="default"
          rounded="lg"
          bordered
          shadow="sm"
          padding="none"
          sx={{ marginTop: 20 }}
        >
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-wrap">
            <AppInput
              placeholder="Search by exchange number or narration…"
              value={searchParams.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              prefix={<FiSearch className="text-text-muted" />}
              sx={{ width: 280 }}
              size="sm"
            />
            <AppSelect
              options={statusOptions}
              value={searchParams.status}
              onChange={(val) => handleFilterChange("status", val)}
              sx={{ width: 160 }}
              size="sm"
            />
            <div className="ml-auto flex items-center gap-2">
              <AppButton
                size="sm"
                variant="ghost"
                icon={<FiRefreshCw />}
                onClick={handleRefresh}
                loading={isLoading}
              >
                Refresh
              </AppButton>
              <PermissionGate permission="cash-exchange:create">
                <AppButton
                  size="sm"
                  variant="primary"
                  icon={<FiPlus />}
                  onClick={handleCreateNew}
                >
                  New Exchange
                </AppButton>
              </PermissionGate>
            </div>
          </div>

          {/* Table */}
          <AppTable
            columns={columns}
            rows={cashExchanges}
            getRowId={(row) => row._id}
            loading={isLoading}
            emptyText="No cash exchanges found."
            pagination={
              showPagination
                ? {
                    current: currentPage,
                    pageSize,
                    total: totalExchanges,
                    onChange: handlePageChange,
                    onPageSizeChange: handlePageSizeChange,
                  }
                : undefined
            }
          />
        </AppCard>

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <AppCard
              variant="default"
              rounded="lg"
              bordered
              shadow="xl"
              padding="lg"
              sx={{ width: 420 }}
            >
              <AppHeading level={4} weight={700} sx={{ marginBottom: 8 }}>
                Cancel Cash Exchange
              </AppHeading>
              <AppText size="sm" sx={{ color: "var(--color-text-muted)", marginBottom: 16 }}>
                This will reverse the denomination changes in the cash drawer.
                Provide an optional reason.
              </AppText>
              <AppInput
                placeholder="Cancellation reason (optional)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                size="sm"
                sx={{ marginBottom: 16 }}
              />
              <AppStack direction="row" gap={8} justify="flex-end">
                <AppButton
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep
                </AppButton>
                <AppButton
                  size="sm"
                  variant="danger"
                  onClick={handleConfirmCancel}
                  loading={isCancelling}
                >
                  Confirm Cancel
                </AppButton>
              </AppStack>
            </AppCard>
          </div>
        )}
      </div>
    </section>
  );
};

export default CashExchangesDesktopPage;
