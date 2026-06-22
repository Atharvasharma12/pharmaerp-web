import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/constants";
import { useIsMobile } from "@/hooks";

import PartiesDesktopPage from "./desktop/PartiesDesktopPage";
import PartiesMobilePage from "./mobile/PartiesMobilePage";

const PartiesPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewCustomers = () => {
    navigate(ROUTES.CUSTOMERS);
  };

  const handleViewSuppliers = () => {
    navigate(ROUTES.SUPPLIERS);
  };

  const partiesData = useMemo(() => {
    return {
      customers: {
        total: 2487,
        active: 2312,
        inactive: 175,
        recent: "+32 this month",
      },
      suppliers: {
        total: 856,
        active: 798,
        inactive: 58,
        recent: "+14 this month",
      },
    };
  }, []);

  const pageProps = {
    searchQuery,
    setSearchQuery,
    partiesData,
    handleViewCustomers,
    handleViewSuppliers,
  };

  return isMobile ? (
    <PartiesMobilePage {...pageProps} />
  ) : (
    <PartiesDesktopPage {...pageProps} />
  );
};

export default PartiesPage;
