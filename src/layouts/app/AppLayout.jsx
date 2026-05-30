// src/layouts/app/AppLayout.jsx

import { useIsMobile } from "@/hooks";

import AppDesktopLayout from "./desktop/AppDesktopLayout";
import AppMobileLayout from "./mobile/AppMobileLayout";

const AppLayout = () => {
  const isMobile = useIsMobile();

  return isMobile ? <AppMobileLayout /> : <AppDesktopLayout />;
};

export default AppLayout;
