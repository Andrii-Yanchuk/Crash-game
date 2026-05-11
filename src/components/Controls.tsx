"use client";

import { useBalance } from "@/hooks/useBalance";
import { socket } from "@/lib/socket";
import { useGameStore } from "@/stores/game";
import Image from "next/image";
import { useState } from "react";
import useSound from "use-sound";

const QUICK_ACTIONS = ["1/2", "x2", "Max"];

const BET_BUTTON_STATE = {
  waiting: {
    label: "Place bet",
    className: "bg-[#FBBF24] text-black",
    disabled: false,
  },
  start: {
    label: "Wait for next round",
    className: "bg-[#4A5568] text-white",
    disabled: true,
  },
  tick: {
    label: "Cash Out",
    className: "bg-[#22C55E] text-black",
    disabled: false,
  },
  crash: {
    label: "Crashed",
    className: "bg-[#EF4444] text-white",
    disabled: true,
  },
} as const;

interface ControlsProps {
  username: string;
}

export function Controls({ username }: ControlsProps) {
  const [amount, setAmount] = useState(10);
  const [isAutoCashOutEnabled, setIsAutoCashOutEnabled] = useState(false);
  const balance = useGameStore((state) => state.balance);
  const {
    error: balanceError,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useBalance(username);
  const phase = useGameStore((state) => state.phase);
  const myBet = useGameStore((state) => state.myBet);
  const isBetPending = useGameStore((state) => state.isBetPending);
  const betError = useGameStore((state) => state.betError);
  const isSoundEnabled = useGameStore((state) => state.isSoundEnabled);
  const setIsBetPending = useGameStore((state) => state.setIsBetPending);
  const setBetError = useGameStore((state) => state.setBetError);
  const [playBetSound] = useSound("/sounds/bet.mp3", {
    soundEnabled: isSoundEnabled,
    volume: 0.6,
  });
  const betButtonState = BET_BUTTON_STATE[phase];
  const hasPlacedBet = phase === "waiting" && Boolean(myBet);
  const canCashOut = phase === "tick" && Boolean(myBet);
  const isWaitingForNextRound = phase === "tick" && !myBet;
  const displayedBetButtonState = isWaitingForNextRound
    ? BET_BUTTON_STATE.start
    : betButtonState;
  const isBetButtonDisabled =
    displayedBetButtonState.disabled ||
    isBetPending ||
    hasPlacedBet ||
    isWaitingForNextRound;
  const isBetControlsDisabled =
    isBetPending || Boolean(myBet) || phase !== "waiting";
  const betButtonLabel = isBetPending
    ? "Loading..."
    : canCashOut
      ? "Cash Out"
      : isWaitingForNextRound
        ? "Wait for next round"
        : hasPlacedBet
          ? `Bet placed - ${myBet?.amount}`
          : displayedBetButtonState.label;

  function handleQuickAction(action: string) {
    if (isBetControlsDisabled) {
      return;
    }

    if (action === "1/2") {
      setAmount(amount / 2);
      return;
    }

    if (action === "x2") {
      setAmount(amount * 2);
      return;
    }

    if (action === "Max" && typeof balance === "number") {
      setAmount(balance);
    }
  }

  function handleBetButtonClick() {
    if (phase === "tick") {
      if (!myBet || isBetPending) {
        return;
      }

      setBetError(null);
      setIsBetPending(true);
      socket.emit("bet:cashout", {});
      return;
    }

    if (phase !== "waiting" || myBet || isBetPending) {
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000) {
      setBetError("Bet amount must be greater than 0 and no more than 10000.");
      return;
    }

    setBetError(null);
    setIsBetPending(true);
    playBetSound();
    socket.emit("bet:place", {
      amount,
      autoCashOutAt: isAutoCashOutEnabled ? 2 : null,
    });
  }

  return (
    <section className="flex flex-col rounded-xl border border-[#1A1F2E] bg-[#0E1119] p-3">
      <label
        htmlFor="bet-amount"
        className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#7A8599]"
      >
        Bet amount
      </label>

      <div className="mb-2 flex h-10 items-center rounded-[9px] border border-[#1A1F2E] bg-[#111620] px-3">
        <input
          id="bet-amount"
          type="number"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.valueAsNumber || 0)}
          disabled={isBetControlsDisabled}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none disabled:cursor-not-allowed disabled:text-[#7A8599] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="ml-3 shrink-0 text-sm font-medium text-[#7A8599]">
          USD
        </span>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            disabled={isBetControlsDisabled}
            onClick={() => handleQuickAction(action)}
            className="h-6 rounded-md border border-[#1A1F2E] bg-[#111620] text-xs font-medium text-[#7A8599] transition hover:bg-[#1A1F2E] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#111620]"
          >
            {action}
          </button>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#7A8599]">
          Auto cash out
        </span>
        <div className="flex items-center gap-3">
          {isAutoCashOutEnabled ? (
            <span className="font-mono text-sm font-semibold text-[#FBBF24]">
              2.00x
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Toggle auto cash out"
            aria-pressed={isAutoCashOutEnabled}
            disabled={isBetControlsDisabled}
            onClick={() => setIsAutoCashOutEnabled((value) => !value)}
            className={`flex h-6 w-11 items-center rounded-full p-0.5 cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isAutoCashOutEnabled ? "bg-[#FBBF24]" : "bg-[#111620]"
            }`}
          >
            <span
              className={`size-5 rounded-full bg-white transition ${
                isAutoCashOutEnabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleBetButtonClick}
        className={`mb-4 h-13 rounded-[9px] font-semibold cursor-pointer transition disabled:cursor-not-allowed ${displayedBetButtonState.className}`}
        disabled={isBetButtonDisabled}
      >
        {betButtonLabel}
      </button>
      {betError ? (
        <p className="mb-3 text-xs font-medium text-red-400">{betError}</p>
      ) : null}

      <div className="flex items-center justify-between border-t border-[#1A1F2E] pt-4">
        <div className="flex items-center gap-2">
          <Image src="/balance-icon.svg" alt="Balance" width={16} height={16} />
          <span className="text-xs font-medium text-[#7A8599]">Balance</span>
        </div>
        <span className="font-mono text-sm font-semibold text-[#FBBF24]">
          {isBalanceLoading
            ? "Loading..."
            : isBalanceError
              ? "Error"
              : (balance ?? 0).toFixed(2)}
        </span>
      </div>
      {balanceError?.message ? (
        <p className="mt-2 text-xs text-red-400">{balanceError.message}</p>
      ) : null}
    </section>
  );
}
