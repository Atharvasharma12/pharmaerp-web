import { Box } from "@mui/material";

const maxWidthMap = {
  sm: 640,
  md: 900,
  lg: 1200,
  xl: 1440,
  full: "100%",
};

const AppContainer = ({
  children,
  maxWidth = "xl",
  centered = true,
  disablePadding = false,
  fluid = false,
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: fluid ? "100%" : maxWidthMap[maxWidth] || maxWidth,
        mx: centered ? "auto" : 0,
        px: disablePadding ? 0 : { xs: 2, sm: 3, md: 4 },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default AppContainer;
