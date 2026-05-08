import { Box } from "@mui/material";

const getGridColumns = (cols) => {
  if (typeof cols === "number") {
    return `repeat(${cols}, minmax(0, 1fr))`;
  }
  return cols;
};

const AppGrid = ({
  children,

  /* Columns */
  columns = 1, // number OR string
  xs,
  sm,
  md,
  lg,
  xl,

  /* Spacing */
  gap = 2,
  rowGap,
  columnGap,

  /* Alignment */
  align = "stretch",
  justify = "stretch",

  /* Layout */
  fullWidth = true,

  /* Visual */
  surface = false,
  bordered = false,
  rounded = false,

  /* Misc */
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        display: "grid",

        /* ===== RESPONSIVE COLUMNS ===== */
        gridTemplateColumns: {
          xs: getGridColumns(xs || columns),
          sm: getGridColumns(sm || xs || columns),
          md: getGridColumns(md || sm || xs || columns),
          lg: getGridColumns(lg || md || sm || xs || columns),
          xl: getGridColumns(xl || lg || md || sm || xs || columns),
        },

        gap,
        rowGap,
        columnGap,

        alignItems: align,
        justifyItems: justify,

        width: fullWidth ? "100%" : undefined,

        /* ===== THEME ===== */
        backgroundColor: surface ? "var(--color-surface)" : undefined,
        border: bordered ? "1px solid var(--color-border)" : undefined,
        borderRadius: rounded ? "12px" : undefined,

        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default AppGrid;
