import React from "react";
import DateRangeRoundedIcon from "@mui/icons-material/DateRangeRounded";

import { AppDateRangePicker } from "@/components";

const DateRangeFilter = ({
  name = "dateRange",
  label = "Date range",

  value,
  onChange,

  placeholder = "Select date range",

  size = "medium",
  fullWidth = true,

  clearable = true,
  disabled = false,
  loading = false,
  required = false,

  helperText,
  startIcon = <DateRangeRoundedIcon />,

  variant = "surface",
  rounded = "md",

  sx = {},
  ...props
}) => {
  const handleChange = (nextValue) => {
    onChange?.(nextValue);
  };

  return (
    <AppDateRangePicker
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      clearable={clearable}
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

export default DateRangeFilter;
