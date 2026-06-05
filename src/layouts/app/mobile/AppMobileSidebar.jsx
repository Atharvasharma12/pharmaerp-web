// src/layouts/app/mobile/AppMobileSidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";

import {
  FiBarChart2,
  FiBox,
  FiBriefcase,
  FiCreditCard,
  FiFileText,
  FiHelpCircle,
  FiHome,
  FiMapPin,
  FiSettings,
  FiShoppingCart,
  FiTruck,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { AppButton } from "@/components";
import { ROUTES } from "@/constants";

const sidebarItems = [
  {
    label: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: <FiHome />,
  },
  {
    label: "Companies",
    path: ROUTES.COMPANIES,
    icon: <FiBriefcase />,
  },
  {
    label: "Branches",
    path: ROUTES.BRANCHES,
    icon: <FiMapPin />,
  },
  {
    label: "Staff",
    path: ROUTES.WORKSPACE_MEMBERS,
    icon: <FiUsers />,
  },
  {
    label: "Access Control",
    path: ROUTES.ACCESS_CONTROL,
    icon: <FiUsers />,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: <FiBox />,
  },
  {
    label: "Purchases",
    path: "/purchases",
    icon: <FiTruck />,
  },
  {
    label: "Sales (POS)",
    path: "/sales",
    icon: <FiShoppingCart />,
  },
  {
    label: "Billing & Invoicing",
    path: "/billing",
    icon: <FiFileText />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <FiBarChart2 />,
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: <FiCreditCard />,
  },
  {
    label: "Settings",
    path: ROUTES.SETTINGS,
    icon: <FiSettings />,
  },
];

const AppMobileSidebar = ({ open, onClose }) => {
  return (
    <>
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 z-[60] bg-overlay transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      <aside
        className={[
          "fixed inset-y-0 left-0 z-[70] w-[285px] max-w-[82vw] border-r border-border bg-surface shadow-xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-[62px] items-center justify-between border-b border-border px-4">
            <NavLink
              to={ROUTES.DASHBOARD}
              onClick={onClose}
              className="flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
                <img
                  src="/erp-mini-logo.png"
                  alt="PharmaERP Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>

              <div>
                <div className="text-[20px] font-bold leading-none tracking-tight text-text">
                  Pharma<span className="text-primary">ERP</span>
                </div>
                <div className="mt-1 text-[10px] font-medium leading-none text-text-muted">
                  Retail Pharmacy ERP
                </div>
              </div>
            </NavLink>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface-hover hover:text-primary"
            >
              <FiX className="text-[21px]" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition",
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-text-muted hover:bg-surface-hover hover:text-text",
                  ].join(" ")
                }
              >
                <span className="text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="space-y-3 border-t border-border px-3 py-4">
            <div className="rounded-xl border border-primary/15 bg-primary-soft/60 p-3">
              <div className="text-[11px] font-medium text-text-muted">
                Your Plan
              </div>

              <div className="mt-1 text-[14px] font-bold text-primary">
                Professional Plan
              </div>

              <div className="mt-2 text-[11px] leading-relaxed text-text-muted">
                Upgrade anytime to unlock more users, branches and premium
                features.
              </div>

              <AppButton
                fullWidth
                variant="contained"
                colorVariant="primary"
                rounded="lg"
                sx={{
                  mt: 2,
                  py: "7px",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                Upgrade Plan
              </AppButton>
            </div>

            <NavLink
              to="/help-center"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl border border-border bg-bg/70 p-3 transition hover:border-primary hover:bg-primary-soft"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-[18px] text-primary">
                <FiHelpCircle />
              </span>

              <span>
                <span className="block text-[13px] font-bold text-text">
                  Need Help?
                </span>
                <span className="mt-1 block text-[11px] text-text-muted">
                  Contact support
                </span>
              </span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppMobileSidebar;
