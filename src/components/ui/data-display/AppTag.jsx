import React from "react";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import AppBadge from "./AppBadge";

const AppTag = ({
  label,
  children,
  colorVariant = "neutral", // primary | success | error | warning | info | dark | neutral
  variant = "soft", // soft | contained | outlined | text
  size = "small", // small | medium | large
  rounded = "md", // sm | md | lg | full
  removable = false,
  onDelete,
  clickable = false,
  onClick,
  showIcon = false,
  icon,
  disabled = false,
  sx = {},
  ...props
}) => {
  return (
    <AppBadge
      label={label}
      variant={variant}
      colorVariant={colorVariant}
      size={size}
      rounded={rounded}
      removable={removable}
      onDelete={onDelete}
      clickable={clickable}
      onClick={onClick}
      disabled={disabled}
      startIcon={showIcon ? icon || <LocalOfferRoundedIcon /> : undefined}
      sx={sx}
      {...props}
    >
      {children}
    </AppBadge>
  );
};

export default AppTag;
