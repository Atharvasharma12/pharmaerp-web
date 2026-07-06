import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiList,
  FiBookOpen,
  FiUsers,
  FiTruck,
  FiTrendingUp,
  FiLayers,
  FiFileText,
  FiSettings,
  FiCalendar,
  FiDownload,
  FiArrowRight,
  FiClock,
  FiChevronRight,
  FiPrinter,
} from "react-icons/fi";
import { FaWallet, FaUniversity } from "react-icons/fa";

import {
  AppBreadcrumb,
  AppButton,
  AppCard,
  PageHeader,
  AppBox,
} from "@/components";
import { formatDate } from "@/utils";
import { ROUTES } from "@/constants";

// 9 report modules data
const REPORT_MODULES = [
  {
    key: "trial-balance",
    index: 1,
    title: "Trial Balance",
    desc: "Summary of all ledger accounts with debit, credit and closing balances. Total Debits = Total Credits.",
    isCore: true,
    color: "success",
    icon: <FiList />,
  },
  {
    key: "general-ledger",
    index: 2,
    title: "General Ledger",
    desc: "Complete transaction history for any account within a selected date range.",
    isCore: true,
    color: "primary",
    icon: <FiBookOpen />,
  },
  {
    key: "customer-ledger",
    index: 3,
    title: "Customer Ledger",
    desc: "Detailed statement for a specific customer including invoices, receipts and outstanding balance.",
    isCore: false,
    color: "warning",
    icon: <FiUsers />,
  },
  {
    key: "supplier-ledger",
    index: 4,
    title: "Supplier Ledger",
    desc: "Detailed statement for a specific supplier including bills, payments and outstanding balance.",
    isCore: false,
    color: "purple",
    icon: <FiTruck />,
  },
  {
    key: "cash-book",
    index: 5,
    title: "Cash Book",
    desc: "All cash inflows and outflows. Daily and monthly cash position with running balance.",
    isCore: false,
    color: "success",
    icon: <FaWallet />,
  },
  {
    key: "bank-book",
    index: 6,
    title: "Bank Book",
    desc: "All bank transactions including deposits, withdrawals, transfers and cheques.",
    isCore: false,
    color: "primary",
    icon: <FaUniversity />,
  },
  {
    key: "profit-loss",
    index: 7,
    title: "Profit & Loss Statement",
    desc: "Summary of income and expenses to calculate Net Profit or Loss for a period.",
    isCore: false,
    color: "warning",
    icon: <FiTrendingUp />,
  },
  {
    key: "balance-sheet",
    index: 8,
    title: "Balance Sheet",
    desc: "Statement of Assets, Liabilities and Equity as on a specific date.",
    isCore: false,
    color: "purple",
    icon: <FiLayers />,
  },
  {
    key: "gst-report",
    index: 9,
    title: "GST Reports",
    desc: "GST reports including GSTR-1, GSTR-2 and GST Summary for compliance filing.",
    isCore: false,
    color: "success",
    icon: <FiFileText />,
  },
];

// Mock recent generated reports updated to match 2026 dates
const RECENT_REPORTS = [
  {
    id: "r1",
    name: "Trial Balance",
    type: "PDF",
    date: "06 Jul 2026, 10:30 AM",
    generatedBy: "Admin User",
  },
  {
    id: "r2",
    name: "Profit & Loss Statement",
    type: "Excel",
    date: "06 Jul 2026, 06:15 PM",
    generatedBy: "Admin User",
  },
  {
    id: "r3",
    name: "Bank Book",
    type: "PDF",
    date: "05 Jul 2026, 05:45 PM",
    generatedBy: "Admin User",
  },
  {
    id: "r4",
    name: "Customer Ledger - Apollo Pharmacy",
    type: "PDF",
    date: "05 Jul 2026, 11:20 AM",
    generatedBy: "Admin User",
  },
  {
    id: "r5",
    name: "Balance Sheet",
    type: "Excel",
    date: "04 Jul 2026, 07:10 PM",
    generatedBy: "Admin User",
  },
];

// Quick actions list
const QUICK_ACTIONS = [
  {
    id: "schedule",
    title: "Schedule New Report",
    desc: "Automate report generation and delivery",
    icon: <FiCalendar />,
    color: "primary",
  },
  {
    id: "export",
    title: "Export Report Data",
    desc: "Export report data in Excel or CSV format",
    icon: <FiDownload />,
    color: "success",
  },
  {
    id: "templates",
    title: "Report Templates",
    desc: "Manage your custom report templates",
    icon: <FiFileText />,
    color: "warning",
  },
  {
    id: "settings",
    title: "Report Settings",
    desc: "Configure report preferences and defaults",
    icon: <FiSettings />,
    color: "purple",
  },
];

