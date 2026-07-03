import React, { useMemo } from "react";
import {
  FiList,
  FiBookOpen,
  FiUsers,
  FiTruck,
  FiDollarSign,
  FiBriefcase,
  FiTrendingUp,
  FiLayers,
  FiFileText,
  FiPrinter,
  FiPlay,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { FaWallet, FaUniversity } from "react-icons/fa";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppSelect,
  AppText,
  PageHeader,
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

const ReportViewerDesktopPage = ({
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
  const currentReportInfo = useMemo(() => {
    return REPORT_MODULES.find((r) => r.key === reportType);
  }, [reportType]);

  const navigateToReport = (key) => {
    window.location.pathname = `/finance/reports/${key}`;
  };

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    const formatted = Math.abs(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `₹ ${formatted}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const isLoading = status === API_STATUS.LOADING;
  const isError = status === API_STATUS.ERROR;
  const activeReportTitle = currentReportInfo?.title || "Financial Report";

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      {/* Dynamic Printing CSS */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          section {
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
          }
          nav, header, button, .no-print, [role="button"], .breadcrumb-container, .filters-container, .sidebar-container {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <div className="no-print">
          <PageHeader
            title={activeReportTitle}
            subtitle={currentReportInfo?.desc}
            extra={
              <AppBreadcrumb
                size="small"
                variant="text"
                items={[
                  { label: "Dashboard" },
                  { label: "Finance & Accounting" },
                  { label: "Reports", onClick: handleBackToDashboard },
                  { label: activeReportTitle, current: true },
                ]}
                sx={breadcrumbSx}
                itemSx={breadcrumbItemSx}
                currentItemSx={breadcrumbCurrentSx}
              />
            }
            actions={
              <AppButton
                variant="outlined"
                colorVariant="neutral"
                size="small"
                rounded="md"
                startIcon={<FiArrowLeft />}
                onClick={handleBackToDashboard}
                sx={backBtnSx}
              >
                Back to Reports
              </AppButton>
            }
            align="flex-start"
            justify="space-between"
            sx={pageHeaderSx}
            contentSx={pageHeaderContentSx}
          />
        </div>

        {/* Feedback Alert */}
        {(error || message) && (
          <div
            className={`mt-4 p-3 text-[12.5px] font-semibold rounded-md flex justify-between items-center no-print ${
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

        <div className="mt-5 print-full-width">
            {/* Filters */}
            <div className="no-print mb-4">
              <AppCard variant="default" rounded="lg" bordered shadow="sm">
                <div className="p-4 flex flex-wrap items-end justify-between gap-4">
                  <div className="flex flex-wrap items-end gap-3">
                    {/* Trial Balance & Balance Sheet Date */}
                    {(reportType === "trial-balance" || reportType === "balance-sheet") && (
                      <AppInput
                        type="date"
                        label="As Of Date"
                        name="asOfDate"
                        value={filters.asOfDate}
                        onChange={(e) => handleFilterChange("asOfDate", e.target.value)}
                        size="small"
                        formControlSx={{ width: 160 }}
                        inputSx={compactFilterInputSx}
                        labelSx={filterLabelSx}
                      />
                    )}

                    {/* include zero balance checkbox */}
                    {reportType === "trial-balance" && (
                      <div className="flex items-center h-8 mb-0.5">
                        <label className="flex items-center gap-2 text-[11.5px] font-semibold text-text cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                            checked={filters.includeZeroBalances}
                            onChange={(e) =>
                              handleFilterChange("includeZeroBalances", e.target.checked)
                            }
                          />
                          Include Zero Balances
                        </label>
                      </div>
                    )}

                    {/* Date Ranges */}
                    {reportType !== "trial-balance" && reportType !== "balance-sheet" && (
                      <>
                        <AppInput
                          type="date"
                          label="From Date"
                          name="startDate"
                          value={filters.startDate}
                          onChange={(e) => handleFilterChange("startDate", e.target.value)}
                          size="small"
                          formControlSx={{ width: 160 }}
                          inputSx={compactFilterInputSx}
                          labelSx={filterLabelSx}
                        />
                        <AppInput
                          type="date"
                          label="To Date"
                          name="endDate"
                          value={filters.endDate}
                          onChange={(e) => handleFilterChange("endDate", e.target.value)}
                          size="small"
                          formControlSx={{ width: 160 }}
                          inputSx={compactFilterInputSx}
                          labelSx={filterLabelSx}
                        />
                      </>
                    )}

                    {/* Account Selector */}
                    {(reportType === "general-ledger" ||
                      reportType === "cash-book" ||
                      reportType === "bank-book" ||
                      reportType === "customer-ledger" ||
                      reportType === "supplier-ledger") && (
                      <AppSelect
                        label="Account Filter"
                        name="accountId"
                        value={filters.accountId}
                        onChange={(e) => handleFilterChange("accountId", e.target.value)}
                        options={accountOptions}
                        size="small"
                        variant="bordered"
                        rounded="md"
                        formControlSx={{ width: 200 }}
                        inputSx={compactFilterInputSx}
                        labelSx={filterLabelSx}
                      />
                    )}

                    {/* Customer Selector */}
                    {reportType === "customer-ledger" && (
                      <AppSelect
                        label="Select Customer"
                        name="customerId"
                        value={filters.customerId}
                        onChange={(e) => handleFilterChange("customerId", e.target.value)}
                        options={customerOptions}
                        size="small"
                        variant="bordered"
                        rounded="md"
                        formControlSx={{ width: 200 }}
                        inputSx={compactFilterInputSx}
                        labelSx={filterLabelSx}
                      />
                    )}

                    {/* Supplier Selector */}
                    {reportType === "supplier-ledger" && (
                      <AppSelect
                        label="Select Supplier"
                        name="supplierId"
                        value={filters.supplierId}
                        onChange={(e) => handleFilterChange("supplierId", e.target.value)}
                        options={supplierOptions}
                        size="small"
                        variant="bordered"
                        rounded="md"
                        formControlSx={{ width: 200 }}
                        inputSx={compactFilterInputSx}
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
                        formControlSx={{ width: 180 }}
                        inputSx={compactFilterInputSx}
                        labelSx={filterLabelSx}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <AppButton
                      variant="contained"
                      colorVariant="primary"
                      size="small"
                      rounded="md"
                      startIcon={<FiPlay />}
                      onClick={runReport}
                      disabled={isLoading}
                      loading={isLoading}
                      sx={actionBtnSx}
                    >
                      Run Report
                    </AppButton>
                    <AppButton
                      variant="outlined"
                      colorVariant="primary"
                      size="small"
                      rounded="md"
                      startIcon={<FiPrinter />}
                      onClick={handlePrint}
                      disabled={isLoading || !reportData}
                      sx={actionBtnSx}
                    >
                      Print
                    </AppButton>
                  </div>
                </div>
              </AppCard>
            </div>

            {/* Content Area */}
            <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none" className="print-full-width">
              <div id="printable-report-area" className="p-6">
                <div className="border-b border-border pb-4 mb-5 flex justify-between items-start">
                  <div>
                    <h2 className="text-[18px] font-black text-text uppercase tracking-tight">
                      {activeReportTitle}
                    </h2>
                    <p className="text-[11px] text-text-muted mt-1">
                      {currentReportInfo?.desc}
                    </p>
                  </div>
                  <div className="text-right text-[10.5px] text-text-muted">
                    <span className="block font-bold">Generated: {formatDate(new Date())}</span>
                    {filters.asOfDate && (
                      <span className="block mt-0.5">As of: {formatDate(filters.asOfDate)}</span>
                    )}
                    {filters.startDate && filters.endDate && (
                      <span className="block mt-0.5">
                        Period: {formatDate(filters.startDate)} to {formatDate(filters.endDate)}
                      </span>
                    )}
                  </div>
                </div>

                {isLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                    <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", fontWeight: 650 }}>
                      Loading report data...
                    </AppText>
                  </div>
                ) : isError ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <FiAlertCircle className="text-[36px] text-danger mb-3" />
                    <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                      Report Error
                    </AppHeading>
                    <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                      {error || "An error occurred while compiling ledger accounts."}
                    </AppText>
                  </div>
                ) : !reportData ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <FiPlay className="text-[36px] text-text-muted/40 mb-3" />
                    <AppHeading level={3} weight={600} sx={{ m: 0, fontSize: "14px", color: "var(--app-color-text)" }}>
                      No Data Selected
                    </AppHeading>
                    <AppText variant="body2" sx={{ color: "var(--app-color-text-muted)", mt: 0.5 }}>
                      Select filter parameters above and click "Run Report" to populate.
                    </AppText>
                  </div>
                ) : (
                  <div>
                    {reportType === "trial-balance" && (
                      <TrialBalanceView data={reportData} formatCurrency={formatCurrency} />
                    )}
                    {(reportType === "general-ledger" ||
                      reportType === "customer-ledger" ||
                      reportType === "supplier-ledger" ||
                      reportType === "cash-book" ||
                      reportType === "bank-book") && (
                      <LedgerBookView data={reportData} formatCurrency={formatCurrency} />
                    )}
                    {reportType === "profit-loss" && (
                      <ProfitLossView data={reportData} formatCurrency={formatCurrency} />
                    )}
                    {reportType === "balance-sheet" && (
                      <BalanceSheetView data={reportData} formatCurrency={formatCurrency} />
                    )}
                    {reportType === "gst-report" && (
                      <GstReportView
                        data={reportData}
                        gstType={filters.gstType}
                        formatCurrency={formatCurrency}
                      />
                    )}
                  </div>
                )}
              </div>
            </AppCard>
        </div>
      </div>
    </section>
  );
};

/* Child View Tables identical to ReportsDesktopPage */
const TrialBalanceView = ({ data, formatCurrency }) => {
  const rows = data.rows || [];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-border bg-surface-hover/20 text-text font-bold">
            <th className="py-3 px-4 font-bold">Code</th>
            <th className="py-3 px-4 font-bold">Account Name</th>
            <th className="py-3 px-4 font-bold">Nature</th>
            <th className="py-3 px-4 font-bold">Category</th>
            <th className="py-3 px-4 text-right font-bold">Debit Total (Dr)</th>
            <th className="py-3 px-4 text-right font-bold">Credit Total (Cr)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.accountId || idx} className="border-b border-border hover:bg-surface-hover/10 transition">
              <td className="py-2.5 px-4 font-mono font-bold text-text-muted">{row.accountCode}</td>
              <td className="py-2.5 px-4 font-semibold text-text">{row.accountName}</td>
              <td className="py-2.5 px-4 text-text-muted">{row.accountNature}</td>
              <td className="py-2.5 px-4 text-text-muted">{row.accountCategory}</td>
              <td className="py-2.5 px-4 text-right font-semibold text-[#2b8a3e]">
                {row.debitTotal > 0 ? formatCurrency(row.debitTotal) : "-"}
              </td>
              <td className="py-2.5 px-4 text-right font-semibold text-[#c92a2a]">
                {row.creditTotal > 0 ? formatCurrency(row.creditTotal) : "-"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-b-2 border-t-2 border-text bg-surface-hover/30 font-bold text-text">
            <td colSpan={4} className="py-3.5 px-4 text-right font-bold">Total Balances</td>
            <td className="py-3.5 px-4 text-right font-black text-[#2b8a3e]">{formatCurrency(data.totalDebit)}</td>
            <td className="py-3.5 px-4 text-right font-black text-[#c92a2a]">{formatCurrency(data.totalCredit)}</td>
          </tr>
        </tfoot>
      </table>
      <div className="mt-5 p-4 rounded-lg flex items-center justify-between border no-print bg-surface-hover/20">
        <div className="flex items-center gap-3">
          {data.isBalanced ? <FiCheckCircle className="text-[22px] text-[#2b8a3e]" /> : <FiAlertCircle className="text-[22px] text-[#c92a2a]" />}
          <div>
            <span className="block text-[13px] font-bold text-text">
              Status: {data.isBalanced ? "Balanced" : "Out of Balance"}
            </span>
            <span className="block text-[11.5px] text-text-muted mt-0.5">Difference checking.</span>
          </div>
        </div>
        <div>
          <span className={`text-[16px] font-black ${data.isBalanced ? "text-[#2b8a3e]" : "text-[#c92a2a]"}`}>
            {formatCurrency(Math.abs(data.totalDebit - data.totalCredit))}
          </span>
        </div>
      </div>
    </div>
  );
};

const LedgerBookView = ({ data, formatCurrency }) => {
  const entries = data.entries || [];
  const openingBalance = data.openingBalance || 0;
  const openingBalanceType = data.openingBalanceType || "DR";
  const totals = data.totals || { debit: 0, credit: 0, closingBalance: 0, closingBalanceType: "DR" };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6 no-print">
        <div className="border border-border p-4 bg-surface rounded-lg">
          <span className="text-[10px] font-bold uppercase text-text-muted block">Opening Balance</span>
          <span className="text-[16px] font-extrabold text-text mt-1 block">
            {formatCurrency(openingBalance)} <span className="text-[10px] text-text-muted font-black">{openingBalanceType}</span>
          </span>
        </div>
        <div className="border border-border p-4 bg-surface rounded-lg">
          <span className="text-[10px] font-bold uppercase text-text-muted block">Total Debits</span>
          <span className="text-[16px] font-extrabold text-[#2b8a3e] mt-1 block">{formatCurrency(totals.debit)}</span>
        </div>
        <div className="border border-border p-4 bg-surface rounded-lg">
          <span className="text-[10px] font-bold uppercase text-text-muted block">Total Credits</span>
          <span className="text-[16px] font-extrabold text-[#c92a2a] mt-1 block">{formatCurrency(totals.credit)}</span>
        </div>
        <div className="border border-border p-4 bg-surface rounded-lg">
          <span className="text-[10px] font-bold uppercase text-text-muted block">Closing Balance</span>
          <span className="text-[16px] font-extrabold text-primary mt-1 block">
            {formatCurrency(totals.closingBalance)} <span className="text-[10px] text-text-muted font-black">{totals.closingBalanceType}</span>
          </span>
        </div>
      </div>

      <table className="w-full text-left border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-border bg-surface-hover/20 font-bold text-text">
            <th className="py-3 px-4 font-bold">Date</th>
            <th className="py-3 px-4 font-bold">Voucher No</th>
            <th className="py-3 px-4 font-bold">Account Name</th>
            <th className="py-3 px-4 font-bold">Narration</th>
            <th className="py-3 px-4 text-right font-bold">Debit (Dr)</th>
            <th className="py-3 px-4 text-right font-bold">Credit (Cr)</th>
            <th className="py-3 px-4 text-right font-bold">Running Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border bg-surface-hover/5">
            <td colSpan={4} className="py-2.5 px-4 text-text-muted italic">Opening balance carried forward</td>
            <td className="py-2.5 px-4 text-right font-semibold text-[#2b8a3e]">{openingBalanceType === "DR" ? formatCurrency(openingBalance) : "-"}</td>
            <td className="py-2.5 px-4 text-right font-semibold text-[#c92a2a]">{openingBalanceType === "CR" ? formatCurrency(openingBalance) : "-"}</td>
            <td className="py-2.5 px-4 text-right font-bold text-text">
              {formatCurrency(openingBalance)} <span className="text-[9.5px] text-text-muted font-black uppercase">{openingBalanceType}</span>
            </td>
          </tr>
          {entries.map((e, idx) => (
            <tr key={e._id || idx} className="border-b border-border hover:bg-surface-hover/10 transition">
              <td className="py-2.5 px-4 text-text-muted">{formatDate(e.voucherDate)}</td>
              <td className="py-2.5 px-4 font-mono font-bold text-text">{e.voucherNumber || e.voucherId?.voucherNumber || "-"}</td>
              <td className="py-2.5 px-4 font-semibold text-text">{e.accountId?.accountName || "-"}</td>
              <td className="py-2.5 px-4 text-text-muted truncate max-w-[200px]" title={e.narration}>{e.narration || e.voucherId?.narration || "-"}</td>
              <td className="py-2.5 px-4 text-right font-semibold text-[#2b8a3e]">{e.debit > 0 ? formatCurrency(e.debit) : "-"}</td>
              <td className="py-2.5 px-4 text-right font-semibold text-[#c92a2a]">{e.credit > 0 ? formatCurrency(e.credit) : "-"}</td>
              <td className="py-2.5 px-4 text-right font-bold text-text">
                {formatCurrency(Math.abs(e.runningBalance))} <span className="text-[9.5px] text-text-muted font-black ml-1 uppercase">{e.runningBalance >= 0 ? "dr" : "cr"}</span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-b-2 border-t font-bold text-text bg-surface-hover/30">
            <td colSpan={4} className="py-3 px-4 text-right font-bold">Period Totals</td>
            <td className="py-3 px-4 text-right font-black text-[#2b8a3e]">{formatCurrency(totals.debit)}</td>
            <td className="py-3 px-4 text-right font-black text-[#c92a2a]">{formatCurrency(totals.credit)}</td>
            <td className="py-3 px-4 text-right font-black text-primary">
              {formatCurrency(totals.closingBalance)} <span className="text-[9.5px] text-text-muted font-black uppercase">{totals.closingBalanceType}</span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

const ProfitLossView = ({ data, formatCurrency }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-8 mt-5">
        <div>
          <h3 className="text-[13px] font-black text-text border-b border-text pb-2 uppercase">Income / Revenues</h3>
          <table className="w-full text-left mt-2 text-[12px]">
            <tbody>
              {data.income?.map((item, idx) => (
                <tr key={item.accountId || idx} className="border-b border-border">
                  <td className="py-2 font-mono text-[11px] text-text-muted w-16">{item.accountCode}</td>
                  <td className="py-2 font-semibold text-text">{item.accountName}</td>
                  <td className="py-2 text-right font-bold text-[#2b8a3e]">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t border-text text-text">
                <td colSpan={2} className="py-3 text-right">Total Revenue</td>
                <td className="py-3 text-right text-[#2b8a3e] font-black">{formatCurrency(data.totalIncome)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          <h3 className="text-[13px] font-black text-text border-b border-text pb-2 uppercase">Operating Expenses</h3>
          <table className="w-full text-left mt-2 text-[12px]">
            <tbody>
              {data.expenses?.map((item, idx) => (
                <tr key={item.accountId || idx} className="border-b border-border">
                  <td className="py-2 font-mono text-[11px] text-text-muted w-16">{item.accountCode}</td>
                  <td className="py-2 font-semibold text-text">{item.accountName}</td>
                  <td className="py-2 text-right font-bold text-[#c92a2a]">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t border-text text-text">
                <td colSpan={2} className="py-3 text-right">Total Expenses</td>
                <td className="py-3 text-right text-[#c92a2a] font-black">{formatCurrency(data.totalExpenses)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="mt-8 p-5 rounded-lg flex items-center justify-between border border-primary/20 bg-primary-soft">
        <div>
          <span className="block text-[14px] font-black text-text uppercase">Net Result ({data.isProfit ? "Net Profit" : "Net Loss"})</span>
          <span className="block text-[11.5px] text-text-muted mt-0.5">Revenue minus Expenses.</span>
        </div>
        <span className={`text-[20px] font-black ${data.isProfit ? "text-[#2b8a3e]" : "text-[#c92a2a]"}`}>{formatCurrency(data.netProfit)}</span>
      </div>
    </div>
  );
};

const BalanceSheetView = ({ data, formatCurrency }) => {
  return (
    <div>
      <div className="grid grid-cols-2 gap-8 mt-5">
        <div>
          <h3 className="text-[13px] font-black text-text border-b border-text pb-2 uppercase">Assets</h3>
          <table className="w-full text-left mt-2 text-[12px]">
            <tbody>
              {data.assets?.map((item, idx) => (
                <tr key={item.accountId || idx} className="border-b border-border">
                  <td className="py-2 font-mono text-[11px] text-text-muted w-16">{item.accountCode}</td>
                  <td className="py-2 font-semibold text-text">{item.accountName}</td>
                  <td className="py-2 text-right font-bold text-text">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t border-text text-text bg-surface-hover/10">
                <td colSpan={2} className="py-3 px-2 text-right">Total Assets</td>
                <td className="py-3 px-2 text-right text-primary font-black">{formatCurrency(data.totalAssets)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div>
          <h3 className="text-[13px] font-black text-text border-b border-text pb-2 uppercase">Liabilities & Owner Equity</h3>
          <table className="w-full text-left mt-2 text-[12px]">
            <tbody>
              <tr className="bg-surface-hover/10"><td colSpan={3} className="py-1 px-2 text-[10px] font-black text-text uppercase">Liabilities</td></tr>
              {data.liabilities?.map((item, idx) => (
                <tr key={item.accountId || idx} className="border-b border-border">
                  <td className="py-2 px-2 font-mono text-[11px] text-text-muted w-16">{item.accountCode}</td>
                  <td className="py-2 px-2 font-semibold text-text">{item.accountName}</td>
                  <td className="py-2 px-2 text-right font-bold text-text">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr className="bg-surface-hover/10"><td colSpan={3} className="py-1 px-2 text-[10px] font-black text-text uppercase">Equity</td></tr>
              {data.equity?.map((item, idx) => (
                <tr key={item.accountId || idx} className="border-b border-border">
                  <td className="py-2 px-2 font-mono text-[11px] text-text-muted w-16">{item.accountCode}</td>
                  <td className="py-2 px-2 font-semibold text-text">{item.accountName}</td>
                  <td className="py-2 px-2 text-right font-bold text-text">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr className="border-b border-border">
                <td className="py-2 px-2 font-mono text-[11px] text-text-muted w-16">-</td>
                <td className="py-2 px-2 font-semibold text-text italic">Retained Earnings (Net Profit)</td>
                <td className="py-2 px-2 text-right font-bold text-[#2b8a3e]">{formatCurrency(data.retainedEarnings)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="font-bold border-t border-text text-text bg-surface-hover/10">
                <td colSpan={2} className="py-3 px-2 text-right">Total Liabilities & Equity</td>
                <td className="py-3 px-2 text-right text-primary font-black">{formatCurrency(data.totalLiabilitiesAndEquity)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="mt-8 p-4 rounded-lg flex items-center justify-between border no-print bg-surface-hover/20">
        <div className="flex items-center gap-3">
          {data.isBalanced ? <FiCheckCircle className="text-[22px] text-[#2b8a3e]" /> : <FiAlertCircle className="text-[22px] text-[#c92a2a]" />}
          <div>
            <span className="block text-[13px] font-bold text-text">Statement Balance: {data.isBalanced ? "Balanced" : "Out of Balance"}</span>
            <span className="block text-[11.5px] text-text-muted mt-0.5">Formula: Assets = Liabilities + Equity</span>
          </div>
        </div>
        <span className={`text-[16px] font-black ${data.isBalanced ? "text-[#2b8a3e]" : "text-[#c92a2a]"}`}>
          {formatCurrency(Math.abs(data.totalAssets - data.totalLiabilitiesAndEquity))}
        </span>
      </div>
    </div>
  );
};

const GstReportView = ({ data, gstType, formatCurrency }) => {
  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6 no-print">
        <div className="border border-border p-4 bg-surface rounded-lg">
          <span className="text-[10px] font-bold uppercase text-text-muted block">Total Output GST</span>
          <span className="text-[16px] font-extrabold text-[#c92a2a] mt-1 block">{formatCurrency(data.totalOutputGst)}</span>
        </div>
        <div className="border border-border p-4 bg-surface rounded-lg">
          <span className="text-[10px] font-bold uppercase text-text-muted block">Total Input GST</span>
          <span className="text-[16px] font-extrabold text-[#2b8a3e] mt-1 block">{formatCurrency(data.totalInputGst)}</span>
        </div>
        <div className="border border-border p-4 bg-surface rounded-lg">
          <span className="text-[10px] font-bold uppercase text-text-muted block">Net GST {data.netGstPayableType}</span>
          <span className={`text-[16px] font-extrabold mt-1 block ${Number(data.netGstPayable) >= 0 ? "text-[#c92a2a]" : "text-[#2b8a3e]"}`}>{formatCurrency(Math.abs(data.netGstPayable))}</span>
        </div>
      </div>

      {gstType !== "GSTR2" && (
        <div className="mb-8">
          <h3 className="text-[13px] font-black text-text border-b border-text pb-2 uppercase">Output tax (Sales)</h3>
          <table className="w-full text-left mt-2 text-[12px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-hover/10 font-bold text-text">
                <th className="py-2.5 px-4 font-bold">Account</th>
                <th className="py-2.5 px-4 font-bold">Code</th>
                <th className="py-2.5 px-4 text-right font-bold">Total Debits</th>
                <th className="py-2.5 px-4 text-right font-bold">Total Credits</th>
                <th className="py-2.5 px-4 text-right font-bold">Net Liability</th>
              </tr>
            </thead>
            <tbody>
              {data.outputGst?.map((summary, idx) => (
                <tr key={summary.accountId || idx} className="border-b border-border hover:bg-surface-hover/5">
                  <td className="py-2 px-4 font-semibold text-text">{summary.accountName}</td>
                  <td className="py-2 px-4 font-mono text-[11px] text-text-muted">{summary.accountCode}</td>
                  <td className="py-2 px-4 text-right text-text-muted">{formatCurrency(summary.totalDebit)}</td>
                  <td className="py-2 px-4 text-right text-text-muted">{formatCurrency(summary.totalCredit)}</td>
                  <td className="py-2 px-4 text-right font-bold text-[#c92a2a]">{formatCurrency(summary.netAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {gstType !== "GSTR1" && (
        <div>
          <h3 className="text-[13px] font-black text-text border-b border-text pb-2 uppercase">Input tax (Purchases)</h3>
          <table className="w-full text-left mt-2 text-[12px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-hover/10 font-bold text-text">
                <th className="py-2.5 px-4 font-bold">Account</th>
                <th className="py-2.5 px-4 font-bold">Code</th>
                <th className="py-2.5 px-4 text-right font-bold">Total Debits</th>
                <th className="py-2.5 px-4 text-right font-bold">Total Credits</th>
                <th className="py-2.5 px-4 text-right font-bold">Net ITC Claimable</th>
              </tr>
            </thead>
            <tbody>
              {data.inputGst?.map((summary, idx) => (
                <tr key={summary.accountId || idx} className="border-b border-border hover:bg-surface-hover/5">
                  <td className="py-2 px-4 font-semibold text-text">{summary.accountName}</td>
                  <td className="py-2 px-4 font-mono text-[11px] text-text-muted">{summary.accountCode}</td>
                  <td className="py-2 px-4 text-right text-text-muted">{formatCurrency(summary.totalDebit)}</td>
                  <td className="py-2 px-4 text-right text-text-muted">{formatCurrency(summary.totalCredit)}</td>
                  <td className="py-2 px-4 text-right font-bold text-[#2b8a3e]">{formatCurrency(summary.netAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* Style vars */
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

const actionBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 600,
};

const backBtnSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 600,
};

export default ReportViewerDesktopPage;
