import {
  DEFAULT_AUTO_CASH_OUT_AT,
  DEFAULT_BET_AMOUNT,
} from "@/config/bet";
import type { QuickBetAction } from "@/config/bet";
import type { PlaceBetInput } from "@/hooks/useBetActions";
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
      autoCashOutAt: isAutoCashOutEnabled ? DEFAULT_AUTO_CASH_OUT_AT : null,
    });
  }

  return {
    autoCashOutAt: DEFAULT_AUTO_CASH_OUT_AT,
    defaultAmount: DEFAULT_BET_AMOUNT,
    handleAmountChange,
    handleQuickAction,
    isAutoCashOutEnabled,
    submitBetAction,
    toggleAutoCashOut,
  };
}
