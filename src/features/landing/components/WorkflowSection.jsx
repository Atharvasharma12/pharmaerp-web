import React from "react";
import {
  FiShoppingCart,
  FiPackage,
  FiGrid,
  FiFileText,
  FiBarChart2,
  FiUsers,
  FiMonitor,
  FiCheckCircle,
} from "react-icons/fi";

const WorkflowSection = () => {
  const steps = [
    {
      number: "1",
      icon: <FiShoppingCart />,
      title: "Purchase",
      desc: "Create purchase orders, manage suppliers and get the best prices.",
      color: "green",
    },
    {
      number: "2",
      icon: <FiPackage />,
      title: "Stock In",
      desc: "Receive stock, scan items and update inventory in real-time.",
      color: "green",
    },
    {
      number: "3",
      icon: <FiGrid />,
      title: "Inventory Management",
      desc: "Track stock, batches, expiry dates and get low stock alerts.",
      color: "blue",
    },
    {
      number: "4",
      icon: <FiFileText />,
      title: "Sales & Billing",
      desc: "Fast billing with GST, discounts, schemes and multiple payments.",
      color: "purple",
    },
    {
      number: "5",
      icon: <FiBarChart2 />,
      title: "Reports & Analytics",
      desc: "Get real-time reports on sales, profit, stock and business performance.",
      color: "orange",
    },
    {
      number: "6",
      icon: <FiUsers />,
      title: "Customers & Growth",
      desc: "Improve customer loyalty, manage credit and grow your pharmacy business.",
      color: "green",
    },
  ];

  return (
    <section className="w-full bg-[#fbfcfd] py-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* HEADING */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-[#08a84f]">
            <FiMonitor className="text-[13px]" />
            Smart Workflow
          </div>

          <h2 className="text-[28px] font-extrabold leading-[1.08] tracking-[-0.8px] text-slate-900 sm:text-[34px] lg:text-[40px]">
            A Complete System That Simplifies
            <span className="block text-[#08a84f]">
              Your Pharmacy Operations
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-[14px] leading-6 text-slate-600">
            From purchase to profit, PharmaERP streamlines every step of your
            pharmacy workflow so you can save time and focus on your customers.
          </p>
        </div>

        {/* WORKFLOW CARDS */}
        <div className="mt-14 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => (
            <WorkflowCard
              key={step.title}
              {...step}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* DASHBOARD BOX */}
        <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50/35 px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="grid items-center gap-6 lg:grid-cols-[0.34fr_0.66fr]">
            <div className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[26px] text-[#08a84f]">
                <FiMonitor />
              </div>

              <div>
                <h3 className="text-[18px] font-extrabold text-[#08a84f]">
                  One System. Complete Control.
                </h3>

                <p className="mt-2 max-w-[340px] text-[14px] leading-6 text-slate-800">
                  PharmaERP connects every operation of your pharmacy in one
                  place.
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    "Real-time data & updates",
                    "Accurate stock & expiry tracking",
                    "Better decisions, higher profits",
                    "Happy customers, growing business",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <FiCheckCircle className="shrink-0 text-[17px] text-[#08a84f]" />
                      <span className="text-[13.5px] text-slate-800">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="/src/assets/dashboard-showcase/overview-dashboard.png"
                alt="Dashboard Overview"
                className="w-full max-w-[700px] rounded-xl object-contain shadow-[0_12px_28px_rgba(15,23,42,0.06)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const WorkflowCard = ({ number, icon, title, desc, color, isLast }) => {
  const colors = {
    green: {
      iconBg: "bg-emerald-50",
      iconText: "text-[#08a84f]",
      numberBg: "bg-[#08a84f]",
      title: "text-[#08a84f]",
    },
    blue: {
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      numberBg: "bg-blue-600",
      title: "text-blue-600",
    },
    purple: {
      iconBg: "bg-purple-50",
      iconText: "text-purple-600",
      numberBg: "bg-purple-600",
      title: "text-purple-600",
    },
    orange: {
      iconBg: "bg-orange-50",
      iconText: "text-orange-500",
      numberBg: "bg-orange-500",
      title: "text-orange-500",
    },
  };

  const c = colors[color] || colors.green;

  return (
    <div className="relative">
      {!isLast && (
        <div className="absolute left-[calc(100%-3px)] top-[44px] z-20 hidden w-7 items-center xl:flex">
          <div className="h-[2px] flex-1 border-t-2 border-dotted border-[#08a84f]" />
          <div className="h-0 w-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-[#08a84f]" />
        </div>
      )}

      <div className="relative min-h-[188px] rounded-xl border border-slate-200 bg-white px-4 pb-5 pt-11 text-center shadow-[0_8px_20px_rgba(15,23,42,0.035)]">
        <div
          className={`absolute left-1/2 top-0 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${c.iconBg} ${c.iconText}`}
        >
          <span className="text-[34px]">{icon}</span>
        </div>

        <div className="flex items-start justify-center gap-2">
          <span
            className={`mt-[1px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${c.numberBg} text-[12px] font-extrabold leading-none text-white`}
          >
            {number}
          </span>

          <h3
            className={`max-w-[125px] text-left text-[14.5px] font-extrabold leading-[1.25] ${c.title}`}
          >
            {title}
          </h3>
        </div>

        <p className="mx-auto mt-4 max-w-[145px] text-[12.5px] leading-5 text-slate-600">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default WorkflowSection;
