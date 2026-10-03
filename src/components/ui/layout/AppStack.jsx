import { Stack } from "@mui/material";

const AppStack = ({
  children,

  /* Direction */
  direction = "column",

  /* Spacing */
  spacing = 1,
  gap,

  /* Alignment */
  align = "stretch",
  justify = "flex-start",
  wrap = "nowrap",

  /* Layout */
  fullWidth = false,
  fullHeight = false,

  /* Visual */
  surface = false,
  bordered = false,
  rounded = false,
  elevation = false,
  hoverable = false,

  /* Misc */
  divider,
  sx = {},
  ...props
}) => {
  return (
    <Stack
      direction={direction}
      spacing={gap ?? spacing}
      alignItems={align}
      justifyContent={justify}
      flexWrap={wrap}
      divider={divider}
      sx={{
        width: fullWidth ? "100%" : undefined,
        height: fullHeight ? "100%" : undefined,

        /* ===== THEME ===== */
        backgroundColor: surface ? "var(--color-surface)" : undefined,

        border: bordered ? "1px solid var(--color-border)" : undefined,

        borderRadius: rounded ? "12px" : undefined,

        boxShadow: elevation ? "var(--app-shadow-sm)" : "none",

        transition: "all 0.2s ease",

        ...(hoverable && {
          "&:hover": {
            backgroundColor: "var(--color-surface-hover)",
          },
        }),

        ...sx,
      }}
      {...props}
    >
      {children}
    </Stack>
  );
};

export default AppStack;
