import React from "react";
import { useIsMobile } from "@/hooks";
import Gstr2DesktopPage from "./desktop/Gstr2DesktopPage";
import Gstr2MobilePage from "./mobile/Gstr2MobilePage";

const Gstr2Page = () => {
  const isMobile = useIsMobile();

  return isMobile ? <Gstr2MobilePage /> : <Gstr2DesktopPage />;
};

export default Gstr2Page;
