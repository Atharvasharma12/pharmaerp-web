import { Box } from "@mui/material";

const AppFormRow = ({
  children,
  gap = 2,
  align = "flex-start",
  justify = "flex-start",
  wrap = true,
  className = "",
  sx = {},
  ...props
}) => {
  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        alignItems: {
          xs: "stretch",
          sm: align,
        },
        justifyContent: justify,
        gap,
        flexWrap: wrap ? "wrap" : "nowrap",
        width: "100%",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default AppFormRow;
