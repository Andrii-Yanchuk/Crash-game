import Image from "next/image";

type ConnectionStatusProps = {
  connectionDotClassName: string;
  connectionLabel: string;
  displayedRoundId: string;
  playerCount: number;
};

export function ConnectionStatus({
  connectionDotClassName,
  connectionLabel,
  displayedRoundId,
  playerCount,
}: ConnectionStatusProps) {
  return (
    <>
      <div className="flex items-center gap-2 text-sm font-medium md:hidden">
        <span
          className={`size-2.5 shrink-0 rounded-full ${connectionDotClassName}`}
        />
        <span>{displayedRoundId}</span>
      </div>

      <div className="hidden min-w-0 items-center gap-2 text-sm font-medium md:flex">
        <span
          className={`size-3 shrink-0 rounded-full ${connectionDotClassName}`}
        />
        <span className="shrink-0">{connectionLabel}</span>
        <span className="text-[#4A5568]">вЂў</span>
        <span className="shrink-0">Round {displayedRoundId}</span>
        <Image
          src="/wifi-icon.svg"
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          className="ml-3 shrink-0"
        />
        <span className="shrink-0">{playerCount} players</span>
      </div>
    </>
  );
}
