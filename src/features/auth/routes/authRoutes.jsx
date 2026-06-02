import { ROUTES } from "@/constants";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

const authRoutes = [
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },

  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
];

export default authRoutes;
