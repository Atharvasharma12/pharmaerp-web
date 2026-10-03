import React, { useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";

import { AppBox, AppIconButton, AppDrawer } from "@/components";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = ({
  children,

  sidebarItems = [],
  sidebarLogo,
  sidebarTitle = "ERP Suite",
  sidebarSubtitle = "Admin Panel",
  sidebarFooter,

  navbarTitle,
  navbarSubtitle,
  navbarCenter,
  navbarRight,
  navbarActions = [],
  user,

  defaultCollapsed = false,
  sidebarWidth = 280,
  collapsedWidth = 76,

  sx = {},
  contentSx = {},
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen((prev) => !prev);
  };

  const sidebarNode = (
    <Sidebar
      logo={sidebarLogo}
      title={sidebarTitle}
      subtitle={sidebarSubtitle}
      items={sidebarItems}
      footer={sidebarFooter}
      collapsed={collapsed}
      width={sidebarWidth}
      collapsedWidth={collapsedWidth}
    />
  );

  return (
    <AppBox
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        ...sx,
      }}
    >
      <AppBox
        sx={{
          display: { xs: "none", lg: "block" },
          flexShrink: 0,
        }}
      >
        {sidebarNode}
      </AppBox>

      <AppDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        anchor="left"
        width={sidebarWidth}
        showHeader={false}
        bodySx={{ p: 0 }}
        paperSx={{
          width: sidebarWidth,
        }}
      >
        <Sidebar
          logo={sidebarLogo}
          title={sidebarTitle}
          subtitle={sidebarSubtitle}
          items={sidebarItems}
          footer={sidebarFooter}
          collapsed={false}
          width={sidebarWidth}
          collapsedWidth={collapsedWidth}
        />
      </AppDrawer>

      <AppBox
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar
          title={navbarTitle}
          subtitle={navbarSubtitle}
          center={navbarCenter}
          right={navbarRight}
          actions={navbarActions}
          user={user}
          left={
            <>
              <AppIconButton
                icon={<MenuRoundedIcon />}
                variant="text"
                colorVariant="dark"
                rounded="full"
                sx={{
                  display: { xs: "inline-flex", lg: "none" },
                }}
                onClick={toggleMobileSidebar}
              />

              <AppIconButton
                icon={<ChevronLeftRoundedIcon />}
                variant="text"
                colorVariant="dark"
                rounded="full"
                sx={{
                  display: { xs: "none", lg: "inline-flex" },
                  transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                }}
                onClick={toggleCollapsed}
              />
            </>
          }
        />

        <AppBox
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 2, sm: 3 },
            ...contentSx,
          }}
        >
          {children}
        </AppBox>
      </AppBox>
    </AppBox>
  );
};

export default MainLayout;
