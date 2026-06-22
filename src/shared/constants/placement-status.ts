export const PLACEMENT_STATUS = {
  PENDING: "pending",
  INTERVIEWING: "interviewing",
  OFFERED: "offered",
  PLACED: "placed",
  REJECTED: "rejected",
  UNPLACED: "unplaced",
} as const;

export type PlacementStatus =
  (typeof PLACEMENT_STATUS)[keyof typeof PLACEMENT_STATUS];
