import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./components";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
