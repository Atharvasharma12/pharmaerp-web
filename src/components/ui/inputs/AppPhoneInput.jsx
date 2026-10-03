import React, { forwardRef } from "react";
import AppInput from "./AppInput";

const AppPhoneInput = forwardRef(function AppPhoneInput(
  {
    value,
    onChange,
    countryCode = "+91",
    showCountryCode = true,
    maxLength = 10,
    onlyMobile = true,
    placeholder = "Enter phone number",
    helperText,
    errorText,
    validateOnBlur = true,
    onBlur,
    inputProps = {},
    ...props
  },
  ref,
) {
  const cleanPhone = (nextValue = "") => {
    let cleaned = String(nextValue).replace(/\D/g, "");

    if (maxLength) {
      cleaned = cleaned.slice(0, maxLength);
    }

    return cleaned;
  };

  const getPhoneError = (phoneValue) => {
    if (!phoneValue) return "";

    if (maxLength && phoneValue.length !== maxLength) {
      return `Phone number must be ${maxLength} digits`;
    }

    if (onlyMobile && maxLength === 10 && !/^[6-9]/.test(phoneValue)) {
      return "Phone number must start with 6, 7, 8, or 9";
    }

    return "";
  };

  const handleChange = (event) => {
    const nextValue = cleanPhone(event.target.value);

    onChange?.({
      ...event,
      target: {
        ...event.target,
        value: nextValue,
      },
    });
  };

  const handleBlur = (event) => {
    if (validateOnBlur) {
      const nextValue = cleanPhone(event.target.value);
      const nextError = getPhoneError(nextValue);

      if (nextValue !== event.target.value) {
        onChange?.({
          ...event,
          target: {
            ...event.target,
            value: nextValue,
          },
        });
      }

      event.target.validationMessage = nextError;
    }

    onBlur?.(event);
  };

  const resolvedErrorText =
    errorText || (validateOnBlur ? getPhoneError(value) : "");

  return (
    <AppInput
      ref={ref}
      type="tel"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      prefix={showCountryCode ? countryCode : undefined}
      helperText={helperText}
      errorText={resolvedErrorText}
      clearable
      inputProps={{
        inputMode: "numeric",
        pattern: "[0-9]*",
        maxLength,
        ...inputProps,
      }}
      {...props}
    />
  );
});

export default AppPhoneInput;
