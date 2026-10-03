import React from "react";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";

import { SelectFilter } from "@/components";

const DEFAULT_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const StatusFilter = ({
  value,
  onChange,
  options = DEFAULT_STATUS_OPTIONS,

  name = "status",
  label = "Status",
  placeholder = "Select status",

  multiple = false,
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
      multiple={multiple}
      size={size}
      fullWidth={fullWidth}
      clearable={clearable}
      disabled={disabled}
      loading={loading}
      startIcon={<FlagRoundedIcon />}
      sx={sx}
      {...props}
    />
  );
};

export default StatusFilter;
