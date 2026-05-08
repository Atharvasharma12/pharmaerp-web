import LandingPage from "@/features/public/pages/LandingPage";
import LoginPage from "@/features/auth/pages/LoginPage";

import { createBrowserRouter } from "react-router-dom";
import { AuthLayout, PublicLayout } from "@/layout";

const AboutPage = () => {
  return <div>About Page</div>;
};

const NotFoundPage = () => {
  return <div>404 - Page Not Found</div>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      // {
      //   path: "register",
      //   element: <RegisterPage />,
      // },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
