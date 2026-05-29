import {
  DEFAULT_AUTO_CASH_OUT_AT,
  MAX_AUTO_CASH_OUT_AT,
  MIN_AUTO_CASH_OUT_AT,
} from "@/config/bet";

function hasOnlyDigits(value: string) {
  return [...value].every((char) => char >= "0" && char <= "9");
}

export function parseDecimalInput(value: string) {
  const amount = Number(value.replace(",", "."));

  return Number.isFinite(amount) ? amount : 0;
}

export function isValidDecimalInput(value: string, maxDecimalPlaces = 2) {
  const parts = value.replace(",", ".").split(".");

  if (parts.length > 2) {
    return false;
  }

  const [wholePart, decimalPart = ""] = parts;

  return (
    hasOnlyDigits(wholePart) &&
    hasOnlyDigits(decimalPart) &&
    decimalPart.length <= maxDecimalPlaces
  );
}

export function normalizeAutoCashOutAt(autoCashOutAt: number) {
  if (!Number.isFinite(autoCashOutAt)) {
    return DEFAULT_AUTO_CASH_OUT_AT;
  }

  const roundedAutoCashOutAt = Math.round(autoCashOutAt * 100) / 100;

  return Math.min(
    MAX_AUTO_CASH_OUT_AT,
    Math.max(MIN_AUTO_CASH_OUT_AT, roundedAutoCashOutAt),
  );
}
