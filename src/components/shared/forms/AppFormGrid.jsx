import { Box } from "@mui/material";

const AppFormGrid = ({
  children,
  columns = {
    xs: 1,
    sm: 2,
    md: 3,
  },
  gap = 2,
  className = "",
  sx = {},
  ...props
}) => {
  const getColumns = (value) => `repeat(${value}, minmax(0, 1fr))`;

  return (
    <Box
      className={className}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: getColumns(columns.xs || 1),
          sm: getColumns(columns.sm || columns.xs || 1),
          md: getColumns(columns.md || columns.sm || columns.xs || 1),
          lg: getColumns(columns.lg || columns.md || columns.sm || 1),
        },
        gap,
        width: "100%",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default AppFormGrid;
