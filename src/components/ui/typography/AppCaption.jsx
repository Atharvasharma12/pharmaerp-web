import { Typography } from "@mui/material";

const AppCaption = ({ children, sx = {}, ...props }) => {
  return (
    <Typography
      variant="caption"
      sx={{
        color: "var(--color-text-muted)",
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default AppCaption;
