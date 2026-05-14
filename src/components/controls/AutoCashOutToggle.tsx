type AutoCashOutToggleProps = {
  autoCashOutAt: string;
  disabled: boolean;
  isEnabled: boolean;
  onAutoCashOutAtBlur: () => void;
  onAutoCashOutAtChange: (autoCashOutAt: string) => void;
  onToggle: () => void;
};

export function AutoCashOutToggle({
  autoCashOutAt,
  disabled,
  isEnabled,
  onAutoCashOutAtBlur,
  onAutoCashOutAtChange,
  onToggle,
}: AutoCashOutToggleProps) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#7A8599]">
          Auto cash out
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Toggle auto cash out"
            aria-pressed={isEnabled}
            disabled={disabled}
            onClick={onToggle}
            className={`flex h-6 w-11 items-center rounded-full p-0.5 cursor-pointer transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isEnabled ? "bg-[#FBBF24]" : "bg-[#111620]"
            }`}
          >
            <span
              className={`size-5 rounded-full bg-white transition ${
                isEnabled ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {isEnabled ? (
        <label className="flex h-10 items-center rounded-[9px] border border-[#1A1F2E] bg-[#111620] px-3">
          <input
            aria-label="Auto cash out multiplier"
            type="text"
            inputMode="decimal"
            value={autoCashOutAt}
            disabled={disabled}
            onBlur={onAutoCashOutAtBlur}
            onChange={(event) =>
              onAutoCashOutAtChange(event.target.value)
            }
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none disabled:cursor-not-allowed disabled:text-[#7A8599] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="ml-3 shrink-0 text-sm font-medium text-[#7A8599]">
            x
          </span>
        </label>
      ) : null}
    </div>
  );
}
