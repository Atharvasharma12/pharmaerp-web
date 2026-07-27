// src/features/marketplace/stores/routes/marketplaceStoreRoutes.jsx

import React from "react";
import { ROUTES } from "@/constants";

import {
  MarketplaceStoreListPage,
  MarketplaceStoreCreatePage,
  MarketplaceStoreEditPage,
  MarketplaceStoreDetailPage,
} from "../pages";

const marketplaceStoreRoutes = [
  {
    path: ROUTES.MARKETPLACE_STORES,
    element: <MarketplaceStoreListPage />,
  },
  {
    path: ROUTES.CREATE_MARKETPLACE_STORE,
    element: <MarketplaceStoreCreatePage />,
  },
  {
    path: ROUTES.EDIT_MARKETPLACE_STORE(),
    element: <MarketplaceStoreEditPage />,
  },
  {
    path: ROUTES.MARKETPLACE_STORE_DETAILS(),
    element: <MarketplaceStoreDetailPage />,
  },
];

export default marketplaceStoreRoutes;
