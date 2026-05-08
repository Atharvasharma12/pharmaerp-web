import React from "react";
import { NavLink } from "react-router-dom";

import { AppBox, AppStack, AppText, AppHeading, AppBadge } from "@/components";

const Sidebar = ({
  logo,
  title = "ERP Suite",
  subtitle = "Admin Panel",
  items = [],
  footer,
  collapsed = false,
  width = 280,
  collapsedWidth = 76,
  sx = {},
}) => {
  return (
    <AppBox
      component="aside"
      sx={{
        width: collapsed ? collapsedWidth : width,
        minWidth: collapsed ? collapsedWidth : width,
        height: "100vh",
        position: "sticky",
        top: 0,
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease, min-width 0.2s ease",
        ...sx,
      }}
    >
      <AppBox
        sx={{
          height: 72,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        {logo || (
          <AppBox
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-inverse)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            E
          </AppBox>
        )}

        {!collapsed && (
          <AppBox sx={{ minWidth: 0 }}>
            <AppHeading level={6} weight={800} sx={{ lineHeight: 1.1 }}>
              {title}
            </AppHeading>

            <AppText
              color="var(--color-text-muted)"
              sx={{ fontSize: "0.75rem" }}
            >
              {subtitle}
            </AppText>
          </AppBox>
        )}
      </AppBox>

      <AppStack
        spacing={0.5}
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 1.2,
          py: 1.5,
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.key || item.label}
              to={item.to || "#"}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <AppBox
                  sx={{
                    minHeight: 44,
                    px: collapsed ? 1 : 1.4,
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: 1.2,
                    color: isActive
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)",
                    backgroundColor: isActive
                      ? "var(--color-primary-soft)"
                      : "transparent",
                    fontWeight: isActive ? 800 : 600,
                    transition: "all 0.18s ease",

                    "&:hover": {
                      backgroundColor: isActive
                        ? "var(--color-primary-soft)"
                        : "var(--color-surface-hover)",
                      color: isActive
                        ? "var(--color-primary)"
                        : "var(--color-text)",
                    },

                    "& svg": {
                      fontSize: 20,
                      flexShrink: 0,
                    },
                  }}
                >
                  {Icon && <Icon />}

                  {!collapsed && (
                    <>
                      <AppText
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: "0.86rem",
                          fontWeight: "inherit",
                          color: "inherit",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.label}
                      </AppText>

                      {item.badge && (
                        <AppBadge
                          label={item.badge}
                          size="small"
                          colorVariant={item.badgeColor || "primary"}
                        />
                      )}
                    </>
                  )}
                </AppBox>
              )}
            </NavLink>
          );
        })}
      </AppStack>

      {footer && (
        <AppBox
          sx={{
            p: 1.5,
            borderTop: "1px solid var(--color-border)",
            flexShrink: 0,
          }}
        >
          {footer}
        </AppBox>
      )}
    </AppBox>
  );
};

export default Sidebar;
