import React, { useState, useMemo } from "react";
import {
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiPlay,
  FiArrowLeft,
  FiList,
  FiBookOpen,
  FiUsers,
  FiTruck,
  FiTrendingUp,
  FiLayers,
  FiFileText,
} from "react-icons/fi";
import { FaWallet, FaUniversity } from "react-icons/fa";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppStack,
  AppText,
  AppButton,
} from "@/components";
import { formatDate } from "@/utils";
import { API_STATUS } from "@/constants";

// 9 report modules metadata
const REPORT_MODULES = [
  {
    key: "trial-balance",
    title: "Trial Balance",
    desc: "Summary of all ledger accounts with debit, credit and closing balances. Total Debits = Total Credits.",
    icon: <FiList />,
  },
  {
    key: "general-ledger",
    title: "General Ledger",
    desc: "Complete transaction history for any account within a selected date range.",
    icon: <FiBookOpen />,
  },
  {
    key: "customer-ledger",
    title: "Customer Ledger",
    desc: "Detailed statement for a specific customer including invoices, receipts and outstanding balance.",
    icon: <FiUsers />,
  },
  {
    key: "supplier-ledger",
    title: "Supplier Ledger",
    desc: "Detailed statement for a specific supplier including bills, payments and outstanding balance.",
    icon: <FiTruck />,
  },
  {
    key: "cash-book",
    title: "Cash Book",
    desc: "All cash inflows and outflows. Daily and monthly cash position with running balance.",
    icon: <FaWallet />,
  },
  {
    key: "bank-book",
    title: "Bank Book",
    desc: "All bank transactions including deposits, withdrawals, transfers and cheques.",
    icon: <FaUniversity />,
  },
  {
    key: "profit-loss",
    title: "Profit & Loss Statement",
    desc: "Summary of income and expenses to calculate Net Profit or Loss for a period.",
    icon: <FiTrendingUp />,
  },
  {
    key: "balance-sheet",
    title: "Balance Sheet",
    desc: "Statement of Assets, Liabilities and Equity as on a specific date.",
    icon: <FiLayers />,
  },
  {
    key: "gst-report",
    title: "GST Reports",
    desc: "GST reports including GSTR-1, GSTR-2 and GST Summary for compliance filing.",
    icon: <FiFileText />,
  },
];

