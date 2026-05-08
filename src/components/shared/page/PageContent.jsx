import AppBox from "@/components/ui/layout/AppBox";
import AppStack from "@/components/ui/layout/AppStack";

const PageContent = ({
  children,

  spacing = 3,

  surface = false,
  bordered = false,
  rounded = false,
  elevation = false,
  padded = false,

  sx = {},
  ...props
}) => {
  return (
    <AppBox
      surface={surface}
      bordered={bordered}
      rounded={rounded}
      elevation={elevation}
      p={padded ? { xs: 2, sm: 3 } : 0}
      sx={{
        width: "100%",
        minWidth: 0,
        ...sx,
      }}
      {...props}
    >
      <AppStack spacing={spacing} fullWidth>
        {children}
      </AppStack>
    </AppBox>
  );
};

export default PageContent;
