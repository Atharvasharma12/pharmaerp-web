import React from "react";

import { AppSelect } from "@/components";

const SelectFilter = ({
  name,
  label,

  value,
  onChange,

  options = [],

  placeholder = "Select option",

  multiple = false,
  clearable = true,

  size = "medium",
  fullWidth = true,

  disabled = false,
  loading = false,
  required = false,

  startIcon,
  helperText,

  variant = "surface",
  rounded = "md",

  sx = {},
  ...props
}) => {
  const handleChange = (event, nextValue) => {
    onChange?.(event, nextValue);
  };

  return (
    <AppSelect
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
      multiple={multiple}
      clearable={clearable}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      loading={loading}
      required={required}
      helperText={helperText}
      startIcon={startIcon}
      variant={variant}
      rounded={rounded}
      sx={sx}
      {...props}
    />
  );
};

export default SelectFilter;
