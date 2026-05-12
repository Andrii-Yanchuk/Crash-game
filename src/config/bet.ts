export const DEFAULT_BET_AMOUNT = 10;
export const MAX_BET_AMOUNT = 10000;
export const DEFAULT_AUTO_CASH_OUT_AT = 2;

export const QUICK_BET_ACTIONS = [
  { id: "half", label: "1/2" },
  { id: "double", label: "x2" },
  { id: "max", label: "Max" },
] as const;

export type QuickBetAction = (typeof QUICK_BET_ACTIONS)[number]["id"];
