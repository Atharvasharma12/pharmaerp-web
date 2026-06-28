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
} from "react-icons/fi";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppIconButton,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
  AppTablePagination,
  AppMenu,
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
}) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const handleCreate = () => {
    navigate(ROUTES.CREATE_JOURNAL_VOUCHER);
  };

  const handleCardClick = (voucherId) => {
    navigate(ROUTES.JOURNAL_VOUCHER_DETAILS(voucherId));
  };

  const getTypeBadge = (type) => {
    const raw = String(type || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "JOURNAL") bg = "bg-[#f3f0ff] text-[#7048e8] border-[#d0bfff]";
    else if (raw === "PAYMENT") bg = "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    else if (raw === "RECEIPT") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CONTRA") bg = "bg-[#e7f5ff] text-[#1c7ed6] border-[#a5d8ff]";
    else if (raw === "PURCHASE") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "SALE") bg = "bg-[#e6fcf5] text-[#0ca678] border-[#96f2d7]";

    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[9px] font-semibold border ${bg}`}>
        {raw}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const raw = String(status || "").toUpperCase();
    let bg = "bg-[#f8f9fa] text-[#495057] border-[#dee2e6]";

    if (raw === "DRAFT") bg = "bg-[#f1f3f5] text-[#868e96] border-[#e9ecef]";
    else if (raw === "PENDING_APPROVAL" || raw === "PENDING") bg = "bg-[#fff9db] text-[#f08c00] border-[#ffe066]";
    else if (raw === "APPROVED") bg = "bg-[#e8f2ff] text-[#1864ab] border-[#c3e3ff]";
    else if (raw === "POSTED") bg = "bg-[#ebfbee] text-[#2b8a3e] border-[#c3fae8]";
    else if (raw === "CANCELLED") bg = "bg-[#fff5f5] text-[#fa5252] border-[#ffc9c9]";
    else if (raw === "REVERSED") bg = "bg-[#fff0f6] text-[#d6336c] border-[#fcc2d7]";

    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.2 text-[8.5px] font-bold uppercase border ${bg}`}>
        {raw}
      </span>
    );
  };

  const shouldRenderPagination = journalVouchers.length > 0;

  return (
    <section className="w-full bg-bg pb-6">
      <AppBox sx={containerSx}>
        {/* Mobile Page Header */}
        <AppBox sx={headerWrapperSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1}>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppHeading level={1} weight={700} sx={pageTitleSx}>
                Journal Vouchers
              </AppHeading>
              <AppText variant="body2" sx={pageSubtitleSx}>
                Record ledger adjustment entries
              </AppText>
            </AppBox>

            <AppIconButton
              icon={<FiPlus />}
              variant="filled"
              colorVariant="primary"
              size="small"
              rounded="md"
              onClick={handleCreate}
              sx={actionHeaderIconBtnSx}
            />
          </AppStack>
        </AppBox>

        {/* Filters Toolbar */}
        <div className="px-2 mb-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <AppInput
                name="search"
                value={searchParams.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search vouchers..."
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
          )}
        </div>

        {/* Content list */}
        <div className="px-2 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                Querying journal vouchers...
              </AppText>
            </div>
          ) : journalVouchers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FiInbox className="text-[40px] text-text-muted/40 mb-2" />
              <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "13px", color: "var(--app-color-text)" }}>
                No Vouchers Found
              </AppHeading>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                Try adjusting your search filters.
              </AppText>
            </div>
          ) : (
            journalVouchers.map((voucher) => {
              return (
                <AppCard
                  key={voucher._id}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="none"
                  padding="none"
                  onClick={() => handleCardClick(voucher._id)}
                  sx={voucherCardSx}
                >
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-primary text-[12.5px]">
                        {voucher.voucherNumber}
                      </span>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {getTypeBadge(voucher.voucherType)}
                        {getStatusBadge(voucher.status)}
                        <AppMenu
                          trigger={
                            <button className="p-1 text-text-muted hover:text-primary rounded transition cursor-pointer ml-1">
                              <FiMoreVertical className="text-[14px]" />
                            </button>
                          }
                          items={[
                            {
                              id: "view",
                              label: "View Details",
                              icon: <FiEye />,
                              onClick: () => handleCardClick(voucher._id),
                            },
                            {
                              id: "edit",
                              label: "Edit Voucher",
                              icon: <FiEdit2 />,
                              onClick: () => navigate(ROUTES.EDIT_JOURNAL_VOUCHER(voucher._id)),
                            },
                          ]}
                          dense
                          minWidth={130}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] text-text-muted block">
                          Date: {formatDate(voucher.voucherDate)}
                        </span>
                        {voucher.referenceNumber && (
                          <span className="text-[10px] text-text-muted block font-mono">
                            Ref: {voucher.referenceNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-text-muted block">Value:</span>
                        <span className="text-[13.5px] font-black text-[#2b8a3e]">
                          {formatCurrency(voucher.totalDebit || 0)}
                        </span>
                      </div>
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
                totalItems={totalVouchers}
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

const actionHeaderIconBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  bgcolor: "var(--app-color-primary)",
  color: "white",
  "&:hover": { bgcolor: "var(--app-color-primary-hover)" },
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
  color: "var(--app-color-text)",
  mb: 0.5,
};

const voucherCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    borderColor: "var(--app-color-primary)",
    transform: "translateY(-1px)",
  },
};

const paginationFooterWrapperSx = {
  pt: 2,
  pb: 2,
  display: "flex",
  justifyContent: "center",
  width: "100%",
  "& > div": { width: "100%" },
};

export default JournalVouchersMobilePage;
