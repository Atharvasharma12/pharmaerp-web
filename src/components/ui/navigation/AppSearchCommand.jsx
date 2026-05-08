import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Box,
  Dialog,
  DialogContent,
  Fade,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardCommandKeyRoundedIcon from "@mui/icons-material/KeyboardCommandKeyRounded";
import SubdirectoryArrowRightRoundedIcon from "@mui/icons-material/SubdirectoryArrowRightRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

const defaultFilter = (item, query) => {
  if (!query) return true;

  const source = [
    item.label,
    item.description,
    ...(Array.isArray(item.keywords) ? item.keywords : []),
    item.group,
  ]
    .filter(Boolean)
    .join(" ");

  return normalize(source).includes(normalize(query));
};

const groupItems = (items) => {
  return items.reduce((acc, item) => {
    const group = item.group || "Commands";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
};

const getShortcutLabel = () => {
  if (typeof navigator === "undefined") return "Ctrl K";
  const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
  return isMac ? "⌘ K" : "Ctrl K";
};

const isTypingTarget = (target) => {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName;
  return (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    target.isContentEditable
  );
};

const ShortcutPill = ({ children, tokens }) => (
  <Box
    component="span"
    sx={{
      minWidth: 24,
      px: 0.75,
      py: 0.25,
      borderRadius: "8px",
      border: `1px solid ${tokens.border}`,
      backgroundColor: tokens.surfaceAlt,
      color: tokens.textMuted,
      fontSize: "0.72rem",
      fontWeight: 700,
      lineHeight: 1.2,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </Box>
);

const AppSearchCommand = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  items = [],
  title = "Search commands",
  placeholder = "Search pages, actions, shortcuts...",
  emptyText = "No results found.",
  shortcutLabel,
  showShortcutHint = true,
  closeOnSelect = true,
  disableAutoFocus = false,
  maxHeight = 420,
  width = 720,
  filterFn = defaultFilter,
  initialQuery = "",
  showGroups = true,
  loopNavigation = true,
  sx = {},
  dialogProps = {},
  contentSx = {},
  inputProps = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const isControlled = typeof controlledOpen === "boolean";
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const [query, setQuery] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  const resolvedShortcutLabel = shortcutLabel || getShortcutLabel();

  const setOpenState = useCallback(
    (next) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const handleClose = useCallback(() => {
    setOpenState(false);
  }, [setOpenState]);

  const handleOpen = useCallback(() => {
    setOpenState(true);
  }, [setOpenState]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => filterFn(item, query));
  }, [items, query, filterFn]);

  const groupedEntries = useMemo(() => {
    if (!showGroups) return { Results: filteredItems };
    return groupItems(filteredItems);
  }, [filteredItems, showGroups]);

  const flatItems = useMemo(() => {
    return Object.values(groupedEntries).flat();
  }, [groupedEntries]);

  useEffect(() => {
    if (!open) return;

    if (!flatItems.length) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((prev) => Math.min(prev, flatItems.length - 1));
  }, [open, flatItems.length]);

  useEffect(() => {
    if (!open || disableAutoFocus) return;

    const id = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);

    return () => window.clearTimeout(id);
  }, [open, disableAutoFocus]);

  useEffect(() => {
    if (!open) {
      setQuery(initialQuery);
      setActiveIndex(0);
    }
  }, [open, initialQuery]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const metaOrCtrl = event.metaKey || event.ctrlKey;
      const typing = isTypingTarget(event.target);

      if (metaOrCtrl && key === "k") {
        event.preventDefault();
        event.stopPropagation();
        setOpenState(!open);
        return;
      }

      if (!open) return;

      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (typing && !["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!flatItems.length) return;

        setActiveIndex((prev) => {
          const next = prev + 1;
          if (next >= flatItems.length) {
            return loopNavigation ? 0 : flatItems.length - 1;
          }
          return next;
        });
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!flatItems.length) return;

        setActiveIndex((prev) => {
          const next = prev - 1;
          if (next < 0) {
            return loopNavigation ? flatItems.length - 1 : 0;
          }
          return next;
        });
        return;
      }

      if (event.key === "Enter") {
        const selected = flatItems[activeIndex];
        if (!selected || selected.disabled) return;

        event.preventDefault();
        selected.onSelect?.(selected);

        if (closeOnSelect) {
          handleClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    open,
    flatItems,
    activeIndex,
    closeOnSelect,
    loopNavigation,
    handleClose,
    setOpenState,
  ]);

  const handleSelect = (item) => {
    if (item.disabled) return;
    item.onSelect?.(item);

    if (closeOnSelect) {
      handleClose();
    }
  };

  let runningIndex = -1;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={false}
      disableEscapeKeyDown={false}
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: width,
          borderRadius: "18px",
          border: `1px solid ${t.border}`,
          backgroundColor: t.surface,
          color: t.text,
          boxShadow: t.shadowXl,
          backgroundImage: "none",
          overflow: "hidden",
          ...sx,
        },
      }}
      {...dialogProps}
    >
      <DialogContent
        sx={{
          p: 0,
          backgroundColor: t.surface,
          color: t.text,
          ...contentSx,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${t.border}`,
            backgroundColor: t.surface,
          }}
        >
          <SearchRoundedIcon
            sx={{
              color: t.textMuted,
              fontSize: 20,
              flexShrink: 0,
            }}
          />

          <InputBase
            inputRef={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={placeholder}
            fullWidth
            sx={{
              color: t.text,
              fontSize: "0.95rem",
              fontWeight: 500,
              "& input::placeholder": {
                color: t.textMuted,
                opacity: 1,
              },
            }}
            {...inputProps}
          />

          {showShortcutHint && !query && (
            <ShortcutPill tokens={t}>{resolvedShortcutLabel}</ShortcutPill>
          )}

          <IconButton
            type="button"
            aria-label="Close search command"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleClose();
            }}
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              color: t.textMuted,
              backgroundColor: "transparent",
              border: `1px solid transparent`,
              transition:
                "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease",
              "&:hover": {
                backgroundColor: t.surfaceHover,
                borderColor: t.border,
                color: t.text,
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow: t.focusRing,
              },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            backgroundColor: t.surfaceAlt,
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <Typography
            sx={{
              color: t.text,
              fontSize: "0.86rem",
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              color: t.textMuted,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <KeyboardCommandKeyRoundedIcon sx={{ fontSize: 15 }} />
            <span>Use ↑ ↓ to navigate</span>
          </Box>
        </Box>

        <Box
          sx={{
            maxHeight,
            overflowY: "auto",
            backgroundColor: t.surface,
          }}
        >
          {flatItems.length === 0 ? (
            <Box
              sx={{
                px: 2,
                py: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                color: t.textMuted,
              }}
            >
              <SearchRoundedIcon sx={{ fontSize: 28, opacity: 0.7 }} />
              <Typography
                sx={{
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: t.textMuted,
                }}
              >
                {emptyText}
              </Typography>
            </Box>
          ) : (
            Object.entries(groupedEntries).map(
              ([groupName, groupItems], groupIdx) => (
                <Box key={groupName}>
                  {showGroups && (
                    <Box
                      sx={{
                        px: 2,
                        py: 1,
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        backgroundColor: t.surface,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: t.textMuted,
                        }}
                      >
                        {groupName}
                      </Typography>
                    </Box>
                  )}

                  <List disablePadding sx={{ px: 1.25, pb: 1 }}>
                    {groupItems.map((item) => {
                      runningIndex += 1;
                      const isActive = runningIndex === activeIndex;

                      return (
                        <ListItemButton
                          key={
                            item.key ||
                            `${groupName}-${item.label}-${runningIndex}`
                          }
                          onClick={() => handleSelect(item)}
                          disabled={item.disabled}
                          sx={{
                            mb: 0.5,
                            borderRadius: "12px",
                            border: `1px solid ${
                              isActive
                                ? activeBorder(t, item.color, theme)
                                : "transparent"
                            }`,
                            backgroundColor: isActive
                              ? activeBg(t, item.color, theme)
                              : "transparent",
                            color: t.text,
                            alignItems: "flex-start",
                            gap: 1.25,
                            px: 1.25,
                            py: 1.1,
                            transition:
                              "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease",
                            "&:hover": {
                              backgroundColor: isActive
                                ? activeBg(t, item.color, theme)
                                : t.surfaceHover,
                            },
                            "&.Mui-disabled": {
                              opacity: 1,
                              color: t.disabledText,
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              minWidth: 34,
                              borderRadius: "10px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: isActive
                                ? "rgba(255,255,255,0.18)"
                                : t.surfaceAlt,
                              border: `1px solid ${t.border}`,
                              color: isActive
                                ? activeText(t, item.color, theme)
                                : t.textMuted,
                              mt: 0.125,
                              "& svg": {
                                fontSize: 18,
                              },
                            }}
                          >
                            {item.icon || <SubdirectoryArrowRightRoundedIcon />}
                          </Box>

                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                    color: isActive
                                      ? activeText(t, item.color, theme)
                                      : t.text,
                                  }}
                                >
                                  {item.label}
                                </Typography>

                                {item.shortcut ? (
                                  <ShortcutPill tokens={t}>
                                    {item.shortcut}
                                  </ShortcutPill>
                                ) : null}
                              </Box>
                            }
                            secondary={
                              item.description ? (
                                <Typography
                                  sx={{
                                    mt: 0.35,
                                    fontSize: "0.8rem",
                                    lineHeight: 1.45,
                                    color: isActive
                                      ? activeMutedText(t, item.color, theme)
                                      : t.textMuted,
                                  }}
                                >
                                  {item.description}
                                </Typography>
                              ) : null
                            }
                            sx={{ m: 0 }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>

                  {groupIdx < Object.keys(groupedEntries).length - 1 && (
                    <Divider
                      sx={{
                        borderColor: t.border,
                        mx: 2,
                      }}
                    />
                  )}
                </Box>
              ),
            )
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const activeBg = (t, color, mode) => {
  const map = {
    primary: t.primarySoft,
    success: t.successSoft,
    error: t.errorSoft,
    warning: t.warningSoft,
    info: t.infoSoft,
    dark: mode === "dark" ? t.surfaceHover : t.neutral[100],
    neutral: mode === "dark" ? t.surfaceHover : t.neutral[100],
  };

  return map[color] || t.primarySoft;
};

const activeBorder = (t, color, mode) => {
  const map = {
    primary: t.primary,
    success: t.success,
    error: t.error,
    warning: t.warning,
    info: t.info,
    dark: mode === "dark" ? t.borderStrong : t.neutral[300],
    neutral: mode === "dark" ? t.neutral[400] : t.neutral[300],
  };

  return map[color] || t.primary;
};

const activeText = (t, color, mode) => {
  const map = {
    primary: t.primary,
    success: t.success,
    error: t.error,
    warning: t.warning,
    info: t.info,
    dark: mode === "dark" ? t.text : t.neutral[900],
    neutral: mode === "dark" ? t.text : t.neutral[700],
  };

  return map[color] || t.primary;
};

const activeMutedText = (t, color, mode) => {
  const map = {
    primary: t.primaryHover,
    success: t.successHover,
    error: t.errorHover,
    warning: t.warningHover,
    info: t.infoHover,
    dark: mode === "dark" ? t.textMuted : t.neutral[700],
    neutral: mode === "dark" ? t.textMuted : t.neutral[600],
  };

  return map[color] || t.primaryHover;
};

export default AppSearchCommand;
