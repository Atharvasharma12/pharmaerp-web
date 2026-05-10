import React from "react";
import {
  FiBox,
  FiTrendingUp,
  FiPackage,
  FiFileText,
  FiUsers,
  FiMonitor,
  FiShield,
  FiHome,
  FiDollarSign,
  FiSend,
} from "react-icons/fi";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <FiSend />,
      title: "Increase Efficiency",
      desc: "Automate daily tasks like billing, inventory and reports to save time and run your store smoothly.",
      color: "green",
    },
    {
      icon: <FiTrendingUp />,
      title: "Boost Profits",
      desc: "Track sales, margins and fast moving items to make better decisions and grow your profits.",
      color: "blue",
    },
    {
      icon: <FiPackage />,
      title: "Reduce Stock Loss",
      desc: "Smart expiry alerts, batch tracking and real-time stock updates help you reduce wastage and losses.",
      color: "purple",
    },
    {
      icon: <FiFileText />,
      title: "100% GST Compliant",
      desc: "Stay fully compliant with GST billing, reports and e-invoicing. File returns accurately and on time.",
      color: "orange",
    },
    {
      icon: <FiUsers />,
      title: "Improve Customer Satisfaction",
      desc: "Maintain customer history, offers and loyalty points to build long-term relationships.",
      color: "cyan",
    },
    {
      icon: <FiMonitor />,
      title: "Access Anytime, Anywhere",
      desc: "Cloud based solution lets you access your pharmacy data from desktop, tablet or mobile.",
      color: "yellow",
    },
    {
      icon: <FiShield />,
      title: "Secure & Reliable",
      desc: "Your data is safe with automatic backup, role-based access and enterprise level security.",
      color: "red",
    },
    {
      icon: <FiHome />,
      title: "Built for Pharmacy Stores",
      desc: "Designed specifically for Indian pharmacy stores with all the features you truly need.",
      color: "green",
    },
  ];

  const bottomItems = [
    {
      icon: <FiShield />,
      title: "Save Time",
      desc: "Automate operations and focus on customers",
    },
    {
      icon: <FiDollarSign />,
      title: "Save Money",
      desc: "Reduce wastage and operational costs",
    },
    {
      icon: <FiTrendingUp />,
      title: "Make Better Decisions",
      desc: "Real-time insights and reports at your fingertips",
    },
    {
      icon: <FiUsers />,
      title: "Grow Your Business",
      desc: "Smarter management for sustainable growth",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#fbfcfd] py-10">
      <DecorDots className="left-0 top-[310px]" />
      <DecorDots className="right-0 bottom-[70px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* HEADING */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-[#08a84f]">
            <FiBox className="text-[13px]" />
            Key Benefits
          </div>

          <h2 className="text-[28px] font-extrabold leading-[1.08] tracking-[-0.8px] text-slate-900 sm:text-[34px] lg:text-[40px]">
            Powerful Benefits That Help
            <span className="block text-[#08a84f]">Your Pharmacy Grow</span>
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-[14px] leading-6 text-slate-600">
            PharmaERP is designed to improve efficiency, reduce costs and
            increase profits while giving you complete control of your pharmacy.
          </p>
        </div>

        {/* BENEFITS GRID */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <BenefitCard key={item.title} {...item} />
          ))}
        </div>

        {/* BOTTOM STRIP */}
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/35 px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {bottomItems.map((item, index) => (
              <BottomBenefit
                key={item.title}
                {...item}
                noBorder={index === bottomItems.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const BenefitCard = ({ icon, title, desc, color }) => {
  const colors = {
    green: "bg-emerald-50 text-[#08a84f]",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-500",
    cyan: "bg-cyan-50 text-cyan-600",
    yellow: "bg-amber-50 text-amber-500",
    red: "bg-red-50 text-red-500",
  };

  return (
    <div className="flex min-h-[210px] flex-col items-center rounded-xl border border-slate-200 bg-white px-5 py-5 text-center shadow-[0_8px_20px_rgba(15,23,42,0.035)]">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          colors[color] || colors.green
        }`}
      >
        <span className="text-[28px]">{icon}</span>
      </div>

      <h3 className="mt-4 text-[15px] font-bold leading-snug text-slate-900">
        {title}
      </h3>

      <p className="mt-2 max-w-[240px] text-[13px] leading-6 text-slate-600">
        {desc}
      </p>

      <div className="mt-auto pt-4">
        <span className="block h-[2px] w-[48px] rounded-full bg-[#08a84f]" />
      </div>
    </div>
  );
};

const BottomBenefit = ({ icon, title, desc, noBorder }) => {
  return (
    <div
      className={`flex items-center gap-3 ${
        !noBorder ? "lg:border-r lg:border-emerald-200 lg:pr-5" : ""
      }`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[23px] text-[#08a84f]">
        {icon}
      </div>

      <div>
        <h4 className="text-[13px] font-bold text-slate-900">{title}</h4>

        <p className="mt-1 text-[12px] leading-5 text-slate-600">{desc}</p>
      </div>
    </div>
  );
};

const DecorDots = ({ className = "" }) => {
  return (
    <div
      className={`pointer-events-none absolute hidden h-[120px] w-[90px] opacity-35 lg:block ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(8,168,79,0.35) 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
      }}
    />
  );
};

export default BenefitsSection;
