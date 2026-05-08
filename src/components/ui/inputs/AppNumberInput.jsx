import React, { forwardRef } from "react";
import AppInput from "./AppInput";

const AppNumberInput = forwardRef(function AppNumberInput(
  {
    value,
    onChange,
    min,
    max,
    step = 1,
    allowNegative = true,
    allowDecimal = true,
    clampOnBlur = true,
    suffix,
    inputProps = {},
    onBlur,
    ...props
  },
  ref,
) {
  const normalizeValue = (nextValue) => {
    if (nextValue === "") return "";

    let cleaned = String(nextValue);

    cleaned = cleaned.replace(/[^\d.-]/g, "");

    if (!allowNegative) {
      cleaned = cleaned.replace(/-/g, "");
    } else {
      cleaned = cleaned.replace(/(?!^)-/g, "");
    }

    if (!allowDecimal) {
      cleaned = cleaned.replace(/\./g, "");
    } else {
      const parts = cleaned.split(".");
      cleaned =
        parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
    }

    return cleaned;
  };

  const clampValue = (nextValue) => {
    if (nextValue === "" || nextValue === "-" || nextValue === ".") {
      return "";
    }

    let numberValue = Number(nextValue);

    if (Number.isNaN(numberValue)) return "";

    if (min !== undefined) numberValue = Math.max(numberValue, min);
    if (max !== undefined) numberValue = Math.min(numberValue, max);

    return String(numberValue);
  };

  const handleChange = (event) => {
    const nextValue = normalizeValue(event.target.value);

    onChange?.({
      ...event,
      target: {
        ...event.target,
        value: nextValue,
      },
    });
  };

  const handleBlur = (event) => {
    if (clampOnBlur) {
      const nextValue = clampValue(event.target.value);

      if (nextValue !== event.target.value) {
        onChange?.({
          ...event,
          target: {
            ...event.target,
            value: nextValue,
          },
        });
      }
    }

    onBlur?.(event);
  };

  return (
    <AppInput
      ref={ref}
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      suffix={suffix}
      inputProps={{
        inputMode: allowDecimal ? "decimal" : "numeric",
        min,
        max,
        step,
        ...inputProps,
      }}
      {...props}
    />
  );
});

export default AppNumberInput;
