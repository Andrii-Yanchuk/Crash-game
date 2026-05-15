import {
  DEFAULT_AUTO_CASH_OUT_AT,
  DEFAULT_BET_AMOUNT,
} from "@/config/bet";
import type { QuickBetAction } from "@/config/bet";
import type { PlaceBetInput } from "@/hooks/useBetActions";
import {
  isValidDecimalInput,
  normalizeAutoCashOutAt,
  parseDecimalInput,
} from "@/lib/betInput";
import type { RoundPhase } from "@/types/type";
import { useCallback, useRef } from "react";

type UseBetFormInput = {
  balance: number | null;
  phase: RoundPhase;
  isBetControlsDisabled: boolean;
  cashOut: () => void;
  placeBet: (input: PlaceBetInput) => void;
};

export function useBetForm({
  balance,
  phase,
  isBetControlsDisabled,
  cashOut,
  placeBet,
}: UseBetFormInput) {
  const amountRef = useRef(DEFAULT_BET_AMOUNT);
  const autoCashOutAtRef = useRef(String(DEFAULT_AUTO_CASH_OUT_AT));
  const isAutoCashOutEnabledRef = useRef(false);

  const handleAmountChange = useCallback((nextAmount: number) => {
    amountRef.current = nextAmount;
  }, []);

  const handleQuickAction = useCallback(
    (action: QuickBetAction, currentAmount: number) => {
      if (isBetControlsDisabled) {
        return currentAmount;
      }

      const nextAmount =
        action === "half"
          ? currentAmount / 2
          : action === "double"
            ? currentAmount * 2
            : typeof balance === "number"
              ? balance
              : currentAmount;

      amountRef.current = nextAmount;
      return nextAmount;
    },
    [balance, isBetControlsDisabled],
  );

  const handleAutoCashOutAtChange = useCallback(
    (nextAutoCashOutAt: string) => {
      if (!isValidDecimalInput(nextAutoCashOutAt)) {
        return false;
      }

      autoCashOutAtRef.current = nextAutoCashOutAt;
      return true;
    },
    [],
  );

  const handleAutoCashOutAtBlur = useCallback(() => {
    const nextAutoCashOutAt = String(
      normalizeAutoCashOutAt(parseDecimalInput(autoCashOutAtRef.current)),
    );

    autoCashOutAtRef.current = nextAutoCashOutAt;

    return nextAutoCashOutAt;
  }, []);

  const toggleAutoCashOut = useCallback((isEnabled: boolean) => {
    isAutoCashOutEnabledRef.current = isEnabled;
  }, []);

  const submitBetAction = useCallback(() => {
    if (phase === "tick") {
      cashOut();
      return;
    }

    placeBet({
      amount: amountRef.current,
      autoCashOutAt: isAutoCashOutEnabledRef.current
        ? normalizeAutoCashOutAt(parseDecimalInput(autoCashOutAtRef.current))
        : null,
    });
  }, [cashOut, phase, placeBet]);

  return {
    defaultAmount: DEFAULT_BET_AMOUNT,
    handleAmountChange,
    handleAutoCashOutAtChange,
    handleAutoCashOutAtBlur,
    handleQuickAction,
    submitBetAction,
    toggleAutoCashOut,
  };
}
