import { DEFAULT_AUTO_CASH_OUT_AT } from "@/config/bet";
import { memo, useRef } from "react";

const DEFAULT_AUTO_CASH_OUT_AT_TEXT = String(DEFAULT_AUTO_CASH_OUT_AT);

type AutoCashOutToggleProps = {
  disabled: boolean;
  onAutoCashOutAtBlur: () => string;
  onAutoCashOutAtChange: (autoCashOutAt: string) => boolean;
  onToggle: (isEnabled: boolean) => void;
};

function AutoCashOutToggleComponent({
  disabled,
  onAutoCashOutAtBlur,
  onAutoCashOutAtChange,
  onToggle,
}: AutoCashOutToggleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autoCashOutAtRef = useRef(DEFAULT_AUTO_CASH_OUT_AT_TEXT);

  function handleAutoCashOutAtBlur() {
    const nextAutoCashOutAt = onAutoCashOutAtBlur();
    autoCashOutAtRef.current = nextAutoCashOutAt;

    if (inputRef.current) {
      inputRef.current.value = nextAutoCashOutAt;
    }
  }

  function handleAutoCashOutAtChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const nextAutoCashOutAt = event.target.value;

    if (onAutoCashOutAtChange(nextAutoCashOutAt)) {
      autoCashOutAtRef.current = nextAutoCashOutAt;
      return;
    }

    event.target.value = autoCashOutAtRef.current;
  }

  return (
    <div className="group mb-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#7A8599]">
          Auto cash out
        </span>
        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center has-disabled:cursor-not-allowed has-disabled:opacity-50">
            <input
              type="checkbox"
              aria-label="Toggle auto cash out"
              disabled={disabled}
              onChange={(event) => onToggle(event.target.checked)}
              className="peer sr-only"
            />
            <span
              className="flex h-6 w-11 items-center rounded-full bg-[#111620] p-0.5 transition peer-checked:bg-[#FBBF24] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FBBF24] [&>span]:transition peer-checked:[&>span]:translate-x-5"
            >
              <span className="size-5 rounded-full bg-white" />
            </span>
          </label>
        </div>
      </div>

      <label
        className="hidden h-10 items-center rounded-[9px] border border-[#1A1F2E] bg-[#111620] px-3 group-has-[:checked]:flex"
      >
        <input
          ref={inputRef}
          aria-label="Auto cash out multiplier"
          type="text"
          inputMode="decimal"
          defaultValue={DEFAULT_AUTO_CASH_OUT_AT_TEXT}
          disabled={disabled}
          onBlur={handleAutoCashOutAtBlur}
          onChange={handleAutoCashOutAtChange}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none disabled:cursor-not-allowed disabled:text-[#7A8599] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="ml-3 shrink-0 text-sm font-medium text-[#7A8599]">
          x
        </span>
      </label>
    </div>
  );
}

export const AutoCashOutToggle = memo(AutoCashOutToggleComponent);
