// src/layouts/app/components/header/HeaderProfileDropdown.jsx

import React from "react";
import { Link } from "react-router-dom";

import { ROUTES } from "@/constants";
import useAuth from "@/features/auth/hooks/useAuth";

const HeaderProfileDropdown = ({ className = "" }) => {
  const { user } = useAuth();

  const userName = user?.name || user?.fullName || "Admin User";
  const userInitials =
    userName
      ?.split(" ")
      ?.map((w) => w?.[0])
      ?.join("")
      ?.slice(0, 2)
      ?.toUpperCase() || "AU";

  return (
    <div className={`relative ${className}`}>
      {/* User Profile Avatar Link (Replaced Dropdown) */}
      <Link
        to={ROUTES.SETTINGS}
        aria-label="User profile settings"
        className="flex size-9 cursor-pointer items-center justify-center rounded-full ring-2 ring-border/80 hover:ring-primary/40 transition-all active:scale-[0.95]"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={userName}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-primary-soft text-primary font-bold text-xs shadow-2xs">
            {userInitials}
          </div>
        )}
      </Link>
    </div>
  );
};

export default HeaderProfileDropdown;
