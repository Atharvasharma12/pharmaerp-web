import { Box, Divider } from "@mui/material";
import { AppHeading, AppText } from "@/components/ui/typography";

const AppSection = ({
  children,
  title,
  description,
  action,

  padded = true,
  bordered = true,
  surface = true,
  rounded = true,
  divider = false,

  headerAlign = "flex-start",
  spacing = 2,

  sx = {},
  headerSx = {},
  contentSx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        backgroundColor: surface ? "var(--color-surface)" : "transparent",
        border: bordered ? "1px solid var(--color-border)" : "none",
        borderRadius: rounded ? "16px" : 0,
        p: padded ? { xs: 2, sm: 3 } : 0,
        ...sx,
      }}
      {...props}
    >
      {(title || description || action) && (
        <Box
          sx={{
            display: "flex",
            alignItems: headerAlign,
            justifyContent: "space-between",
            gap: 2,
            mb: children ? spacing : 0,
            ...headerSx,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <AppHeading level={6} weight={700}>
                {title}
              </AppHeading>
            )}

            {description && (
              <AppText
                color="var(--color-text-muted)"
                sx={{ mt: 0.5, fontSize: "0.875rem" }}
              >
                {description}
              </AppText>
            )}
          </Box>

          {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
        </Box>
      )}

      {divider && (title || description || action) && (
        <Divider sx={{ borderColor: "var(--color-border)", mb: spacing }} />
      )}

      <Box sx={contentSx}>{children}</Box>
    </Box>
  );
};

export default AppSection;
