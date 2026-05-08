import React from "react";

import {
  AppBox,
  AppStack,
  AppHeading,
  AppText,
  AppAvatar,
  AppIconButton,
  AppDropdown,
} from "@/components";

const Navbar = ({
  title,
  subtitle,

  left,
  center,
  right,

  user,

  actions = [],

  sticky = true,
  height = 72,

  sx = {},
}) => {
  return (
    <AppBox
      component="header"
      sx={{
        height,
        minHeight: height,
        px: { xs: 2, md: 3 },
        backgroundColor: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        position: sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 1100,

        backdropFilter: "blur(10px)",

        ...sx,
      }}
    >
      <AppStack
        direction="row"
        align="center"
        spacing={2}
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {left}

        {(title || subtitle) && (
          <AppBox sx={{ minWidth: 0 }}>
            {title && (
              <AppHeading
                level={6}
                weight={800}
                sx={{
                  lineHeight: 1.1,
                }}
              >
                {title}
              </AppHeading>
            )}

            {subtitle && (
              <AppText
                color="var(--color-text-muted)"
                sx={{
                  fontSize: "0.78rem",
                  mt: 0.2,
                }}
              >
                {subtitle}
              </AppText>
            )}
          </AppBox>
        )}
      </AppStack>

      {center && (
        <AppBox
          sx={{
            display: {
              xs: "none",
              lg: "flex",
            },
            alignItems: "center",
            justifyContent: "center",
            px: 3,
          }}
        >
          {center}
        </AppBox>
      )}

      <AppStack
        direction="row"
        align="center"
        justify="flex-end"
        spacing={1}
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {actions.map((action, index) => (
          <React.Fragment key={action.key || index}>{action}</React.Fragment>
        ))}

        {right}

        {user && (
          <AppDropdown
            triggerType="custom"
            menuMinWidth={220}
            items={[
              {
                label: "Profile",
                onClick: user.onProfile,
              },
              {
                label: "Settings",
                onClick: user.onSettings,
              },
              {
                type: "divider",
              },
              {
                label: "Logout",
                danger: true,
                onClick: user.onLogout,
              },
            ]}
            trigger={({ onClick }) => (
              <AppBox
                onClick={onClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  cursor: "pointer",
                  borderRadius: "12px",
                  px: 1,
                  py: 0.6,

                  "&:hover": {
                    backgroundColor: "var(--color-surface-hover)",
                  },
                }}
              >
                <AppAvatar src={user.avatar} name={user.name} size="small" />

                <AppBox
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                    },
                  }}
                >
                  <AppText
                    sx={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      lineHeight: 1.1,
                    }}
                  >
                    {user.name}
                  </AppText>

                  <AppText
                    color="var(--color-text-muted)"
                    sx={{
                      fontSize: "0.72rem",
                    }}
                  >
                    {user.role}
                  </AppText>
                </AppBox>
              </AppBox>
            )}
          />
        )}
      </AppStack>
    </AppBox>
  );
};

export default Navbar;
