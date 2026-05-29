export const DEFAULT_BET_AMOUNT = 10;
export const MAX_BET_AMOUNT = 10000;
export const DEFAULT_AUTO_CASH_OUT_AT = 2;
export const MIN_AUTO_CASH_OUT_AT = 1.01;
export const MAX_AUTO_CASH_OUT_AT = 100;

export const QUICK_BET_ACTIONS = [
  { id: "half", label: "1/2" },
  { id: "double", label: "x2" },
  { id: "max", label: "Max" },
] as const;

export type QuickBetAction = (typeof QUICK_BET_ACTIONS)[number]["id"];
