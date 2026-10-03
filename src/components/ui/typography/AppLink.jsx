import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";

const AppLink = ({
  children,
  href,
  underline = "hover",
  sx = {},
  ...props
}) => {
  return (
    <MuiLink
      component={RouterLink}
      to={href}
      underline={underline}
      sx={{
        color: "var(--color-primary)",
        fontWeight: 500,
        cursor: "pointer",
        "&:hover": {
          color: "var(--color-primary-hover)",
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiLink>
  );
};

export default AppLink;
