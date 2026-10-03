import React from "react";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";

import {
  AppCard,
  AppStack,
  AppGrid,
  AppBox,
  AppHeading,
  AppText,
  AppCaption,
  AppBadge,
  AppEmptyState,
  AppInlineLoader,
} from "@/components";

const ChangeHistory = ({
  title = "Change History",
  description,

  changes = [],

  loading = false,
  loadingText = "Loading changes...",

  emptyTitle = "No changes found",
  emptyDescription = "Field-level changes will appear here.",

  showHeader = true,
  showCount = true,

  compact = false,

  sx = {},
}) => {
  const hasChanges = changes.length > 0;

  return (
    <AppCard
      variant="default"
      padding="lg"
      rounded="xl"
      shadow="none"
      bordered
      sx={sx}
    >
      <AppStack spacing={2}>
        {showHeader && (
          <AppStack
            direction="row"
            align="flex-start"
            justify="space-between"
            spacing={2}
          >
            <AppBox sx={{ minWidth: 0 }}>
              <AppHeading level={6}>{title}</AppHeading>

              {description && (
                <AppText color="var(--color-text-muted)" sx={{ mt: 0.4 }}>
                  {description}
                </AppText>
              )}
            </AppBox>

            {showCount && (
              <AppBadge
                label={`${changes.length} change${changes.length === 1 ? "" : "s"}`}
                size="small"
                variant="soft"
                colorVariant="primary"
              />
            )}
          </AppStack>
        )}

        {loading && (
          <AppBox
            bordered
            rounded
            sx={{
              py: 4,
              backgroundColor: "var(--color-surface-alt)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppInlineLoader text={loadingText} />
          </AppBox>
        )}

        {!loading && !hasChanges && (
          <AppEmptyState
            title={emptyTitle}
            description={emptyDescription}
            icon={<CompareArrowsRoundedIcon />}
            size="medium"
            fullHeight={false}
            sx={{
              minHeight: 220,
              border: "1px dashed var(--color-border)",
              borderRadius: "16px",
              backgroundColor: "var(--color-surface-alt)",
            }}
          />
        )}

        {!loading && hasChanges && (
          <AppStack spacing={1.2}>
            {changes.map((change, index) => (
              <AppBox
                key={change.id || index}
                bordered
                rounded
                sx={{
                  p: compact ? 1.25 : 1.6,
                  backgroundColor: "var(--color-surface-alt)",
                }}
              >
                <AppStack spacing={1}>
                  <AppStack
                    direction="row"
                    align="center"
                    justify="space-between"
                    spacing={1}
                  >
                    <AppText weight={800}>{change.field || "Field"}</AppText>

                    {change.type && (
                      <AppBadge
                        label={change.type}
                        size="small"
                        variant="soft"
                        colorVariant={
                          change.type === "added"
                            ? "success"
                            : change.type === "removed"
                              ? "error"
                              : "info"
                        }
                      />
                    )}
                  </AppStack>

                  <AppGrid xs={1} md={2} gap={1.2}>
                    <ChangeValue
                      label="Old Value"
                      value={change.oldValue}
                      emptyLabel="Empty"
                      variant="old"
                    />

                    <ChangeValue
                      label="New Value"
                      value={change.newValue}
                      emptyLabel="Empty"
                      variant="new"
                    />
                  </AppGrid>

                  {(change.user || change.time) && (
                    <AppStack direction="row" spacing={1} wrap="wrap">
                      {change.user && (
                        <AppCaption>
                          By <strong>{change.user}</strong>
                        </AppCaption>
                      )}

                      {change.time && <AppCaption>{change.time}</AppCaption>}
                    </AppStack>
                  )}
                </AppStack>
              </AppBox>
            ))}
          </AppStack>
        )}
      </AppStack>
    </AppCard>
  );
};

const ChangeValue = ({ label, value, emptyLabel, variant }) => {
  const isEmpty = value === undefined || value === null || value === "";

  return (
    <AppBox
      bordered
      rounded
      sx={{
        p: 1.2,
        backgroundColor:
          variant === "old"
            ? "var(--color-error-soft)"
            : "var(--color-success-soft)",
        borderColor:
          variant === "old"
            ? "var(--color-error-soft)"
            : "var(--color-success-soft)",
      }}
    >
      <AppCaption>{label}</AppCaption>

      <AppText
        weight={700}
        sx={{
          mt: 0.35,
          fontSize: "0.84rem",
          wordBreak: "break-word",
        }}
      >
        {isEmpty ? emptyLabel : String(value)}
      </AppText>
    </AppBox>
  );
};

export default ChangeHistory;
