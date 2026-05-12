import { QUICK_BET_ACTIONS } from "@/config/bet";
import type { QuickBetAction } from "@/config/bet";

type BetAmountControlProps = {
  amount: number;
  disabled: boolean;
  onAmountChange: (amount: number) => void;
  onQuickAction: (action: QuickBetAction) => void;
};

export function BetAmountControl({
  amount,
  disabled,
  onAmountChange,
  onQuickAction,
}: BetAmountControlProps) {
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
          id="bet-amount"
          type="number"
          min="0"
          value={amount}
          onChange={(event) => onAmountChange(event.target.valueAsNumber || 0)}
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
            onClick={() => onQuickAction(action.id)}
            className="h-6 rounded-md border border-[#1A1F2E] bg-[#111620] text-xs font-medium text-[#7A8599] transition hover:bg-[#1A1F2E] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#111620]"
          >
            {action.label}
          </button>
        ))}
      </div>
    </>
  );
}
