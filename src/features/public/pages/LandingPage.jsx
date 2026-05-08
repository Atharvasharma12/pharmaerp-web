import React from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";

const features = [
  {
    icon: <ShoppingCartRoundedIcon />,
    title: "Sales Management",
    text: "Manage leads, quotations, orders and invoices.",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    icon: <Inventory2OutlinedIcon />,
    title: "Inventory Control",
    text: "Track stock and warehouse operations.",
    color: "#16a34a",
    bg: "#ecfdf5",
  },
  {
    icon: <ReceiptLongRoundedIcon />,
    title: "Purchase",
    text: "Manage vendors and purchase workflows.",
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    icon: <AccountBalanceWalletOutlinedIcon />,
    title: "Accounting",
    text: "Automate accounting and cash flow.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: <Groups2OutlinedIcon />,
    title: "HR & Payroll",
    text: "Employees, attendance and payroll.",
    color: "#e11d48",
    bg: "#fff1f2",
  },
  {
    icon: <BarChartRoundedIcon />,
    title: "Reports",
    text: "Real-time analytics and insights.",
    color: "#0891b2",
    bg: "#ecfeff",
  },
];

const trustItems = [
  {
    icon: <ShieldOutlinedIcon />,
    title: "Secure",
    text: "Enterprise security",
  },
  {
    icon: <CloudQueueRoundedIcon />,
    title: "Cloud Based",
    text: "Access anywhere",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "24/7 Support",
    text: "Always available",
  },
];

const LandingPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fbff",
        overflowX: "hidden",
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 5, md: 7 },
          pb: { xs: 5, md: 6 },
          background:
            "linear-gradient(180deg, #ffffff 0%, #f7fbff 68%, #eef6ff 100%)",
          borderBottom: "1px solid #e8eef6",
          overflow: "hidden",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: "1440px",
            px: { xs: 2, sm: 3, md: 5, lg: 6 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 4, md: 5, lg: 7 },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* LEFT CONTENT */}
            <Box
              sx={{
                flex: "0 0 41%",
                maxWidth: { xs: "100%", md: 560 },
                width: "100%",
              }}
            >
              <Chip
                label="All-in-One Business Management Solution"
                sx={{
                  mb: 2.2,
                  height: 28,
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  fontWeight: 700,
                  fontSize: 11.5,
                  borderRadius: "999px",
                }}
              />

              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 36, sm: 46, md: 54, lg: 58 },
                  lineHeight: 1.03,
                  letterSpacing: "-0.06em",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Manage Your
                <br />
                Business Faster
                <br />&{" "}
                <Box component="span" sx={{ color: "#2563eb" }}>
                  Smarter.
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2.5,
                  maxWidth: 520,
                  color: "#667085",
                  fontSize: 15,
                  lineHeight: 1.8,
                  fontWeight: 500,
                }}
              >
                Powerful ERP software to manage sales, inventory, accounting,
                HR, finance and operations from one centralized dashboard.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.6}
                sx={{ mt: 3.5 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    height: 48,
                    px: 3.4,
                    borderRadius: "12px",
                    bgcolor: "#2563eb",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: "0 16px 35px rgba(37,99,235,0.22)",
                    "&:hover": { bgcolor: "#1d4ed8" },
                  }}
                >
                  Get Started Free
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<PlayArrowRoundedIcon />}
                  sx={{
                    height: 48,
                    px: 3,
                    borderRadius: "12px",
                    borderColor: "#cbd5e1",
                    color: "#2563eb",
                    bgcolor: "#fff",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 14,
                    "&:hover": {
                      bgcolor: "#eff6ff",
                      borderColor: "#93c5fd",
                    },
                  }}
                >
                  Watch Demo
                </Button>
              </Stack>

              <Grid container spacing={1.5} sx={{ mt: 4 }}>
                {trustItems.map((item) => (
                  <Grid item xs={12} sm={4} key={item.title}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        height: "100%",
                        borderRadius: "14px",
                        border: "1px solid #e8eef6",
                        bgcolor: "rgba(255,255,255,0.86)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          bgcolor: "#f8fafc",
                          color: "#64748b",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          "& svg": { fontSize: 18 },
                        }}
                      >
                        {item.icon}
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: "#111827",
                            lineHeight: 1.2,
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.2,
                            fontSize: 10.5,
                            color: "#667085",
                          }}
                        >
                          {item.text}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* RIGHT IMAGE */}
            <Box
              sx={{
                flex: "1 1 59%",
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  width: "100%",
                  maxWidth: 820,
                  borderRadius: "22px",
                  overflow: "hidden",
                  border: "1px solid #dbeafe",
                  bgcolor: "#ffffff",
                  boxShadow: "0 35px 80px rgba(15,23,42,0.14)",
                }}
              >
                <Box
                  component="img"
                  src="/hero-img.jpeg"
                  alt="ERP Dashboard"
                  sx={{
                    width: "100%",
                    height: { xs: 260, sm: 360, md: 500, lg: 540 },
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* FEATURES */}
      <Box sx={{ py: { xs: 5, md: 6 }, bgcolor: "#ffffff" }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: "1440px",
            px: { xs: 2, sm: 3, md: 5, lg: 6 },
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Chip
              label="Features"
              sx={{
                height: 24,
                bgcolor: "#eff6ff",
                color: "#2563eb",
                fontWeight: 800,
                fontSize: 11,
                mb: 1,
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: 26, md: 34 },
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#0f172a",
              }}
            >
              Everything You Need To Run Your Business
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 14,
                color: "#667085",
                fontWeight: 500,
              }}
            >
              Powerful modules with seamless integration.
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {features.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={item.title}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 2.2,
                    borderRadius: "16px",
                    border: "1px solid #e8eef6",
                    transition: "0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
                      borderColor: "#bfdbfe",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      bgcolor: item.bg,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1.5,
                      "& svg": { fontSize: 22 },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#111827",
                      mb: 0.7,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12.5,
                      lineHeight: 1.6,
                      color: "#667085",
                      minHeight: 56,
                    }}
                  >
                    {item.text}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.3,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#2563eb",
                    }}
                  >
                    Learn More →
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
