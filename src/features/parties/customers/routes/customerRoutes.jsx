import { ROUTES } from "@/constants";
import { CustomersPage, CustomerSettlementsPage } from "../pages";

const customerRoutes = [
  {
    path: ROUTES.CUSTOMERS,
    element: <CustomersPage />,
  },
  {
    path: ROUTES.CUSTOMER_SETTLEMENTS,
    element: <CustomerSettlementsPage />,
  },
];

export default customerRoutes;
