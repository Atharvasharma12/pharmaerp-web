// src/features/marketplace/products/routes/marketplaceProductRoutes.jsx

import React from "react";
import { ROUTES } from "@/constants";
import { MarketplaceProductsPage, CreateMarketplaceProductPage } from "../pages";
import MarketplacePage from "../../pages/MarketplacePage";

const marketplaceProductRoutes = [
  {
    path: ROUTES.MARKETPLACE,
    element: <MarketplacePage />,
  },
  {
    path: ROUTES.MARKETPLACE_PRODUCTS,
    element: <MarketplaceProductsPage />,
  },
  {
    path: ROUTES.CREATE_MARKETPLACE_PRODUCT,
    element: <CreateMarketplaceProductPage />,
  },
];

export default marketplaceProductRoutes;
