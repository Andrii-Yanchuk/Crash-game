import { PlayerRow } from "./PlayerRow";
import type { PublicPlayer } from "@/types/type";
import Image from "next/image";

type PlayersListProps = {
  players: PublicPlayer[];
  className?: string;
  onClose?: () => void;
};

export function PlayersList({
  players,
  className = "",
  onClose,
}: PlayersListProps) {
  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-xl border border-[#1A1F2E] bg-[#0B0E16] text-white ${className}`}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#1A1F2E] px-4">
        <div className="flex min-w-0 items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#7A8599]">
          <Image
            src="/players-icon.svg"
            alt=""
            aria-hidden="true"
            width={16}
            height={16}
          />
          <span>Live players ({players.length})</span>
        </div>

        {onClose ? (
          <button
            type="button"
            aria-label="Close live players"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full transition hover:bg-[#101621] cursor-pointer md:hidden"
          >
            <Image
              src="/close-icon.svg"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
            />
          </button>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
        {players.map((player, index) => (
          <PlayerRow key={player.username} index={index} player={player} />
        ))}

        {players.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#7A8599]">
            No live players
          </p>
        ) : null}
      </div>
    </section>
  );
}
