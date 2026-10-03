import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const hideGoogleTranslateBar = () => {
      // Hide top translate banner
      const banner = document.querySelector(".goog-te-banner-frame");

      if (banner) {
        banner.style.display = "none";
      }

      // Hide translate iframe
      const iframe = document.querySelector("iframe.skiptranslate");

      if (iframe) {
        iframe.style.display = "none";
      }

      // Remove top spacing
      document.body.style.top = "0px";
      document.body.style.position = "static";

      // Hide translate popup
      const popup = document.getElementById("goog-gt-tt");

      if (popup) {
        popup.style.display = "none";
      }

      // Hide translate notification bar
      const notification = document.querySelector(".VIpgJd-ZVi9od-aZ2wEe");

      if (notification) {
        notification.style.display = "none";
      }
    };

    // Run immediately
    hideGoogleTranslateBar();

    // Keep checking because Google re-injects elements
    const interval = setInterval(hideGoogleTranslateBar, 500);

    return () => clearInterval(interval);
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
