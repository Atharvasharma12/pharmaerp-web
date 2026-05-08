import React from "react";

import {
  AppBox,
  AppContainer,
  AppGrid,
  AppHeading,
  AppStack,
  AppText,
} from "@/components";

const AuthLayout = ({
  children,

  title = "Welcome Back",
  subtitle = "Sign in to continue",

  brandingTitle = "ERP Suite",
  brandingSubtitle = "Enterprise Resource Platform",

  hero,

  reverse = false,

  maxWidth = "xl",

  sx = {},
}) => {
  return (
    <AppBox
      sx={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        alignItems: "stretch",
        ...sx,
      }}
    >
      <AppContainer
        maxWidth={maxWidth}
        fluid
        disablePadding
        sx={{
          display: "flex",
          flex: 1,
        }}
      >
        <AppGrid
          columns={2}
          md={2}
          xs={1}
          gap={0}
          fullWidth
          sx={{
            minHeight: "100vh",
          }}
        >
          <AppBox
            sx={{
              order: reverse ? 2 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 3, md: 6 },
              backgroundColor: "var(--color-surface)",
            }}
          >
            <AppBox
              sx={{
                width: "100%",
                maxWidth: 460,
              }}
            >
              <AppStack spacing={1}>
                <AppHeading level={3} weight={800}>
                  {title}
                </AppHeading>

                <AppText
                  color="var(--color-text-muted)"
                  sx={{
                    lineHeight: 1.7,
                  }}
                >
                  {subtitle}
                </AppText>
              </AppStack>

              <AppBox
                sx={{
                  mt: 4,
                }}
              >
                {children}
              </AppBox>
            </AppBox>
          </AppBox>

          <AppBox
            sx={{
              order: reverse ? 1 : 2,
              display: {
                xs: "none",
                md: "flex",
              },
              alignItems: "center",
              justifyContent: "center",
              p: 6,
              background:
                "linear-gradient(135deg, var(--color-primary-soft), var(--color-surface))",
              borderLeft: "1px solid var(--color-border)",
            }}
          >
            <AppBox
              sx={{
                maxWidth: 520,
              }}
            >
              {hero || (
                <AppStack spacing={2}>
                  <AppBox
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "20px",
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-text-inverse)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      fontWeight: 900,
                    }}
                  >
                    E
                  </AppBox>

                  <AppHeading level={2} weight={900}>
                    {brandingTitle}
                  </AppHeading>

                  <AppText
                    sx={{
                      fontSize: "1rem",
                      lineHeight: 1.9,
                      maxWidth: 460,
                    }}
                    color="var(--color-text-muted)"
                  >
                    {brandingSubtitle}
                  </AppText>
                </AppStack>
              )}
            </AppBox>
          </AppBox>
        </AppGrid>
      </AppContainer>
    </AppBox>
  );
};

export default AuthLayout;
