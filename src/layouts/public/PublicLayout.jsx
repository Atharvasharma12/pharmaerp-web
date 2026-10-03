// src/layouts/public/PublicLayout.jsx

import { Outlet } from "react-router-dom";
import useIsMobile from "@/hooks/useIsMobile";

import { PublicDesktopLayout } from "./desktop";
import { PublicMobileLayout } from "./mobile";

const PublicLayout = () => {
  const isMobile = useIsMobile();

  return isMobile ? <PublicMobileLayout /> : <PublicDesktopLayout />;
};

export default PublicLayout;
