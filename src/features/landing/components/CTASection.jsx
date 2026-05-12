import React from "react";
import {
  FiUsers,
  FiCheckCircle,
  FiSend,
  FiHeadphones,
  FiCalendar,
  FiShield,
  FiTrendingUp,
  FiClock,
  FiHeart,
  FiArrowRight,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const CTASection = () => {
  const badges = [
    {
      icon: <FiCheckCircle />,
      text: "No Credit Card Required",
    },
    {
      icon: <FiSend />,
      text: "Setup in Minutes",
    },
    {
      icon: <FiHeadphones />,
      text: "7 Days Free Trial",
    },
  ];

  const features = [
    {
      icon: <FiShield />,
      title: "Trusted & Secure",
      desc: "100% secure, GST compliant and your data is always protected.",
    },
    {
      icon: <FiTrendingUp />,
      title: "Built for Growth",
      desc: "Scalable for single store or multi-store pharmacy businesses.",
    },
    {
      icon: <FiClock />,
      title: "Save Time & Money",
      desc: "Automate tasks, reduce errors and focus on what matters most.",
    },
    {
      icon: <FiUsers />,
      title: "Dedicated Support",
      desc: "Our expert team is always ready to help you succeed.",
    },
  ];

  return (
    <section className="w-full bg-[#fbfcfd] py-10">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white px-6 py-7 shadow-[0_14px_40px_rgba(15,23,42,0.06)] lg:px-10 lg:py-9">
          <div className="grid items-center gap-8 lg:grid-cols-[0.56fr_0.44fr]">
            {/* LEFT CONTENT */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-bold text-[#08a84f]">
                <FiUsers className="text-[15px]" />
                Join Thousands of Successful Pharmacies
              </div>

              <h2 className="text-[34px] font-extrabold leading-[1.08] tracking-[-1px] text-slate-900 sm:text-[42px] lg:text-[46px]">
                Ready to Simplify Your
                <span className="block text-[#08a84f]">
                  Pharmacy Operations?
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-slate-600">
                Experience the power of PharmaERP and take your pharmacy
                business to the next level. Start your{" "}
                <span className="font-bold text-[#08a84f]">free trial</span>{" "}
                today!
              </p>

              <div className="mt-5 flex flex-wrap gap-4">
                {badges.map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-3 text-[14px] font-bold text-slate-900"
                  >
                    <span className="text-[20px] text-[#08a84f]">
                      {item.icon}
                    </span>
                    {item.text}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <button className="flex items-center justify-center gap-3 rounded-lg bg-[#08a84f] px-8 py-4 text-[18px] font-extrabold text-white shadow-sm transition hover:bg-[#079447]">
                  Start Your 7 Days Free Trial
                  <FiArrowRight className="text-[22px]" />
                </button>

                <button className="flex items-center justify-center gap-3 rounded-lg border border-[#08a84f] bg-white px-8 py-4 text-[18px] font-extrabold text-[#08a84f] transition hover:bg-emerald-50">
                  <FiCalendar className="text-[22px]" />
                  Book a Demo
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex -space-x-3">
                  {[
                    "https://i.pravatar.cc/80?img=11",
                    "https://i.pravatar.cc/80?img=47",
                    "https://i.pravatar.cc/80?img=12",
                  ].map((img) => (
                    <img
                      key={img}
                      src={img}
                      alt="Customer"
                      className="h-9 w-9 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} className="text-[17px]" />
                  ))}
                </div>

                <p className="text-[14px] font-semibold text-slate-900">
                  Trusted by{" "}
                  <span className="font-extrabold text-[#08a84f]">5,000+</span>{" "}
                  Pharmacies Across India
                </p>
              </div>
            </div>

            {/* RIGHT IMAGES */}
            <div className="relative hidden min-h-[390px] items-center justify-center lg:flex">
              <div className="absolute right-[-120px] top-[-140px] h-[560px] w-[560px] rounded-full bg-emerald-50" />

              <div
                className="absolute right-4 top-3 h-[110px] w-[150px] opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(8,168,79,0.35) 1.3px, transparent 1.3px)",
                  backgroundSize: "14px 14px",
                }}
              />

              <img
                src="/src/assets/dashboard-showcase/overview-dashboard.png"
                alt="Dashboard Overview"
                className="relative z-10 ml-auto w-full max-w-[560px] rounded-xl object-contain shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
              />

              <img
                src="/src/assets/dashboard-showcase/mobile-app-preview.png"
                alt="Mobile App Preview"
                className="absolute bottom-5 left-12 z-20 w-[120px] rounded-2xl object-contain shadow-[0_16px_35px_rgba(15,23,42,0.18)]"
              />
            </div>
          </div>

          {/* FEATURE STRIP */}
          <div className="mt-7 rounded-2xl border border-slate-100 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {features.map((item, index) => (
                <FeatureItem
                  key={item.title}
                  {...item}
                  noBorder={index === features.length - 1}
                />
              ))}
            </div>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 text-center text-[17px] font-bold text-slate-900">
            <FiHeart className="text-[22px] text-[#08a84f]" />
            <span>
              More than software, we’re your{" "}
              <span className="text-[#08a84f]">growth partner</span> in success.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon, title, desc, noBorder }) => {
  return (
    <div
      className={`flex items-center gap-4 ${
        !noBorder ? "lg:border-r lg:border-slate-200 lg:pr-5" : ""
      }`}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[28px] text-[#08a84f]">
        {icon}
      </div>

      <div>
        <h4 className="text-[15px] font-extrabold text-slate-900">{title}</h4>
        <p className="mt-1 text-[13px] leading-6 text-slate-600">{desc}</p>
      </div>
    </div>
  );
};

export default CTASection;
