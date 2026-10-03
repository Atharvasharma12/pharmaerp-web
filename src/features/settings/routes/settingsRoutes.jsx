import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import SettingsPage from "../pages/SettingsPage";

const settingsRoutes = [
  {
    path: ROUTES.SETTINGS,
    element: <Navigate to={`${ROUTES.SETTINGS}/profile`} replace />,
  },
  {
    path: `${ROUTES.SETTINGS}/:tab`,
    element: <SettingsPage />,
  },
];

export default settingsRoutes;
