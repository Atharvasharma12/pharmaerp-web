import React, { forwardRef } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { AppInput } from "@/components";

const AppSearchInput = forwardRef(function AppSearchInput(
  {
    placeholder = "Search...",
    clearable = true,
    startIcon = <SearchRoundedIcon />,
    type = "search",
    ...props
  },
  ref,
) {
  return (
    <AppInput
      ref={ref}
      type={type}
      placeholder={placeholder}
      clearable={clearable}
      startIcon={startIcon}
      {...props}
    />
  );
});

export default AppSearchInput;
