import { ROUTES } from "@/constants";

import {
  CustomersPage,
  CreateCustomerPage,
  EditCustomerPage,
  CustomerDetailsPage,
} from "../pages";

const customerRoutes = [
  {
    path: ROUTES.CUSTOMERS,
    element: <CustomersPage />,
  },

  {
    path: ROUTES.CREATE_CUSTOMER,
    element: <CreateCustomerPage />,
  },

  {
    path: ROUTES.CUSTOMER_DETAILS(),
    element: <CustomerDetailsPage />,
  },

  {
    path: ROUTES.EDIT_CUSTOMER(),
    element: <EditCustomerPage />,
  },
];

export default customerRoutes;
