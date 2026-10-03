import AppStack from "@/components/ui/layout/AppStack";

const PageActions = ({
  children,

  align = "center",
  justify = "flex-end",

  direction = "row",
  wrap = "wrap",

  spacing = 1.5,

  fullWidth = false,

  sx = {},
  ...props
}) => {
  return (
    <AppStack
      direction={direction}
      align={align}
      justify={justify}
      wrap={wrap}
      spacing={spacing}
      fullWidth={fullWidth}
      sx={{
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </AppStack>
  );
};

export default PageActions;
