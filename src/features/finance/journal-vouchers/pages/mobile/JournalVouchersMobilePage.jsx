import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiInbox,
  FiMoreVertical,
  FiEdit2,
  FiEye,
  FiRefreshCw,
  FiFileText,
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppSelect,
  AppStack,
  AppText,
  AppTablePagination,
  AppMenu,
  AppSearchInput,
  AppTag,
  AppButton,
} from "@/components";
import { ROUTES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils";

const typeOptions = [
  { label: "All Voucher Types", value: "all" },
  { label: "Journal Voucher", value: "JOURNAL" },
  { label: "Payment Voucher", value: "PAYMENT" },
  { label: "Receipt Voucher", value: "RECEIPT" },
  { label: "Contra Voucher", value: "CONTRA" },
  { label: "Purchase Voucher", value: "PURCHASE" },
  { label: "Sale Voucher", value: "SALE" },
  { label: "Opening Balance", value: "OPENING_BALANCE" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Pending Approval", value: "PENDING_APPROVAL" },
  { label: "Approved", value: "APPROVED" },
  { label: "Posted", value: "POSTED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Reversed", value: "REVERSED" },
];

const statusColorMap = {
  DRAFT: "neutral",
  PENDING_APPROVAL: "warning",
  PENDING: "warning",
  APPROVED: "info",
  POSTED: "success",
  CANCELLED: "error",
  REVERSED: "pink",
};

const typeColorMap = {
  JOURNAL: "purple",
  PAYMENT: "error",
  RECEIPT: "success",
  CONTRA: "info",
  PURCHASE: "warning",
  SALE: "teal",
  OPENING_BALANCE: "indigo",
};

const JournalVouchersMobilePage = ({
  journalVouchers = [],
  searchParams,
  currentPage,
  pageSize,
  totalVouchers,
  isLoading = false,
  error,
  clearError,
  handleSearchChange,
  handleFilterChange,
  handlePageChange,
  handlePageSizeChange,
  handleRefresh,
  handleCreateVoucher,
  handleViewVoucher,
  handleEditVoucher,
}) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const handleCreate = () => {
    if (handleCreateVoucher) handleCreateVoucher();
    else navigate(ROUTES.CREATE_JOURNAL_VOUCHER);
  };

  const handleCardClick = (voucherId) => {
    if (handleViewVoucher) handleViewVoucher(voucherId);
    else navigate(ROUTES.JOURNAL_VOUCHER_DETAILS(voucherId));
  };


  const getTypeBadge = (type) => {
    const raw = String(type || "").toUpperCase();
    return (
      <AppTag
        label={raw}
        variant="soft"
        size="small"
        rounded="md"
        colorVariant={typeColorMap[raw] || "neutral"}
        sx={typeBadgeSx}
      />
    );
  };

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    return (
      <AppTag
        label={raw}
        variant="soft"
        size="small"
        rounded="md"
        colorVariant={statusColorMap[raw] || "neutral"}
        sx={statusBadgeSx}
      />
    );
  };

  const shouldRenderPagination = totalVouchers > pageSize;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={800} sx={pageTitleSx}>
                Journal Vouchers
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Define and manage fiscal calendar bounds
              </AppText>
            </AppBox>

            <AppStack direction="row" align="center" gap={1}>
              <AppIconButton
                icon={<FiRefreshCw />}
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                onClick={handleRefresh}
                loading={isLoading}
                disabled={isLoading}
                sx={refreshIconBtnSx}
              />
              <AppButton
                variant="contained"
                colorVariant="primary"
                rounded="md"
                startIcon={<FiPlus />}
                onClick={handleCreate}
                disabled={isLoading}
                sx={addButtonBtnSx}
              >
                Create Voucher
              </AppButton>
            </AppStack>
          </AppStack>
        </AppBox>

        {/* Action errors */}
        {error && (
          <div className="mx-0 mb-3 p-3 bg-danger-soft text-danger text-[11.5px] font-semibold rounded-md flex justify-between items-center">
            <span className="flex-1">{error}</span>
            <button
              onClick={clearError}
              className="text-danger font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search & Filter Row */}
        <AppBox sx={searchFilterRowSx}>
          <AppBox sx={{ flex: 1, minWidth: 0 }}>
            <AppSearchInput
              name="search"
              value={searchParams.search}
              onChange={handleSearchChange}
              placeholder="Search vouchers..."
              clearable
              onClear={() => handleSearchChange("")}
              size="large"
              variant="bordered"
              rounded="md"
              sx={searchBarSx}
              inputSx={searchInputSx}
            />
          </AppBox>

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
        </AppBox>

        {/* Collapsible Panel */}
        {showFilters && (
          <div className="px-0 mb-3">
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
                  label="Voucher Type"
                  name="voucherType"
                  value={searchParams.voucherType}
                  onChange={(e) => handleFilterChange("voucherType", e.target.value)}
                  options={typeOptions}
                  size="small"
                  variant="bordered"
                  rounded="md"
                  inputSx={compactFilterInputSx}
                  labelSx={labelSx}
                />

                <AppSelect
                  label="Approval Status"
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

        {/* Content list */}
        <div className="px-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                Querying journal vouchers...
              </AppText>
            </div>
          ) : journalVouchers.length === 0 ? (
            <AppCard
              variant="default"
              rounded="md"
              bordered
              padding="md"
              sx={emptyCardContainerSx}
            >
              <AppStack
                direction="column"
                align="center"
                justify="center"
                gap={1}
                sx={{ py: 4, width: "100%" }}
              >
                <FiInbox className="text-[28px] text-text-muted/60" />
                <AppHeading
                  level={3}
                  weight={700}
                  align="center"
                  sx={{ m: 0, fontSize: "13px", width: "100%" }}
                >
                  No vouchers found
                </AppHeading>
                <AppText variant="body2" align="center" sx={emptyStateSubTextSx}>
                  Define a new voucher or refine your search keywords.
                </AppText>
              </AppStack>
            </AppCard>
          ) : (
            <AppStack direction="column" gap={1.2}>
              {journalVouchers.map((voucher) => {
                return (
                  <AppCard
                    key={voucher._id}
                    variant="default"
                    rounded="lg"
                    bordered={false}
                    shadow="sm"
                    padding="none"
                    sx={voucherCardSx}
                  >
                    <AppStack direction="row" align="center" gap={1.5} justify="space-between" sx={{ width: "100%" }}>
                      {/* Left Info Block */}
                      <AppStack
                        direction="row"
                        align="center"
                        gap={1.5}
                        sx={{ minWidth: 0, flex: 1, cursor: "pointer" }}
                        onClick={() => handleCardClick(voucher._id)}
                      >
                        {/* Left Icon Avatar Frame */}
                        <AppBox sx={avatarFrameSx}>
                          <FiFileText className="text-[24px]" />
                        </AppBox>

                        {/* Center Info Block */}
                        <AppBox sx={{ minWidth: 0, flex: 1 }}>
                          <AppHeading level={3} weight={700} sx={voucherTitleSx}>
                            {voucher.voucherNumber}
                          </AppHeading>
                          <AppText variant="body2" sx={voucherDateSx}>
                            Date: {formatDate(voucher.voucherDate)} {voucher.referenceNumber ? `• Ref: ${voucher.referenceNumber}` : ""}
                          </AppText>
                          <AppText variant="body2" sx={debitCreditSummarySx}>
                            Dr: {formatCurrency(voucher.totalDebit || 0)} | Cr: {formatCurrency(voucher.totalCredit || 0)}
                          </AppText>
                        </AppBox>
                      </AppStack>

                      {/* Right Stack */}
                      <AppStack direction="row" align="center" gap={1} sx={{ flexShrink: 0 }}>
                        <AppStack
                          direction="column"
                          align="flex-end"
                          gap={0.5}
                          sx={rightMetadataStackSx}
                        >
                          {getTypeBadge(voucher.voucherType)}
                          {getStatusBadge(voucher.status)}
                          <AppText variant="body2" sx={voucherValueSx}>
                            {formatCurrency(voucher.totalDebit || 0)}
                          </AppText>
                        </AppStack>

                        {/* Dropdown Action Menu */}
                        <AppMenu
                          triggerIcon={<FiMoreVertical />}
                          items={[
                            {
                              label: "View Details",
                              icon: <FiEye />,
                              onClick: (e) => {
                                e.stopPropagation();
                                handleCardClick(voucher._id);
                              },
                            },
                            {
                              label: "Edit Voucher",
                              icon: <FiEdit2 />,
                              onClick: (e) => {
                                e.stopPropagation();
                                if (handleEditVoucher) handleEditVoucher(voucher._id);
                                else navigate(ROUTES.EDIT_JOURNAL_VOUCHER(voucher._id));
                              },
                            },

                          ]}
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
                  </AppCard>
                );
              })}
            </AppStack>
          )}
        </div>

        {/* Conditional Pagination Footer */}
        {shouldRenderPagination && (
          <AppBox sx={paginationFooterWrapperSx}>
            <AppTablePagination
              page={currentPage}
              pageSize={pageSize}
              totalItems={totalVouchers}
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

const addButtonBtnSx = {
  height: 36,
  px: 1.6,
  fontSize: "11.5px",
  fontWeight: 750,
  bgcolor: "var(--app-color-primary, #0f172a)",
  color: "var(--app-color-text-inverse, #ffffff)",
  "&:hover": {
    bgcolor: "var(--app-color-primary-hover, #00833f)",
  },
  boxShadow: "none",
  flexShrink: 0,
};

const refreshIconBtnSx = {
  height: 36,
  width: 36,
  minWidth: 36,
  p: 0,
};

const searchFilterRowSx = {
  display: "flex",
  alignItems: "center",
  gap: 1,
  px: 0,
  py: 0.5,
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

const searchBarSx = {
  width: "100%",
  boxShadow: "none",
};

const searchInputSx = {
  height: 42,
  fontSize: "13px",
  bgcolor: "var(--app-color-surface)",
};

const listingListWrapperSx = {
  px: 0,
  py: 1,
};

const emptyCardContainerSx = {
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
  width: "100%",
};

const emptyStateSubTextSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  px: 2,
  textAlign: "center",
  width: "100%",
};

const voucherCardSx = {
  p: 1.5,
  bgcolor: "var(--app-color-surface)",
  border: "1px solid var(--app-color-border)",
  boxShadow:
    "0 2px 10px color-mix(in_srgb, var(--app-color-text) 5%, transparent)",
  transition: "all 0.15s ease",
  "&:active": {
    transform: "scale(0.99)",
  },
};

const avatarFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 46,
  height: 46,
  borderRadius: "10px",
  bgcolor: "color-mix(in_srgb, var(--app-color-primary) 10%, transparent)",
  color: "var(--app-color-primary)",
  flexShrink: 0,
};

const voucherTitleSx = {
  m: 0,
  fontSize: "12px",
  color: "var(--app-color-text)",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: 160,
};

const voucherDateSx = {
  mt: 0.25,
  fontSize: "10px",
  color: "var(--app-color-text-muted)",
};

const debitCreditSummarySx = {
  mt: 0.5,
  fontSize: "9.5px",
  color: "var(--app-color-text-muted)",
};

const rightMetadataStackSx = {
  pl: 1.5,
  borderLeft:
    "1px solid color-mix(in_srgb, var(--app-color-border) 60%, transparent)",
  minWidth: { xs: 75, sm: 90 },
  maxWidth: { xs: 90, sm: 110 },
  flexShrink: 0,
};

const typeBadgeSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 1,
  textTransform: "uppercase",
};

const statusBadgeSx = {
  height: 18,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 1,
  textTransform: "uppercase",
};

const voucherValueSx = {
  mt: 0.5,
  fontSize: "11px",
  fontWeight: 800,
  color: "var(--app-color-success)",
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

const filterCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const labelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text)",
  mb: 0.5,
};

const compactFilterInputSx = {
  height: 32,
  fontSize: "11.5px",
  bgcolor: "var(--app-color-surface)",
};

export default JournalVouchersMobilePage;
