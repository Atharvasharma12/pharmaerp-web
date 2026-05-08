import React from "react";
import AppButton from "./AppButton";

const AppLoadingButton = ({
  children,
  loading = false,
  loadingText = "",
  disabled = false,
  loaderVariant = "spinner", // spinner | dots | pulse
  ...props
}) => {
  return (
    <AppButton
      loading={loading}
      disabled={disabled || loading}
      loaderVariant={loaderVariant}
      {...props}
    >
      {loading && loadingText ? loadingText : children}
    </AppButton>
  );
};

export default AppLoadingButton;
