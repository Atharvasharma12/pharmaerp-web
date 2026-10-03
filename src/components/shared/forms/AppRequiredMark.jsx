import { Typography } from "@mui/material";

const AppRequiredMark = ({
  color = "var(--app-color-error)",
  children = "*",
  sx = {},
  ...props
}) => {
  return (
    <Typography
      component="span"
      sx={{
        color,
        fontSize: "0.95em",
        fontWeight: 600,
        ml: 0.25,
        lineHeight: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default AppRequiredMark;
