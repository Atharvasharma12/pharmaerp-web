import React from "react";
import {
  FiSettings,
  FiCalendar,
  FiDownload,
  FiFileText,
  FiClock,
  FiList,
  FiBookOpen,
  FiUsers,
  FiTruck,
  FiTrendingUp,
  FiLayers,
} from "react-icons/fi";
import { FaWallet, FaUniversity } from "react-icons/fa";

import {
  AppBox,
  AppCard,
  AppHeading,
  AppText,
} from "@/components";

// 9 report modules list
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

// Mock recent generated reports
const RECENT_REPORTS = [
  {
    id: "r1",
    name: "Trial Balance",
    type: "PDF",
    date: "02 Jun 2024, 10:30 AM",
  },
  {
    id: "r2",
    name: "Profit & Loss Statement",
    type: "Excel",
    date: "01 Jun 2024, 06:15 PM",
  },
  {
    id: "r3",
    name: "Bank Book",
    type: "PDF",
    date: "01 Jun 2024, 05:45 PM",
  },
];

// Quick actions list
const QUICK_ACTIONS = [
  {
    id: "schedule",
    title: "Schedule New Report",
    icon: <FiCalendar />,
    color: "primary",
  },
  {
    id: "export",
    title: "Export Report Data",
    icon: <FiDownload />,
    color: "success",
  },
  {
    id: "templates",
    title: "Report Templates",
    icon: <FiFileText />,
    color: "warning",
  },
  {
    id: "settings",
    title: "Report Settings",
    icon: <FiSettings />,
    color: "purple",
  },
];

const ReportsMobilePage = ({ handleReportChange }) => {
  return (
    <section className="w-full bg-bg pb-6 px-3">
      {/* Page Title */}
      <AppBox sx={headerWrapperSx}>
        <AppHeading level={1} weight={700} sx={pageTitleSx}>
          Finance Reports
        </AppHeading>
        <AppText variant="body2" sx={pageSubtitleSx}>
          Comprehensive financial reports and statements.
        </AppText>
      </AppBox>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-5">
        <AppCard variant="default" rounded="lg" bordered shadow="sm" className="p-3">
          <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">
            Total Reports
          </span>
          <span className="text-[18px] font-black text-text mt-1 block">9</span>
          <span className="text-[10px] text-text-muted block mt-1">Available Reports</span>
        </AppCard>

        <AppCard variant="default" rounded="lg" bordered shadow="sm" className="p-3">
          <span className="text-[9.5px] font-bold uppercase text-text-muted tracking-wider block">
            Generated (Month)
          </span>
          <span className="text-[18px] font-black text-text mt-1 block">28</span>
          <span className="text-[10px] text-text-muted block mt-1">Reports Generated</span>
        </AppCard>
      </div>

      {/* Report Modules List */}
      <div className="mb-6">
        <div className="mb-3 px-1">
          <h2 className="text-[14px] font-black text-text m-0">Report Modules</h2>
          <p className="text-[11px] text-text-muted mt-0.5 m-0">
            Select a report to view and generate
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {REPORT_MODULES.map((module) => {
            let iconBg = "bg-primary-soft text-primary";
            if (module.color === "success") iconBg = "bg-success-soft text-success";
            else if (module.color === "warning") iconBg = "bg-warning-soft text-warning";
            else if (module.color === "purple") iconBg = "bg-purple-soft text-purple";

            return (
              <AppCard
                key={module.key}
                variant="default"
                rounded="lg"
                bordered
                shadow="sm"
                className="relative overflow-hidden"
              >
                <div className="p-4">
                  {/* Circle number index badge */}
                  <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-success text-success-contrast text-[9px] font-black flex items-center justify-center border border-white">
                    {module.index}
                  </div>

                  <div className="pl-3 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[15px] ${iconBg}`}>
                      {module.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[12.5px] font-extrabold text-text leading-tight truncate">
                        {module.title}
                      </h3>
                      {module.isCore && (
                        <span className="inline-block mt-0.5 bg-success-soft text-success text-[8.5px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                          Core Report
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-text-muted mt-2.5 leading-relaxed pl-3 line-clamp-2">
                    {module.desc}
                  </p>

                  <div className="mt-4 border-t border-divider pt-2.5 flex justify-between items-center text-[11.5px] font-bold pl-3">
                    <button
                      onClick={() => handleReportChange(module.key)}
                      className="text-success hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View Report →
                    </button>
                    <button
                      onClick={() => handleReportChange(module.key)}
                      className="text-text-muted hover:text-text flex items-center gap-1 cursor-pointer"
                    >
                      <FiSettings /> Customize
                    </button>
                  </div>
                </div>
              </AppCard>
            );
          })}
        </div>
      </div>

      {/* Recent reports list */}
      <AppCard variant="default" rounded="lg" bordered shadow="sm" className="mb-5">
        <div className="p-3 border-b border-border flex justify-between items-center">
          <span className="text-[11.5px] font-black uppercase tracking-wider text-text">
            Recent Reports
          </span>
        </div>
        <div className="p-1 flex flex-col gap-2">
          {RECENT_REPORTS.map((report) => (
            <div
              key={report.id}
              className="p-2 border-b border-border/60 last:border-b-0 flex justify-between items-center"
            >
              <div className="min-w-0">
                <span className="block text-[12px] font-bold text-text truncate">
                  {report.name}
                </span>
                <span className="block text-[10px] text-text-muted mt-0.5">
                  {report.date}
                </span>
              </div>
              <span className={`text-[8.5px] px-1 rounded font-bold uppercase ${
                report.type === "PDF" ? "bg-danger-soft text-danger" : "bg-success-soft text-success"
              }`}>
                {report.type}
              </span>
            </div>
          ))}
        </div>
      </AppCard>

      {/* Quick Actions Grid */}
      <div className="px-1">
        <div className="mb-3">
          <h2 className="text-[14px] font-black text-text m-0">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action) => {
            let colClass = "bg-primary-soft text-primary";
            if (action.color === "success") colClass = "bg-success-soft text-success";
            else if (action.color === "warning") colClass = "bg-warning-soft text-warning";
            else if (action.color === "purple") colClass = "bg-purple-soft text-purple";

            return (
              <button
                key={action.id}
                onClick={() => handleReportChange("trial-balance")}
                className="p-3 border border-border bg-surface hover:bg-surface-hover rounded-xl flex flex-col items-center text-center gap-2 cursor-pointer transition"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[16px] ${colClass}`}>
                  {action.icon}
                </div>
                <span className="text-[11px] font-extrabold text-text leading-tight">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
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

export default ReportsMobilePage;
