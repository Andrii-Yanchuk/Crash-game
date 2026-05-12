"use client";

import { AutoCashOutToggle } from "./AutoCashOutToggle";
import { BalanceDisplay } from "./BalanceDisplay";
import { BetAmountControl } from "./BetAmountControl";
import { BetSubmitButton } from "./BetSubmitButton";
import { useBetActions } from "@/hooks/useBetActions";
import { useBetForm } from "@/hooks/useBetForm";
import { getBetControlState } from "@/lib/betControlState";
import { useGameStore } from "@/stores/game";
import { useShallow } from "zustand/react/shallow";

interface ControlsProps {
  username: string;
}

export function Controls({ username }: ControlsProps) {
  const { balance, betError, isBetPending, myBet, phase } = useGameStore(
    useShallow((state) => ({
      balance: state.balance,
      betError: state.betError,
      isBetPending: state.isBetPending,
      myBet: state.myBet,
      phase: state.phase,
    })),
  );
  const { cashOut, placeBet } = useBetActions();
  const {
    betButtonClassName,
    betButtonLabel,
    isBetButtonDisabled,
    isBetControlsDisabled,
  } = getBetControlState({ phase, myBet, isBetPending });
  const {
    amount,
    autoCashOutAt,
    handleAmountChange,
    handleQuickAction,
    isAutoCashOutEnabled,
    submitBetAction,
    toggleAutoCashOut,
  } = useBetForm({
    balance,
    cashOut,
    isBetControlsDisabled,
    phase,
    placeBet,
  });

  return (
    <section className="flex flex-col rounded-xl border border-[#1A1F2E] bg-[#0E1119] p-3">
      <BetAmountControl
        amount={amount}
        disabled={isBetControlsDisabled}
        onAmountChange={handleAmountChange}
        onQuickAction={handleQuickAction}
      />

      <AutoCashOutToggle
        autoCashOutAt={autoCashOutAt}
        disabled={isBetControlsDisabled}
        isEnabled={isAutoCashOutEnabled}
        onToggle={toggleAutoCashOut}
      />

      <BetSubmitButton
        className={betButtonClassName}
        disabled={isBetButtonDisabled}
        label={betButtonLabel}
        onClick={submitBetAction}
      />

      {betError ? (
        <p className="mb-3 text-xs font-medium text-red-400">{betError}</p>
      ) : null}

      <BalanceDisplay
        balance={balance}
        username={username}
      />
    </section>
  );
}
