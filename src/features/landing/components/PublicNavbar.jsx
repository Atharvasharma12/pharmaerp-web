import React, { useState } from "react";
import {
  FiChevronDown,
  FiArrowRight,
  FiMenu,
  FiX,
  FiPackage,
  FiShoppingCart,
  FiFileText,
  FiBarChart2,
  FiUsers,
  FiHome,
  FiTruck,
  FiBookOpen,
  FiHelpCircle,
  FiInfo,
  FiDollarSign,
  FiMessageSquare,
  FiPhone,
} from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";

const PublicNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      label: "Features",
      dropdown: true,
      items: [
        { label: "Inventory Management", icon: <FiPackage /> },
        { label: "Billing & Invoicing", icon: <FiFileText /> },
        { label: "GST & Compliance", icon: <FiShoppingCart /> },
        { label: "Reports & Analytics", icon: <FiBarChart2 /> },
        { label: "Customer Management", icon: <FiUsers /> },
      ],
    },
    {
      label: "Solutions",
      dropdown: true,
      items: [
        { label: "Independent Pharmacy", icon: <FiHome /> },
        { label: "Chain Pharmacy", icon: <FiUsers /> },
        { label: "Distributors", icon: <FiTruck /> },
        { label: "Medical Stores", icon: <FiShoppingCart /> },
      ],
    },
    {
      label: "Pricing",
      dropdown: false,
    },
    {
      label: "Resources",
      dropdown: true,
      items: [
        { label: "Blog", icon: <FiBookOpen /> },
        { label: "Help Center", icon: <FiHelpCircle /> },
        { label: "Guides", icon: <FiFileText /> },
        { label: "API Documentation", icon: <FiBarChart2 /> },
      ],
    },
    {
      label: "Company",
      dropdown: true,
      items: [
        { label: "About Us", icon: <FiInfo /> },
        { label: "Pricing", icon: <FiDollarSign /> },
        { label: "Testimonials", icon: <FiMessageSquare /> },
        { label: "Contact Us", icon: <FiPhone /> },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#08a84f]">
            <FaPlus className="text-[24px]" />
          </div>

          <span className="text-[24px] font-bold leading-none tracking-tight text-slate-900">
            Pharma<span className="text-[#08a84f]">ERP</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <div key={item.label} className="group relative">
              <button className="flex items-center gap-1 text-[15px] font-medium text-slate-700 transition hover:text-[#08a84f]">
                {item.label}
                {item.dropdown && (
                  <FiChevronDown className="text-[16px] transition group-hover:rotate-180" />
                )}
              </button>

              {item.dropdown && (
                <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-[260px] -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-all duration-200 group-hover:visible group-hover:mt-3 group-hover:opacity-100">
                  <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-slate-200 bg-white" />

                  <div className="relative z-10 space-y-1">
                    {item.items.map((subItem) => (
                      <a
                        key={subItem.label}
                        href="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-[#08a84f]"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-[16px] text-[#08a84f]">
                          {subItem.icon}
                        </span>
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <button className="rounded-lg border border-[#08a84f] px-5 py-2 text-[14px] font-semibold text-[#08a84f] transition hover:bg-emerald-50">
            Log In
          </button>

          <button className="flex items-center gap-2 rounded-lg bg-[#08a84f] px-5 py-2 text-[14px] font-semibold text-white transition hover:bg-[#079447]">
            Start Free Trial
            <FiArrowRight className="text-[17px]" />
          </button>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"
        >
          {mobileOpen ? (
            <FiX className="text-[22px]" />
          ) : (
            <FiMenu className="text-[22px]" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="space-y-3">
            {navItems.map((item) => (
              <div key={item.label}>
                <a
                  href="/"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[15px] font-semibold text-slate-800"
                >
                  {item.label}
                  {item.dropdown && <FiChevronDown />}
                </a>

                {item.dropdown && (
                  <div className="mt-1 space-y-1 pl-3">
                    {item.items.map((subItem) => (
                      <a
                        key={subItem.label}
                        href="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-slate-600"
                      >
                        <span className="text-[#08a84f]">{subItem.icon}</span>
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-3 pt-3">
              <button className="rounded-lg border border-[#08a84f] px-5 py-2.5 text-[14px] font-semibold text-[#08a84f]">
                Log In
              </button>

              <button className="flex items-center justify-center gap-2 rounded-lg bg-[#08a84f] px-5 py-2.5 text-[14px] font-semibold text-white">
                Start Free Trial
                <FiArrowRight className="text-[17px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
