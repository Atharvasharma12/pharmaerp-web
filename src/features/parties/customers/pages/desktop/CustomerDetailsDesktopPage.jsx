// src/features/parties/customers/pages/desktop/CustomerDetailsDesktopPage.jsx

import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { getCustomerLedger, getCustomerSales } from "../../store/customerThunk";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiEdit3,
  FiMoreHorizontal,
  FiCalendar,
  FiUser,
  FiClock,
  FiFileText,
  FiMail,
  FiPhone,
  FiMapPin,
  FiDownload,
  FiPlus,
  FiCheckCircle,
  FiInfo,
  FiDollarSign,
  FiTrendingUp,
  FiFile,
  FiLock,
  FiAlertTriangle,
} from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi2";

import {
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppIconButton,
  AppMenu,
  AppStack,
  AppStatusBadge,
  AppTag,
  AppText,
  AppPageLoader,
  AppErrorState,
  PermissionGate,
} from "@/components";

import { formatDate, formatCurrency } from "@/utils";

const CustomerDetailsDesktopPage = ({
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
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppPageLoader text="Retrieving customer profile ledger..." />
      </section>
    );
  }

  if (hasError && !customer) {
    return (
      <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
        <AppErrorState
          title="Customer Profile Extraction Failure"
          description={
            error || "The server could not process the customer identifier."
          }
          actionText="Retry Pipeline"
          onRetry={handleRefresh}
          size="page"
        />
      </section>
    );
  }

  const safeCustomer = customer || {};

  // Dynamically calculate metrics from sales/payments/outstanding
  const salesData = Array.isArray(sales?.data) ? sales.data : [];
  const salesMeta = sales?.meta || { totalSalesAmount: 0 };
  
  const calculatedMetrics = useMemo(() => {
    // Total sales now uses the precomputed total from the backend (or fallback to calculated)
    const totalSalesVal = salesMeta.totalSalesAmount || 0;
    
    // Total receipts fallback (payments is still unpaginated dummy data for now)
    const totalReceiptsVal = payments.reduce(
      (acc, p) => acc + (p.amount || 0),
      0
    );

    const outstandingVal =
      (Number(safeCustomer.openingBalance) || 0) *
        (safeCustomer.openingBalanceType === "dr" ? 1 : -1) +
      totalSalesVal -
      totalReceiptsVal;

    // We only have the current page of sales, so allTransactions is now just the current page's transactions merged with payments
    const combinedTx = [
      ...salesData.map((s) => ({
        id: s._id || s.invoiceNo || s.invoiceNumber,
        type: "Sales Invoice",
        refNo: s.invoiceNo || s.invoiceNumber,
        date: s.date || s.invoiceDate || s.createdAt,
        dueDate: s.dueDate || s.createdAt,
        amount: s.grandTotal || s.totalAmount,
        status: s.status || "Unpaid",
        rawDate: new Date(s.date || s.invoiceDate || s.createdAt).getTime(),
      })),
      ...payments.map((p) => ({
        id: p._id || p.paymentNumber,
        type: "Payment",
        refNo: p.paymentNumber,
        date: p.paymentDate || p.createdAt,
        dueDate: "-",
        amount: p.amount,
        status: "Paid",
        rawDate: new Date(p.paymentDate || p.createdAt).getTime(),
      })),
    ].sort((a, b) => b.rawDate - a.rawDate);

    const lastTxDate = combinedTx.length > 0 ? combinedTx[0].date : null;

    return {
      totalSales: totalSalesVal,
      totalReceipts: totalReceiptsVal,
      outstandingBalance: outstandingVal,
      totalTransactions: salesMeta.total || combinedTx.length,
      lastTransactionDate: lastTxDate,
      recentTransactions: combinedTx.slice(0, 5),
      allTransactions: combinedTx,
      salesMeta,
    };
  }, [salesData, salesMeta, payments, safeCustomer]);

  // Tab Header Items
  const tabs = [
    { value: "overview", label: "Overview" },
    { value: "transactions", label: `Transactions (${calculatedMetrics.totalTransactions})` },
    { value: "statement", label: "Statement" },
    { value: "documents", label: "Documents" },
    { value: "notes", label: "Notes" },
    { value: "timeline", label: "Timeline" },
  ];

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-5 py-4">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Breadcrumb Header Strip */}
        <div className="flex items-center justify-between">
          <AppBreadcrumb
            size="small"
            variant="text"
            items={[
              { label: "Dashboard", onClick: () => {} },
              { label: "Parties", onClick: handleBack },
              { label: "Customers", onClick: handleBack },
              {
                label: safeCustomer.customerCode || "Customer Details",
                current: true,
              },
            ]}
            sx={breadcrumbSx}
            itemSx={breadcrumbItemSx}
            currentItemSx={breadcrumbCurrentSx}
          />
        </div>

        {/* Customer Header Row */}
        <div className="mt-2 flex w-full items-start justify-between border-b border-border-strong bg-surface rounded-xl border p-4 shadow-xs">
          <AppStack direction="row" align="center" gap={1.2}>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary text-[32px]">
              <HiOutlineUserCircle />
            </div>
            <AppBox>
              <AppStack direction="row" align="center" gap={0.8}>
                <AppHeading level={1} weight={700} sx={pageTitleSx}>
                  {safeCustomer.name}
                </AppHeading>
                <AppStatusBadge
                  status={safeCustomer.status || "active"}
                  variant="soft"
                  rounded="md"
                  size="small"
                />
              </AppStack>
              <AppText variant="body2" sx={subHeaderMetaDataSx}>
                {safeCustomer.customerCode || "-"} &bull;{" "}
                <span className="capitalize font-medium text-text-muted">{safeCustomer.customerType} Customer</span>
              </AppText>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-text-muted">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="text-primary text-[13px]" /> Added on{" "}
                  {safeCustomer.createdAt ? formatDate(safeCustomer.createdAt) : "28 May 2024"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiMail className="text-success text-[13px]" /> {safeCustomer.email || "No Email"}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiPhone className="text-warning text-[13px]" /> {safeCustomer.mobile || "No Mobile"}
                </span>
              </div>
            </AppBox>
          </AppStack>

          <AppStack direction="row" align="center" gap={1}>
            <PermissionGate permission="customer:update">
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                rounded="md"
                size="small"
                startIcon={<FiEdit3 />}
                onClick={handleEdit}
                sx={secondaryButtonSx}
              >
                Edit Customer
              </AppButton>
            </PermissionGate>
            <AppMenu
              trigger={
                <AppButton
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  size="small"
                  endIcon={<FiMoreHorizontal />}
                  sx={secondaryButtonSx}
                >
                  More Actions
                </AppButton>
              }
              items={[
                {
                  id: "refresh",
                  label: "Force Sync State",
                  onClick: handleRefresh,
                },
                {
                  id: "back",
                  label: "Back to Listing",
                  onClick: handleBack,
                },
              ]}
              dense
            />
          </AppStack>
        </div>

        {/* Tab Selection */}
        <div className="mt-4 flex border-b border-border overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`border-b-2 px-4 pb-2.5 text-[12.5px] font-bold transition whitespace-nowrap outline-none ${
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Switch Tab Content */}
        <div className="mt-5">
          {currentTab === "overview" && (
            <OverviewTab
              customer={safeCustomer}
              metrics={calculatedMetrics}
              onTabChange={handleTabChange}
              onEdit={handleEdit}
            />
          )}
          {currentTab === "transactions" && (
            <TransactionsTab metrics={calculatedMetrics} customerId={safeCustomer._id} />
          )}
          {currentTab === "statement" && (
            <StatementTab customer={safeCustomer} ledger={ledger} />
          )}
          {currentTab === "documents" && (
            <DocumentsTab customer={safeCustomer} />
          )}
          {currentTab === "notes" && (
            <NotesTab customer={safeCustomer} />
          )}
          {currentTab === "timeline" && (
            <TimelineTab customer={safeCustomer} />
          )}
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   1. OVERVIEW TAB
   ========================================================================== */
