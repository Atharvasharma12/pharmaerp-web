import { Typography } from "@mui/material";

const AppLabel = ({ children, required = false, sx = {}, ...props }) => {
  return (
    <Typography
      variant="body2"
      sx={{
        color: "var(--color-text-muted)",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "4px",
        ...sx,
      }}
      {...props}
    >
      {children}
      {required && <span style={{ color: "var(--color-error)" }}>*</span>}
    </Typography>
  );
};

export default AppLabel;
