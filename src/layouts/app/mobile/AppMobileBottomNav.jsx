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

const navItems = [
  {
    label: "Dashboard",
    path: ROUTES.SETUP_CENTER,
    icon: <FiHome />,
    end: true,
  },
  {
    label: "Sales (POS)",
    path: "/sales",
    icon: <FiShoppingCart />,
  },
  {
    label: "Inventory",
    path: "/inventory",
    icon: <FiBox />,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: <FiBarChart2 />,
  },
  {
    label: "More",
    path: "/more",
    icon: <FiMoreHorizontal />,
  },
];

const AppMobileBottomNav = () => {
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
