// src/features/onboarding/pages/desktop/CreateWorkspaceDesktopPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCloud,
  FiInfo,
  FiLock,
  FiUsers,
} from "react-icons/fi";

import { ROUTES } from "@/constants";
import {
  AppBox,
  AppButton,
  AppCard,
  AppHeading,
  AppInput,
  AppStack,
  AppText,
} from "@/components";

const CreateWorkspaceDesktopPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    workspaceName: "",
    workspaceSlug: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "workspaceSlug"
          ? value.toLowerCase().replace(/[^a-z0-9-]/g, "")
          : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = {};

    if (!formData.workspaceName.trim()) {
      errors.workspaceName = "Workspace name is required";
    }

    if (
      formData.workspaceSlug &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.workspaceSlug)
    ) {
      errors.workspaceSlug = "Use lowercase letters, numbers and hyphens only";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    navigate(ROUTES.CHOOSE_PLAN);
  };

  return (
    <section className="relative -mx-6 -my-8 overflow-hidden lg:-mx-6">
      <div className="grid min-h-[calc(100vh-58px)] lg:grid-cols-[0.42fr_0.58fr]">
        <AppBox sx={leftColumnSx}>
          <div className="mx-auto mb-6 flex h-[170px] max-w-[320px] items-end justify-center rounded-2xl border border-border bg-surface/50 shadow-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-20 w-24 items-center justify-center rounded-xl border border-border bg-surface shadow-sm">
                <FiBriefcase className="text-[42px] text-primary" />
              </div>

              <div className="mx-auto mt-2 w-24 rounded bg-primary px-3 py-1 text-[11px] font-bold text-primary-contrast">
                PHARMACY
              </div>
            </div>
          </div>

          <AppHeading level={1} weight={750} sx={heroTitleSx}>
            Create Your <span className="text-primary">Workspace</span>
          </AppHeading>

          <AppText variant="body2" sx={heroTextSx}>
            A workspace is your business space in PharmaERP. Create companies,
            branches and manage all operations inside it.
          </AppText>

          <AppStack direction="column" gap={1.5} sx={{ mt: 3 }}>
            <InfoItem
              icon={<FiUsers />}
              text="All companies, branches, staff and data live inside this workspace"
            />
            <InfoItem
              icon={<FiLock />}
              text="Secure, isolated and private to your organization"
            />
            <InfoItem
              icon={<FiCloud />}
              text="Upgrade or change your plan anytime later"
            />
          </AppStack>
        </AppBox>

        <AppBox sx={rightColumnSx}>
          <AppCard
            variant="default"
            rounded="xl"
            bordered
            shadow="md"
            padding="none"
            sx={cardSx}
          >
            <AppBox component="form" onSubmit={handleSubmit}>
              <AppStack direction="row" align="center" gap={1.5}>
                <IconBox icon={<FiBriefcase />} />

                <AppBox>
                  <AppHeading level={2} weight={750} sx={titleSx}>
                    Create Workspace
                  </AppHeading>

                  <AppText variant="body2" sx={subtitleSx}>
                    Set up your pharmacy business workspace.
                  </AppText>
                </AppBox>
              </AppStack>

              <AppStack direction="column" gap={1.7} sx={{ mt: 3 }}>
                <AppInput
                  label="Workspace Name"
                  name="workspaceName"
                  value={formData.workspaceName}
                  onChange={handleChange}
                  placeholder="Enter workspace name"
                  fullWidth
                  required
                  size="medium"
                  variant="bordered"
                  rounded="md"
                  error={Boolean(formErrors.workspaceName)}
                  helperText={
                    formErrors.workspaceName ||
                    "You can use any name. You can change it later."
                  }
                  labelSx={labelSx}
                  inputSx={inputSx}
                />

                <AppCard
                  variant="soft"
                  rounded="lg"
                  bordered
                  padding="none"
                  sx={helpCardSx}
                >
                  <AppStack direction="row" align="flex-start" gap={1.5}>
                    <IconBox icon={<FiInfo />} small />

                    <AppBox>
                      <AppHeading level={3} weight={700} sx={helpTitleSx}>
                        What is a Workspace?
                      </AppHeading>

                      <AppText variant="body2" sx={helpTextSx}>
                        A workspace is a container for your business. Under this
                        workspace, you can create companies, branches, users and
                        manage everything.
                      </AppText>
                    </AppBox>
                  </AppStack>
                </AppCard>

                <AppInput
                  label="Workspace Slug"
                  name="workspaceSlug"
                  value={formData.workspaceSlug}
                  onChange={handleChange}
                  placeholder="your-workspace-slug"
                  fullWidth
                  size="medium"
                  variant="bordered"
                  rounded="md"
                  prefix="pharmaerp.com/ws/"
                  error={Boolean(formErrors.workspaceSlug)}
                  helperText={
                    formErrors.workspaceSlug ||
                    "Optional. Only letters, numbers and hyphens allowed."
                  }
                  labelSx={labelSx}
                  inputSx={inputSx}
                />
              </AppStack>

              <AppBox sx={dividerSx} />

              <AppStack direction="row" align="center" justify="space-between">
                <AppButton
                  type="button"
                  variant="outlined"
                  colorVariant="neutral"
                  rounded="md"
                  startIcon={<FiArrowLeft />}
                  onClick={() => navigate(-1)}
                  sx={backButtonSx}
                >
                  Back
                </AppButton>

                <AppButton
                  type="submit"
                  variant="contained"
                  colorVariant="primary"
                  rounded="md"
                  endIcon={<FiArrowRight />}
                  sx={continueButtonSx}
                >
                  Continue
                </AppButton>
              </AppStack>
            </AppBox>
          </AppCard>
        </AppBox>
      </div>
    </section>
  );
};

