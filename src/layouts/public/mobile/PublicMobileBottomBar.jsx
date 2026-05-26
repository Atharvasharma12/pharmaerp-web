// src/layouts/public/mobile/PublicMobileBottomBar.jsx

import React from "react";
import { NavLink } from "react-router-dom";

import { FiHome, FiGrid, FiLock, FiDollarSign, FiPhone } from "react-icons/fi";

const PublicMobileBottomBar = () => {
  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: <FiHome />,
    },
    {
      label: "Features",
      path: "/",
      icon: <FiGrid />,
    },
    {
      label: "Login",
      path: "/login",
      icon: <FiLock />,
    },
    {
      label: "Pricing",
      path: "/",
      icon: <FiDollarSign />,
    },
    {
      label: "Contact",
      path: "/",
      icon: <FiPhone />,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-md">
      <div className="mx-auto grid h-[64px] max-w-md grid-cols-5 items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/"}
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
                    "flex h-8 w-8 items-center justify-center rounded-xl text-[19px] transition",
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

export default PublicMobileBottomBar;
