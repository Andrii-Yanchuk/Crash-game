"use client";

import { PublicPlayer } from "@/types/type";
import Image from "next/image";

interface PlayersPanelProps {
  isOpen: boolean;
  players: PublicPlayer[];
  onClose: () => void;
}

const AVATAR_COLORS = [
  "bg-[#7C5FD6]",
  "bg-[#F45D9A]",
  "bg-[#24C8E8]",
  "bg-[#36E6A0]",
  "bg-[#FFC45C]",
  "bg-[#F87171]",
];

function getPlayerLabel(player: PublicPlayer) {
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

function getPlayerStatusClassName(player: PublicPlayer) {
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

export function PlayersPanel({ isOpen, players, onClose }: PlayersPanelProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close live players"
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-40 flex h-dvh w-62.5 max-w-[85vw] flex-col border-l border-[#1A1F2E] bg-[#0B0E16] text-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-12 items-center justify-between border-b border-[#1A1F2E] px-4">
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

          <button
            type="button"
            aria-label="Close live players"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-xl leading-none text-[#7A8599] transition hover:bg-[#101621] hover:text-white cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">
          {players.map((player, index) => (
            <div
              key={`${player.username}-${index}`}
              className="flex h-14 items-center gap-3 rounded-lg bg-[#101621] px-3"
            >
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
                <p className="text-xs leading-4 text-[#7A8599]">
                  {player.amount} USD
                </p>
              </div>

              <span
                className={`shrink-0 text-xs font-medium ${getPlayerStatusClassName(
                  player,
                )}`}
              >
                {getPlayerLabel(player)}
              </span>
            </div>
          ))}

          {players.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#7A8599]">
              No live players
            </p>
          ) : null}
        </div>
      </aside>
    </>
  );
}
