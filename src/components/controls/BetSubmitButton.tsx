type BetSubmitButtonProps = {
  className: string;
  disabled: boolean;
  label: string;
  onClick: () => void;
};

export function BetSubmitButton({
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
      {label}
    </button>
  );
}
