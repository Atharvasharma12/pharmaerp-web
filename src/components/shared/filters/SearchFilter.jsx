import React from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { AppSearchInput } from "@/components";

const SearchFilter = ({
  name = "search",
  value = "",
  onChange,
  onSearch,
  onClear,

  label = "Search",
  placeholder = "Search...",

  size = "medium",
  fullWidth = false,
  clearable = true,
  disabled = false,
  loading = false,

  debounce,
  minLength,

  sx = {},
  ...props
}) => {
  const handleChange = (event, nextValue) => {
    onChange?.(event, nextValue);
  };

  return (
    <AppSearchInput
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      onSearch={onSearch}
      onClear={onClear}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      clearable={clearable}
      disabled={disabled}
      loading={loading}
      debounce={debounce}
      minLength={minLength}
      startIcon={<SearchRoundedIcon />}
      sx={sx}
      {...props}
    />
  );
};

export default SearchFilter;
