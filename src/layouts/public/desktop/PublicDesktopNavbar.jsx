// src/layouts/public/desktop/PublicDesktopNavbar.jsx

import React from "react";
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

const PublicDesktopNavbar = () => {
  const loginUrl = "/login";

  const navItems = [
    {
      label: "Features",
      dropdown: true,
      items: [
        {
          label: "Inventory Management",
          icon: <FiPackage />,
          path: "/features/inventory-management",
        },
        {
          label: "Billing & Invoicing",
          icon: <FiFileText />,
          path: "/features/billing-invoicing",
        },
        {
          label: "GST & Compliance",
          icon: <FiShoppingCart />,
          path: "/features/gst-compliance",
        },
        {
          label: "Reports & Analytics",
          icon: <FiBarChart2 />,
          path: "/features/reports-analytics",
        },
        {
          label: "Customer Management",
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
          label: "Independent Pharmacy",
          icon: <FiHome />,
          path: "/solutions/independent-pharmacy",
        },
        {
          label: "Chain Pharmacy",
          icon: <FiUsers />,
          path: "/solutions/chain-pharmacy",
        },
        {
          label: "Distributors",
          icon: <FiTruck />,
          path: "/solutions/distributors",
        },
        {
          label: "Medical Stores",
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
          label: "Help Center",
          icon: <FiHelpCircle />,
          path: "/help-center",
        },
        {
          label: "Guides",
          icon: <FiFileText />,
          path: "/guides",
        },
        {
          label: "API Documentation",
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
          label: "About Us",
          icon: <FiInfo />,
          path: "/about",
        },
        {
          label: "Pricing",
          icon: <FiDollarSign />,
          path: "/pricing",
        },
        {
          label: "Testimonials",
          icon: <FiMessageSquare />,
          path: "/testimonials",
        },
        {
          label: "Contact Us",
          icon: <FiPhone />,
          path: "/contact",
        },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-12">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
              <img
                src="/erp-mini-logo.png"
                alt="PharmaERP Logo"
                className="h-7 w-7 object-contain"
              />
            </div>

            <span className="text-[24px] font-bold tracking-tight text-text">
              Pharma<span className="text-primary">ERP</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 xl:flex">
            {navItems.map((item) => (
              <div key={item.label} className="group relative">
                {item.dropdown ? (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[15px] font-medium text-text-muted transition hover:text-primary"
                    >
                      {item.label}

                      <FiChevronDown className="text-[16px] transition duration-200 group-hover:rotate-180" />
                    </button>

                    <div className="invisible absolute left-1/2 top-full z-50 mt-5 w-[280px] -translate-x-1/2 rounded-2xl border border-border bg-surface p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:mt-3 group-hover:opacity-100">
                      <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-border bg-surface" />

                      <div className="relative z-10 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-medium text-text-muted transition-all duration-200 hover:bg-primary-soft hover:text-primary"
                          >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-[18px] text-primary">
                              {subItem.icon}
                            </span>

                            <div className="flex flex-col">
                              <span>{subItem.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className="text-[15px] font-medium text-text-muted transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />

          <AppButton
            component={Link}
            to={loginUrl}
            variant="outlined"
            colorVariant="primary"
            rounded="lg"
            sx={{
              px: "22px",
              py: "10px",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Log In
          </AppButton>

          <AppButton
            component={Link}
            to="/"
            variant="contained"
            colorVariant="primary"
            rounded="lg"
            endIcon={<FiArrowRight className="text-[17px]" />}
            sx={{
              px: "22px",
              py: "10px",
              fontSize: "14px",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Start Free Trial
          </AppButton>
        </div>
      </nav>
    </header>
  );
};

export default PublicDesktopNavbar;
