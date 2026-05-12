import React from "react";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";

import { AppLoadingButton } from "@/components";

const ExportButton = ({
  children = "Export",

  onClick,
  loading = false,
  disabled = false,

  format = "CSV",
  loadingText = "Exporting...",

  variant = "outlined",
  colorVariant = "primary",
  size = "medium",
  rounded = "md",

  startIcon = <FileDownloadRoundedIcon />,
  sx = {},

  ...props
}) => {
  return (
    <AppLoadingButton
      variant={variant}
      colorVariant={colorVariant}
      size={size}
      rounded={rounded}
      loading={loading}
      loadingText={loadingText}
      disabled={disabled}
      startIcon={startIcon}
      onClick={onClick}
      sx={sx}
      {...props}
    >
      {children || `Export ${format}`}
    </AppLoadingButton>
  );
};

export default ExportButton;
