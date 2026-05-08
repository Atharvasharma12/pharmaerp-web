import React, { forwardRef } from "react";
import AppNumberInput from "./AppNumberInput";

const AppPercentageInput = forwardRef(function AppPercentageInput(
  { min = 0, max = 100, allowDecimal = true, suffix = "%", ...props },
  ref,
) {
  return (
    <AppNumberInput
      ref={ref}
      min={min}
      max={max}
      allowDecimal={allowDecimal}
      suffix={suffix}
      {...props}
    />
  );
});

export default AppPercentageInput;
