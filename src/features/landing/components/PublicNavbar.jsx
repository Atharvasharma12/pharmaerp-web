import { useTheme } from "@/contexts";
import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  FiSun,
  FiMoon,
} from "react-icons/fi";

import { AppButton, AppIconButton } from "@/components";

const PublicNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const loginUrl = "/login";

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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface transition-colors">
      <nav className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img
            src="/erp-mini-logo.png"
            alt="PharmaERP Logo"
            className="h-10 w-10 object-contain"
          />

          <span className="text-[24px] font-bold leading-none tracking-tight text-text">
            Pharma<span className="text-primary">ERP</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <div key={item.label} className="group relative">
              <button className="flex items-center gap-1 text-[15px] font-medium text-text-muted transition hover:text-primary">
                {item.label}

                {item.dropdown && (
                  <FiChevronDown className="text-[16px] transition group-hover:rotate-180" />
                )}
              </button>

              {item.dropdown && (
                <div className="invisible absolute left-1/2 top-full z-50 mt-4 w-[260px] -translate-x-1/2 rounded-xl border border-border bg-surface p-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:mt-3 group-hover:opacity-100">
                  <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-border bg-surface" />

                  <div className="relative z-10 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-text-muted transition hover:bg-primary-soft hover:text-primary"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-[16px] text-primary">
                          {subItem.icon}
                        </span>

                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <AppIconButton
            icon={activeMode === "dark" ? <FiSun /> : <FiMoon />}
            onClick={toggleTheme}
            variant="outlined"
            colorVariant="dark"
            rounded="md"
            tooltip="Toggle theme"
            aria-label="Toggle theme"
            sx={{
              width: 40,
              height: 40,
              borderColor: "var(--app-color-border-strong)",
              color: "var(--app-color-text)",
            }}
          />

          <AppButton
            component={Link}
            to={loginUrl}
            variant="outlined"
            colorVariant="success"
            rounded="md"
            sx={{
              px: "20px",
              py: "8px",
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
            colorVariant="success"
            rounded="md"
            endIcon={<FiArrowRight className="text-[17px]" />}
            sx={{
              px: "20px",
              py: "8px",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Start Free Trial
          </AppButton>
        </div>

        {/* Mobile Button */}
        <AppIconButton
          icon={
            mobileOpen ? (
              <FiX className="text-[22px]" />
            ) : (
              <FiMenu className="text-[22px]" />
            )
          }
          onClick={() => setMobileOpen((prev) => !prev)}
          variant="outlined"
          colorVariant="dark"
          rounded="md"
          aria-label="Toggle mobile menu"
          sx={{
            display: { xs: "inline-flex", lg: "none" },
            borderColor: "var(--app-color-border-strong)",
            color: "var(--app-color-text)",
          }}
        />
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-surface px-4 py-4 lg:hidden">
          <div className="space-y-3">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  to="/"
                  onClick={() => {
                    if (!item.dropdown) setMobileOpen(false);
                  }}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[15px] font-semibold text-text transition hover:bg-primary-soft hover:text-primary"
                >
                  {item.label}
                  {item.dropdown && <FiChevronDown />}
                </Link>

                {item.dropdown && (
                  <div className="mt-1 space-y-1 pl-3">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to="/"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-text-muted transition hover:bg-primary-soft hover:text-primary"
                      >
                        <span className="text-primary">{subItem.icon}</span>
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="flex flex-col gap-3 pt-3">
              <AppButton
                onClick={toggleTheme}
                variant="outlined"
                colorVariant="dark"
                rounded="md"
                fullWidth
                startIcon={activeMode === "dark" ? <FiSun /> : <FiMoon />}
                sx={{
                  py: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                {activeMode === "dark" ? "Light Mode" : "Dark Mode"}
              </AppButton>

              <AppButton
                component={Link}
                to={loginUrl}
                onClick={() => setMobileOpen(false)}
                variant="outlined"
                colorVariant="success"
                rounded="md"
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
                onClick={() => setMobileOpen(false)}
                variant="contained"
                colorVariant="success"
                rounded="md"
                fullWidth
                endIcon={<FiArrowRight className="text-[17px]" />}
                sx={{
                  py: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Start Free Trial
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