const ReportsDesktopPage = ({ handleReportChange }) => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-58px)] bg-bg px-6 py-5">
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Page Header */}
        <PageHeader
          title="Finance Reports"
          subtitle="Comprehensive financial reports and statements for your business."
          extra={
            <AppBreadcrumb
              size="small"
              variant="text"
              items={[
                { label: "Dashboard", onClick: () => navigate(ROUTES.DASHBOARD) },
                { label: "Finance & Accounting", onClick: () => navigate(ROUTES.FINANCE) },
                { label: "Reports", current: true },
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
              startIcon={<FiSettings />}
              sx={secondaryButtonSx}
              onClick={() => handleReportChange("trial-balance")}
            >
              Report Settings
            </AppButton>
          }
          align="flex-start"
          justify="space-between"
          sx={pageHeaderSx}
          contentSx={pageHeaderContentSx}
        />

        {/* 1. Statistics Cards Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx} className="hover:shadow-md transition-shadow">
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">
                  Total Reports
                </span>
                <span className="text-[20px] font-black text-text mt-1.5 block leading-none font-mono">
                  9
                </span>
                <span className="text-[11px] text-text-muted mt-1.5 block">
                  Available Statements
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-soft text-purple flex items-center justify-center border border-purple/10 shrink-0">
                <FiList className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx} className="hover:shadow-md transition-shadow">
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">
                  Generated (Month)
                </span>
                <span className="text-[20px] font-black text-text mt-1.5 block leading-none font-mono">
                  28
                </span>
                <span className="text-[11px] text-text-muted mt-1.5 block">
                  Reconciled Exports
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center border border-primary/10 shrink-0">
                <FiFileText className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx} className="hover:shadow-md transition-shadow">
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">
                  Scheduled Reports
                </span>
                <span className="text-[20px] font-black text-text mt-1.5 block leading-none font-mono">
                  4
                </span>
                <span className="text-[11px] text-text-muted mt-1.5 block">
                  Auto Generated
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-success-soft text-success flex items-center justify-center border border-success/10 shrink-0">
                <FiCalendar className="text-[18px]" />
              </div>
            </div>
          </AppCard>

          <AppCard variant="default" rounded="lg" bordered shadow="sm" sx={statCardSx} className="hover:shadow-md transition-shadow">
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">
                  Last Generated
                </span>
                <span className="text-[18px] font-black text-text mt-1.5 block leading-none truncate max-w-[150px]">
                  2 hours ago
                </span>
                <span className="text-[11px] text-text-muted mt-1.5 block truncate">
                  Trial Balance Report
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-warning-soft text-warning flex items-center justify-center border border-warning/10 shrink-0">
                <FiClock className="text-[18px]" />
              </div>
            </div>
          </AppCard>
        </div>

        {/* 2. Report Modules Grid Section */}
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-[16px] font-black text-text m-0 uppercase tracking-wider">Report Modules</h2>
            <p className="text-[12px] text-text-muted mt-0.5 m-0">
              Select a statement option to configure parameters and run official reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {REPORT_MODULES.map((module) => {
              let iconBg = "bg-primary-soft text-primary border-primary/10";
              if (module.color === "success") {
                iconBg = "bg-success-soft text-success border-success/10";
              } else if (module.color === "warning") {
                iconBg = "bg-warning-soft text-warning border-warning/10";
              } else if (module.color === "purple") {
                iconBg = "bg-purple-soft text-purple border-purple/10";
              }

              return (
                <AppCard
                  key={module.key}
                  variant="default"
                  rounded="lg"
                  bordered
                  shadow="sm"
                  padding="none"
                  sx={moduleCardSx}
                  className="hover:scale-[1.01] transition-transform duration-200"
                >
                  <div className="p-5 flex items-start gap-4 relative overflow-hidden h-full">
                    {/* Index Number Badge */}
                    <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-success text-success-contrast text-[10px] font-extrabold flex items-center justify-center border border-white shadow-sm font-mono">
                      {module.index}
                    </div>

                    <div className="pl-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>
                          {module.icon}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-[14px] font-black text-text leading-tight truncate">
                            {module.title}
                          </h3>
                          {module.isCore && (
                            <span className="inline-block mt-0.5 bg-success-soft text-success text-[8.5px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                              Core Report
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[12px] text-text-muted mt-3.5 leading-relaxed min-h-[50px] line-clamp-3">
                        {module.desc}
                      </p>

                      <div className="mt-5 border-t border-divider pt-3 flex justify-between items-center text-[12px] font-bold">
                        <button
                          onClick={() => handleReportChange(module.key)}
                          className="text-success hover:underline flex items-center gap-1 cursor-pointer font-bold"
                        >
                          View Report <FiArrowRight className="text-[12px]" />
                        </button>
                        <button
                          onClick={() => handleReportChange(module.key)}
                          className="text-text-muted hover:text-text flex items-center gap-1.5 cursor-pointer font-bold"
                        >
                          <FiSettings className="text-[13px]" /> Customize
                        </button>
                      </div>
                    </div>
                  </div>
                </AppCard>
              );
            })}
          </div>
        </div>

        {/* Bottom Dual Columns: Recent Reports & Quick Actions */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Recent Reports Table */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none">
            <div className="p-4 border-b border-border flex justify-between items-center bg-surface-hover/5">
              <span className="text-[12px] font-black uppercase tracking-wider text-text">
                Recent Generated Statements
              </span>
              <button
                onClick={() => handleReportChange("trial-balance")}
                className="text-[11.5px] font-bold text-success hover:underline uppercase tracking-wider"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="border-b border-border bg-surface-hover/10 text-text-muted font-bold uppercase tracking-wider text-[9.5px]">
                    <th className="py-2.5 px-4 font-bold">Report Name</th>
                    <th className="py-2.5 px-4 font-bold">Type</th>
                    <th className="py-2.5 px-4 font-bold">Generated On</th>
                    <th className="py-2.5 px-4 font-bold">Generated By</th>
                    <th className="py-2.5 px-4 text-center font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_REPORTS.map((report) => {
                    const isPdf = report.type === "PDF";
                    const pillClass = isPdf
                      ? "bg-danger-soft text-danger border border-danger/10"
                      : "bg-success-soft text-success border border-success/10";

                    return (
                      <tr
                        key={report.id}
                        className="border-b border-border/40 hover:bg-surface-hover/10 transition"
                      >
                        <td className="py-3 px-4 font-bold text-text">{report.name}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${pillClass}`}>
                            {report.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-muted font-mono">{report.date}</td>
                        <td className="py-3 px-4 text-text font-semibold">{report.generatedBy}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleReportChange("trial-balance")}
                            className="w-7 h-7 rounded-md hover:bg-surface-hover border border-border flex items-center justify-center text-text-muted hover:text-text mx-auto transition cursor-pointer"
                          >
                            <FiDownload className="text-[13px]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-border bg-surface-hover/5">
              <button
                onClick={() => handleReportChange("trial-balance")}
                className="text-[12px] font-bold text-success hover:underline flex items-center gap-1 cursor-pointer"
              >
                View all reports <FiArrowRight className="text-[13px]" />
              </button>
            </div>
          </AppCard>

          {/* Quick Actions Panel */}
          <AppCard variant="default" rounded="lg" bordered shadow="sm" padding="none">
            <div className="p-4 border-b border-border bg-surface-hover/5">
              <span className="text-[12px] font-black uppercase tracking-wider text-text">
                Quick Actions
              </span>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {QUICK_ACTIONS.map((action) => {
                let colClass = "bg-primary-soft text-primary";
                if (action.color === "success") colClass = "bg-success-soft text-success";
                else if (action.color === "warning") colClass = "bg-warning-soft text-warning";
                else if (action.color === "purple") colClass = "bg-purple-soft text-purple";

                return (
                  <button
                    key={action.id}
                    onClick={() => handleReportChange("trial-balance")}
                    className="w-full text-left p-3 border border-border hover:bg-surface-hover rounded-xl flex items-center justify-between transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colClass}`}>
                        {action.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[13px] font-bold text-text leading-tight group-hover:text-success transition">
                          {action.title}
                        </span>
                        <span className="block text-[10.5px] text-text-muted truncate mt-0.5">
                          {action.desc}
                        </span>
                      </div>
                    </div>
                    <FiChevronRight className="text-[16px] text-text-muted/60 shrink-0 group-hover:translate-x-0.5 transition" />
                  </button>
                );
              })}
            </div>
          </AppCard>
        </div>
      </div>
    </section>
  );
};

/* Styles */
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

const secondaryButtonSx = {
  height: 32,
  fontSize: "11px",
  fontWeight: 600,
};

const statCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
};

const moduleCardSx = {
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  height: "100%",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "var(--app-shadow-md)",
  },
};

export default ReportsDesktopPage;
