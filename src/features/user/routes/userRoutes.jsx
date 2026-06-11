import { ROUTES } from "@/constants";
import { MyProfilePage } from "../pages";

const userRoutes = [
  {
    path: ROUTES.PROFILE,
    element: <MyProfilePage />,
  },
];

export default userRoutes;
