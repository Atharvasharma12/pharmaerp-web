import { ROUTES } from "@/constants";
import {
  SuppliersPage,
  CreateSupplierPage,
  EditSupplierPage,
  SupplierDetailsPage,
} from "../pages";

const supplierRoutes = [
  {
    path: ROUTES.SUPPLIERS,
    element: <SuppliersPage />,
  },
  {
    path: ROUTES.CREATE_SUPPLIER,
    element: <CreateSupplierPage />,
  },

  {
    path: ROUTES.SUPPLIER_DETAILS(),
    element: <SupplierDetailsPage />,
  },

  {
    path: ROUTES.EDIT_SUPPLIER(),
    element: <EditSupplierPage />,
  },
];

export default supplierRoutes;
