import { ROUTES } from "@/constants";

import { GlobalProductsPage, GlobalProductDetailsPage } from "../pages";

const globalProductRoutes = [
  {
    path: ROUTES.GLOBAL_PRODUCTS,
    element: <GlobalProductsPage />,
  },
  {
    path: ROUTES.GLOBAL_PRODUCT_DETAILS,
    element: <GlobalProductDetailsPage />,
  },
];

export default globalProductRoutes;
