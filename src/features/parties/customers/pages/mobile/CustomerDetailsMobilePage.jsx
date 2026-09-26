// src/features/parties/customers/pages/mobile/CustomerDetailsMobilePage.jsx

import { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getCustomerSales, getCustomerLedger } from "../../store/customerThunk";
import {
  FiArrowLeft,
  FiEdit3,
  FiMoreHorizontal,
  FiCalendar,
  FiUser,
  FiClock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronRight,
  FiFileText,
  FiDownload,
  FiCheckCircle,
  FiTrendingUp,
  FiDollarSign,
  FiPlus,
  FiSettings,
  FiRefreshCw,
} from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi2";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppMenu,
  AppStack,
  AppStatusBadge,
  AppText,
  AppPageLoader,
  AppErrorState,
  AppTag,
} from "@/components";

import { formatDate, formatCurrency } from "@/utils";

const CustomerDetailsMobilePage = ({
  customer,
  ledger = {},
  outstanding,
  sales = {},
  payments = [],
  isLoading,
  hasError,
  error,
  currentTab,
  handleTabChange,
  handleBack,
  handleEdit,
  handleRefresh,
}) => {
  if (isLoading && !customer) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppPageLoader text="Retrieving customer coordinates..." />
      </AppBox>
    );
  }

  if (hasError && !customer) {
    return (
      <AppBox sx={loadingErrorWrapperSx}>
        <AppErrorState
          title="Customer Profile Extraction Failure"
          description={error || "The server could not process the customer identifier."}
          actionText="Retry Pipeline"
          onRetry={handleRefresh}
          size="medium"
        />
      </AppBox>
    );
  }

  const safeCustomer = customer || {};
  const dispatch = useDispatch();

  const salesData = Array.isArray(sales?.data) ? sales.data : [];
  const salesMeta = sales?.meta || { totalSalesAmount: 0 };
  const ledgerEntries = Array.isArray(ledger?.entries) ? ledger.entries : [];
  const ledgerTotalDebit = ledger?.meta?.totalDebit || 0;
  const ledgerTotalCredit = ledger?.meta?.totalCredit || 0;
  const ledgerNetBal = ledgerTotalDebit - ledgerTotalCredit;

  const combinedTx = useMemo(() => {
    return [
      ...salesData.map((s) => ({
        id: s._id || s.invoiceNo || s.invoiceNumber,
        type: "Sales Invoice",
        refNo: s.invoiceNo || s.invoiceNumber,
        date: s.date || s.invoiceDate || s.createdAt,
        amount: s.grandTotal || s.totalAmount,
        status: s.status || "Unpaid",
        rawDate: new Date(s.date || s.invoiceDate || s.createdAt).getTime(),
      })),
      ...payments.map((p) => ({
        id: p._id || p.paymentNumber,
        type: "Payment",
        refNo: p.paymentNumber,
        date: p.paymentDate || p.createdAt,
        amount: p.amount,
        status: "Paid",
        rawDate: new Date(p.paymentDate || p.createdAt).getTime(),
      })),
    ].sort((a, b) => b.rawDate - a.rawDate);
  }, [salesData, payments]);

  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "transactions", label: `Txns (${salesMeta.total || combinedTx.length})` },
    { value: "statement", label: "Statement" },
    { value: "documents", label: "Docs" },
  ];

  return (
    <section className="w-full bg-bg min-h-[calc(100vh-58px)] pb-16">
      <AppBox sx={containerSx}>
        {/* Mobile Header Row */}
        <AppBox sx={jumbotronHeaderSx}>
          <AppStack direction="row" align="center" justify="space-between" gap={1} sx={{ mb: 1.5 }}>
            <AppIconButton
              icon={<FiArrowLeft />}
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              onClick={handleBack}
              sx={backBtnSx}
            />
            <AppStack direction="row" align="center" gap={0.5}>
              <AppIconButton
                icon={<FiEdit3 />}
                size="small"
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                onClick={handleEdit}
                sx={headerActionBtnSx}
              />
              <AppMenu
                trigger={
                  <AppIconButton
                    icon={<FiMoreHorizontal />}
                    size="small"
                    variant="outlined"
                    colorVariant="neutral"
                    rounded="md"
                    sx={moreActionBtnSx}
                  />
                }
                items={[
                  {
                    id: "refresh",
                    label: "Sync state",
                    icon: <FiRefreshCw />,
                    onClick: handleRefresh,
                  },
                ]}
                dense
              />
            </AppStack>
          </AppStack>

          <AppStack direction="row" align="center" gap={1}>
            <AppBox sx={corporateIconFrameSx}>
              <HiOutlineUserCircle />
            </AppBox>
            <AppBox sx={{ minWidth: 0, flex: 1 }}>
              <AppStack direction="row" align="center" gap={0.5} wrap="wrap">
                <AppHeading level={1} weight={800} sx={companyTitleTextSx}>
                  {safeCustomer.name}
                </AppHeading>
                <AppStatusBadge
                  status={safeCustomer.status || "active"}
                  variant="soft"
                  rounded="md"
                  size="small"
                  sx={statusBadgeOverrideSx}
                />
              </AppStack>
              <AppText variant="body2" sx={companyMetadataTextSx}>
                {safeCustomer.customerCode || "-"} &bull; <span className="capitalize">{safeCustomer.customerType} Customer</span>
              </AppText>
            </AppBox>
          </AppStack>

          {/* Ribbon */}
          <AppBox sx={metaPillsRibbonSx}>
            <span className="flex items-center gap-1">
              <FiCalendar className="text-primary" /> Created on{" "}
              {safeCustomer.createdAt ? formatDate(safeCustomer.createdAt) : "28 May 2024"}
            </span>
          </AppBox>
        </AppBox>

        {/* Tab Selection */}
        <AppBox sx={tabsLineTrackSx}>
          {tabs.map((tab) => {
            const isTabActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-3 pb-2 text-[12px] font-bold transition whitespace-nowrap outline-none ${
                  isTabActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </AppBox>

        {/* Tab Body Scroll */}
        <AppBox sx={mainBodyScrollContentWrapperSx}>
          {currentTab === "overview" && (
            <AppStack direction="column" gap={1.25}>
              {/* Basic Info */}
              <AppCard variant="default" rounded="lg" bordered shadow="none" padding="none" sx={moduleCardContainerSx}>
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                    Basic Information
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2, spaceY: 3 }}>
                  <CompactRow label="Code" value={safeCustomer.customerCode} />
                  <CompactRow label="Type" value={safeCustomer.customerType} />
                  <CompactRow label="Name" value={safeCustomer.name} />
                  <CompactRow label="Mobile" value={safeCustomer.mobile} />
                  <CompactRow label="Email" value={safeCustomer.email} />
                  <CompactRow label="GST Number" value={safeCustomer.gstNumber} />
                  <CompactRow label="PAN Number" value={safeCustomer.panNumber} />
                  <CompactRow label="Drug License" value={safeCustomer.drugLicenseNumber} />
                </AppBox>
              </AppCard>

              {/* Billing Address */}
              <AppCard variant="default" rounded="lg" bordered shadow="none" padding="none" sx={moduleCardContainerSx}>
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                    Billing Address
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2, spaceY: 3 }}>
                  <CompactRow label="Address Line 1" value={safeCustomer.billingAddress?.addressLine1} />
                  <CompactRow label="Address Line 2" value={safeCustomer.billingAddress?.addressLine2} />
                  <CompactRow label="City" value={safeCustomer.billingAddress?.city} />
                  <CompactRow label="State" value={safeCustomer.billingAddress?.state} />
                  <CompactRow label="Pincode" value={safeCustomer.billingAddress?.pincode} />
                </AppBox>
              </AppCard>

              {/* Shipping Address */}
              <AppCard variant="default" rounded="lg" bordered shadow="none" padding="none" sx={moduleCardContainerSx}>
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                    Shipping Address
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2, spaceY: 3 }}>
                  <CompactRow label="Address Line 1" value={safeCustomer.shippingAddress?.addressLine1} />
                  <CompactRow label="Address Line 2" value={safeCustomer.shippingAddress?.addressLine2} />
                  <CompactRow label="City" value={safeCustomer.shippingAddress?.city} />
                  <CompactRow label="State" value={safeCustomer.shippingAddress?.state} />
                  <CompactRow label="Pincode" value={safeCustomer.shippingAddress?.pincode} />
                </AppBox>
              </AppCard>

              {/* Financial info */}
              <AppCard variant="default" rounded="lg" bordered shadow="none" padding="none" sx={moduleCardContainerSx}>
                <AppBox sx={cardHeaderBannerSx}>
                  <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                    Financial Information
                  </AppHeading>
                </AppBox>
                <AppBox sx={{ p: 1.2, spaceY: 3 }}>
                  <CompactRow label="Credit Limit" value={formatCurrency(safeCustomer.creditLimit || 0)} />
                  <CompactRow label="Credit Days" value={safeCustomer.creditDays ? `${safeCustomer.creditDays} Days` : "-"} />
                  <CompactRow label="Opening Bal" value={formatCurrency(safeCustomer.openingBalance || 0)} />
                  <CompactRow label="Balance Type" value={safeCustomer.openingBalanceType?.toUpperCase()} />
                </AppBox>
              </AppCard>

              {/* Bottom Customer Summary metrics */}
              <AppBox sx={highlightsHeaderSpacingBoxSx}>
                <AppHeading level={2} weight={800} sx={cardHeaderTitleSx}>
                  Customer Summary Metrics
                </AppHeading>
              </AppBox>
              <div className="grid grid-cols-2 gap-2">
                <CompactMetricCard
                  title="Total Sales"
                  value={formatCurrency(salesMeta.totalSalesAmount || 0)}
                  color="primary"
                />
                <CompactMetricCard
                  title="Total Receipts"
                  value={formatCurrency(payments.reduce((acc, p) => acc + (p.amount || 0), 0))}
                  color="success"
                />
                <div className="col-span-2">
                  <CompactMetricCard
                    title="Outstanding Balance"
                    value={formatCurrency(
                      (Number(safeCustomer.openingBalance) || 0) * (safeCustomer.openingBalanceType === "dr" ? 1 : -1) +
                      (salesMeta.totalSalesAmount || 0) -
                      payments.reduce((acc, p) => acc + (p.amount || 0), 0)
                    )}
                    color="danger"
                  />
                </div>
              </div>
            </AppStack>
          )}

          {/* Transactions List */}
          {currentTab === "transactions" && (
            <AppStack direction="column" gap={1}>
              {combinedTx.map((tx) => (
                <TxnMobileCard key={tx.id} type={tx.type} refNo={tx.refNo} date={tx.date} amount={tx.amount} status={tx.status} />
              ))}
              {combinedTx.length === 0 && (
                <div className="p-8 text-center text-text-muted text-[11.5px] bg-surface rounded-lg border border-border">
                  No transaction history found.
                </div>
              )}
              {salesMeta.total > 5 && (
                <div className="py-2 flex justify-between items-center px-2">
                  <button
                    type="button"
                    onClick={() => dispatch(getCustomerSales({ customerId: safeCustomer._id, params: { page: (salesMeta.page || 1) - 1, limit: 5 } }))}
                    disabled={(salesMeta.page || 1) <= 1}
                    className="text-[12px] font-bold text-primary hover:underline disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-[10px] text-text-muted">Page {salesMeta.page || 1}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(getCustomerSales({ customerId: safeCustomer._id, params: { page: (salesMeta.page || 1) + 1, limit: 5 } }))}
                    disabled={(salesMeta.page || 1) >= Math.ceil(salesMeta.total / 5)}
                    className="text-[12px] font-bold text-primary hover:underline disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </AppStack>
          )}

          {/* Statement */}
          {currentTab === "statement" && (
            <AppStack direction="column" gap={1}>
              <div className="grid grid-cols-2 gap-2 mb-1">
                <CompactMetricCard title="Total Debit (Dr)" value={formatCurrency(ledgerTotalDebit)} color="danger" />
                <CompactMetricCard title="Total Credit (Cr)" value={formatCurrency(ledgerTotalCredit)} color="success" />
                <div className="col-span-2">
                  <CompactMetricCard 
                    title="Closing Balance" 
                    value={`${formatCurrency(Math.abs(ledgerNetBal))} ${ledgerNetBal >= 0 ? "Dr" : "Cr"}`} 
                    color="primary" 
                  />
                </div>
              </div>

              {ledgerEntries.map((entry) => (
                <AppCard key={entry._id} variant="default" rounded="md" bordered shadow="none" sx={{ p: 1.5, bgcolor: "var(--app-color-surface)" }}>
                  <AppStack direction="row" align="center" justify="space-between" gap={1}>
                    <div>
                      <span className="block text-[12px] font-bold text-text">{entry.voucherType}</span>
                      <span className="block text-[10px] text-text-muted mt-0.5">{entry.voucherNumber} &bull; {formatDate(entry.voucherDate)}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[12.5px] font-extrabold text-text">
                        {entry.debit > 0 ? formatCurrency(entry.debit) + " Dr" : formatCurrency(entry.credit) + " Cr"}
                      </span>
                      <span className="block text-[10px] text-text-muted mt-0.5">Bal: {formatCurrency(Math.abs(entry.runningBalance))}</span>
                    </div>
                  </AppStack>
                </AppCard>
              ))}
              {ledgerEntries.length === 0 && (
                <div className="p-8 text-center text-text-muted text-[11.5px] bg-surface rounded-lg border border-border">
                  No statement history found.
                </div>
              )}
              {ledger?.total > 5 && (
                <div className="py-2 flex justify-between items-center px-2">
                  <button
                    type="button"
                    onClick={() => dispatch(getCustomerLedger({ customerId: safeCustomer._id, params: { page: (ledger.page || 1) - 1, limit: 5 } }))}
                    disabled={(ledger.page || 1) <= 1}
                    className="text-[12px] font-bold text-primary hover:underline disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-[10px] text-text-muted">Page {ledger.page || 1}</span>
                  <button
                    type="button"
                    onClick={() => dispatch(getCustomerLedger({ customerId: safeCustomer._id, params: { page: (ledger.page || 1) + 1, limit: 5 } }))}
                    disabled={(ledger.page || 1) >= Math.ceil(ledger.total / 5)}
                    className="text-[12px] font-bold text-primary hover:underline disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </AppStack>
          )}

          {/* Documents */}
          {currentTab === "documents" && (
            <AppCard variant="default" rounded="md" bordered padding="md" sx={emptyCardContainerSx}>
              <AppStack direction="column" align="center" justify="center" gap={1} sx={{ py: 3, width: "100%" }}>
                <FiFileText className="text-[28px] text-text-muted/60" />
                <AppHeading level={3} weight={700} align="center" sx={{ m: 0, fontSize: "13px", width: "100%" }}>
                  Attached Documents Vault
                </AppHeading>
                <AppText variant="body2" align="center" sx={tabFallbackDescSx}>
                  Manage document files on the desktop view.
                </AppText>
              </AppStack>
            </AppCard>
          )}
        </AppBox>
      </AppBox>
    </section>
  );
};

/* Components */
const CompactRow = ({ label, value }) => (
  <div className="grid grid-cols-[120px_1fr] gap-2 py-0.5 text-[11px] items-start border-b border-divider/40 pb-1.5 last:border-0 last:pb-0">
    <span className="font-bold text-text-muted">{label}</span>
    <span className="font-semibold text-text break-words">{value || "-"}</span>
  </div>
);

const CompactMetricCard = ({ title, value, color }) => (
  <AppCard variant="default" rounded="md" bordered shadow="none" sx={{ p: 1.5, bgcolor: "var(--app-color-surface)" }}>
    <span className="block text-[9.5px] font-bold text-text-muted leading-tight">{title}</span>
    <span className={`block text-[15px] font-black mt-1 leading-tight ${color === "danger" ? "text-danger" : color === "success" ? "text-success" : "text-primary"}`}>
      {value}
    </span>
  </AppCard>
);

const TxnMobileCard = ({ type, refNo, date, amount, status }) => (
  <AppCard variant="default" rounded="md" bordered shadow="none" sx={{ p: 1.5, bgcolor: "var(--app-color-surface)" }}>
    <AppStack direction="row" align="center" justify="space-between" gap={1}>
      <div>
        <span className="block text-[12px] font-bold text-text">{type}</span>
        <span className="block text-[10px] text-text-muted mt-0.5">{refNo} &bull; {formatDate(date)}</span>
      </div>
      <div className="text-right">
        <span className="block text-[12.5px] font-extrabold text-text">{formatCurrency(amount)}</span>
        <span className="inline-block mt-0.5">
          <AppTag
            label={status}
            colorVariant={status.toLowerCase() === "paid" ? "success" : status.toLowerCase() === "partial" ? "warning" : "danger"}
            variant="soft"
            rounded="sm"
            size="small"
            sx={{ fontSize: "8.5px", height: 16 }}
          />
        </span>
      </div>
    </AppStack>
  </AppCard>
);

/* Styles */
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

const loadingErrorWrapperSx = {
  width: "100%",
  minHeight: 320,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  px: 1.5,
};

const jumbotronHeaderSx = {
  pt: 1.5,
  pb: 1.25,
  px: 1.5,
};

const backBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border)",
};

const headerActionBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border-strong)",
  color: "var(--app-color-text)",
};

const moreActionBtnSx = {
  height: 32,
  width: 32,
  minWidth: 32,
  borderColor: "var(--app-color-border-strong)",
};

const corporateIconFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: "10px",
  fontSize: "24px",
  flexShrink: 0,
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
};

const companyTitleTextSx = {
  m: 0,
  fontSize: "17px",
  lineHeight: 1.2,
  letterSpacing: "-0.3px",
  color: "var(--app-color-text)",
};

const statusBadgeOverrideSx = {
  height: 16,
  fontSize: "8.5px",
  fontWeight: 750,
  px: 0.85,
  textTransform: "capitalize",
};

const companyMetadataTextSx = {
  mt: 0.15,
  fontSize: "10.5px",
  color: "var(--app-color-text-muted)",
};

const metaPillsRibbonSx = {
  mt: 1.5,
  pt: 1,
  borderTop: "1px dashed var(--app-color-border)",
  display: "flex",
  flexDirection: "column",
  gap: 0.4,
  fontSize: "10.5px",
  fontWeight: 600,
  color: "var(--app-color-text-muted)",
};

const tabsLineTrackSx = {
  display: "flex",
  gap: 0.75,
  borderBottom: "1px solid var(--app-color-divider)",
  px: 1.5,
  overflowX: "auto",
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
    width: 0,
    height: 0,
  },
};

const mainBodyScrollContentWrapperSx = {
  px: 1.5,
  py: 1.5,
  bgcolor: "color-mix(in_srgb, var(--app-color-surface-alt) 20%, transparent)",
};

const moduleCardContainerSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-xs)",
};

const cardHeaderBannerSx = {
  px: 1.2,
  py: 0.85,
  borderBottom: "1px solid var(--app-color-divider)",
  bgcolor: "var(--app-color-surface-alt)",
};

const cardHeaderTitleSx = {
  m: 0,
  fontSize: "12px",
  letterSpacing: "-0.1px",
  color: "var(--app-color-text)",
  textTransform: "uppercase",
  fontWeight: 800,
};

const highlightsHeaderSpacingBoxSx = {
  pt: 0.5,
  pb: 0.25,
};

const emptyCardContainerSx = {
  borderColor: "var(--app-color-border)",
  bgcolor: "var(--app-color-surface)",
};

const tabFallbackDescSx = {
  fontSize: "11px",
  color: "var(--app-color-text-muted)",
  maxWidth: 240,
  mx: "auto",
  m: 0,
  mt: 0.5,
};

export default CustomerDetailsMobilePage;
