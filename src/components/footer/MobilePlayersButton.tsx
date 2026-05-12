import Image from "next/image";
import { RefObject } from "react";

type MobilePlayersButtonProps = {
  buttonRef: RefObject<HTMLButtonElement | null>;
  onClick: () => void;
  playerCount: number;
};

export function MobilePlayersButton({
  buttonRef,
  onClick,
  playerCount,
}: MobilePlayersButtonProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Open live players"
      onClick={onClick}
      className="flex h-11 items-center gap-2 rounded-full bg-[#101621] px-4 text-white transition hover:bg-[#171E2B] cursor-pointer md:hidden"
    >
      <Image
        src="/players-icon.svg"
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
      />
      <span className="font-mono text-lg font-semibold">{playerCount}</span>
    </button>
  );
}
