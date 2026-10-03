// src/features/marketplace/pages/MarketplacePage.jsx

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useIsMobile } from "@/hooks";
import { ROUTES } from "@/constants";

import MarketplaceDesktopPage from "./desktop/MarketplaceDesktopPage";
import MarketplaceMobilePage from "./mobile/MarketplaceMobilePage";

const MarketplacePage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const marketplaceModules = useMemo(() => {
    return [
      {
        id: "stores",
        title: "Marketplace Stores",
        description: "Register and manage your digital storefront configurations, hours, and status.",
        colorVariant: "primary",
        onClick: () => navigate(ROUTES.MARKETPLACE_STORES),
      },
      {
        id: "products",
        title: "Marketplace Products",
        description: "Browse platform-priced catalog products and enable them for online storefront sales.",
        colorVariant: "success",
        onClick: () => navigate(ROUTES.MARKETPLACE_PRODUCTS),
      },
    ];
  }, [navigate]);

  const filteredModules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return marketplaceModules;
    return marketplaceModules.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query),
    );
  }, [searchQuery, marketplaceModules]);

  const pageProps = {
    modules: filteredModules,
    searchQuery,
    setSearchQuery,
  };

  return isMobile ? (
    <MarketplaceMobilePage {...pageProps} />
  ) : (
    <MarketplaceDesktopPage {...pageProps} />
  );
};

export default MarketplacePage;
