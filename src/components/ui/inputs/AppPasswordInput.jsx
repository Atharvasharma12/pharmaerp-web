import React, { forwardRef } from "react";
import AppInput from "./AppInput";

const AppPasswordInput = forwardRef(function AppPasswordInput(
  {
    autoComplete = "current-password",
    placeholder = "Enter password",
    passwordToggle = true,
    ...props
  },
  ref,
) {
  return (
    <AppInput
      ref={ref}
      type="password"
      autoComplete={autoComplete}
      placeholder={placeholder}
      passwordToggle={passwordToggle}
      {...props}
    />
  );
});

export default AppPasswordInput;
