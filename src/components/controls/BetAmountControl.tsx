import { QUICK_BET_ACTIONS } from "@/config/bet";
import type { QuickBetAction } from "@/config/bet";
import { isValidDecimalInput, parseDecimalInput } from "@/lib/betInput";
import { formatAmount } from "@/lib/format";
import { useRef } from "react";

type BetAmountControlProps = {
  defaultAmount: number;
  disabled: boolean;
  onAmountChange: (amount: number) => void;
  onQuickAction: (action: QuickBetAction, currentAmount: number) => number;
};

export function BetAmountControl({
  defaultAmount,
  disabled,
  onAmountChange,
  onQuickAction,
}: BetAmountControlProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function getCurrentAmount() {
    return parseDecimalInput(inputRef.current?.value ?? "");
  }

  function handleQuickAction(action: QuickBetAction) {
    const nextAmount = onQuickAction(action, getCurrentAmount());

    if (inputRef.current) {
      inputRef.current.value = formatAmount(nextAmount);
    }
  }

  function handleBlur() {
    if (inputRef.current) {
      inputRef.current.value = formatAmount(getCurrentAmount());
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    if (isValidDecimalInput(value)) {
      onAmountChange(parseDecimalInput(value));
      return;
    }

    event.target.value = formatAmount(getCurrentAmount());
  }

  return (
    <>
      <label
        htmlFor="bet-amount"
        className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#7A8599]"
      >
        Bet amount
      </label>

      <div className="mb-2 flex h-10 items-center rounded-[9px] border border-[#1A1F2E] bg-[#111620] px-3">
        <input
          ref={inputRef}
          id="bet-amount"
          type="text"
          inputMode="decimal"
          defaultValue={formatAmount(defaultAmount)}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={disabled}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none disabled:cursor-not-allowed disabled:text-[#7A8599] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="ml-3 shrink-0 text-sm font-medium text-[#7A8599]">
          USD
        </span>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2">
        {QUICK_BET_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={disabled}
            onClick={() => handleQuickAction(action.id)}
            className="h-6 rounded-md border border-[#1A1F2E] bg-[#111620] text-xs font-medium text-[#7A8599] transition hover:bg-[#1A1F2E] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#111620]"
          >
            {action.label}
          </button>
        ))}
      </div>
    </>
  );
}
