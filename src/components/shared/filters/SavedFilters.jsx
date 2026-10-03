import React from "react";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";

import { SelectFilter } from "@/components";

const SavedFilters = ({
  value = "",
  onChange,
  options = [],

  name = "savedFilter",
  label = "Saved filters",
  placeholder = "Select saved filter",

  size = "medium",
  fullWidth = true,
  clearable = true,
  disabled = false,
  loading = false,

  sx = {},
  ...props
}) => {
  return (
    <SelectFilter
      name={name}
      label={label}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      clearable={clearable}
      disabled={disabled}
      loading={loading}
      startIcon={<BookmarkRoundedIcon />}
      sx={sx}
      {...props}
    />
  );
};

export default SavedFilters;
