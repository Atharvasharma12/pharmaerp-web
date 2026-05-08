import AppBox from "@/components/ui/layout/AppBox";
import AppStack from "@/components/ui/layout/AppStack";

const PageToolbar = ({
  children,

  justify = "space-between",
  align = "center",

  wrap = "wrap",

  spacing = 2,

  surface = false,
  bordered = false,
  rounded = true,
  elevation = false,

  padded = true,

  sticky = false,
  top = 0,
  zIndex = 10,

  sx = {},
  ...props
}) => {
  return (
    <AppBox
      surface={surface}
      bordered={bordered}
      rounded={rounded}
      elevation={elevation}
      p={padded ? 2 : 0}
      sx={{
        position: sticky ? "sticky" : "relative",
        top: sticky ? top : undefined,
        zIndex: sticky ? zIndex : undefined,

        ...(sticky && {
          backdropFilter: "blur(10px)",
        }),

        ...sx,
      }}
      {...props}
    >
      <AppStack
        direction="row"
        align={align}
        justify={justify}
        wrap={wrap}
        spacing={spacing}
        fullWidth
      >
        {children}
      </AppStack>
    </AppBox>
  );
};

export default PageToolbar;
