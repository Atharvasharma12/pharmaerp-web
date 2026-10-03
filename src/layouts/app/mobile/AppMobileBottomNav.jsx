// src/layouts/app/mobile/AppMobileBottomNav.jsx

import React from "react";
import { NavLink } from "react-router-dom";

import {
  FiBarChart2,
  FiBox,
  FiHome,
  FiMoreHorizontal,
  FiShoppingCart,
  FiCheckCircle,
  FiBriefcase,
  FiMapPin,
  FiHelpCircle,
} from "react-icons/fi";

import { ROUTES } from "@/constants";
import { useSetupStatus } from "@/features/setup/hooks/useSetupStatus";

const AppMobileBottomNav = () => {
  const { isSetupComplete, companyCompleted, branchCompleted } = useSetupStatus();

  // If setup is not 100% complete, progressively show setup-relevant navigation
  const setupNavItems = [
    {
      label: "Setup",
      path: ROUTES.SETUP_CENTER,
      icon: <FiCheckCircle />,
      end: true,
    },
    ...(companyCompleted
      ? [
          {
            label: "Companies",
            path: ROUTES.COMPANIES,
            icon: <FiBriefcase />,
          },
        ]
      : []),
    ...(companyCompleted && branchCompleted
      ? [
          {
            label: "Branches",
            path: ROUTES.BRANCHES,
            icon: <FiMapPin />,
          },
        ]
      : []),
    {
      label: "Settings",
      path: ROUTES.SETTINGS,
      icon: <FiMoreHorizontal />,
    },
    {
      label: "Help",
      path: ROUTES.HELP_CENTER,
      icon: <FiHelpCircle />,
    },
  ];

  const fullNavItems = [
    {
      label: "Dashboard",
      path: ROUTES.DASHBOARD,
      icon: <FiHome />,
      end: true,
    },
    {
      label: "Sales (POS)",
      path: ROUTES.SALES,
      icon: <FiShoppingCart />,
    },
    {
      label: "Inventory",
      path: ROUTES.WORKSPACE_PRODUCTS,
      icon: <FiBox />,
    },
    {
      label: "Reports",
      path: ROUTES.REPORTS,
      icon: <FiBarChart2 />,
    },
    {
      label: "Settings",
      path: ROUTES.SETTINGS,
      icon: <FiMoreHorizontal />,
    },
  ];

  const navItems = isSetupComplete ? fullNavItems : setupNavItems;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-md">
      <div
        className={`mx-auto grid h-[64px] max-w-md items-center ${
          navItems.length === 3
            ? "grid-cols-3"
            : navItems.length === 4
              ? "grid-cols-4"
              : "grid-cols-5"
        }`}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              [
                "flex h-full flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition",
                isActive
                  ? "text-primary font-bold"
                  : "text-text-muted hover:text-primary",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-xl text-[20px] transition",
                    isActive ? "bg-primary-soft text-primary" : "",
                  ].join(" ")}
                >
                  {item.icon}
                </span>

                <span className="leading-none">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default AppMobileBottomNav;
