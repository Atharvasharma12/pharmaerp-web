import { ROUTES } from "@/constants";
import SettingsPage from "../pages/SettingsPage";

const settingsRoutes = [
  {
    path: ROUTES.SETTINGS,
    element: <SettingsPage />,
  },
  {
    path: `${ROUTES.SETTINGS}/:tab`,
    element: <SettingsPage />,
  },
];

export default settingsRoutes;
