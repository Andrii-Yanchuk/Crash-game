import Image from "next/image";
import { useBalance } from "@/hooks/useBalance";

type BalanceDisplayProps = {
  balance: number | null;
  username: string;
};

export function BalanceDisplay({
  balance,
  username,
}: BalanceDisplayProps) {
  const { error, isError, isLoading } = useBalance(username);

  return (
    <>
      <div className="flex items-center justify-between border-t border-[#1A1F2E] pt-4">
        <div className="flex items-center gap-2">
          <Image src="/balance-icon.svg" alt="Balance" width={16} height={16} />
          <span className="text-xs font-medium text-[#7A8599]">Balance</span>
        </div>
        <span className="font-mono text-sm font-semibold text-[#FBBF24]">
          {isLoading
            ? "Loading..."
            : isError
              ? "Error"
              : (balance ?? 0).toFixed(2)}
        </span>
      </div>
      {error?.message ? (
        <p className="mt-2 text-xs text-red-400">{error.message}</p>
      ) : null}
    </>
  );
}
