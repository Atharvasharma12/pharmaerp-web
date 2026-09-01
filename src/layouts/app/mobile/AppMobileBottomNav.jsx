// src/layouts/app/mobile/AppMobileBottomNav.jsx

import React from "react";
import { NavLink } from "react-router-dom";

import {
  FiBarChart2,
  FiBox,
  FiHome,
  FiMoreHorizontal,
  FiShoppingCart,
} from "react-icons/fi";

import { ROUTES } from "@/constants";

import { usePermission } from "@/hooks";

const AppMobileBottomNav = () => {
  const { isOwner } = usePermission();

  const navItems = [
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

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-md">
      <div className="mx-auto grid h-[64px] max-w-md grid-cols-5 items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              [
                "flex h-full flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-semibold transition",
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-primary",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-xl text-[21px] transition",
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
