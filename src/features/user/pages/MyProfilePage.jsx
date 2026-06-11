// src/features/user/pages/MyProfilePage.jsx

import { useIsMobile } from "@/hooks";

import MyProfileDesktopPage from "./desktop/MyProfileDesktopPage";
import MyProfileMobilePage from "./mobile/MyProfileMobilePage";

const MyProfilePage = () => {
  const isMobile = useIsMobile();

  return isMobile ? <MyProfileMobilePage /> : <MyProfileDesktopPage />;
};

export default MyProfilePage;
