// src/features/landing/components/mobile/MobileDashboardShowcaseSection.jsx

import {
  FiBox,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
  FiPackage,
  FiPieChart,
  FiShoppingBag,
  FiShoppingCart,
  FiShield,
} from "react-icons/fi";

import { AppButton } from "@/components";

const tinyButtonTextSx = {
  fontSize: "5.5px",
  lineHeight: "1",
  fontWeight: 900,
};

const MobileDashboardShowcaseSection = () => {
  return (
    <section className="w-full bg-bg px-3 py-4">
      <div className="mx-auto max-w-[390px]">
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-[16px] font-extrabold leading-tight tracking-[-0.3px] text-text">
              Dashboard Preview
            </h2>
            <p className="mt-0.5 truncate text-[9px] font-semibold text-text-muted">
              All your pharmacy insights at a glance
            </p>
          </div>

          <button
            type="button"
            className="flex h-[20px] shrink-0 items-center gap-[2px] rounded-md border border-border bg-surface px-1 shadow-sm"
            style={tinyButtonTextSx}
          >
            <FiCalendar style={{ fontSize: 7 }} className="text-text-muted" />
            <span style={tinyButtonTextSx}>Today, 20 May</span>
            <FiChevronDown
              style={{ fontSize: 7 }}
              className="text-text-muted"
            />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          <KpiCard
            icon={<FiShoppingBag />}
            iconClass="bg-primary-soft text-primary"
            value="₹2.45L"
            label="Sales"
            trend="↑12.5%"
          />
          <KpiCard
            icon={<FiShoppingCart />}
            iconClass="bg-info-soft text-info"
            value="320"
            label="Orders"
            trend="↑8.3%"
          />
          <KpiCard
            icon={<FiPackage />}
            iconClass="bg-warning-soft text-warning"
            value="18"
            label="Low Stock"
          />
          <KpiCard
            icon={<FiPieChart />}
            iconClass="bg-primary-soft text-primary"
            value="₹45.3K"
            label="Profit"
            trend="↑15.2%"
          />
        </div>

        <div className="mt-2 rounded-xl border border-border bg-surface p-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-[11.5px] font-extrabold text-text">
              Sales Overview
            </h3>

            <button
              type="button"
              className="flex h-[18px] items-center gap-[2px] rounded-md border border-border bg-surface px-1.5"
              style={tinyButtonTextSx}
            >
              <span style={tinyButtonTextSx}>This Week</span>
              <FiChevronDown style={{ fontSize: 7 }} />
            </button>
          </div>

          <div className="mt-2 grid grid-cols-[78px_1fr] items-end gap-2">
            <div>
              <h4 className="text-[14px] font-extrabold tracking-[-0.35px] text-text">
                ₹2,45,680
              </h4>
              <p className="mt-0.5 text-[8.5px] font-semibold text-text-muted">
                Total Sales
              </p>

              <div className="mt-2 inline-flex rounded-full bg-primary-soft px-1.5 py-0.5 text-[8.5px] font-extrabold text-primary">
                ↑ 12.5%
              </div>

              <p className="mt-1 text-[8px] font-semibold text-text-muted">
                vs Last Week
              </p>
            </div>

            <MiniAreaChart />
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <AlertCard tone="error" title="Expiry" value="24" desc="Soon" />
          <AlertCard
            tone="warning"
            title="Near Expiry"
            value="56"
            desc="Near"
          />
          <AlertCard tone="info" title="Invoices" value="18" desc="Pending" />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-surface p-2.5 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-1">
              <h3 className="text-[10.5px] font-extrabold leading-tight text-text">
                Top Medicines
              </h3>

              <button
                type="button"
                className="shrink-0 text-primary"
                style={tinyButtonTextSx}
              >
                View All
              </button>
            </div>

            <div className="space-y-1.5">
              {medicines.map((item) => (
                <MedicineRow key={item.name} {...item} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-2.5 shadow-sm">
            <h3 className="text-[10.5px] font-extrabold leading-tight text-text">
              Payment Method
            </h3>

            <div className="mt-2 flex items-center justify-center">
              <DonutChart />
            </div>

            <div className="mt-2 space-y-1">
              {payments.map((item) => (
                <PaymentRow key={item.label} {...item} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 rounded-xl border border-border bg-surface shadow-sm">
          <div className="flex items-center justify-between px-2.5 py-2">
            <h3 className="text-[11px] font-extrabold text-text">
              Recent Transactions
            </h3>

            <button
              type="button"
              className="text-text-muted"
              style={tinyButtonTextSx}
            >
              View All
            </button>
          </div>

          {transactions.map((item, index) => (
            <TransactionRow
              key={item.invoice}
              {...item}
              bordered={index !== transactions.length - 1}
            />
          ))}
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-xl border border-primary-soft bg-primary-soft/50 p-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-[20px] text-primary">
            <FiShield />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[9.5px] font-extrabold leading-snug text-text">
              Manage smarter with PharmaERP
            </h3>
            <p className="mt-0.5 truncate text-[7.5px] font-semibold text-text-muted">
              Inventory, Billing, Reports & more
            </p>
          </div>

          <AppButton
            variant="contained"
            colorVariant="primary"
            rounded="md"
            endIcon={<FiChevronRight />}
            sx={{
              minWidth: "unset",
              px: 1.45,
              py: 0.75,
              fontSize: "10px !important",
              fontWeight: "900 !important",
              lineHeight: "1 !important",
              whiteSpace: "nowrap",
              "& .MuiButton-endIcon": {
                ml: "3px",
                fontSize: "12px",
              },
            }}
          >
            Free Trial
          </AppButton>
        </div>
      </div>
    </section>
  );
};

const KpiCard = ({ icon, iconClass, value, label, trend }) => {
  return (
    <div className="min-h-[68px] rounded-xl border border-border bg-surface p-1.5 shadow-sm">
      <div
        className={`mb-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[12px] ${iconClass}`}
      >
        {icon}
      </div>

      <h3 className="truncate text-[10.5px] font-extrabold tracking-[-0.3px] text-text">
        {value}
      </h3>

      <p className="mt-0.5 truncate text-[7.8px] font-semibold text-text">
        {label}
      </p>

      {trend && (
        <p className="mt-1 truncate text-[7.2px] font-extrabold text-primary">
          {trend}
        </p>
      )}
    </div>
  );
};

const MiniAreaChart = () => {
  return (
    <div className="relative h-[74px] w-full">
      <div className="absolute inset-0 flex flex-col justify-between text-[6.8px] font-semibold text-text-muted">
        {["40K", "30K", "20K", "10K", "0"].map((item) => (
          <div key={item} className="flex items-center gap-1">
            <span className="w-5">{item}</span>
            <span className="h-px flex-1 border-t border-dashed border-border" />
          </div>
        ))}
      </div>

      <svg
        viewBox="0 0 260 130"
        className="absolute bottom-3 left-5 right-0 h-[60px] w-[calc(100%-20px)]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="mobileSalesFillCompactFinal"
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="var(--app-color-primary)"
              stopOpacity="0.26"
            />
            <stop
              offset="100%"
              stopColor="var(--app-color-primary)"
              stopOpacity="0.02"
            />
          </linearGradient>
        </defs>

        <path
          d="M0 105 C20 105 24 82 45 78 C64 73 68 82 86 60 C105 40 123 54 133 78 C143 101 163 32 180 28 C199 24 203 88 224 84 C238 81 243 55 260 42 L260 130 L0 130 Z"
          fill="url(#mobileSalesFillCompactFinal)"
        />

        <path
          d="M0 105 C20 105 24 82 45 78 C64 73 68 82 86 60 C105 40 123 54 133 78 C143 101 163 32 180 28 C199 24 203 88 224 84 C238 81 243 55 260 42"
          fill="none"
          stroke="var(--app-color-primary)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute bottom-0 left-6 right-0 grid grid-cols-7 text-center text-[6.5px] font-semibold text-text-muted">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  );
};

const AlertCard = ({ tone, title, value, desc }) => {
  const toneMap = {
    error: "border-error-soft bg-error-soft/45 text-error",
    warning: "border-warning-soft bg-warning-soft/45 text-warning",
    info: "border-info-soft bg-info-soft/45 text-info",
  };

  return (
    <div
      className={`flex min-h-[48px] items-center justify-between rounded-xl border p-2 ${toneMap[tone]}`}
    >
      <div className="min-w-0">
        <p className="truncate text-[8px] font-extrabold">{title}</p>
        <h3 className="mt-0.5 text-[14px] font-extrabold leading-none">
          {value}
        </h3>
        <p className="mt-0.5 truncate text-[7px] font-semibold text-text-muted">
          {desc}
        </p>
      </div>

      <button className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface/70 text-[12px]">
        <FiChevronRight />
      </button>
    </div>
  );
};

const medicines = [
  { name: "Paracetamol", type: "Strip", sold: "1,245", tone: "error" },
  { name: "Azithromycin", type: "Strip", sold: "980", tone: "info" },
  { name: "Amoxicillin", type: "Cap", sold: "875", tone: "warning" },
  { name: "Cetirizine", type: "Strip", sold: "765", tone: "info" },
  { name: "Pantoprazole", type: "Strip", sold: "620", tone: "primary" },
];

const MedicineRow = ({ name, type, sold, tone }) => {
  const toneMap = {
    error: "bg-error-soft text-error",
    info: "bg-info-soft text-info",
    warning: "bg-warning-soft text-warning",
    primary: "bg-primary-soft text-primary",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] ${toneMap[tone]}`}
      >
        <FiBox />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[8px] font-extrabold leading-tight text-text">
          {name}
        </p>
        <p className="text-[7px] font-semibold leading-tight text-text-muted">
          {type}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[8px] font-extrabold leading-tight text-text">
          {sold}
        </p>
        <p className="text-[6.8px] font-semibold leading-tight text-text-muted">
          Sold
        </p>
      </div>
    </div>
  );
};

const DonutChart = () => {
  return (
    <div className="relative h-[74px] w-[74px] rounded-full bg-[conic-gradient(var(--app-color-primary)_0_40%,var(--app-color-info)_40%_70%,var(--app-color-warning)_70%_90%,var(--app-color-success)_90%_100%)]">
      <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-surface text-center">
        <span className="text-[6.5px] font-semibold leading-none text-text-muted">
          Total
        </span>
        <span className="mt-0.5 text-[7px] font-extrabold leading-none text-text">
          ₹2.45L
        </span>
      </div>
    </div>
  );
};

const payments = [
  { label: "Cash", value: "40%", dot: "bg-primary" },
  { label: "UPI", value: "30%", dot: "bg-info" },
  { label: "Card", value: "20%", dot: "bg-warning" },
  { label: "Others", value: "10%", dot: "bg-success" },
];

const PaymentRow = ({ label, value, dot }) => {
  return (
    <div className="flex items-center justify-between gap-1 text-[7.3px] font-semibold">
      <div className="flex items-center gap-1 text-text">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </div>
      <span className="truncate text-text-muted">{value}</span>
    </div>
  );
};

const transactions = [
  {
    icon: <FiShoppingCart />,
    tone: "success",
    invoice: "INV-1256",
    customer: "Walk-in Customer",
    amount: "₹1,250",
    status: "Paid",
    time: "10:30",
  },
  {
    icon: <FiShoppingCart />,
    tone: "info",
    invoice: "INV-1255",
    customer: "Ramesh Medical",
    amount: "₹3,450",
    status: "Paid",
    time: "09:45",
  },
  {
    icon: <FiShoppingCart />,
    tone: "warning",
    invoice: "INV-1254",
    customer: "Sanjay Pharmacy",
    amount: "₹2,780",
    status: "Pending",
    time: "09:20",
  },
];

const TransactionRow = ({
  icon,
  tone,
  invoice,
  customer,
  amount,
  status,
  time,
  bordered,
}) => {
  const toneMap = {
    success: "bg-success-soft text-success",
    info: "bg-info-soft text-info",
    warning: "bg-warning-soft text-warning",
  };

  return (
    <div
      className={[
        "grid grid-cols-[27px_1fr_auto_auto] items-center gap-1.5 px-2.5 py-1.5",
        bordered ? "border-b border-border" : "",
      ].join(" ")}
    >
      <div
        className={`flex h-[26px] w-[26px] items-center justify-center rounded-md text-[12px] ${toneMap[tone]}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[8.5px] font-extrabold leading-tight text-text">
          {invoice}
        </p>
        <p className="truncate text-[7px] font-semibold leading-tight text-text-muted">
          {customer}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[8px] font-extrabold leading-tight text-text">
          {amount}
        </p>
        <p
          className={[
            "text-[7px] font-bold leading-tight",
            status === "Paid" ? "text-success" : "text-warning",
          ].join(" ")}
        >
          {status}
        </p>
      </div>

      <p className="text-right text-[7px] font-semibold text-text-muted">
        {time}
      </p>
    </div>
  );
};

export default MobileDashboardShowcaseSection;
