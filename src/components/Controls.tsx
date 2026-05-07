"use client";

import { useBalance } from "@/hooks/useBalance";
import { useGameStore } from "@/stores/game";
import Image from "next/image";
import { useState } from "react";

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
  const betButtonState = BET_BUTTON_STATE[phase];

  function handleQuickAction(action: string) {
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
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
            onClick={() => handleQuickAction(action)}
            className="h-6 rounded-md border border-[#1A1F2E] bg-[#111620] text-xs font-medium text-[#7A8599] transition hover:bg-[#1A1F2E] cursor-pointer"
          >
            {action}
          </button>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#7A8599]">
          Auto cash out
        </span>
        <button
          type="button"
          aria-label="Toggle auto cash out"
          aria-pressed={isAutoCashOutEnabled}
          onClick={() => setIsAutoCashOutEnabled((value) => !value)}
          className={`flex h-6 w-11 items-center rounded-full p-0.5 cursor-pointer transition ${
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

      <button
        type="button"
        className={`mb-4 h-[52px] rounded-[9px] font-semibold cursor-pointer transition disabled:cursor-not-allowed ${betButtonState.className}`}
        disabled={betButtonState.disabled}
      >
        {betButtonState.label}
      </button>

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
