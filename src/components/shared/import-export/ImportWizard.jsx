import React, { useMemo, useState } from "react";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";

import {
  AppDialog,
  AppStepper,
  AppFileUpload,
  AppTable,
  AppAlert,
  AppButton,
  AppLoadingButton,
  AppCard,
  AppBox,
  AppStack,
  AppHeading,
  AppText,
  AppEmptyState,
} from "@/components";

const ImportWizard = ({
  open = false,
  onClose,

  title = "Import Data",
  subtitle = "Upload your file and review the data before importing.",

  steps = [
    {
      label: "Upload File",
      description: "Select CSV or Excel file",
    },
    {
      label: "Preview Data",
      description: "Validate imported records",
    },
    {
      label: "Complete",
      description: "Finish import process",
    },
  ],

  acceptedFileTypes = ".csv,.xlsx,.xls",

  file,
  onFileChange,

  columns = [],
  rows = [],

  loading = false,
  importing = false,

  error,
  successMessage,

  onImport,
  onBack,

  importButtonText = "Import Data",
  nextButtonText = "Next",
  backButtonText = "Back",

  maxWidth = "lg",

  sx = {},
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const hasRows = rows?.length > 0;

  const isLastStep = activeStep === steps.length - 1;

  const canGoNext = useMemo(() => {
    if (activeStep === 0) return !!file;
    if (activeStep === 1) return hasRows;
    return false;
  }, [activeStep, file, hasRows]);

  const handleNext = () => {
    if (isLastStep) return;

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      onBack?.();
      return;
    }

    setActiveStep((prev) => prev - 1);
  };

  const handleImport = async () => {
    await onImport?.();
    setActiveStep(2);
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <AppStack spacing={2}>
          {error ? (
            <AppAlert severity="error" variant="soft">
              {error}
            </AppAlert>
          ) : null}

          <AppCard bordered rounded="lg" padding="lg" variant="soft">
            <AppStack spacing={2}>
              <AppBox>
                <AppHeading level={6}>Upload Import File</AppHeading>

                <AppText
                  sx={{
                    mt: 0.5,
                    color: "var(--color-text-muted)",
                  }}
                >
                  Supported formats: CSV, XLSX
                </AppText>
              </AppBox>

              <AppFileUpload
                value={file}
                onChange={onFileChange}
                accept={acceptedFileTypes}
                fullWidth
                loading={loading}
                helperText="Make sure your file follows the required template format."
              />
            </AppStack>
          </AppCard>
        </AppStack>
      );
    }

    if (activeStep === 1) {
      return (
        <AppStack spacing={2}>
          <AppAlert severity="info" variant="soft">
            Review the imported records before confirming.
          </AppAlert>

          {hasRows ? (
            <AppTable
              columns={columns}
              rows={rows}
              bordered
              rounded
              stickyHeader
              maxHeight={420}
            />
          ) : (
            <AppEmptyState
              icon={<DescriptionRoundedIcon fontSize="inherit" />}
              title="No preview data available"
              description="Upload a valid file to preview imported records."
              size="medium"
            />
          )}
        </AppStack>
      );
    }

    return (
      <AppStack
        spacing={2}
        align="center"
        justify="center"
        sx={{
          py: 4,
        }}
      >
        <DoneAllRoundedIcon
          sx={{
            fontSize: 68,
            color: "var(--color-success)",
          }}
        />

        <AppHeading level={5}>Import Completed</AppHeading>

        <AppText
          align="center"
          sx={{
            maxWidth: 480,
            color: "var(--color-text-muted)",
          }}
        >
          {successMessage ||
            "Your data has been successfully imported into the system."}
        </AppText>
      </AppStack>
    );
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      maxWidth={maxWidth}
      fullWidth
      showActions={false}
      paperSx={{
        ...sx,
      }}
    >
      <AppStack spacing={3}>
        <AppStepper steps={steps} activeStep={activeStep} />

        {renderStepContent()}

        {!isLastStep && (
          <AppStack
            direction="row"
            justify="space-between"
            align="center"
            sx={{
              pt: 1,
            }}
          >
            <AppButton
              variant="outlined"
              colorVariant="dark"
              onClick={handleBack}
              disabled={importing}
            >
              {backButtonText}
            </AppButton>

            <AppStack direction="row" spacing={1.25}>
              {activeStep === 1 ? (
                <AppLoadingButton
                  variant="contained"
                  colorVariant="primary"
                  loading={importing}
                  loadingText="Importing..."
                  startIcon={<UploadFileRoundedIcon />}
                  onClick={handleImport}
                >
                  {importButtonText}
                </AppLoadingButton>
              ) : (
                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  onClick={handleNext}
                  disabled={!canGoNext}
                >
                  {nextButtonText}
                </AppButton>
              )}
            </AppStack>
          </AppStack>
        )}

        {isLastStep && (
          <AppStack direction="row" justify="flex-end">
            <AppButton
              variant="contained"
              colorVariant="success"
              onClick={onClose}
            >
              Done
            </AppButton>
          </AppStack>
        )}
      </AppStack>
    </AppDialog>
  );
};

export default ImportWizard;