const ReportViewerMobilePage = ({
  reportType,
  reportData,
  status,
  error,
  message,
  filters,
  accountOptions = [],
  customerOptions = [],
  supplierOptions = [],
  handleFilterChange,
  runReport,
  handleBackToDashboard,
  clearFeedback,
}) => {
  const [showFilters, setShowFilters] = useState(true);

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return "₹ " + Math.abs(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const navigateToReport = (key) => {
    window.location.pathname = `/finance/reports/${key}`;
  };

  const isLoading = status === API_STATUS.LOADING;
  const isError = status === API_STATUS.ERROR;

  const currentReportLabel = useMemo(() => {
    return REPORT_MODULES.find((opt) => opt.key === reportType)?.title || "Report";
  }, [reportType]);

  return (
    <section className="w-full bg-bg pb-6 px-3">
      {/* Mobile Page Header with Back Button */}
      <AppBox sx={headerWrapperSx}>
        <AppStack direction="row" align="center" gap={1.5}>
          <button
            onClick={handleBackToDashboard}
            className="p-1 border border-border hover:bg-surface-hover rounded-md shrink-0 text-text-muted cursor-pointer"
          >
            <FiArrowLeft className="text-[18px]" />
          </button>
          <div className="min-w-0">
            <AppHeading level={1} weight={700} sx={pageTitleSx}>
              {currentReportLabel}
            </AppHeading>
            <AppText variant="body2" sx={pageSubtitleSx}>
              View statement balances
            </AppText>
          </div>
        </AppStack>
      </AppBox>

      {/* Feedback Alerts */}
      {(error || message) && (
        <div
          className={`mb-3 p-3 text-[11.5px] font-semibold rounded-md flex justify-between items-center ${
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


      {/* Collapsible Filters */}
      <div className="mb-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full px-3 py-2 border rounded-md flex items-center justify-between text-[11.5px] font-bold transition ${
            showFilters
              ? "bg-primary-soft border-primary/30 text-primary"
              : "bg-surface border-border text-text"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <FiFilter className="text-[14px]" />
            Filters Configuration
          </span>
          {showFilters ? <FiChevronUp className="text-[14px]" /> : <FiChevronDown className="text-[14px]" />}
        </button>

        {showFilters && (
          <AppCard variant="default" rounded="none" bordered className="border-t-0 p-3 flex flex-col gap-3">
            {/* Trial Balance & Balance Sheet Date */}
            {(reportType === "trial-balance" || reportType === "balance-sheet") && (
              <AppInput
                type="date"
                label="As Of Date"
                name="asOfDate"
                value={filters.asOfDate}
                onChange={(e) => handleFilterChange("asOfDate", e.target.value)}
                size="small"
                fullWidth
                labelSx={filterLabelSx}
              />
            )}

            {/* include zero balance checkbox */}
            {reportType === "trial-balance" && (
              <label className="flex items-center gap-2 text-[12px] font-semibold text-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  checked={filters.includeZeroBalances}
                  onChange={(e) => handleFilterChange("includeZeroBalances", e.target.checked)}
                />
                Include Zero Balances
              </label>
            )}

            {/* Date Ranges */}
            {reportType !== "trial-balance" && reportType !== "balance-sheet" && (
              <div className="grid grid-cols-2 gap-2">
                <AppInput
                  type="date"
                  label="From Date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  size="small"
                  fullWidth
                  labelSx={filterLabelSx}
                />
                <AppInput
                  type="date"
                  label="To Date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  size="small"
                  fullWidth
                  labelSx={filterLabelSx}
                />
              </div>
            )}

            {/* Account Selector */}
            {(reportType === "general-ledger" ||
              reportType === "cash-book" ||
              reportType === "bank-book" ||
              reportType === "customer-ledger" ||
              reportType === "supplier-ledger") && (
              <AppSelect
                label="Account"
                name="accountId"
                value={filters.accountId}
                onChange={(e) => handleFilterChange("accountId", e.target.value)}
                options={accountOptions}
                size="small"
                variant="bordered"
                rounded="md"
                fullWidth
                labelSx={filterLabelSx}
              />
            )}

            {/* Customer Selector */}
            {reportType === "customer-ledger" && (
              <AppSelect
                label="Customer"
                name="customerId"
                value={filters.customerId}
                onChange={(e) => handleFilterChange("customerId", e.target.value)}
                options={customerOptions}
                size="small"
                variant="bordered"
                rounded="md"
                fullWidth
                labelSx={filterLabelSx}
              />
            )}

            {/* Supplier Selector */}
            {reportType === "supplier-ledger" && (
              <AppSelect
                label="Supplier"
                name="supplierId"
                value={filters.supplierId}
                onChange={(e) => handleFilterChange("supplierId", e.target.value)}
                options={supplierOptions}
                size="small"
                variant="bordered"
                rounded="md"
                fullWidth
                labelSx={filterLabelSx}
              />
            )}

            {/* GST Type Selector */}
            {reportType === "gst-report" && (
              <AppSelect
                label="GST Report Type"
                name="gstType"
                value={filters.gstType}
                onChange={(e) => handleFilterChange("gstType", e.target.value)}
                options={[
                  { label: "GST Summary", value: "SUMMARY" },
                  { label: "GSTR-1 (Sales)", value: "GSTR1" },
                  { label: "GSTR-2 (Purchases)", value: "GSTR2" },
                ]}
                size="small"
                variant="bordered"
                rounded="md"
                fullWidth
                labelSx={filterLabelSx}
              />
            )}

            <AppButton
              variant="contained"
              colorVariant="primary"
              size="small"
              rounded="md"
              startIcon={<FiPlay />}
              onClick={() => {
                runReport();
                setShowFilters(false);
              }}
              disabled={isLoading}
              loading={isLoading}
              fullWidth
            >
              Run Report
            </AppButton>
          </AppCard>
        )}
      </div>

      {/* Output Content Card */}
      <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none">
        <div className="p-3 bg-surface-hover/20 border-b border-border">
          <span className="text-[12px] font-black text-text uppercase block">
            {currentReportLabel} Data
          </span>
        </div>

        <div className="p-3">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
              <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)" }}>
                Loading report data...
              </AppText>
            </div>
          ) : isError ? (
            <div className="py-12 text-center text-danger text-[12px]">
              Failed to load report: {error || "An error occurred."}
            </div>
          ) : !reportData ? (
            <div className="py-12 text-center text-text-muted text-[12px]">
              Select parameters above and click "Run Report" to display figures.
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              {reportType === "trial-balance" && (
                <MobileTrialBalance data={reportData} formatCurrency={formatCurrency} />
              )}
              {(reportType === "general-ledger" ||
                reportType === "customer-ledger" ||
                reportType === "supplier-ledger" ||
                reportType === "cash-book" ||
                reportType === "bank-book") && (
                <MobileLedger data={reportData} formatCurrency={formatCurrency} />
              )}
              {reportType === "profit-loss" && (
                <MobileProfitLoss data={reportData} formatCurrency={formatCurrency} />
              )}
              {reportType === "balance-sheet" && (
                <MobileBalanceSheet data={reportData} formatCurrency={formatCurrency} />
              )}
              {reportType === "gst-report" && (
                <MobileGst data={reportData} gstType={filters.gstType} formatCurrency={formatCurrency} />
              )}
            </div>
          )}
        </div>
      </AppCard>
    </section>
  );
};

/* Mobile Specific Tables Subviews */
const MobileTrialBalance = ({ data, formatCurrency }) => {
  const rows = data.rows || [];
  return (
    <table className="w-full text-left border-collapse text-[11px] min-w-[500px]">
      <thead>
        <tr className="border-b border-border text-text font-bold">
          <th className="py-2 font-bold">Code</th>
          <th className="py-2 font-bold">Account</th>
          <th className="py-2 text-right font-bold">Dr</th>
          <th className="py-2 text-right font-bold">Cr</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr key={r.accountId || idx} className="border-b border-border">
            <td className="py-2 font-mono font-semibold text-text-muted">{r.accountCode}</td>
            <td className="py-2 text-text font-bold">{r.accountName}</td>
            <td className="py-2 text-right text-[#2b8a3e]">{r.debitTotal > 0 ? formatCurrency(r.debitTotal) : "-"}</td>
            <td className="py-2 text-right text-[#c92a2a]">{r.creditTotal > 0 ? formatCurrency(r.creditTotal) : "-"}</td>
          </tr>
        ))}
        <tr className="font-extrabold border-t border-text text-text">
          <td colSpan={2} className="py-2 text-right">Totals</td>
          <td className="py-2 text-right text-[#2b8a3e]">{formatCurrency(data.totalDebit)}</td>
          <td className="py-2 text-right text-[#c92a2a]">{formatCurrency(data.totalCredit)}</td>
        </tr>
      </tbody>
    </table>
  );
};

const MobileLedger = ({ data, formatCurrency }) => {
  const entries = data.entries || [];
  const openingBalance = data.openingBalance || 0;
  const openingBalanceType = data.openingBalanceType || "DR";
  const totals = data.totals || { debit: 0, credit: 0, closingBalance: 0, closingBalanceType: "DR" };

  return (
    <div>
      <div className="flex justify-between border-b border-border pb-2 text-[11.5px] font-bold text-text-muted">
        <span>Op. Bal: {formatCurrency(openingBalance)} {openingBalanceType}</span>
        <span>Cl. Bal: {formatCurrency(totals.closingBalance)} {totals.closingBalanceType}</span>
      </div>
      <table className="w-full text-left border-collapse text-[11px] min-w-[500px] mt-2">
        <thead>
          <tr className="border-b border-border text-text font-bold">
            <th className="py-2 font-bold">Date</th>
            <th className="py-2 font-bold">Voucher</th>
            <th className="py-2 text-right font-bold">Dr</th>
            <th className="py-2 text-right font-bold">Cr</th>
            <th className="py-2 text-right font-bold">Balance</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, idx) => (
            <tr key={e._id || idx} className="border-b border-border">
              <td className="py-2 text-text-muted">{formatDate(e.voucherDate)}</td>
              <td className="py-2 text-text font-bold font-mono">{e.voucherNumber || e.voucherId?.voucherNumber || "OP"}</td>
              <td className="py-2 text-right text-[#2b8a3e]">{e.debit > 0 ? formatCurrency(e.debit) : "-"}</td>
              <td className="py-2 text-right text-[#c92a2a]">{e.credit > 0 ? formatCurrency(e.credit) : "-"}</td>
              <td className="py-2 text-right text-text font-black">{formatCurrency(Math.abs(e.runningBalance))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MobileProfitLoss = ({ data, formatCurrency }) => {
  return (
    <div className="text-[11.5px]">
      <div className="flex justify-between font-bold py-1 border-b border-border">
        <span>Total Revenue:</span>
        <span className="text-[#2b8a3e]">{formatCurrency(data.totalIncome)}</span>
      </div>
      <div className="flex justify-between font-bold py-1 border-b border-border mt-1">
        <span>Total Expenses:</span>
        <span className="text-[#c92a2a]">{formatCurrency(data.totalExpenses)}</span>
      </div>
      <div className="flex justify-between font-black py-2 mt-2 bg-primary-soft border border-primary/20 rounded px-2">
        <span>{data.isProfit ? "Net Profit" : "Net Loss"}:</span>
        <span className={data.isProfit ? "text-[#2b8a3e]" : "text-[#c92a2a]"}>{formatCurrency(data.netProfit)}</span>
      </div>
    </div>
  );
};

const MobileBalanceSheet = ({ data, formatCurrency }) => {
  return (
    <div className="text-[11.5px]">
      <div className="flex justify-between font-bold py-1 border-b border-border">
        <span>Total Assets:</span>
        <span>{formatCurrency(data.totalAssets)}</span>
      </div>
      <div className="flex justify-between font-bold py-1 border-b border-border mt-1">
        <span>Total Liabilities & Equity:</span>
        <span>{formatCurrency(data.totalLiabilitiesAndEquity)}</span>
      </div>
      <div className="flex justify-between font-black py-2 mt-2 bg-surface-hover/20 rounded px-2">
        <span>Balanced Check:</span>
        <span className={data.isBalanced ? "text-[#2b8a3e]" : "text-[#c92a2a]"}>
          {data.isBalanced ? "BALANCED" : "OUT OF BALANCE"}
        </span>
      </div>
    </div>
  );
};

const MobileGst = ({ data, gstType, formatCurrency }) => {
  return (
    <div className="text-[11.5px]">
      <div className="flex justify-between font-semibold py-1">
        <span>Output GST:</span>
        <span className="text-[#c92a2a]">{formatCurrency(data.totalOutputGst)}</span>
      </div>
      <div className="flex justify-between font-semibold py-1">
        <span>Input GST (ITC):</span>
        <span className="text-[#2b8a3e]">{formatCurrency(data.totalInputGst)}</span>
      </div>
      <div className="flex justify-between font-black py-2 border-t border-border mt-1">
        <span>Net GST Payable:</span>
        <span className={data.netGstPayable >= 0 ? "text-[#c92a2a]" : "text-[#2b8a3e]"}>
          {formatCurrency(Math.abs(data.netGstPayable))}
        </span>
      </div>
    </div>
  );
};

/* Styles */
const headerWrapperSx = { px: 1, pt: 3, pb: 2 };
const pageTitleSx = {
  fontSize: "20px",
  lineHeight: 1.2,
  color: "var(--app-color-text)",
  m: 0,
};
const pageSubtitleSx = {
  fontSize: "12px",
  color: "var(--app-color-text-muted)",
  mt: 0.5,
};

const filterLabelSx = {
  fontSize: "11px",
  fontWeight: 700,
  color: "var(--app-color-text-muted)",
  mb: 0.5,
};

export default ReportViewerMobilePage;
