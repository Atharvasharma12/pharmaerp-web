import React from "react";
import {
  FiShield,
  FiSmile,
  FiLock,
  FiCloud,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiHeadphones,
  FiSend,
} from "react-icons/fi";

const HeroSection = () => {
  return (
    <section className="w-full overflow-hidden bg-[#fbfcfd] pt-8 pb-6">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        {/* HERO CONTENT */}
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          {/* LEFT SIDE */}
          <div className="max-w-[590px]">
            {/* Badge */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-[#08a84f]">
              <FiCheckCircle className="text-[12px]" />
              All-in-One Pharmacy Management Software
            </div>

            {/* Heading */}
            <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-[-1.1px] text-slate-900 sm:text-[40px] lg:text-[44px] xl:text-[46px]">
              <span className="block whitespace-nowrap">
                Simplify Your Pharmacy.
              </span>

              <span className="block whitespace-nowrap text-[#08a84f]">
                Grow Your Business.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-3 max-w-[520px] text-[14px] leading-6 text-slate-600">
              PharmaERP helps pharmacies automate billing, manage inventory,
              track expiry, handle GST and grow smarter with real-time insights.
            </p>

            {/* Features */}
            <div className="mt-4 grid max-w-[500px] grid-cols-2 gap-x-6 gap-y-2.5">
              <Feature icon={<FiShield />} text="GST Compliant" />
              <Feature icon={<FiSmile />} text="Easy to Use" />
              <Feature icon={<FiLock />} text="Secure & Reliable" />
              <Feature icon={<FiCloud />} text="Cloud Based" />
            </div>

            {/* Buttons */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button className="flex items-center justify-center gap-2 rounded-lg bg-[#08a84f] px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#079447]">
                <FiSend className="text-[16px]" />
                Start Free Trial
              </button>

              <button className="flex items-center justify-center gap-2 rounded-lg border border-[#08a84f] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#08a84f] transition hover:bg-emerald-50">
                <FiCalendar className="text-[16px]" />
                Book a Demo
              </button>
            </div>

            {/* Bottom Text */}
            <div className="mt-3 flex items-center gap-2 text-[12px] text-slate-600">
              <FiCheckCircle className="text-[#08a84f]" />
              <span>No credit card required</span>
              <span>•</span>
              <span>Setup in minutes</span>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden items-center justify-center lg:flex">
            <img
              src="/src/assets/dashboard-showcase/overview-dashboard.png"
              alt="ERP Dashboard"
              className="w-full max-w-[470px] rounded-xl object-contain drop-shadow-[0_14px_26px_rgba(15,23,42,0.12)]"
            />
          </div>
        </div>

        {/* TRUST SECTION */}
        <div className="mx-auto mt-6 max-w-6xl border-t border-slate-200 pt-5">
          <p className="text-center text-[15px] font-medium text-slate-700">
            Trusted by <span className="font-bold text-[#08a84f]">5,000+</span>{" "}
            Pharmacies Across India
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <TrustItem
              icon={<FiShield />}
              title="100% Secure"
              text="Your data is safe and protected"
            />

            <TrustItem
              icon={<FiClock />}
              title="Save Time"
              text="Automate tasks and reduce manual work"
            />

            <TrustItem
              icon={<FiTrendingUp />}
              title="Grow Faster"
              text="Insights that help you make better decisions"
            />

            <TrustItem
              icon={<FiHeadphones />}
              title="Dedicated Support"
              text="We're here to help you succeed"
              noBorder
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-[14px] text-[#08a84f]">
        {icon}
      </div>

      <span className="text-[12.5px] font-medium text-slate-700">{text}</span>
    </div>
  );
};

const TrustItem = ({ icon, title, text, noBorder }) => {
  return (
    <div
      className={`flex items-start gap-4 ${
        !noBorder ? "lg:border-r lg:border-slate-200 lg:pr-6" : ""
      }`}
    >
      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center text-[32px] text-[#08a84f]">
        {icon}
      </div>

      {/* Content */}
      <div>
        <h4 className="text-[13px] font-bold text-slate-900">{title}</h4>

        <p className="mt-1 text-[12px] leading-5 text-slate-600">{text}</p>
      </div>
    </div>
  );
};

export default HeroSection;
