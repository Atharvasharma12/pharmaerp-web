// src/features/onboarding/pages/mobile/CreateWorkspaceMobilePage.jsx

import {
  FiArrowRight,
  FiBriefcase,
  FiCloud,
  FiInfo,
  FiLock,
  FiRefreshCcw,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppStack,
  AppText,
} from "@/components";

const CreateWorkspaceMobilePage = ({
  formData,
  formErrors = {},
  workspaceTypes = [],
  isLoading = false,
  handleChange,
  handleSubmit,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--app-color-primary)_7%,transparent),transparent_34%)]" />

      <AppBox sx={sectionSx}>
        <AppHeading level={1} weight={750} align="center" sx={titleSx}>
          Create Your Workspace
        </AppHeading>

        <AppBox component="form" onSubmit={handleSubmit} sx={{ mt: 2.4 }}>
          <AppStack direction="column" gap={1.65}>
            <AppInput
              label="Workspace Name"
              name="workspaceName"
              value={formData.workspaceName || ""}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter workspace name"
              fullWidth
              required
              size="small"
              variant="bordered"
              rounded="md"
              startIcon={<FiBriefcase />}
              error={Boolean(formErrors.workspaceName)}
              helperText={
                formErrors.workspaceName ||
                "You can use any name for your workspace. You can change it later."
              }
              labelSx={labelSx}
              inputSx={inputSx}
              helperTextSx={helperTextSx}
            />

            <AppInput
              label="Workspace Type"
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              disabled={isLoading}
              fullWidth
              required
              select
              size="small"
              variant="bordered"
              rounded="md"
              error={Boolean(formErrors.type)}
              helperText={
                formErrors.type || "Select the type of business workspace."
              }
              labelSx={labelSx}
              inputSx={inputSx}
              helperTextSx={helperTextSx}
            >
              {workspaceTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </AppInput>

            {formErrors.submit ? (
              <AppText variant="body2" sx={submitErrorSx}>
                {formErrors.submit}
              </AppText>
            ) : null}

            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="sm"
              padding="none"
              sx={infoCardSx}
            >
              <AppStack direction="row" align="center" gap={1.25}>
                <AppBox sx={infoIconSx}>
                  <FiInfo />
                </AppBox>

                <AppBox sx={{ minWidth: 0 }}>
                  <AppHeading level={3} weight={700} sx={infoTitleSx}>
                    What is a Workspace?
                  </AppHeading>

                  <AppText variant="body2" weight={500} sx={infoTextSx}>
                    Workspace is a container for your business. Under this
                    workspace, you can create companies, branches, users and
                    manage everything.
                  </AppText>
                </AppBox>
              </AppStack>
            </AppCard>

            <AppCard
              variant="default"
              rounded="xl"
              bordered
              shadow="sm"
              padding="none"
              sx={featuresCardSx}
            >
              {workspaceFeatures.map((item, index) => (
                <FeatureRow
                  key={item.title}
                  {...item}
                  bordered={index !== workspaceFeatures.length - 1}
                />
              ))}
            </AppCard>

            <AppButton
              type="submit"
              variant="contained"
              colorVariant="primary"
              rounded="md"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              endIcon={<FiArrowRight />}
              sx={continueButtonSx}
            >
              Complete Onboarding
            </AppButton>
          </AppStack>
        </AppBox>

        <AppStack
          direction="row"
          align="center"
          justify="center"
          gap={0.6}
          sx={footerSx}
        >
          <FiLock className="text-[12px] text-primary" />

          <AppText variant="body2" weight={600} sx={footerTextSx}>
            Your data is secure and encrypted
          </AppText>
        </AppStack>
      </AppBox>
    </section>
  );
};

const FeatureRow = ({ icon, title, desc, bordered }) => (
  <div
    className={[
      "flex items-center gap-2.5 px-3 py-2.5",
      bordered ? "border-b border-border" : "",
    ].join(" ")}
  >
    <AppBox sx={featureIconSx}>{icon}</AppBox>

    <div className="min-w-0 flex-1">
      <AppHeading level={3} weight={700} sx={featureTitleSx}>
        {title}
      </AppHeading>

      <AppText variant="body2" weight={500} sx={featureDescSx}>
        {desc}
      </AppText>
    </div>
  </div>
);

const workspaceFeatures = [
  {
    icon: <FiShield />,
    title: "Secure Workspace",
    desc: "Your data is 100% safe and encrypted",
  },
  {
    icon: <FiCloud />,
    title: "Cloud Based",
    desc: "Access your business anytime, anywhere",
  },
  {
    icon: <FiUsers />,
    title: "Multi User",
    desc: "Invite team members & manage roles",
  },
  {
    icon: <FiRefreshCcw />,
    title: "Auto Backup",
    desc: "Daily backup & data protection",
  },
];

const sectionSx = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  maxWidth: { xs: 390, sm: 430, md: 460 },
  mx: "auto",
  px: 0,
  pt: 0,
  pb: 0,
};

const titleSx = {
  m: 0,
  fontSize: { xs: "23px", sm: "25px" },
  lineHeight: 1.14,
  letterSpacing: "-0.55px",
  color: "var(--app-color-text)",
};

const labelSx = {
  mb: 0.45,
  fontSize: "12.4px",
  fontWeight: 700,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 43,
  fontSize: "12.5px",
  bgcolor: "var(--app-color-surface)",
  color: "var(--app-color-text)",
};

const helperTextSx = {
  mt: 0.5,
  fontSize: "10.8px",
  fontWeight: 500,
  lineHeight: "16px",
  color: "var(--app-color-text-muted)",
};

const submitErrorSx = {
  mt: -0.45,
  fontSize: "11.3px",
  fontWeight: 650,
  lineHeight: "17px",
  color: "var(--app-color-error)",
};

const infoCardSx = {
  mt: 0.2,
  px: 1.15,
  py: 1.15,
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-primary-soft)",
};

const infoIconSx = {
  width: 38,
  height: 38,
  minWidth: 38,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "20px",
};

const infoTitleSx = {
  m: 0,
  fontSize: "13px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const infoTextSx = {
  mt: 0.45,
  fontSize: "11.2px",
  lineHeight: "17px",
  color: "var(--app-color-text-muted)",
};

const featuresCardSx = {
  mt: 0.2,
  overflow: "hidden",
  bgcolor: "var(--app-color-readonly-bg)",
  borderColor: "var(--app-color-primary-soft)",
};

const featureIconSx = {
  width: 40,
  height: 40,
  minWidth: 40,
  borderRadius: "999px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "var(--app-color-primary-soft)",
  color: "var(--app-color-primary)",
  fontSize: "21px",
};

const featureTitleSx = {
  m: 0,
  fontSize: "12.4px",
  lineHeight: 1.15,
  color: "var(--app-color-text)",
};

const featureDescSx = {
  mt: 0.35,
  fontSize: "10.8px",
  lineHeight: "15.5px",
  color: "var(--app-color-text-muted)",
};

const continueButtonSx = {
  mt: 0.35,
  height: 45,
  fontSize: "14px",
  fontWeight: 750,
  boxShadow: "var(--app-shadow-sm)",
  "& .MuiButton-endIcon": {
    ml: "8px",
    fontSize: "17px",
  },
};

const footerSx = {
  mt: 1.55,
  width: "100%",
  textAlign: "center",
};

const footerTextSx = {
  fontSize: "11.2px",
  color: "var(--app-color-text-muted)",
};

export default CreateWorkspaceMobilePage;
