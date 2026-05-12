import {
  AVATAR_COLORS,
  getPlayerLabel,
  getPlayerStatusClassName,
} from "./playerView";
import type { PublicPlayer } from "@/types/type";

type PlayerRowProps = {
  index: number;
  player: PublicPlayer;
};

export function PlayerRow({ index, player }: PlayerRowProps) {
  return (
    <div className="flex h-14 items-center gap-3 rounded-lg bg-[#101621] px-3">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${
          AVATAR_COLORS[index % AVATAR_COLORS.length]
        }`}
      >
        {player.username.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-5 text-white">
          {player.username}
        </p>
        <p className="text-xs leading-4 text-[#7A8599]">{player.amount} USD</p>
      </div>

      <span
        className={`shrink-0 text-xs font-medium ${getPlayerStatusClassName(
          player,
        )}`}
      >
        {getPlayerLabel(player)}
      </span>
    </div>
  );
}
