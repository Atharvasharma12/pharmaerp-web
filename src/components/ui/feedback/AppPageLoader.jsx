import React from "react";
import { Box } from "@mui/material";
import AppLoader from "./AppLoader";

const AppPageLoader = ({
  text = "Loading...",
  variant = "spinner", // spinner | dots | pulse
  colorVariant = "primary",
  overlay = false,
  fullScreen = false,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: fullScreen ? "100vh" : "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      <AppLoader
        size={fullScreen ? "fullscreen" : "page"}
        variant={variant}
        colorVariant={colorVariant}
        text={text}
        overlay={overlay}
        fullScreen={fullScreen}
      />
    </Box>
  );
};

export default AppPageLoader;
