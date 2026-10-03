import React from "react";
import { Box } from "@mui/material";
import AppDatePicker from "./AppDatePicker";

const AppDateRangePicker = ({
  startLabel = "Start Date",
  endLabel = "End Date",
  startName = "startDate",
  endName = "endDate",
  value = {},
  onChange,
  startValue,
  endValue,
  fullWidth = true,
  gap = 1.5,
  ...props
}) => {
  const resolvedStartValue = startValue ?? value?.startDate ?? null;
  const resolvedEndValue = endValue ?? value?.endDate ?? null;

  const handleStartChange = (nextValue) => {
    onChange?.({
      startDate: nextValue,
      endDate: resolvedEndValue,
    });
  };

  const handleEndChange = (nextValue) => {
    onChange?.({
      startDate: resolvedStartValue,
      endDate: nextValue,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap,
        width: fullWidth ? "100%" : "auto",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
      }}
    >
      <AppDatePicker
        label={startLabel}
        name={startName}
        value={resolvedStartValue}
        onChange={handleStartChange}
        fullWidth
        maxDate={resolvedEndValue || undefined}
        {...props}
      />

      <AppDatePicker
        label={endLabel}
        name={endName}
        value={resolvedEndValue}
        onChange={handleEndChange}
        fullWidth
        minDate={resolvedStartValue || undefined}
        {...props}
      />
    </Box>
  );
};

export default AppDateRangePicker;
