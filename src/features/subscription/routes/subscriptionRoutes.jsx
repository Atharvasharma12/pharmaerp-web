import { ROUTES } from "@/constants";
import { UpgradePlanPage, CheckoutPage } from "../pages";

const subscriptionRoutes = [
  {
    path: ROUTES.UPGRADE_PLAN,
    element: <UpgradePlanPage />,
  },
  {
    path: ROUTES.CHECKOUT,
    element: <CheckoutPage />,
  },
];

export default subscriptionRoutes;
