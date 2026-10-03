import React, { useState } from "react";
import {
  FiMonitor,
  FiCreditCard,
  FiBox,
  FiBarChart2,
  FiSmartphone,
  FiEye,
  FiShield,
  FiClock,
  FiTrendingUp,
  FiLayout,
} from "react-icons/fi";

const DashboardShowcaseSection = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    {
      id: "all",
      label: "All Dashboards",
      icon: <FiLayout />,
    },
    {
      id: "overview",
      label: "Overview Dashboard",
      icon: <FiMonitor />,
      image: "/src/assets/dashboard-showcase/overview-dashboard.png",
      alt: "Overview Dashboard",
    },
    {
      id: "pos",
      label: "POS / Billing Screen",
      icon: <FiCreditCard />,
      image: "/src/assets/dashboard-showcase/pos-billing-screen.png",
      alt: "POS Billing Screen",
    },
    {
      id: "inventory",
      label: "Inventory Management",
      icon: <FiBox />,
      image: "/src/assets/dashboard-showcase/inventory-management.png",
      alt: "Inventory Management",
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: <FiBarChart2 />,
      image: "/src/assets/dashboard-showcase/reports-analytics.png",
      alt: "Reports Analytics",
    },
    {
      id: "mobile",
      label: "Mobile App",
      icon: <FiSmartphone />,
      image: "/src/assets/dashboard-showcase/mobile-app-preview.png",
      alt: "Mobile App Preview",
    },
  ];

  const activeItem = tabs.find((tab) => tab.id === activeTab);

  const benefits = [
    {
      icon: <FiEye />,
      title: "Real-time Insights",
      text: "Live data to help you make quick decisions.",
    },
    {
      icon: <FiBarChart2 />,
      title: "Better Control",
      text: "Track every activity across your store.",
    },
    {
      icon: <FiShield />,
      title: "Data You Can Trust",
      text: "Accurate, secure and always up-to-date.",
    },
    {
      icon: <FiClock />,
      title: "Save More Time",
      text: "Automated reports and smart alerts.",
    },
    {
      icon: <FiTrendingUp />,
      title: "Grow Your Business",
      text: "Insights that help you increase profits.",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#fbfcfd] py-12">
      <div className="pointer-events-none absolute inset-x-0 top-[235px] h-[430px] bg-gradient-to-b from-[#edf7f6] to-transparent" />
      <div className="pointer-events-none absolute bottom-20 right-20 h-64 w-64 rounded-full bg-emerald-50 opacity-60 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-5 lg:px-6">
        {/* HEADING */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[12px] font-bold text-[#08a84f]">
            <FiMonitor className="text-[14px]" />
            Powerful Insights, Real-time Control
          </div>

          <h2 className="text-[30px] font-extrabold leading-[1.08] tracking-[-0.9px] text-slate-900 sm:text-[38px] lg:text-[46px]">
            Everything at a Glance with{" "}
            <span className="text-[#08a84f]">Smart Dashboards</span>
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">
            PharmaERP dashboards give you real-time insights into your pharmacy
            operations so you can make faster, smarter decisions.
          </p>
        </div>

        {/* TAB BAR */}
        <div className="mx-auto mt-9 max-w-[1280px] overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex h-[72px] items-center justify-center gap-2.5 border-b border-slate-200 px-2 text-[13px] font-bold transition lg:border-b-0 lg:border-r ${
                  activeTab === tab.id
                    ? "bg-white text-[#08a84f]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-[#08a84f]"
                }`}
              >
                <span className="text-[21px]">{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>

                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#08a84f]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* SHOWCASE */}
        <div className="mx-auto max-w-[1280px] rounded-b-[30px] bg-[#eef7f6]/80 px-4 pb-7 pt-7 sm:px-5 lg:px-6">
          {activeTab === "all" ? (
            <div className="grid items-start gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              {/* LEFT BIG IMAGE */}
              <div className="rounded-2xl bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
                <img
                  src="/src/assets/dashboard-showcase/overview-dashboard.png"
                  alt="Overview Dashboard"
                  className="h-auto w-full object-contain"
                />
              </div>

              {/* RIGHT SIDE AUTO HEIGHT IMAGES */}
              <div className="grid items-start gap-4">
                <div className="grid items-start gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
                    <img
                      src="/src/assets/dashboard-showcase/pos-billing-screen.png"
                      alt="POS Billing Screen"
                      className="h-auto w-full object-contain"
                    />
                  </div>

                  <div className="rounded-2xl bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
                    <img
                      src="/src/assets/dashboard-showcase/inventory-management.png"
                      alt="Inventory Management"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </div>

                <div className="grid items-start gap-4 md:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-2xl bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
                    <img
                      src="/src/assets/dashboard-showcase/reports-analytics.png"
                      alt="Reports Analytics"
                      className="h-auto w-full object-contain"
                    />
                  </div>

                  <div className="rounded-2xl bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">
                    <img
                      src="/src/assets/dashboard-showcase/mobile-app-preview.png"
                      alt="Mobile App Preview"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
              <img
                src={activeItem.image}
                alt={activeItem.alt}
                className="mx-auto h-auto w-full object-contain"
              />
            </div>
          )}
        </div>

        {/* BENEFITS */}
        <div className="mx-auto -mt-1 max-w-[1180px] rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {benefits.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[25px] text-[#08a84f]">
                  {item.icon}
                </div>

                <div>
                  <h4 className="text-[13px] font-extrabold text-slate-900">
                    {item.title}
                  </h4>

                  <p className="mt-1 text-[12.5px] leading-5 text-slate-600">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardShowcaseSection;
