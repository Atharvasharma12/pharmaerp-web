import React from "react";
import { Box } from "@mui/material";
import AppRadio from "./AppRadio";

const AppRadioGroup = ({
  options = [],
  value,
  onChange,
  name,
  direction = "column", // row | column
  spacing = 1,
  ...props
}) => {
  const handleChange = (event) => {
    onChange?.({
      target: {
        name,
        value: event.target.value,
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        gap: spacing,
      }}
    >
      {options.map((option, index) => {
        const optionValue = option?.value ?? option?.id ?? index;

        const optionLabel = option?.label ?? String(optionValue);

        return (
          <AppRadio
            key={optionValue}
            name={name}
            value={optionValue}
            label={optionLabel}
            checked={value === optionValue}
            onChange={handleChange}
            {...props}
          />
        );
      })}
    </Box>
  );
};

export default AppRadioGroup;
