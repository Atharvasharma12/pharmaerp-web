import React from "react";
import { useIsMobile } from "@/hooks";
import Gstr3bDesktopPage from "./desktop/Gstr3bDesktopPage";
import Gstr3bMobilePage from "./mobile/Gstr3bMobilePage";

const Gstr3bPage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <Gstr3bMobilePage /> : <Gstr3bDesktopPage />;
};

export default Gstr3bPage;
