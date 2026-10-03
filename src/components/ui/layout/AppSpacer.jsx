import { Box } from "@mui/material";

const sizeMap = {
  xs: 0.5,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  "2xl": 6,
};

const AppSpacer = ({ size = "md", axis = "vertical", sx = {}, ...props }) => {
  const value = sizeMap[size] ?? size;

  return (
    <Box
      aria-hidden="true"
      sx={{
        flexShrink: 0,
        width: axis === "horizontal" ? value : "100%",
        height: axis === "vertical" ? value : "100%",
        ...sx,
      }}
      {...props}
    />
  );
};

export default AppSpacer;
