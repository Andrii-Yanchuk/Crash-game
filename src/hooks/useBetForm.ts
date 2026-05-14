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
import { useRef, useState } from "react";

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
  const [autoCashOutAt, setAutoCashOutAt] = useState(
    String(DEFAULT_AUTO_CASH_OUT_AT),
  );
  const [isAutoCashOutEnabled, setIsAutoCashOutEnabled] = useState(false);

  function handleAmountChange(nextAmount: number) {
    amountRef.current = nextAmount;
  }

  function handleQuickAction(action: QuickBetAction, currentAmount: number) {
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
  }

  function handleAutoCashOutAtChange(nextAutoCashOutAt: string) {
    if (isValidDecimalInput(nextAutoCashOutAt)) {
      setAutoCashOutAt(nextAutoCashOutAt);
    }
  }

  function handleAutoCashOutAtBlur() {
    setAutoCashOutAt((value) =>
      String(normalizeAutoCashOutAt(parseDecimalInput(value))),
    );
  }

  function toggleAutoCashOut() {
    setIsAutoCashOutEnabled((value) => !value);
  }

  function submitBetAction() {
    if (phase === "tick") {
      cashOut();
      return;
    }

    placeBet({
      amount: amountRef.current,
      autoCashOutAt: isAutoCashOutEnabled
        ? normalizeAutoCashOutAt(parseDecimalInput(autoCashOutAt))
        : null,
    });
  }

  return {
    autoCashOutAt,
    defaultAmount: DEFAULT_BET_AMOUNT,
    handleAmountChange,
    handleAutoCashOutAtChange,
    handleAutoCashOutAtBlur,
    handleQuickAction,
    isAutoCashOutEnabled,
    submitBetAction,
    toggleAutoCashOut,
  };
}