const OverviewTab = ({ customer, metrics, onTabChange, onEdit }) => {
  const billingAddr = customer.billingAddress || {};
  const shippingAddr = customer.shippingAddress || {};

  return (
    <div className="grid grid-cols-[1fr_360px] gap-4 items-start">
      {/* Left Column */}
      <div className="space-y-4">
        {/* Basic Information Card */}
        <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
            <div>
              <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Basic Information</AppHeading>
            </div>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              startIcon={<FiEdit3 />}
              onClick={onEdit}
              sx={{ height: 28, fontSize: "11px" }}
            >
              Edit
            </AppButton>
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3.5">
            <InfoRow label="Customer Code" value={customer.customerCode || "-"} />
            <InfoRow label="Mobile" value={customer.mobile || "-"} />
            <InfoRow
              label="Customer Type"
              value={
                customer.customerType ? (
                  <AppTag
                    label={customer.customerType}
                    colorVariant="primary"
                    variant="soft"
                    rounded="md"
                    sx={{ height: 20, fontSize: "10.5px", fontWeight: 700, textTransform: "capitalize" }}
                  />
                ) : (
                  "-"
                )
              }
            />
            <InfoRow label="Alternate Mobile" value={customer.alternateMobile || "-"} />
            <InfoRow label="Customer Name" value={customer.name || "-"} />
            <InfoRow label="Email" value={customer.email || "-"} />
            <InfoRow
              label="Status"
              value={
                <AppTag
                  label={customer.status || "active"}
                  colorVariant={customer.status === "active" ? "success" : "warning"}
                  variant="soft"
                  rounded="md"
                  sx={{ height: 20, fontSize: "10.5px", fontWeight: 700, textTransform: "capitalize" }}
                />
              }
            />
            <InfoRow label="GST Number" value={customer.gstNumber || "-"} />
            <InfoRow label="Ledger Account" value={`Sundry Debtors - ${customer.name}`} />
            <InfoRow label="PAN Number" value={customer.panNumber || "-"} />
            <InfoRow label="Branch" value="Head Office" />
            <InfoRow label="Drug License Number" value={customer.drugLicenseNumber || "-"} />
            <div className="col-span-2">
              <InfoRow label="Notes" value={customer.notes || "--"} vertical />
            </div>
          </div>
        </AppCard>

        {/* Billing Address Card */}
        <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
            <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Billing Address</AppHeading>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              startIcon={<FiEdit3 />}
              onClick={onEdit}
              sx={{ height: 28, fontSize: "11px" }}
            >
              Edit
            </AppButton>
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3.5">
            <div className="col-span-2">
              <InfoRow label="Address Line 1" value={billingAddr.addressLine1 || "-"} />
            </div>
            <div className="col-span-2">
              <InfoRow label="Address Line 2" value={billingAddr.addressLine2 || "-"} />
            </div>
            <InfoRow label="City" value={billingAddr.city || "-"} />
            <InfoRow label="District" value={billingAddr.district || "-"} />
            <InfoRow label="State" value={billingAddr.state || "-"} />
            <InfoRow label="Country" value={billingAddr.country || "India"} />
            <InfoRow label="Pincode" value={billingAddr.pincode || "-"} />
          </div>
        </AppCard>

        {/* Shipping Address Card */}
        <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
            <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Shipping Address</AppHeading>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              startIcon={<FiEdit3 />}
              onClick={onEdit}
              sx={{ height: 28, fontSize: "11px" }}
            >
              Edit
            </AppButton>
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3.5">
            <div className="col-span-2">
              <InfoRow label="Address Line 1" value={shippingAddr.addressLine1 || "-"} />
            </div>
            <div className="col-span-2">
              <InfoRow label="Address Line 2" value={shippingAddr.addressLine2 || "-"} />
            </div>
            <InfoRow label="City" value={shippingAddr.city || "-"} />
            <InfoRow label="District" value={shippingAddr.district || "-"} />
            <InfoRow label="State" value={shippingAddr.state || "-"} />
            <InfoRow label="Country" value={shippingAddr.country || "India"} />
            <InfoRow label="Pincode" value={shippingAddr.pincode || "-"} />
          </div>
        </AppCard>

        {/* Financial Information Card */}
        <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
            <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Financial Information</AppHeading>
            <AppButton
              variant="outlined"
              colorVariant="neutral"
              size="small"
              rounded="md"
              startIcon={<FiEdit3 />}
              onClick={onEdit}
              sx={{ height: 28, fontSize: "11px" }}
            >
              Edit
            </AppButton>
          </div>
          <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3.5">
            <InfoRow label="Credit Limit" value={formatCurrency(customer.creditLimit || 0)} />
            <InfoRow label="Credit Days" value={customer.creditDays ? `${customer.creditDays} Days` : "No limit"} />
            <InfoRow label="Opening Balance" value={formatCurrency(customer.openingBalance || 0)} />
            <InfoRow
              label="Opening Balance Type"
              value={
                <AppTag
                  label={customer.openingBalanceType === "dr" ? "DR (Debit)" : "CR (Credit)"}
                  colorVariant={customer.openingBalanceType === "dr" ? "primary" : "warning"}
                  variant="soft"
                  rounded="md"
                  sx={{ height: 20, fontSize: "10.5px", fontWeight: 700 }}
                />
              }
            />
          </div>
        </AppCard>

        {/* Recent Transactions Card */}
        <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
            <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Recent Transactions</AppHeading>
            <button
              type="button"
              onClick={() => onTabChange("transactions")}
              className="text-[11.5px] font-bold text-primary hover:underline"
            >
              View All Transactions
            </button>
          </div>
          <div className="w-full overflow-x-auto">
            {metrics.recentTransactions.length === 0 ? (
              <div className="p-6 text-center text-text-muted text-[12px]">
                No transactions recorded for this customer yet.
              </div>
            ) : (
              <table className="w-full border-collapse text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-border bg-surface-alt/45 text-[10.5px] font-bold text-text-muted uppercase tracking-wider">
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Reference No.</th>
                    <th className="px-4 py-2.5">Date</th>
                    <th className="px-4 py-2.5">Due Date</th>
                    <th className="px-4 py-2.5 text-right">Amount</th>
                    <th className="px-4 py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {metrics.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-alt/20 transition">
                      <td className="px-4 py-3 font-semibold text-text">{tx.type}</td>
                      <td className="px-4 py-3 font-mono text-text-muted">{tx.refNo || "-"}</td>
                      <td className="px-4 py-3 text-text-muted">{formatDate(tx.date)}</td>
                      <td className="px-4 py-3 text-text-muted">{tx.dueDate !== "-" ? formatDate(tx.dueDate) : "-"}</td>
                      <td className="px-4 py-3 text-right font-bold text-text">{formatCurrency(tx.amount)}</td>
                      <td className="px-4 py-3 text-center">
                        <AppTag
                          label={tx.status}
                          colorVariant={
                            tx.status.toLowerCase() === "paid" || tx.status.toLowerCase() === "completed"
                              ? "success"
                              : tx.status.toLowerCase() === "partial"
                              ? "warning"
                              : "danger"
                          }
                          variant="soft"
                          rounded="md"
                          size="small"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </AppCard>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Customer Summary Card */}
        <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
          <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
            <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Customer Summary</AppHeading>
          </div>
          <div className="p-4 space-y-4">
            <SummaryItem
              label="Total Sales (This Year)"
              value={formatCurrency(metrics.totalSales)}
              icon={<FiTrendingUp />}
              color="text-primary bg-primary-soft"
            />
            <SummaryItem
              label="Total Receipts (This Year)"
              value={formatCurrency(metrics.totalReceipts)}
              icon={<FiCheckCircle />}
              color="text-success bg-success-soft"
            />
            <SummaryItem
              label="Outstanding Balance"
              value={formatCurrency(metrics.outstandingBalance)}
              icon={<FiDollarSign />}
              color="text-danger bg-danger-soft animate-pulse"
            />
            <SummaryItem
              label="Total Transactions"
              value={metrics.totalTransactions}
              icon={<FiFileText />}
              color="text-warning bg-warning-soft"
            />
            <div className="pt-2 border-t border-border flex justify-between text-[11px] text-text-muted font-medium">
              <span>Last Transaction</span>
              <span className="font-bold text-text">{metrics.lastTransactionDate ? formatDate(metrics.lastTransactionDate) : "Never"}</span>
            </div>
          </div>
        </AppCard>

        {/* Quick Actions Card */}
        <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
          <div className="border-b border-border px-4 py-3 bg-surface-alt/20">
            <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Quick Actions</AppHeading>
          </div>
          <div className="p-3 space-y-2">
            <QuickActionButton label="Create Sales Invoice" icon={<FiPlus />} />
            <QuickActionButton label="Receive Payment" icon={<FiCheckCircle />} />
            <QuickActionButton label="View Statement" icon={<FiFileText />} onClick={() => onTabChange("statement")} />
            <QuickActionButton label="Download Ledger PDF" icon={<FiDownload />} />
          </div>
        </AppCard>

        {/* Attached Documents Card */}
        <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
            <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Attached Documents</AppHeading>
            <button
              type="button"
              onClick={() => onTabChange("documents")}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            <DocItem name="GST Certificate.pdf" date="12 Jun 2024" size="1.2 MB" />
            <DocItem name="Drug License Copy.pdf" date="15 Jun 2024" size="840 KB" />
          </div>
        </AppCard>

        {/* Customer Timeline Card */}
        <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-alt/20">
            <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Customer Timeline</AppHeading>
            <button
              type="button"
              onClick={() => onTabChange("timeline")}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="p-4 space-y-3.5">
            <TimelineItem
              title="Customer Created"
              desc="Profile ledger opened by System Admin"
              time={customer.createdAt ? formatDate(customer.createdAt) : "28 May 2024"}
              active
            />
          </div>
        </AppCard>
      </div>
    </div>
  );
};

/* ==========================================================================
   2. TRANSACTIONS TAB
   ========================================================================== */
const TransactionsTab = ({ metrics, customerId }) => {
  const dispatch = useDispatch();
  const salesMeta = metrics.salesMeta || { page: 1, total: metrics.totalTransactions };
  const currentPage = salesMeta.page || 1;
  const rowsPerPage = 5;
  const totalPages = Math.ceil((salesMeta.total || metrics.totalTransactions) / rowsPerPage);

  const currentRows = metrics.allTransactions;

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(getCustomerSales({ customerId, params: { page: currentPage + 1, limit: rowsPerPage } }));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(getCustomerSales({ customerId, params: { page: currentPage - 1, limit: rowsPerPage } }));
    }
  };

  return (
    <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
      <div className="border-b border-border px-4 py-3.5 bg-surface-alt/10 flex justify-between items-center">
        <div>
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Transaction Log Book</AppHeading>
          <span className="block text-[11px] text-text-muted mt-0.5">Historical sales records, debit notes and payments received.</span>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        {metrics.allTransactions.length === 0 ? (
          <div className="p-12 text-center text-text-muted text-[13px]">
            No recorded transactions found for this customer record.
          </div>
        ) : (
          <>
            <table className="w-full border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-border bg-surface-alt/45 text-[11px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="px-4 py-3">Transaction Type</th>
                  <th className="px-4 py-3">Reference No.</th>
                  <th className="px-4 py-3">Posting Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentRows.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-alt/20 transition">
                    <td className="px-4 py-3.5 font-bold text-text">{tx.type}</td>
                    <td className="px-4 py-3.5 font-mono text-text-muted">{tx.refNo || "-"}</td>
                    <td className="px-4 py-3.5 text-text-muted">{formatDate(tx.date)}</td>
                    <td className="px-4 py-3.5 text-text-muted">{tx.dueDate !== "-" ? formatDate(tx.dueDate) : "-"}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-text">{formatCurrency(tx.amount)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <AppTag
                        label={tx.status}
                        colorVariant={
                          tx.status.toLowerCase() === "paid" || tx.status.toLowerCase() === "completed"
                            ? "success"
                            : tx.status.toLowerCase() === "partial"
                            ? "warning"
                            : "danger"
                        }
                        variant="soft"
                        rounded="md"
                        size="small"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-surface">
                <span className="text-[12px] text-text-muted">
                  Page {currentPage} of {totalPages} (Total {salesMeta.total} entries)
                </span>
                <div className="flex space-x-2">
                  <AppButton
                    variant="outlined"
                    colorVariant="neutral"
                    size="small"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    sx={{ height: 28, fontSize: "11px", px: 2 }}
                  >
                    Previous
                  </AppButton>
                  <AppButton
                    variant="outlined"
                    colorVariant="neutral"
                    size="small"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    sx={{ height: 28, fontSize: "11px", px: 2 }}
                  >
                    Next
                  </AppButton>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppCard>
  );
};

/* ==========================================================================
   3. STATEMENT TAB
   ========================================================================== */
const StatementTab = ({ customer, ledger }) => {
  const dispatch = useDispatch();
  const ledgerEntries = Array.isArray(ledger?.entries) ? ledger.entries : [];
  const currentPage = ledger?.page || 1;
  const totalEntries = ledger?.total || 0;
  const totalDebit = ledger?.meta?.totalDebit || 0;
  const totalCredit = ledger?.meta?.totalCredit || 0;
  const netBalance = totalDebit - totalCredit;
  const rowsPerPage = 5;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);

  // Generate statement data from actual backend ledger entries
  const statementRows = useMemo(() => {
    const rows = [];
    
    ledgerEntries.forEach((entry) => {
      rows.push({
        id: entry._id,
        date: entry.voucherDate,
        particulars: entry.narration || `${entry.voucherType} (Ref: ${entry.voucherNumber})`,
        debit: entry.debit,
        credit: entry.credit,
        balance: entry.runningBalance,
        isOpening: false,
      });
    });

    // Only show Opening Balance at the bottom of the last page
    if (currentPage === totalPages || totalPages === 0) {
      const opBal = Number(customer.openingBalance) || 0;
      const opBalType = customer.openingBalanceType || "dr";
      rows.push({
        id: "opening-bal",
        date: customer.createdAt || "2024-05-28",
        particulars: "Opening Balance",
        debit: opBalType === "dr" ? opBal : 0,
        credit: opBalType === "cr" ? opBal : 0,
        balance: opBalType === "dr" ? opBal : -opBal,
        isOpening: true,
      });
    }

    return rows;
  }, [customer, ledgerEntries, currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(getCustomerLedger({ customerId: customer._id, params: { page: currentPage + 1, limit: rowsPerPage } }));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(getCustomerLedger({ customerId: customer._id, params: { page: currentPage - 1, limit: rowsPerPage } }));
    }
  };

  return (
    <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-surface-alt/10">
        <div>
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Account Statement / Ledger Sheet</AppHeading>
          <span className="block text-[11px] text-text-muted mt-0.5">Running ledger statement with debit/credit balance indicators.</span>
        </div>
        <AppButton
          variant="outlined"
          colorVariant="neutral"
          size="small"
          rounded="md"
          startIcon={<FiDownload />}
          sx={{ height: 32, fontSize: "11.5px" }}
        >
          Download PDF Statement
        </AppButton>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-[12.5px]">
          <thead>
            <tr className="border-b border-border bg-surface-alt/45 text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Particulars</th>
              <th className="px-4 py-3 text-right">Debit (Dr)</th>
              <th className="px-4 py-3 text-right">Credit (Cr)</th>
              <th className="px-4 py-3 text-right">Running Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {statementRows.map((row) => (
              <tr key={row.id} className={`hover:bg-surface-alt/10 transition ${row.isOpening ? "bg-primary-soft/10 font-semibold" : ""}`}>
                <td className="px-4 py-3.5 text-text-muted">{formatDate(row.date)}</td>
                <td className="px-4 py-3.5 text-text font-medium">{row.particulars}</td>
                <td className="px-4 py-3.5 text-right font-mono text-danger">{row.debit > 0 ? formatCurrency(row.debit) : "-"}</td>
                <td className="px-4 py-3.5 text-right font-mono text-success">{row.credit > 0 ? formatCurrency(row.credit) : "-"}</td>
                <td className="px-4 py-3.5 text-right font-mono font-bold text-text">
                  {formatCurrency(Math.abs(row.balance))} {row.balance >= 0 ? "Dr" : "Cr"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-surface-alt/20">
            <tr className="border-t-2 border-border font-bold text-[12.5px]">
              <td colSpan="2" className="px-4 py-3 text-right">Grand Total Summary:</td>
              <td className="px-4 py-3 text-right text-danger">{formatCurrency(totalDebit)}</td>
              <td className="px-4 py-3 text-right text-success">{formatCurrency(totalCredit)}</td>
              <td className="px-4 py-3 text-right">
                {formatCurrency(Math.abs(netBalance))} {netBalance >= 0 ? "Dr" : "Cr"}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-surface">
            <span className="text-[12px] text-text-muted">
              Page {currentPage} of {totalPages} (Total {totalEntries} entries)
            </span>
            <div className="flex space-x-2">
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                onClick={handlePrev}
                disabled={currentPage === 1}
                sx={{ height: 28, fontSize: "11px", px: 2 }}
              >
                Previous
              </AppButton>
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                sx={{ height: 28, fontSize: "11px", px: 2 }}
              >
                Next
              </AppButton>
            </div>
          </div>
        )}
      </div>
    </AppCard>
  );
};

/* ==========================================================================
   4. DOCUMENTS TAB
   ========================================================================== */
const DocumentsTab = () => (
  <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
    <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-surface-alt/10">
      <div>
        <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Document Vault</AppHeading>
        <span className="block text-[11px] text-text-muted mt-0.5">Secure drug licenses, GSTIN registrations, and legal credentials.</span>
      </div>
      <AppButton
        variant="contained"
        colorVariant="primary"
        size="small"
        rounded="md"
        startIcon={<FiPlus />}
        sx={{ height: 32, fontSize: "11.5px", fontWeight: 700 }}
      >
        Upload File
      </AppButton>
    </div>
    <div className="p-4 grid grid-cols-4 gap-4">
      <VaultDocCard name="GST Registration Certificate.pdf" size="1.2 MB" type="pdf" date="Added 12 Jun 2024" />
      <VaultDocCard name="Drug License Copy.pdf" size="840 KB" type="pdf" date="Added 15 Jun 2024" />
      <VaultDocCard name="Shop Front Photo.jpg" size="2.4 MB" type="image" date="Added 18 Jun 2024" />
    </div>
  </AppCard>
);

const VaultDocCard = ({ name, size, type, date }) => (
  <AppCard variant="default" rounded="md" bordered sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", bgcolor: "var(--app-color-surface)" }}>
    <div className="h-12 w-12 rounded-lg bg-primary-soft text-primary flex items-center justify-center text-[24px]">
      <FiFile />
    </div>
    <span className="block text-[12.5px] font-bold text-text text-center mt-3 truncate w-full">{name}</span>
    <span className="block text-[10.5px] text-text-muted text-center mt-1">{size} &bull; {date}</span>
    <AppStack direction="row" gap={1} sx={{ mt: 3, w: "100%" }}>
      <AppButton variant="outlined" colorVariant="neutral" rounded="sm" size="small" sx={{ flex: 1, height: 28, fontSize: "10.5px" }}>
        View
      </AppButton>
      <AppIconButton icon={<FiDownload />} size="small" variant="outlined" colorVariant="neutral" rounded="sm" sx={{ height: 28, width: 28 }} />
    </AppStack>
  </AppCard>
);

/* ==========================================================================
   5. NOTES TAB
   ========================================================================== */
const NotesTab = ({ customer }) => {
  const [notes, setNotes] = useState([
    { id: 1, text: customer.notes || "Initial customer setup completed. Verified Drug license credentials.", author: "Admin", date: "28 May 2024, 10:30 AM" },
  ]);
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newNote,
        author: "Admin",
        date: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      },
    ]);
    setNewNote("");
  };

  return (
    <div className="grid grid-cols-[1fr_360px] gap-4 items-start">
      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="border-b border-border px-4 py-3 bg-surface-alt/10">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Customer Notes</AppHeading>
        </div>
        <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="p-3 bg-surface-alt/30 border border-border rounded-lg space-y-1">
              <p className="text-[12.5px] text-text whitespace-pre-line leading-relaxed">{note.text}</p>
              <div className="flex items-center justify-between pt-1 text-[10px] text-text-muted font-medium">
                <span>By {note.author}</span>
                <span>{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      </AppCard>

      <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
        <div className="border-b border-border px-4 py-3 bg-surface-alt/10">
          <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Add New Note</AppHeading>
        </div>
        <div className="p-4 space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type your notes regarding payment agreements, delivery instructions, or license renewals..."
            className="w-full h-[120px] p-2.5 rounded-lg border border-border bg-surface text-[12.5px] leading-relaxed outline-none focus:border-primary transition"
          />
          <AppButton
            variant="contained"
            colorVariant="primary"
            rounded="md"
            size="small"
            onClick={handleAddNote}
            sx={{ width: "100%", height: 36, fontWeight: 700 }}
          >
            Save Note Entry
          </AppButton>
        </div>
      </AppCard>
    </div>
  );
};

