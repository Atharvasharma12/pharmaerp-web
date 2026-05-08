import HomePage from "@/pages/HomePage";
import UIComponentDisplayPage from "@/pages/UIComponentDisplayPage";
import { createBrowserRouter } from "react-router-dom";

// const HomePage = () => {
//   return <div>Home Page</div>;
// };

const AboutPage = () => {
  return <div>About Page</div>;
};

const NotFoundPage = () => {
  return <div>404 - Page Not Found</div>;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
