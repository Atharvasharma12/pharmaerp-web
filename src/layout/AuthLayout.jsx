import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./components";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