/* ==========================================================================
   6. TIMELINE TAB
   ========================================================================== */
const TimelineTab = ({ customer }) => (
  <AppCard variant="default" rounded="lg" bordered padding="none" sx={sectionCardSx}>
    <div className="border-b border-border px-4 py-3.5 bg-surface-alt/10">
      <AppHeading level={2} weight={700} sx={cardHeaderTitleSx}>Audit Log Timeline</AppHeading>
      <span className="block text-[11px] text-text-muted mt-0.5">Chronological system changes, modifications, and administrative checks.</span>
    </div>
    <div className="p-6 max-w-[600px] space-y-6">
      <TimelineItem
        title="Customer Profile Opened"
        desc="Admin registered MedLife Pharmacy in the system."
        time={customer.createdAt ? formatDate(customer.createdAt) : "28 May 2024"}
        active
      />
      <TimelineItem
        title="Drug License Credentials Uploaded"
        desc="System automatically marked Drug License DL-25B-123456 as pending administrative verification."
        time={customer.createdAt ? formatDate(customer.createdAt) : "28 May 2024"}
        active
      />
    </div>
  </AppCard>
);

/* ==========================================================================
   PRESENTATIONAL HELPERS
   ========================================================================== */
const InfoRow = ({ label, value, vertical = false }) => (
  <div className={`text-[12px] ${vertical ? "flex flex-col gap-1" : "grid grid-cols-[140px_1fr] gap-2 items-start"}`}>
    <span className="font-bold text-text-muted leading-tight">{label}</span>
    <span className="font-semibold text-text break-words leading-tight">{value || "-"}</span>
  </div>
);

