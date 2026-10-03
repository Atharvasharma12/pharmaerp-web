import React from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import { AppButton, AppIconButton, AppMenu } from "@/components";

const AppDropdown = ({
  label = "Options",
  icon,
  items = [],
  children,

  triggerType = "button", // button | icon | custom
  trigger,

  variant = "outlined",
  colorVariant = "primary",
  size = "medium",
  rounded = "md",
  disabled = false,
  loading = false,

  buttonProps = {},
  iconButtonProps = {},

  menuMinWidth = 190,
  menuMaxWidth = 280,
  closeOnItemClick = true,

  endIcon = <KeyboardArrowDownRoundedIcon />,

  ...props
}) => {
  const renderTrigger = ({ onClick, open, disabled: menuDisabled }) => {
    if (triggerType === "custom" && typeof trigger === "function") {
      return trigger({ onClick, open, disabled: menuDisabled });
    }

    if (triggerType === "custom" && React.isValidElement(trigger)) {
      return React.cloneElement(trigger, {
        onClick,
        disabled: disabled || trigger.props?.disabled,
      });
    }

    if (triggerType === "icon") {
      return (
        <AppIconButton
          icon={icon || endIcon}
          variant={variant}
          colorVariant={colorVariant}
          size={size}
          rounded={rounded}
          disabled={disabled || loading}
          loading={loading}
          onClick={onClick}
          {...iconButtonProps}
        />
      );
    }

    return (
      <AppButton
        variant={variant}
        colorVariant={colorVariant}
        size={size}
        rounded={rounded}
        disabled={disabled || loading}
        loading={loading}
        endIcon={endIcon}
        onClick={onClick}
        {...buttonProps}
      >
        {label}
      </AppButton>
    );
  };

  return (
    <AppMenu
      items={items}
      minWidth={menuMinWidth}
      maxWidth={menuMaxWidth}
      closeOnItemClick={closeOnItemClick}
      disabled={disabled || loading}
      trigger={renderTrigger}
      {...props}
    >
      {children}
    </AppMenu>
  );
};

export default AppDropdown;
