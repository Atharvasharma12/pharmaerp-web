import React, { useState } from "react";
import {
  FiTag,
  FiHome,
  FiCheckCircle,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiCloud,
} from "react-icons/fi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BsDiamond } from "react-icons/bs";
import { FaStar } from "react-icons/fa";

const PricingSection = () => {
  const [yearly, setYearly] = useState(true);

  const plans = [
    {
      name: "Basic",
      subtitle: "Perfect for small pharmacies",
      price: "₹999",
      yearlyText: "Billed annually at ₹11,988 (Save ₹2,388)",
      icon: <FiHome />,
      color: "green",
      popular: false,
      features: [
        "Sales & Billing (GST Ready)",
        "Inventory Management",
        "Purchase Management",
        "Expiry & Batch Tracking",
        "Reports & Analytics",
        "1 Store / 1 User",
        "Cloud Backup (5 GB)",
        "Email Support",
      ],
    },
    {
      name: "Professional",
      subtitle: "Best for growing pharmacies",
      price: "₹1,999",
      yearlyText: "Billed annually at ₹23,988 (Save ₹4,000)",
      icon: <BsDiamond />,
      color: "green",
      popular: true,
      features: [
        "Customer Management (CRM)",
        "Advanced Reports & Analytics",
        "Barcode Scanning Support",
        "Offers & Schemes Management",
        "Low Stock & Expiry Alerts",
        "Multi-User Access (Up to 3 Users)",
        "Multi-Store Management",
        "Cloud Backup (20 GB)",
        "WhatsApp Integration",
        "Priority Support",
        "Data Export (Excel/PDF)",
        "GSTR-1 & E-Invoicing",
      ],
    },
    {
      name: "Enterprise",
      subtitle: "For large & multi-store pharmacies",
      price: "₹3,999",
      yearlyText: "Billed annually at ₹47,988 (Save ₹8,000)",
      icon: <HiOutlineOfficeBuilding />,
      color: "purple",
      popular: false,
      features: [
        "Unlimited Users",
        "Advanced Analytics Dashboard",
        "Role-Based Access Control",
        "Dedicated Account Manager",
        "API Access",
        "Custom Training & Onboarding",
        "Cloud Backup (100 GB)",
        "Data Backup & Restore",
        "24/7 Premium Support",
        "SLA & Uptime Guarantee",
        "Priority Feature Requests",
      ],
    },
  ];

  const bottomFeatures = [
    {
      icon: <FiCloud />,
      title: "100% Cloud Based",
      desc: "Access your pharmacy data anytime, anywhere.",
    },
    {
      icon: <FiShield />,
      title: "Secure & Reliable",
      desc: "Advanced security and daily backups.",
    },
    {
      icon: <FiRefreshCw />,
      title: "Easy to Use",
      desc: "Simple interface for pharmacy professionals.",
    },
    {
      icon: <FiHeadphones />,
      title: "Dedicated Support",
      desc: "Our expert team is ready to help you.",
    },
  ];

  return (
    <section className="w-full bg-[#fbfcfd] py-9">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* HEADING */}
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-[#08a84f]">
            <FiTag className="text-[13px]" />
            Simple Pricing, Powerful Software
          </div>

          <h2 className="text-[28px] font-extrabold leading-[1.08] tracking-[-0.8px] text-slate-900 sm:text-[34px] lg:text-[38px]">
            Choose the Perfect Plan for
            <span className="block text-[#08a84f]">Your Pharmacy Business</span>
          </h2>

          <p className="mx-auto mt-3 max-w-4xl text-[13.5px] leading-6 text-slate-600">
            Flexible plans for every pharmacy size and need. All plans include
            core features to run your pharmacy smoothly. Upgrade, downgrade or
            cancel anytime as your business grows.
          </p>

          {/* TOGGLE */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <span className="text-[13px] font-semibold text-slate-800">
              Monthly Billing
            </span>

            <button
              onClick={() => setYearly(!yearly)}
              className={`relative h-6 w-11 rounded-full transition ${
                yearly ? "bg-[#08a84f]" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  yearly ? "left-[23px]" : "left-1"
                }`}
              />
            </button>

            <span className="text-[13px] font-semibold text-[#08a84f]">
              Yearly Billing
            </span>

            <div className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-[#08a84f]">
              Save up to 20%
            </div>
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="mt-7 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </div>

        {/* FEATURES STRIP */}
        <div className="mt-5 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
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

        {/* BOTTOM TAGS */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-2xl bg-emerald-50 px-5 py-3">
          {[
            "All plans are GST compliant",
            "No hidden charges",
            "Cancel anytime",
            "Upgrade or downgrade anytime",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-[13px] font-semibold text-[#08a84f]"
            >
              <FiShield className="text-[15px]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({
  name,
  subtitle,
  price,
  yearlyText,
  icon,
  color,
  popular,
  features,
}) => {
  const colors = {
    green: {
      iconBg: "bg-emerald-50",
      iconText: "text-[#08a84f]",
      border: "border-[#08a84f]",
      text: "text-[#08a84f]",
      button: "bg-[#08a84f] text-white hover:bg-[#079447] border-[#08a84f]",
      outline: "border-[#08a84f] text-[#08a84f] hover:bg-emerald-50",
      badge: "bg-[#08a84f]",
    },
    purple: {
      iconBg: "bg-purple-50",
      iconText: "text-purple-600",
      border: "border-purple-500",
      text: "text-purple-600",
      button: "bg-purple-600 text-white hover:bg-purple-700 border-purple-600",
      outline: "border-purple-500 text-purple-600 hover:bg-purple-50",
      badge: "bg-purple-600",
    },
  };

  const c = colors[color] || colors.green;

  return (
    <div
      className={`relative rounded-2xl border bg-white px-5 py-5 shadow-[0_8px_22px_rgba(15,23,42,0.045)] ${
        popular ? `${c.border} border-2` : "border-slate-200"
      }`}
    >
      {popular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div
            className={`flex items-center gap-2 rounded-full ${c.badge} px-4 py-1 text-[11px] font-bold text-white`}
          >
            <FaStar className="text-[10px]" />
            MOST POPULAR
          </div>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${c.iconBg} ${c.iconText}`}
        >
          <span className="text-[28px]">{icon}</span>
        </div>

        <div>
          <h3 className="text-[18px] font-extrabold text-slate-900">{name}</h3>
          <p className="mt-1 text-[13px] text-slate-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-end gap-2">
          <h2 className={`text-[38px] font-extrabold leading-none ${c.text}`}>
            {price}
          </h2>
          <span className="mb-1 text-[13px] text-slate-700">/ month</span>
        </div>

        <div
          className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
            color === "purple"
              ? "bg-purple-100 text-purple-700"
              : "bg-emerald-100 text-[#08a84f]"
          }`}
        >
          {yearlyText}
        </div>
      </div>

      <div className="my-4 border-t border-slate-200" />

      <h4 className={`text-[14px] font-bold ${c.text}`}>
        {name === "Basic"
          ? "Everything in Basic:"
          : name === "Professional"
            ? "Everything in Basic, plus:"
            : "Everything in Professional, plus:"}
      </h4>

      <div
        className={`mt-3 grid gap-y-2.5 ${
          name === "Professional" || name === "Enterprise"
            ? "md:grid-cols-2 md:gap-x-4"
            : ""
        }`}
      >
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <FiCheckCircle
              className={`mt-0.5 shrink-0 text-[15px] ${c.text}`}
            />
            <span className="text-[12.5px] leading-5 text-slate-800">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <button
          className={`w-full rounded-lg border px-4 py-2.5 text-[14px] font-bold transition ${
            popular ? c.button : c.outline
          }`}
        >
          Start 7 Days Free Trial
        </button>

        <p className="mt-2 text-center text-[11.5px] text-slate-500">
          No Credit Card Required
        </p>
      </div>
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
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[22px] text-[#08a84f]">
        {icon}
      </div>

      <div>
        <h4 className="text-[13px] font-bold text-slate-900">{title}</h4>
        <p className="mt-1 text-[12px] leading-5 text-slate-600">{desc}</p>
      </div>
    </div>
  );
};

export default PricingSection;
