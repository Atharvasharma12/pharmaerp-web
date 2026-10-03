import { Box } from "@mui/material";

const AppBox = ({
  children,

  /* Layout */
  display,
  flexDirection,
  alignItems,
  justifyContent,
  flexWrap,
  gap,

  /* Spacing */
  p,
  px,
  py,
  m,
  mx,
  my,

  /* Size */
  width,
  height,
  minHeight,

  /* Visual */
  surface = false,
  bordered = false,
  hoverable = false,
  rounded = true,
  elevation = false,

  /* Misc */
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        display,
        flexDirection,
        alignItems,
        justifyContent,
        flexWrap,
        gap,

        p,
        px,
        py,
        m,
        mx,
        my,

        width,
        height,
        minHeight,

        /* ===== THEME AWARE ===== */
        backgroundColor: surface ? "var(--color-surface)" : undefined,

        border: bordered ? "1px solid var(--color-border)" : undefined,

        borderRadius: rounded ? "12px" : 0,

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
    </Box>
  );
};

export default AppBox;
