import { Typography } from "@mui/material";

const AppFieldHint = ({
  children,
  color = "var(--app-color-text-muted)",
  className = "",
  sx = {},
  ...props
}) => {
  if (!children) return null;

  return (
    <Typography
      variant="caption"
      className={className}
      sx={{
        display: "block",
        mt: 0.75,
        color,
        fontSize: "0.75rem",
        lineHeight: 1.5,
        letterSpacing: "0.01em",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default AppFieldHint;
