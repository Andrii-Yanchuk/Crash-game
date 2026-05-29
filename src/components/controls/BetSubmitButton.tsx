import { formatAmount } from "@/lib/format";
import { useMultiplierStore } from "@/stores/multiplier";
import { memo, useEffect, useRef } from "react";

type BetSubmitButtonProps = {
  className: string;
  disabled: boolean;
  label: string;
  betAmount: number | null;
  onClick: () => void;
};

function CashOutButtonLabel({ betAmount }: { betAmount: number }) {
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function updateLabel(multiplier: number) {
      if (labelRef.current) {
        labelRef.current.textContent = `Cash Out - ${formatAmount(
          betAmount * multiplier,
        )}`;
      }
    }

    updateLabel(useMultiplierStore.getState().multiplier);

    return useMultiplierStore.subscribe((state) => {
      updateLabel(state.multiplier);
    });
  }, [betAmount]);

  return <span ref={labelRef}>Cash Out</span>;
}

function BetSubmitButtonComponent({
  betAmount,
  className,
  disabled,
  label,
  onClick,
}: BetSubmitButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mb-4 h-13 rounded-[9px] font-semibold cursor-pointer transition disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
    >
      {betAmount === null ? label : <CashOutButtonLabel betAmount={betAmount} />}
    </button>
  );
}

export const BetSubmitButton = memo(BetSubmitButtonComponent);
