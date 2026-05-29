import type { PublicPlayer } from "@/types/type";

export const AVATAR_COLORS = [
  "bg-[#7C5FD6]",
  "bg-[#F45D9A]",
  "bg-[#24C8E8]",
  "bg-[#36E6A0]",
  "bg-[#FFC45C]",
  "bg-[#F87171]",
];

export function getPlayerLabel(player: PublicPlayer) {
  if (player.status === "cashed_out") {
    return `${player.multiplier?.toFixed(2) ?? "0.00"}x`;
  }

  if (player.status === "lost") {
    return "Lost";
  }

  if (player.status === "watching") {
    return "Watching";
  }

  return "Bet";
}

export function getPlayerStatusClassName(player: PublicPlayer) {
  if (player.status === "cashed_out") {
    return "text-[#22C55E]";
  }

  if (player.status === "lost") {
    return "text-[#EF4444]";
  }

  if (player.status === "watching") {
    return "text-[#7A8599]";
  }

  return "text-[#FBBF24]";
}
