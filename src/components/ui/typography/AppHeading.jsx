import { Typography } from "@mui/material";

const AppHeading = ({
  children,
  level = 5,
  weight = 600,
  gutterBottom = false,
  sx = {},
  ...props
}) => {
  const variantMap = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6",
  };

  return (
    <Typography
      variant={variantMap[level]}
      gutterBottom={gutterBottom}
      sx={{
        color: "var(--color-text)",
        fontWeight: weight,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

export default AppHeading;
