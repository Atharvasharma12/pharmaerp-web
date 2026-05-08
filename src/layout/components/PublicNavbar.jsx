import React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  IconButton,
  Stack,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

const PublicNavbar = () => {
  const location = useLocation();

  const [modulesAnchor, setModulesAnchor] = React.useState(null);
  const [resourcesAnchor, setResourcesAnchor] = React.useState(null);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "Modules", dropdown: true },
    { label: "Pricing", path: "/pricing" },
    { label: "Industries", path: "/industries" },
    { label: "Resources", dropdown: true },
    { label: "About Us", path: "/about" },
    { label: "Contact Us", path: "/contact" },
  ];

  const moduleItems = [
    { label: "Sales Management", path: "/modules/sales" },
    { label: "Inventory", path: "/modules/inventory" },
    { label: "Accounting", path: "/modules/accounting" },
    { label: "Purchase", path: "/modules/purchase" },
    { label: "HR & Payroll", path: "/modules/hr-payroll" },
  ];

  const resourceItems = [
    { label: "Blog", path: "/blog" },
    { label: "Help Center", path: "/help-center" },
    { label: "Documentation", path: "/documentation" },
    { label: "Case Studies", path: "/case-studies" },
  ];

  const handleDropdownOpen = (event, label) => {
    if (label === "Modules") setModulesAnchor(event.currentTarget);
    if (label === "Resources") setResourcesAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setModulesAnchor(null);
    setResourcesAnchor(null);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 1200,
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(18px)",
        color: "#1f2937",
        borderBottom: "1px solid #e8eef6",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "76px !important",
          px: { xs: 2, md: 4, lg: 5 },
          display: "flex",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            textDecoration: "none",
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "11px",
              background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)",
            }}
          >
            <DashboardCustomizeRoundedIcon
              sx={{ color: "#fff", fontSize: 22 }}
            />
          </Box>

          <Box
            component="span"
            sx={{
              fontSize: { xs: 22, md: 24 },
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#172033",
              lineHeight: 1,
            }}
          >
            Core
            <Box
              component="span"
              sx={{ color: "#2563eb", ml: 0.4, fontWeight: 800 }}
            >
              ERP
            </Box>
          </Box>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ lg: 2.6, xl: 3.1 }}
          sx={{
            display: { xs: "none", lg: "flex" },
            flex: 1,
            justifyContent: "center",
          }}
        >
          {navItems.map((item) => {
            const active = item.path ? isActive(item.path) : false;

            return (
              <Button
                key={item.label}
                component={item.dropdown ? "button" : Link}
                to={item.dropdown ? undefined : item.path}
                onClick={(e) =>
                  item.dropdown ? handleDropdownOpen(e, item.label) : undefined
                }
                endIcon={
                  item.dropdown ? (
                    <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
                  ) : null
                }
                sx={{
                  position: "relative",
                  p: 0,
                  minWidth: "auto",
                  color: active ? "#2563eb" : "#344054",
                  fontSize: 14,
                  fontWeight: active ? 700 : 600,
                  lineHeight: 1,
                  textTransform: "none",
                  textDecoration: "none",
                  "& .MuiButton-endIcon": { ml: 0.4 },
                  "&:hover": {
                    bgcolor: "transparent",
                    color: "#2563eb",
                  },
                  "&::after": active
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: -28,
                        height: "2.5px",
                        borderRadius: "20px",
                        bgcolor: "#2563eb",
                      }
                    : {},
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.6}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <IconButton
            sx={{
              width: 38,
              height: 38,
              color: "#64748b",
              border: "1px solid #edf2f7",
              bgcolor: "#fff",
              "&:hover": { bgcolor: "#f8fafc" },
            }}
          >
            <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          <Button
            component={Link}
            to="/login"
            sx={{
              color: "#334155",
              fontWeight: 600,
              textTransform: "none",
              fontSize: 14,
              px: 1,
              textDecoration: "none",
              "&:hover": {
                bgcolor: "transparent",
                color: "#2563eb",
              },
            }}
          >
            Login
          </Button>

          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              px: 2.5,
              py: 1.15,
              borderRadius: "10px",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#2563eb",
              boxShadow: "0 10px 18px rgba(37, 99, 235, 0.22)",
              textDecoration: "none",
              "&:hover": {
                bgcolor: "#1d4ed8",
                boxShadow: "0 12px 22px rgba(37, 99, 235, 0.28)",
              },
            }}
          >
            Get Started Free
          </Button>
        </Stack>

        <IconButton
          sx={{
            display: { xs: "flex", lg: "none" },
            color: "#1f2937",
            border: "1px solid #e5e7eb",
          }}
        >
          <MenuRoundedIcon />
        </IconButton>
      </Toolbar>

      <Menu
        anchorEl={modulesAnchor}
        open={Boolean(modulesAnchor)}
        onClose={handleClose}
      >
        {moduleItems.map((item) => (
          <MenuItem
            key={item.label}
            component={Link}
            to={item.path}
            onClick={handleClose}
            sx={{ fontSize: 14, fontWeight: 500, py: 1.1 }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={resourcesAnchor}
        open={Boolean(resourcesAnchor)}
        onClose={handleClose}
      >
        {resourceItems.map((item, index) => (
          <React.Fragment key={item.label}>
            {index === 3 && <Divider />}
            <MenuItem
              component={Link}
              to={item.path}
              onClick={handleClose}
              sx={{ fontSize: 14, fontWeight: 500, py: 1.1 }}
            >
              {item.label}
            </MenuItem>
          </React.Fragment>
        ))}
      </Menu>
    </AppBar>
  );
};

export default PublicNavbar;
