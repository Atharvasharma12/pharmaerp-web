// src/pages/UIComponentDisplayPage.jsx

import React from "react";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import {
  AppAvatar,
  AppBadge,
  AppBox,
  AppBreadcrumb,
  AppButton,
  AppDropdown,
  AppHeading,
  AppIconButton,
  AppSection,
  AppStack,
  AppStickyBar,
  AppText,
  Sidebar,
  Navbar,
  MainLayout,
  PageHeader,
  AuthLayout,
  ModuleLayout,
  PageActions,
  PageContent,
  PageToolbar,
} from "@/components";

const sidebarItems = [
  {
    label: "Dashboard",
    to: "/",
    icon: DashboardRoundedIcon,
  },
  {
    label: "Employees",
    to: "/employees",
    icon: PeopleRoundedIcon,
    badge: "12",
  },
  {
    label: "Payroll",
    to: "/payroll",
    icon: ReceiptLongRoundedIcon,
  },
  {
    label: "Inventory",
    to: "/inventory",
    icon: Inventory2RoundedIcon,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: SettingsRoundedIcon,
  },
];

const user = {
  name: "John Doe",
  role: "HR Manager",
};

const UIComponentDisplayPage = () => {
  return (
    <AppBox
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <PageContent spacing={4}>
        {/* ====================================================== */}
        {/* PAGE HEADER */}
        {/* ====================================================== */}

        <PageHeader
          title="Layout Components Showcase"
          subtitle="Reusable enterprise layout system for ERP applications."
          breadcrumbItems={[{ label: "Components" }, { label: "Layouts" }]}
          actions={
            <PageActions>
              <AppButton variant="outlined" colorVariant="dark">
                Cancel
              </AppButton>

              <AppButton startIcon={<AddRoundedIcon />} colorVariant="primary">
                Create
              </AppButton>
            </PageActions>
          }
        />

        {/* ====================================================== */}
        {/* SIDEBAR */}
        {/* ====================================================== */}

        <AppSection
          title="Sidebar"
          description="Reusable navigation sidebar for ERP modules."
        >
          <AppBox
            sx={{
              height: 640,
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <Sidebar
              title="ERP Suite"
              subtitle="Admin Panel"
              items={sidebarItems}
              footer={
                <AppText
                  color="var(--color-text-muted)"
                  sx={{ fontSize: "0.75rem" }}
                >
                  Version 1.0.0
                </AppText>
              }
            />
          </AppBox>
        </AppSection>

        {/* ====================================================== */}
        {/* NAVBAR */}
        {/* ====================================================== */}

        <AppSection
          title="Navbar"
          description="Top application navigation bar."
        >
          <AppBox
            sx={{
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <Navbar
              title="Employee Management"
              subtitle="Manage employee records"
              actions={[
                <AppIconButton
                  key="notification"
                  icon={<NotificationsRoundedIcon />}
                  variant="text"
                  colorVariant="dark"
                />,
              ]}
              right={
                <AppButton
                  variant="soft"
                  colorVariant="primary"
                  startIcon={<SearchRoundedIcon />}
                >
                  Search
                </AppButton>
              }
              user={user}
            />
          </AppBox>
        </AppSection>

        {/* ====================================================== */}
        {/* PAGE HEADER */}
        {/* ====================================================== */}

        <AppSection
          title="PageHeader"
          description="Reusable page title area with breadcrumbs and actions."
        >
          <PageHeader
            title="Employees"
            subtitle="Manage employee records, departments, payroll, and onboarding workflows."
            breadcrumbItems={[{ label: "HRMS" }, { label: "Employees" }]}
            actions={
              <PageActions>
                <AppButton variant="outlined">Export</AppButton>

                <AppButton>Add Employee</AppButton>
              </PageActions>
            }
          />
        </AppSection>

        {/* ====================================================== */}
        {/* AUTH LAYOUT */}
        {/* ====================================================== */}

        <AppSection
          title="AuthLayout"
          description="Authentication screen layout for login/register pages."
        >
          <AppBox
            sx={{
              height: 720,
              overflow: "hidden",
              borderRadius: "18px",
              border: "1px solid var(--color-border)",
            }}
          >
            <AuthLayout
              title="Welcome Back"
              subtitle="Sign in to access your workspace."
              brandingTitle="ERP Suite"
              brandingSubtitle="Modern enterprise resource management platform."
            >
              <AppStack spacing={2}>
                <AppBox
                  sx={{
                    height: 48,
                    borderRadius: "12px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                />

                <AppBox
                  sx={{
                    height: 48,
                    borderRadius: "12px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                />

                <AppButton fullWidth>Sign In</AppButton>
              </AppStack>
            </AuthLayout>
          </AppBox>
        </AppSection>

        {/* ====================================================== */}
        {/* MODULE LAYOUT */}
        {/* ====================================================== */}

        <AppSection
          title="ModuleLayout"
          description="Standard module page wrapper for ERP systems."
        >
          <AppBox
            sx={{
              border: "1px solid var(--color-border)",
              borderRadius: "18px",
              overflow: "hidden",
            }}
          >
            <ModuleLayout
              title="Payroll Management"
              subtitle="Run payroll operations and manage salary workflows."
              breadcrumbItems={[{ label: "Finance" }, { label: "Payroll" }]}
              stickyToolbar
              toolbar={
                <PageToolbar surface bordered>
                  <AppText color="var(--color-text-muted)">
                    Payroll filters and actions
                  </AppText>

                  <PageActions>
                    <AppButton variant="outlined">Export</AppButton>

                    <AppButton>Run Payroll</AppButton>
                  </PageActions>
                </PageToolbar>
              }
              headerActions={
                <PageActions>
                  <AppButton variant="outlined">Reports</AppButton>

                  <AppButton>Create Payroll</AppButton>
                </PageActions>
              }
            >
              <PageContent spacing={2}>
                <AppSection title="Payroll Summary">
                  <AppText>
                    Salary processing overview and monthly analytics.
                  </AppText>
                </AppSection>

                <AppSection title="Pending Approvals">
                  <AppText>
                    Approval queues and payroll validation workflows.
                  </AppText>
                </AppSection>

                <AppSection title="Employee Payroll Table">
                  <AppText>
                    Employee payroll records, deductions, bonuses, and taxes.
                  </AppText>
                </AppSection>
              </PageContent>
            </ModuleLayout>
          </AppBox>
        </AppSection>

        {/* ====================================================== */}
        {/* MAIN LAYOUT */}
        {/* ====================================================== */}

        <AppSection
          title="MainLayout"
          description="Complete enterprise application shell layout."
        >
          <AppBox
            sx={{
              height: 900,
              overflow: "hidden",
              borderRadius: "18px",
              border: "1px solid var(--color-border)",
            }}
          >
            <MainLayout
              sidebarItems={sidebarItems}
              sidebarTitle="ERP Suite"
              sidebarSubtitle="Enterprise Platform"
              navbarTitle="Dashboard"
              navbarSubtitle="Business overview and insights"
              user={user}
              navbarActions={[
                <AppIconButton
                  key="notification"
                  icon={<NotificationsRoundedIcon />}
                  variant="text"
                  colorVariant="dark"
                />,
              ]}
            >
              <PageContent spacing={3}>
                <PageHeader
                  title="Dashboard Overview"
                  subtitle="Business metrics, reports, and operational insights."
                  breadcrumbItems={[{ label: "Dashboard" }]}
                  actions={
                    <PageActions>
                      <AppButton variant="outlined">Export</AppButton>

                      <AppButton>Generate Report</AppButton>
                    </PageActions>
                  }
                />

                <PageToolbar surface bordered>
                  <AppText color="var(--color-text-muted)">
                    Toolbar actions and filters
                  </AppText>

                  <PageActions>
                    <AppButton variant="soft">Refresh</AppButton>

                    <AppButton>Create Widget</AppButton>
                  </PageActions>
                </PageToolbar>

                <AppSection title="Analytics">
                  <AppText>
                    KPI cards, charts, reports, and financial summaries.
                  </AppText>
                </AppSection>

                <AppSection title="Operations">
                  <AppText>
                    Operational metrics and workflow monitoring.
                  </AppText>
                </AppSection>

                <AppSection title="Recent Activity">
                  <AppText>
                    User actions, approvals, notifications, and audit events.
                  </AppText>
                </AppSection>
              </PageContent>
            </MainLayout>
          </AppBox>
        </AppSection>

        {/* ====================================================== */}
        {/* EXTRA LAYOUT UTILITIES */}
        {/* ====================================================== */}

        <AppSection
          title="Additional Layout Utilities"
          description="Supporting reusable layout primitives."
        >
          <AppStack spacing={3}>
            <AppStickyBar
              variant="surface"
              rounded="lg"
              blur
              left={<AppHeading level={6}>Sticky Action Bar</AppHeading>}
              right={
                <PageActions>
                  <AppButton variant="outlined">Cancel</AppButton>

                  <AppButton>Save Changes</AppButton>
                </PageActions>
              }
            />

            <AppBreadcrumb
              items={[
                { label: "Dashboard" },
                { label: "Employees" },
                { label: "Employee Details" },
              ]}
            />

            <AppStack direction="row" spacing={2} align="center">
              <AppAvatar name="John Doe" size="large" />

              <AppBadge label="Active" colorVariant="success" />

              <AppDropdown
                label="Quick Actions"
                items={[
                  { label: "Edit" },
                  { label: "Duplicate" },
                  { label: "Archive" },
                ]}
              />
            </AppStack>
          </AppStack>
        </AppSection>
      </PageContent>
    </AppBox>
  );
};

export default UIComponentDisplayPage;
