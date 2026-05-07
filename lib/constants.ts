export const ROLES = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER"
} as const;

export const STATUSES = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED"
} as const;

export const PRIORITIES = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH"
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Status = (typeof STATUSES)[keyof typeof STATUSES];
export type Priority = (typeof PRIORITIES)[keyof typeof PRIORITIES];

export const STATUS_OPTIONS = Object.values(STATUSES);
export const PRIORITY_OPTIONS = Object.values(PRIORITIES);
