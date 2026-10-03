import React from "react";
import { Snackbar, Slide } from "@mui/material";
import { AppAlert } from "@/components";

const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};

const AppToast = ({
  open = false,
  onClose,

  title,
  message,
  children,

  severity = "info", // success | error | warning | info
  variant = "soft", // soft | outlined | filled

  position = "top-right", // top-right | top-left | bottom-right | bottom-left | top-center | bottom-center
  autoHideDuration = 4000,

  showIcon = true,
  closable = true,
  icon,
  actions,

  rounded = "md",
  dense = false,
  fullWidth = false,

  disableClickAway = true,
  transition = SlideTransition,

  sx = {},
  alertSx = {},
  contentSx = {},

  ...props
}) => {
  const positionMap = {
    "top-right": { vertical: "top", horizontal: "right" },
    "top-left": { vertical: "top", horizontal: "left" },
    "bottom-right": { vertical: "bottom", horizontal: "right" },
    "bottom-left": { vertical: "bottom", horizontal: "left" },
    "top-center": { vertical: "top", horizontal: "center" },
    "bottom-center": { vertical: "bottom", horizontal: "center" },
  };

  const anchorOrigin = positionMap[position] || positionMap["top-right"];

  const handleClose = (event, reason) => {
    if (disableClickAway && reason === "clickaway") return;
    onClose?.(event, reason);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
      anchorOrigin={anchorOrigin}
      TransitionComponent={transition}
      sx={{
        width: {
          xs: "calc(100% - 32px)",
          sm: "auto",
        },
        maxWidth: {
          xs: "calc(100% - 32px)",
          sm: 420,
        },
        ...sx,
      }}
      {...props}
    >
      <AppAlert
        title={title}
        severity={severity}
        variant={variant}
        showIcon={showIcon}
        closable={closable}
        onClose={handleClose}
        icon={icon}
        actions={actions}
        rounded={rounded}
        dense={dense}
        fullWidth={fullWidth}
        visible={open}
        sx={{
          minWidth: {
            xs: "100%",
            sm: 360,
          },
          boxShadow: "var(--app-shadow-lg)",
          ...alertSx,
        }}
        contentSx={contentSx}
      >
        {children || message}
      </AppAlert>
    </Snackbar>
  );
};

export default AppToast;
