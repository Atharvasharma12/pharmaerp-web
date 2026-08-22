import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AppProvider } from "@/providers";

// Global Typography Fonts (Geist Sans + Geist Mono)
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";

import "@/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
