import React from "react";
import {
  FiShield,
  FiShoppingCart,
  FiBox,
  FiClipboard,
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiPercent,
  FiLock,
  FiArrowRight,
  FiCloud,
  FiMonitor,
} from "react-icons/fi";
import { MdOutlineQrCodeScanner } from "react-icons/md";

const FeaturesSection = () => {
  const features = [
    {
      icon: <FiShoppingCart />,
      title: "Sales & Billing",
      desc: "Fast and easy billing with GST, discounts, schemes and multiple payment options.",
      color: "green",
    },
    {
      icon: <FiBox />,
      title: "Inventory Management",
      desc: "Real-time stock tracking, low stock alerts and accurate inventory control.",
      color: "blue",
    },
    {
      icon: <FiClipboard />,
      title: "Purchase Management",
      desc: "Manage suppliers, purchase orders, returns and purchase price.",
      color: "purple",
    },
    {
      icon: <FiUsers />,
      title: "Customer Management",
      desc: "Maintain customer records, loyalty points and purchase history.",
      color: "orange",
    },
    {
      icon: <FiCalendar />,
      title: "Expiry Tracking",
      desc: "Track expiry dates and batches with smart alerts.",
      color: "red",
    },
    {
      icon: <FiBarChart2 />,
      title: "Reports & Analytics",
      desc: "Insightful reports on sales, profit and stock performance.",
      color: "teal",
    },
    {
      icon: <FiPercent />,
      title: "Offers & Schemes",
      desc: "Create offers and discount rules to boost your sales.",
      color: "yellow",
    },
    {
      icon: <FiLock />,
      title: "Access Control",
      desc: "Secure role-based access for staff and multi-user management.",
      color: "blue",
    },
  ];

  const bottomFeatures = [
    {
      icon: <FiShield />,
      title: "GST Compliant",
      desc: "Accurate invoicing and tax reports.",
    },
    {
      icon: <MdOutlineQrCodeScanner />,
      title: "Barcode Support",
      desc: "Fast billing with barcode support.",
    },
    {
      icon: <FiCloud />,
      title: "Cloud Backup",
      desc: "Automatic backup and secure storage.",
    },
    {
      icon: <FiMonitor />,
      title: "Access Anywhere",
      desc: "Use your pharmacy system anytime.",
    },
  ];

  return (
    <section className="w-full bg-[#fbfcfd] py-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* HEADING */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-[#08a84f]">
            <FiShield className="text-[13px]" />
            Powerful Features
          </div>

          <h2 className="text-[28px] font-extrabold leading-[1.08] tracking-[-0.8px] text-slate-900 sm:text-[34px] lg:text-[40px]">
            Everything You Need to Run Your Pharmacy
            <span className="block text-[#08a84f]">All in One Place</span>
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-[14px] leading-6 text-slate-600">
            PharmaERP comes with all the essential tools to manage your pharmacy
            operations efficiently and effortlessly.
          </p>
        </div>

        {/* FEATURE GRID */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* BOTTOM FEATURES */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {bottomFeatures.map((item, index) => (
              <BottomFeature
                key={item.title}
                {...item}
                noBorder={index === bottomFeatures.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, desc, color }) => {
  const colorClasses = {
    green: "bg-emerald-50 text-[#08a84f]",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-500",
    red: "bg-red-50 text-red-500",
    teal: "bg-teal-50 text-teal-600",
    yellow: "bg-amber-50 text-amber-500",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.035)]">
      {/* Icon */}
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-[22px] ${
          colorClasses[color] || colorClasses.green
        }`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-4 text-[15px] font-bold text-slate-900">{title}</h3>

      {/* Description */}
      <p className="mt-2 text-[13px] leading-6 text-slate-600">{desc}</p>

      {/* Link */}
      <a
        href="/"
        className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#08a84f]"
      >
        Learn more
        <FiArrowRight className="text-[14px]" />
      </a>
    </div>
  );
};

const BottomFeature = ({ icon, title, desc, noBorder }) => {
  return (
    <div
      className={`flex items-center gap-3 ${
        !noBorder ? "lg:border-r lg:border-slate-200 lg:pr-5" : ""
      }`}
    >
      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[24px] text-[#08a84f]">
        {icon}
      </div>

      {/* Content */}
      <div>
        <h4 className="text-[13px] font-bold text-slate-900">{title}</h4>

        <p className="mt-1 text-[12px] leading-5 text-slate-600">{desc}</p>
      </div>
    </div>
  );
};

export default FeaturesSection;
