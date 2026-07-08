// src/layouts/public/desktop/PublicDesktopNavbar.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiChevronDown,
  FiArrowRight,
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

import { AppButton } from "@/components";
import ThemeSwitcher from "@/components/shared/theme/ThemeSwitcher";
import LanguageSelector from "@/components/shared/language/LanguageSelector";
import { ROUTES } from "@/constants";

const PublicDesktopNavbar = () => {
  const [language, setLanguage] = useState("en");

  const loginUrl = "/login";
  const registerUrl = ROUTES.REGISTER;

  const navItems = [
    {
      label: "Features",
      dropdown: true,
      items: [
        {
          label: "Inventory",
          icon: <FiPackage />,
          path: "/features/inventory-management",
        },
        {
          label: "Billing",
          icon: <FiFileText />,
          path: "/features/billing-invoicing",
        },
        {
          label: "GST",
          icon: <FiShoppingCart />,
          path: "/features/gst-compliance",
        },
        {
          label: "Analytics",
          icon: <FiBarChart2 />,
          path: "/features/reports-analytics",
        },
        {
          label: "Customers",
          icon: <FiUsers />,
          path: "/features/customer-management",
        },
      ],
    },
    {
      label: "Solutions",
      dropdown: true,
      items: [
        {
          label: "Pharmacy",
          icon: <FiHome />,
          path: "/solutions/independent-pharmacy",
        },
        {
          label: "Chain",
          icon: <FiUsers />,
          path: "/solutions/chain-pharmacy",
        },
        {
          label: "Distributors",
          icon: <FiTruck />,
          path: "/solutions/distributors",
        },
        {
          label: "Stores",
          icon: <FiShoppingCart />,
          path: "/solutions/medical-stores",
        },
      ],
    },
    {
      label: "Pricing",
      dropdown: false,
      path: "/pricing",
    },
    {
      label: "Resources",
      dropdown: true,
      items: [
        {
          label: "Blog",
          icon: <FiBookOpen />,
          path: "/blog",
        },
        {
          label: "Help",
          icon: <FiHelpCircle />,
          path: "/help-center",
        },
        {
          label: "Guides",
          icon: <FiFileText />,
          path: "/guides",
        },
        {
          label: "API Docs",
          icon: <FiBarChart2 />,
          path: "/api-docs",
        },
      ],
    },
    {
      label: "Company",
      dropdown: true,
      items: [
        {
          label: "About",
          icon: <FiInfo />,
          path: "/about",
        },
        {
          label: "Pricing",
          icon: <FiDollarSign />,
          path: "/pricing",
        },
        {
          label: "Reviews",
          icon: <FiMessageSquare />,
          path: "/testimonials",
        },
        {
          label: "Contact",
          icon: <FiPhone />,
          path: "/contact",
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[64px] w-full max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface shadow-sm">
              <img
                src="/erp-mini-logo.png"
                alt="PharmaERP Logo"
                className="h-6 w-6 object-contain"
              />
            </div>

            <span className="text-[21px] font-bold tracking-tight text-text">
              Pharma<span className="text-primary">ERP</span>
            </span>
          </Link>

          <div className="hidden items-center gap-5 xl:flex">
            {navItems.map((item) => (
              <div key={item.label} className="group relative">
                {item.dropdown ? (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[14px] font-medium text-text-muted transition hover:text-primary"
                    >
                      {item.label}
                      <FiChevronDown className="text-[15px] transition duration-200 group-hover:rotate-180" />
                    </button>

                    <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-[220px] -translate-x-1/2 rounded-xl border border-border bg-surface p-1.5 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:mt-2 group-hover:opacity-100">
                      <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-border bg-surface" />

                      <div className="relative z-10 space-y-0.5">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] font-medium text-text-muted transition-all duration-200 hover:bg-primary-soft hover:text-primary"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-[15px] text-primary">
                              {subItem.icon}
                            </span>

                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="text-[14px] font-medium text-text-muted transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            size="small"
            align="right"
          />

          <ThemeSwitcher size="small" />

          <AppButton
            component={Link}
            to={loginUrl}
            variant="outlined"
            colorVariant="primary"
            rounded="lg"
            sx={{
              px: "16px",
              py: "8px",
              fontSize: "13px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Log In
          </AppButton>

          <AppButton
            component={Link}
            to={registerUrl}
            variant="contained"
            colorVariant="primary"
            rounded="lg"
            endIcon={<FiArrowRight className="text-[15px]" />}
            sx={{
              px: "16px",
              py: "8px",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Start Trial
          </AppButton>
        </div>
      </nav>
    </header>
  );
};

export default PublicDesktopNavbar;
