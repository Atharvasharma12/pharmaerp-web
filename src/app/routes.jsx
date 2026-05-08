import { PublicLayout } from "@/layout";
import { createBrowserRouter, Outlet } from "react-router-dom";

const HomePage = () => {
  return <div>Home Page</div>;
};

const AboutPage = () => {
  return <div>About Page</div>;
};

const NotFoundPage = () => {
  return <div>404 - Page Not Found</div>;
};

const PublicRoutes = () => {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoutes />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
