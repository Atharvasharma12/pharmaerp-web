// src/layouts/public/mobile/PublicMobileTopBar.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiMenu,
  FiX,
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

import { AppButton, AppIconButton } from "@/components";
import ThemeSwitcher from "@/components/shared/theme/ThemeSwitcher";

const PublicMobileTopBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const loginUrl = "/login";

  const navItems = [
    {
      label: "Features",
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
      path: "/pricing",
    },
    {
      label: "Resources",
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

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (label) => {
    setOpenDropdown((current) => (current === label ? null : label));
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur-md">
        <nav className="flex h-[64px] items-center justify-between px-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
              <img
                src="/erp-mini-logo.png"
                alt="PharmaERP Logo"
                className="h-6 w-6 object-contain"
              />
            </div>

            <span className="text-[22px] font-bold leading-none tracking-tight text-text">
              Pharma<span className="text-primary">ERP</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeSwitcher compact size="small" />

            <AppIconButton
              icon={
                menuOpen ? (
                  <FiX className="text-[22px]" />
                ) : (
                  <FiMenu className="text-[22px]" />
                )
              }
              onClick={() => setMenuOpen((prev) => !prev)}
              variant="outlined"
              colorVariant="dark"
              rounded="md"
              aria-label="Toggle mobile menu"
              sx={{
                width: 38,
                height: 38,
                borderColor: "var(--app-color-border-strong)",
                color: "var(--app-color-text)",
              }}
            />
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-x-0 top-[64px] z-40 max-h-[calc(100vh-64px)] overflow-y-auto border-b border-border bg-surface px-4 py-4 shadow-lg">
          <div className="space-y-2">
            {navItems.map((item) => {
              const hasDropdown = Array.isArray(item.items);
              const isOpen = openDropdown === item.label;

              if (!hasDropdown) {
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-text transition hover:bg-primary-soft hover:text-primary"
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() => handleDropdownToggle(item.label)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-semibold text-text transition hover:bg-primary-soft hover:text-primary"
                  >
                    <span>{item.label}</span>

                    <FiChevronDown
                      className={`text-[17px] transition duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-1 space-y-1 rounded-xl bg-surface-alt p-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.path}
                          onClick={closeMenu}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-text-muted transition hover:bg-primary-soft hover:text-primary"
                        >
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-[16px] text-primary">
                            {subItem.icon}
                          </span>

                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border pt-4">
            <AppButton
              component={Link}
              to={loginUrl}
              onClick={closeMenu}
              variant="outlined"
              colorVariant="primary"
              rounded="lg"
              fullWidth
              sx={{
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
              onClick={closeMenu}
              variant="contained"
              colorVariant="primary"
              rounded="lg"
              fullWidth
              endIcon={<FiArrowRight className="text-[17px]" />}
              sx={{
                py: "10px",
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Start Free Trial
            </AppButton>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicMobileTopBar;
