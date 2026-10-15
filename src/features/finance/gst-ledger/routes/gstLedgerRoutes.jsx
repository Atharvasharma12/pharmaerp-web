import { ROUTES } from "@/constants";
import Gstr1Page from "../pages/Gstr1Page";
import Gstr2Page from "../pages/Gstr2Page";
import Gstr3bPage from "../pages/Gstr3bPage";

const gstLedgerRoutes = [
  {
    path: ROUTES.GSTR1,
    element: <Gstr1Page />,
  },
  {
    path: ROUTES.GSTR2,
    element: <Gstr2Page />,
  },
  {
    path: ROUTES.GSTR3B,
    element: <Gstr3bPage />,
  },
];

export default gstLedgerRoutes;
