import React from "react";
import { useIsMobile } from "@/hooks";
import Gstr1DesktopPage from "./desktop/Gstr1DesktopPage";
import Gstr1MobilePage from "./mobile/Gstr1MobilePage";

const Gstr1Page = () => {
  const isMobile = useIsMobile();

  return isMobile ? <Gstr1MobilePage /> : <Gstr1DesktopPage />;
};

export default Gstr1Page;
