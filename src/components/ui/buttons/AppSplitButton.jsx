import React, { useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { AppButton, AppIconButton, AppMenu } from "@/components";

const AppSplitButton = ({
  label = "Action",
  items = [],
  onClick,
  selectedIndex = 0,

  variant = "contained",
  colorVariant = "primary",
  size = "medium",
  rounded = "md",
  disabled = false,
  loading = false,
  elevation = false,

  menuMinWidth = 190,
  closeOnItemClick = true,

  sx = {},
  buttonSx = {},
  arrowSx = {},
}) => {
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const activeItem = items[activeIndex];

  const handleMainClick = (event) => {
    if (onClick) {
      onClick(event, activeItem, activeIndex);
      return;
    }

    activeItem?.onClick?.(event, activeItem, activeIndex);
  };

  const menuItems = items.map((item, index) => ({
    ...item,
    selected: index === activeIndex,
    onClick: (event) => {
      setActiveIndex(index);
      item.onClick?.(event, item, index);
    },
  }));

  return (
    <div style={{ display: "inline-flex", ...sx }}>
      <AppButton
        variant={variant}
        colorVariant={colorVariant}
        size={size}
        rounded={rounded}
        disabled={disabled || !activeItem}
        loading={loading}
        elevation={elevation}
        onClick={handleMainClick}
        sx={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          ...buttonSx,
        }}
      >
        {activeItem?.label || label}
      </AppButton>

      <AppMenu
        items={menuItems}
        minWidth={menuMinWidth}
        closeOnItemClick={closeOnItemClick}
        disabled={disabled || loading}
        trigger={({ onClick }) => (
          <AppIconButton
            icon={<KeyboardArrowDownRoundedIcon />}
            variant={variant}
            colorVariant={colorVariant}
            size={size}
            rounded={rounded}
            disabled={disabled || loading}
            elevation={elevation}
            onClick={onClick}
            sx={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              ml: "-1px",
              ...arrowSx,
            }}
          />
        )}
      />
    </div>
  );
};

export default AppSplitButton;