const SummaryItem = ({ label, value, icon, color }) => (
  <div className="flex items-center gap-3">
    <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[16px] shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <span className="block text-[10.5px] font-bold text-text-muted leading-tight">{label}</span>
      <span className="block text-[15.5px] font-black text-text mt-0.5 leading-tight">{value}</span>
    </div>
  </div>
);

const QuickActionButton = ({ label, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-surface text-[12px] font-bold text-text hover:bg-surface-alt/30 transition text-left"
  >
    <span className="text-[13px] text-primary">{icon}</span>
    {label}
  </button>
);

const DocItem = ({ name, date, size }) => (
  <div className="flex items-center justify-between p-3 hover:bg-surface-alt/10 transition">
    <div className="flex items-center gap-2 min-w-0">
      <FiFileText className="text-primary text-[15px] shrink-0" />
      <div className="min-w-0">
        <span className="block text-[12px] font-bold text-text truncate leading-tight">{name}</span>
        <span className="block text-[10px] text-text-muted mt-0.5 leading-none">{date} &bull; {size}</span>
      </div>
    </div>
    <AppIconButton icon={<FiDownload />} size="small" variant="outlined" colorVariant="neutral" rounded="md" />
  </div>
);

const TimelineItem = ({ title, desc, time, active = false }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center shrink-0">
      <div className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center ${active ? "border-primary bg-primary-soft text-primary" : "border-border bg-surface text-text-muted"}`}>
        <div className="h-1.5 w-1.5 rounded-full bg-current" />
      </div>
      <div className="w-[1.5px] flex-1 bg-border my-1" />
    </div>
    <div className="pb-4 min-w-0">
      <span className="block text-[12.5px] font-bold text-text leading-tight">{title}</span>
      <span className="block text-[11px] text-text-muted mt-1 leading-relaxed">{desc}</span>
      <span className="block text-[10px] text-text-muted/80 mt-1 font-semibold">{time}</span>
    </div>
  </div>
);

/* Styles */
const breadcrumbSx = { mb: 1 };
const breadcrumbItemSx = { fontSize: "11px", fontWeight: 700 };
const breadcrumbCurrentSx = { fontSize: "11px", fontWeight: 700 };
const pageTitleSx = { fontSize: "20px", fontWeight: 800, m: 0, color: "var(--app-color-text)", letterSpacing: "-0.4px" };
const subHeaderMetaDataSx = { mt: 0.15, fontSize: "11px", color: "var(--app-color-text-muted)" };
const secondaryButtonSx = { height: 32, fontSize: "11.5px", fontWeight: 700, borderColor: "var(--app-color-border-strong)" };
const sectionCardSx = { bgcolor: "var(--app-color-surface)", borderColor: "var(--app-color-border)", boxShadow: "var(--app-shadow-xs)" };
const cardHeaderTitleSx = { m: 0, fontSize: "12.5px", fontWeight: 800, color: "var(--app-color-text)", textTransform: "uppercase", letterSpacing: "0.2px" };

export default CustomerDetailsDesktopPage;
