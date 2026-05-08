import { Typography } from "@mui/material";

const AppText = ({
  children,
  variant = "body2",
  color = "var(--color-text)",
  weight,
  align,
  sx = {},
  ...props
}) => {
  return (
    <Typography
      variant={variant}
      align={align}
      sx={{
        color,
        fontWeight: weight,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default AppText;
