import React, { forwardRef } from "react";
import AppNumberInput from "./AppNumberInput";

const AppCurrencyInput = forwardRef(function AppCurrencyInput(
  {
    currency = "₹",
    position = "prefix", // prefix | suffix
    allowDecimal = true,
    min = 0,
    ...props
  },
  ref,
) {
  return (
    <AppNumberInput
      ref={ref}
      allowDecimal={allowDecimal}
      min={min}
      prefix={position === "prefix" ? currency : undefined}
      suffix={position === "suffix" ? currency : undefined}
      {...props}
    />
  );
});

export default AppCurrencyInput;
