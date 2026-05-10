import React from "react";
import {
  FiShield,
  FiCloud,
  FiHeadphones,
  FiSend,
  FiLock,
  FiRefreshCw,
} from "react-icons/fi";
import {
  FaPlus,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import { HiCurrencyRupee } from "react-icons/hi2";

const PublicFooter = () => {
  const productLinks = [
    "Features",
    "Inventory Management",
    "Billing & Invoicing",
    "GST & Compliance",
    "Reports & Analytics",
  ];

  const solutionLinks = [
    "Independent Pharmacy",
    "Chain Pharmacy",
    "Distributors",
    "Medical Stores",
  ];

  const companyLinks = ["About Us", "Pricing", "Testimonials", "Careers"];

  const resourceLinks = ["Blog", "Help Center", "Guides", "API Documentation"];

  const trustItems = [
    {
      icon: <FiCloud />,
      title: "Secure Cloud",
      text: "Your data is safe with us",
    },
    {
      icon: <FiLock />,
      title: "Daily Backups",
      text: "Automatic backups for peace of mind",
    },
    {
      icon: <FiRefreshCw />,
      title: "99.9% Uptime",
      text: "Reliable performance",
    },
    {
      icon: <FiHeadphones />,
      title: "Expert Support",
      text: "We're here to help",
    },
  ];

  return (
    <footer className="w-full bg-[#f8fafc] pt-10 pb-5">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* TOP SECTION */}
        <div className="grid gap-8 border-b border-slate-200 pb-8 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_0.8fr_1.2fr]">
          {/* BRAND */}
          <div>
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#08a84f]">
                <FaPlus className="text-[22px]" />
              </div>

              <span className="text-[24px] font-bold tracking-tight text-slate-900">
                Pharma<span className="text-[#08a84f]">ERP</span>
              </span>
            </a>

            <p className="mt-4 max-w-[240px] text-[13px] leading-6 text-slate-600">
              All-in-one pharmacy management software to simplify operations and
              grow your pharmacy business.
            </p>

            <div className="mt-5 space-y-3">
              <FooterInfo icon={<FiShield />} text="100% Secure & Reliable" />

              <FooterInfo icon={<FiCloud />} text="Cloud Based" />

              <FooterInfo icon={<HiCurrencyRupee />} text="GST Compliant" />

              <FooterInfo icon={<FiHeadphones />} text="Dedicated Support" />
            </div>
          </div>

          {/* COLUMNS */}
          <FooterColumn title="Product" links={productLinks} />
          <FooterColumn title="Solutions" links={solutionLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Resources" links={resourceLinks} />

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-[15px] font-bold text-slate-900">
              Stay Updated
            </h3>

            <p className="mt-4 text-[13px] leading-6 text-slate-600">
              Get latest updates, features and pharmacy tips.
            </p>

            <form className="mt-4 flex overflow-hidden rounded-lg border border-slate-200 bg-white">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 px-3 py-2.5 text-[13px] outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                className="flex w-11 items-center justify-center bg-[#08a84f] text-white"
              >
                <FiSend className="text-[16px]" />
              </button>
            </form>

            <h3 className="mt-6 text-[15px] font-bold text-slate-900">
              Follow Us
            </h3>

            <div className="mt-4 flex items-center gap-3">
              <SocialIcon icon={<FaFacebookF />} />
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaLinkedinIn />} />
              <SocialIcon icon={<FaYoutube />} />
            </div>
          </div>
        </div>

        {/* TRUST BAR */}
        <div className="grid gap-5 border-b border-slate-200 py-5 md:grid-cols-2 lg:grid-cols-5">
          {/* TRUSTED */}
          <div className="flex items-center gap-3">
            <FiShield className="text-[34px] text-[#08a84f]" />

            <div>
              <p className="text-[13px] font-semibold text-slate-700">
                Trusted by{" "}
                <span className="font-bold text-[#08a84f]">5,000+</span>{" "}
                Pharmacies
              </p>

              <p className="text-[13px] text-slate-600">Across India</p>
            </div>
          </div>

          {/* TRUST ITEMS */}
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 border-slate-200 lg:border-l lg:pl-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-[20px] text-[#08a84f]">
                {item.icon}
              </div>

              <div>
                <p className="text-[13px] font-semibold text-slate-900">
                  {item.title}
                </p>

                <p className="mt-0.5 text-[12px] text-slate-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-3 pt-5 text-[12px] text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>© 2024 PharmaERP. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/" className="hover:text-[#08a84f]">
              Privacy Policy
            </a>

            <a href="/" className="hover:text-[#08a84f]">
              Terms of Service
            </a>

            <a href="/" className="hover:text-[#08a84f]">
              Refund Policy
            </a>

            <a href="/" className="hover:text-[#08a84f]">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>

      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a
              href="/"
              className="text-[13px] text-slate-600 transition hover:text-[#08a84f]"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FooterInfo = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[16px] text-[#08a84f]">
        {icon}
      </div>

      <span className="text-[13px] font-medium text-slate-700">{text}</span>
    </div>
  );
};

const SocialIcon = ({ icon }) => {
  return (
    <a
      href="/"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[15px] text-slate-700"
    >
      {icon}
    </a>
  );
};

export default PublicFooter;
