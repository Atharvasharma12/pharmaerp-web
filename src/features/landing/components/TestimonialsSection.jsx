import React from "react";
import {
  FiUsers,
  FiHome,
  FiFileText,
  FiTrendingUp,
  FiMapPin,
} from "react-icons/fi";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

const TestimonialsSection = () => {
  const stats = [
    {
      icon: <FiHome />,
      value: "5,000+",
      title: "Pharmacies",
      desc: "Trust PharmaERP",
    },
    {
      icon: <FiUsers />,
      value: "20,000+",
      title: "Users",
      desc: "Across India",
    },
    {
      icon: <FiFileText />,
      value: "1 Cr+",
      title: "Bills Generated",
      desc: "Every Month",
    },
    {
      icon: <FiTrendingUp />,
      value: "99.9%",
      title: "Uptime",
      desc: "Reliable & Secure",
    },
  ];

  const testimonials = [
    {
      text: "PharmaERP has completely transformed the way we run our pharmacy. Billing is faster, stock management is effortless and reports help us make better decisions.",
      name: "Amit Sharma",
      store: "Sharma Medical Store",
      city: "Jaipur, Rajasthan",
      image: "https://i.pravatar.cc/100?img=11",
    },
    {
      text: "The expiry alerts and stock tracking features have reduced our losses significantly. Support team is very responsive and the system is very easy to use.",
      name: "Neha Patel",
      store: "Patel Pharmacy",
      city: "Surat, Gujarat",
      image: "https://i.pravatar.cc/100?img=47",
    },
    {
      text: "Best pharmacy management system we have used. GST billing, purchase management, customer history — everything is so well organized in one place.",
      name: "Ramesh Verma",
      store: "Verma Medicals",
      city: "Lucknow, Uttar Pradesh",
      image: "https://i.pravatar.cc/100?img=12",
    },
  ];

  const logos = [
    "Apollo PHARMACY",
    "MedPlus ✚",
    "Wellness Forever",
    "netmeds",
    "FRANK ROSS",
    "LIFECARE",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#fbfcfd] py-10">
      <DecorDots className="left-0 top-[300px]" />
      <DecorDots className="right-0 bottom-[115px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* HEADING */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-[#08a84f]">
            <FiUsers className="text-[13px]" />
            Trusted by Pharmacy Owners
          </div>

          <h2 className="text-[28px] font-extrabold leading-[1.08] tracking-[-0.8px] text-slate-900 sm:text-[34px] lg:text-[40px]">
            Loved by Thousands of
            <span className="block text-[#08a84f]">
              Pharmacy Owners Across India
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-[14px] leading-6 text-slate-600">
            PharmaERP is trusted by retail pharmacy stores of all sizes to
            simplify operations, improve efficiency and grow their business.
          </p>
        </div>

        {/* STATS */}
        <div className="mx-auto mt-8 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        {/* TESTIMONIALS */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </div>

        {/* LOGOS */}
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/30 px-5 py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
          <h3 className="text-center text-[18px] font-bold text-slate-900">
            Trusted by Leading Pharmacy Stores
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {logos.map((logo, index) => (
              <LogoCard key={logo} logo={logo} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ icon, value, title, desc }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.035)]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[27px] text-[#08a84f]">
        {icon}
      </div>

      <div>
        <h3 className="text-[26px] font-extrabold leading-none text-slate-900">
          {value}
        </h3>

        <p className="mt-1 text-[15px] font-bold leading-none text-slate-900">
          {title}
        </p>

        <p className="mt-2 text-[12.5px] leading-5 text-slate-600">{desc}</p>
      </div>
    </div>
  );
};

const TestimonialCard = ({ text, name, store, city, image }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_20px_rgba(15,23,42,0.035)]">
      <FaQuoteLeft className="text-[24px] text-[#08a84f]" />

      <p className="mt-4 min-h-[108px] text-[14px] leading-6 text-slate-800">
        {text}
      </p>

      <div className="mt-4 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={image}
              alt={name}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0">
              <h4 className="text-[14px] font-bold text-slate-900">{name}</h4>

              <p className="mt-1 text-[12px] font-semibold text-slate-900">
                {store}
              </p>

              <p className="mt-1 flex items-center gap-1 text-[11.5px] text-slate-700">
                <FiMapPin className="shrink-0 text-[#08a84f]" />
                {city}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-[13px]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const LogoCard = ({ logo, index }) => {
  const styles = [
    "text-teal-700",
    "text-red-600",
    "text-green-700",
    "text-cyan-600",
    "text-slate-700",
    "text-slate-800",
  ];

  return (
    <div className="flex h-[64px] items-center justify-center rounded-lg bg-white px-3 shadow-[0_8px_18px_rgba(15,23,42,0.035)]">
      <span
        className={`text-center text-[15px] font-extrabold leading-tight ${
          styles[index] || "text-slate-800"
        }`}
      >
        {logo}
      </span>
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

export default TestimonialsSection;
