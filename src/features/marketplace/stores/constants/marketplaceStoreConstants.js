// src/features/marketplace/stores/constants/marketplaceStoreConstants.js

export const MARKETPLACE_STORE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  CLOSED: "CLOSED",
};

export const MARKETPLACE_STORE_ONLINE_STATUS = {
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE",
  BUSY: "BUSY",
  PAUSED: "PAUSED",
};

export const MARKETPLACE_STORE_VERIFICATION_STATUS = {
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const MARKETPLACE_STORE_ONBOARDING_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
};

export const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export const DEFAULT_WORKING_HOURS = DAYS_OF_WEEK.reduce((acc, day) => {
  acc[day.key] = {
    isOpen: true,
    openTime: "09:00",
    closeTime: "21:00",
  };
  return acc;
}, {});
