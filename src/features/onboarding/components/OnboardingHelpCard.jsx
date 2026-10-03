import { FiHeadphones, FiShield } from "react-icons/fi";

import { AppBox, AppButton, AppCard, AppStack, AppText } from "@/components";

const OnboardingHelpCard = ({
  title = "Need Help?",
  description = "Our support team is ready to help you.",
  buttonText = "Contact Support",
  onContact,
  showTrust = false,
  trustTitle = "Your data is safe",
  trustDescription = "We use secure onboarding to protect your business data.",
  sx,
}) => {
  return (
    <AppCard
      variant="default"
      rounded="lg"
      bordered
      shadow="sm"
      padding="none"
      sx={{ ...cardSx, ...sx }}
    >
      {showTrust && (
        <>
          <AppStack direction="row" align="flex-start" gap={1} sx={sectionSx}>
            <AppBox
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={iconWrapSx}
            >
              <FiShield />
            </AppBox>

            <AppBox sx={{ minWidth: 0 }}>
              <AppText variant="body2" weight={700} sx={titleSx}>
                {trustTitle}
              </AppText>

              <AppText variant="body2" sx={descriptionSx}>
                {trustDescription}
              </AppText>
            </AppBox>
          </AppStack>

          <AppBox sx={dividerSx} />
        </>
      )}

      <AppStack direction="row" align="flex-start" gap={1} sx={sectionSx}>
        <AppBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={iconWrapSx}
        >
          <FiHeadphones />
        </AppBox>

        <AppBox sx={{ minWidth: 0 }}>
          <AppText variant="body2" weight={700} sx={titleSx}>
            {title}
          </AppText>

          <AppText variant="body2" sx={descriptionSx}>
            {description}
          </AppText>
        </AppBox>
      </AppStack>

      <AppButton
        type="button"
        variant="outlined"
        colorVariant="neutral"
        rounded="md"
        fullWidth
        onClick={onContact}
        sx={buttonSx}
      >
        {buttonText}
      </AppButton>
    </AppCard>
  );
};

const cardSx = {
  width: "100%",
  px: 1.45,
  py: 1.35,
  bgcolor: "color-mix(in srgb, var(--app-color-surface) 92%, transparent)",
  backdropFilter: "blur(16px)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-sm)",
};

const sectionSx = {
  width: "100%",
};

const iconWrapSx = {
  width: 30,
  height: 30,
  minWidth: 30,
  borderRadius: "999px",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "16px",
  lineHeight: 0,

  "& svg": {
    display: "block",
  },
};

const titleSx = {
  mt: 0.05,
  fontSize: "12.3px",
  lineHeight: "16px",
  color: "var(--app-color-text)",
};

const descriptionSx = {
  mt: 0.25,
  fontSize: "11.4px",
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const dividerSx = {
  my: 1.2,
  width: "100%",
  height: "1px",
  bgcolor: "var(--app-color-border)",
};

const buttonSx = {
  mt: 1.1,
  height: 34,
  fontSize: "11.8px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  color: "var(--app-color-text)",
};

export default OnboardingHelpCard;
