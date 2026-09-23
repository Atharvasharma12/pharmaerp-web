import { ROUTES } from "@/constants";
import Gstr1Page from "../pages/Gstr1Page";
import Gstr2Page from "../pages/Gstr2Page";

const gstLedgerRoutes = [
  {
    path: ROUTES.GSTR1,
    element: <Gstr1Page />,
  },
  {
    path: ROUTES.GSTR2,
    element: <Gstr2Page />,
  },
];

export default gstLedgerRoutes;