const InfoItem = ({ icon, text }) => (
  <AppStack direction="row" align="center" gap={1.3}>
    <IconBox icon={icon} small />

    <AppText
      variant="body2"
      sx={{
        fontSize: "13px",
        lineHeight: "21px",
        color: "var(--app-color-text)",
      }}
    >
      {text}
    </AppText>
  </AppStack>
);

const IconBox = ({ icon, small = false }) => (
  <AppBox
    display="flex"
    alignItems="center"
    justifyContent="center"
    sx={{
      width: small ? 38 : 48,
      height: small ? 38 : 48,
      minWidth: small ? 38 : 48,
      borderRadius: small ? "12px" : "14px",
      bgcolor: "var(--app-color-primary-soft)",
      color: "var(--app-color-primary)",
      fontSize: small ? "20px" : "25px",
      lineHeight: 0,
    }}
  >
    {icon}
  </AppBox>
);

const leftColumnSx = {
  position: "relative",
  display: "flex",
  minHeight: "calc(100vh - 58px)",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  px: { xs: 4, lg: 6 },
  py: 5,
  bgcolor:
    "color-mix(in srgb, var(--app-color-primary) 5%, var(--app-color-bg))",
  borderRight: "1px solid var(--app-color-border)",
};

const rightColumnSx = {
  display: "flex",
  minHeight: "calc(100vh - 58px)",
  alignItems: "center",
  justifyContent: "center",
  px: { xs: 4, lg: 7 },
  py: 5,
  bgcolor: "var(--app-color-bg)",
};

const heroTitleSx = {
  m: 0,
  textAlign: "center",
  fontSize: { xs: "28px", lg: "34px" },
  lineHeight: 1.12,
  letterSpacing: "-0.7px",
  color: "var(--app-color-text)",
};

const heroTextSx = {
  mx: "auto",
  mt: 1.2,
  maxWidth: 380,
  textAlign: "center",
  fontSize: "13.5px",
  lineHeight: "23px",
  color: "var(--app-color-text-muted)",
};

const cardSx = {
  width: "100%",
  maxWidth: 720,
  px: { xs: 3, lg: 3.5 },
  py: { xs: 3, lg: 3.2 },
  bgcolor: "var(--app-color-surface)",
  borderColor: "var(--app-color-border)",
  boxShadow: "var(--app-shadow-md)",
};

const titleSx = {
  m: 0,
  fontSize: { xs: "24px", lg: "28px" },
  letterSpacing: "-0.5px",
  color: "var(--app-color-text)",
};

const subtitleSx = {
  mt: 0.45,
  fontSize: "13px",
  color: "var(--app-color-text-muted)",
};

const labelSx = {
  mb: 0.45,
  fontSize: "12.5px",
  fontWeight: 650,
  color: "var(--app-color-text)",
};

const inputSx = {
  height: 42,
  fontSize: "13.5px",
  bgcolor: "var(--app-color-surface-alt)",
};

const helpCardSx = {
  px: 2,
  py: 1.7,
  bgcolor: "var(--app-color-primary-soft)",
  borderColor: "var(--app-color-border)",
};

const helpTitleSx = {
  m: 0,
  fontSize: "14px",
  color: "var(--app-color-text)",
};

const helpTextSx = {
  mt: 0.5,
  fontSize: "12.8px",
  lineHeight: "21px",
  color: "var(--app-color-text-muted)",
};

const dividerSx = {
  mt: 2.5,
  mb: 1.8,
  height: 1,
  bgcolor: "var(--app-color-border)",
};

const backButtonSx = {
  height: 42,
  px: 2.2,
  fontSize: "13.5px",
  fontWeight: 650,
  bgcolor: "var(--app-color-surface-alt)",
};

const continueButtonSx = {
  height: 42,
  px: 3.2,
  fontSize: "14px",
  fontWeight: 700,
  boxShadow: "var(--app-shadow-sm)",
};

export default CreateWorkspaceDesktopPage;
