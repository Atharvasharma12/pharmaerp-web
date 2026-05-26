// src/layouts/auth/AuthLayout.jsx

import useIsMobile from "@/hooks/useIsMobile";

import { AuthDesktopLayout } from "./desktop";
import { AuthMobileLayout } from "./mobile";

const AuthLayout = () => {
  const isMobile = useIsMobile();

  return isMobile ? <AuthMobileLayout /> : <AuthDesktopLayout />;
};

export default AuthLayout;
