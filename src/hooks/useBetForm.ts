import {
  DEFAULT_AUTO_CASH_OUT_AT,
  DEFAULT_BET_AMOUNT,
} from "@/config/bet";
import type { QuickBetAction } from "@/config/bet";
import type { PlaceBetInput } from "@/hooks/useBetActions";
import type { RoundPhase } from "@/types/type";
import { useState } from "react";

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
  const [amount, setAmount] = useState(DEFAULT_BET_AMOUNT);
  const [isAutoCashOutEnabled, setIsAutoCashOutEnabled] = useState(false);

  function handleAmountChange(nextAmount: number) {
    setAmount(nextAmount);
  }

  function handleQuickAction(action: QuickBetAction) {
    if (isBetControlsDisabled) {
      return;
    }

    if (action === "half") {
      setAmount((currentAmount) => currentAmount / 2);
      return;
    }

    if (action === "double") {
      setAmount((currentAmount) => currentAmount * 2);
      return;
    }

    if (typeof balance === "number") {
      setAmount(balance);
    }
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
      amount,
      autoCashOutAt: isAutoCashOutEnabled ? DEFAULT_AUTO_CASH_OUT_AT : null,
    });
  }

  return {
    amount,
    autoCashOutAt: DEFAULT_AUTO_CASH_OUT_AT,
    handleAmountChange,
    handleQuickAction,
    isAutoCashOutEnabled,
    submitBetAction,
    toggleAutoCashOut,
  };
}
