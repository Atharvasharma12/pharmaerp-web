// src/layouts/app/desktop/AppDesktopSidebar.jsx

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
    path: "/companies",
    icon: <FiBriefcase />,
  },
  {
    label: "Branches",
    path: "/branches",
    icon: <FiMapPin />,
  },
  {
    label: "Staff",
    path: ROUTES.USERS,
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

const AppDesktopSidebar = () => {
  return (
    <aside className="sticky top-0 h-screen w-[230px] shrink-0 border-r border-divider bg-surface/95 backdrop-blur-md">
      <div className="flex h-full flex-col">
        <div className="flex h-[58px] items-center px-5">
          <NavLink
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
              <img
                src="/erp-mini-logo.png"
                alt="PharmaERP Logo"
                className="h-6 w-6 object-contain"
              />
            </div>

            <div>
              <div className="text-[20px] font-semibold leading-none tracking-tight text-text">
                <span className="text-primary">Pharma</span>ERP
              </div>
              <div className="mt-1 text-[11px] font-normal leading-none text-text-muted">
                Retail Pharmacy ERP
              </div>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition",
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-text-muted hover:bg-surface-hover hover:text-text",
                ].join(" ")
              }
            >
              <span className="text-[17px]">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 px-3 pb-4">
          <div className="rounded-xl border border-primary/15 bg-primary-soft/60 p-3">
            <div className="text-[11px] font-medium text-text-muted">
              Your Plan
            </div>

            <div className="mt-1 text-[14px] font-semibold text-primary">
              Starter Trial
            </div>

            <div className="my-3 h-px bg-border" />

            <div className="text-[11px] font-medium text-text">
              14 Days Left in Trial
            </div>
            <div className="mt-1 text-[11px] text-text-muted">
              Expires on 28 May 2024
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
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Upgrade Plan
            </AppButton>
          </div>

          <div className="rounded-xl border border-divider bg-bg/70 p-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-[17px] text-text-muted">
                <FiHelpCircle />
              </div>

              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-text">
                  Need Help?
                </div>
                <div className="mt-1 text-[11px] leading-relaxed text-text-muted">
                  We are here to help you.
                </div>

                <NavLink
                  to="/help-center"
                  className="mt-2 inline-flex text-[11px] font-semibold text-primary hover:underline"
                >
                  Contact Support →
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppDesktopSidebar;
