type AutoCashOutToggleProps = {
  autoCashOutAt: number;
  disabled: boolean;
  isEnabled: boolean;
  onToggle: () => void;
};

export function AutoCashOutToggle({
  autoCashOutAt,
  disabled,
  isEnabled,
  onToggle,
}: AutoCashOutToggleProps) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-[#7A8599]">
        Auto cash out
      </span>
      <div className="flex items-center gap-3">
        {isEnabled ? (
          <span className="font-mono text-sm font-semibold text-[#FBBF24]">
            {autoCashOutAt.toFixed(2)}x
          </span>
        ) : null}
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
  );
}
