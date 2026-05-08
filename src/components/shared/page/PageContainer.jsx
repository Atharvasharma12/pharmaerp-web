import AppContainer from "@/components/ui/layout/AppContainer";
import AppStack from "@/components/ui/layout/AppStack";

const PageContainer = ({
  children,

  maxWidth = "xl",
  fluid = false,
  centered = true,
  disablePadding = false,

  spacing = 3,
  minHeight = "100%",

  sx = {},
  contentSx = {},

  ...props
}) => {
  return (
    <AppContainer
      maxWidth={maxWidth}
      fluid={fluid}
      centered={centered}
      disablePadding={disablePadding}
      sx={{
        py: { xs: 2, sm: 3 },
        minHeight,
        ...sx,
      }}
      {...props}
    >
      <AppStack
        spacing={spacing}
        fullWidth
        sx={{
          minHeight,
          ...contentSx,
        }}
      >
        {children}
      </AppStack>
    </AppContainer>
  );
};

export default PageContainer;
