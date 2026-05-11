"use client";

import { useGameStore } from "@/stores/game";
import Image from "next/image";
import { useRef, useState } from "react";
import { PlayersPanel } from "./PlayersPanel";

interface FooterProps {
  username: string;
  onLogout: () => void;
}

export function Footer({ username, onLogout }: FooterProps) {
  const [isPlayersPanelOpen, setIsPlayersPanelOpen] = useState(false);
  const playersButtonRef = useRef<HTMLButtonElement>(null);
  const roundId = useGameStore((state) => state.roundId);
  const players = useGameStore((state) => state.players);
  const playerCount = useGameStore((state) => state.playerCount);
  const isSoundEnabled = useGameStore((state) => state.isSoundEnabled);
  const isConnected = useGameStore((state) => state.isConnected);
  const setIsSoundEnabled = useGameStore((state) => state.setIsSoundEnabled);
  const displayedRoundId = roundId?.replace("round_", "R#") ?? "R#----";
  const connectionLabel = isConnected ? "Connected" : "Disconnected";
  const connectionDotClassName = isConnected ? "bg-[#22C55E]" : "bg-[#EF4444]";

  function closePlayersPanel() {
    playersButtonRef.current?.focus();
    setIsPlayersPanelOpen(false);
  }

  return (
    <>
      <footer className="flex h-18 items-center justify-between border-t border-[#1A1F2E] bg-[#0B0E16] px-4 text-[#7A8599]">
        <div className="flex min-w-0 items-center gap-3">
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
            <span className="text-[#4A5568]">•</span>
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

          <button
            ref={playersButtonRef}
            type="button"
            aria-label="Open live players"
            onClick={() => setIsPlayersPanelOpen(true)}
            className="flex h-11 items-center gap-2 rounded-full bg-[#101621] px-4 text-white transition hover:bg-[#171E2B] cursor-pointer md:hidden"
          >
            <Image
              src="/players-icon.svg"
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
            />
            <span className="font-mono text-lg font-semibold">
              {playerCount}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex h-10 max-w-36 items-center gap-1.5 rounded-full bg-[#101621] px-4 text-sm font-medium text-white transition hover:bg-[#171E2B] cursor-pointer"
          >
            <span className="min-w-0 truncate">{username}</span>
            <Image
              src="/logout-icon.svg"
              alt=""
              aria-hidden="true"
              width={16}
              height={16}
              className="shrink-0"
            />
          </button>

          <button
            type="button"
            aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
            aria-pressed={isSoundEnabled}
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className={`flex size-10 items-center justify-center rounded-full transition cursor-pointer ${
              isSoundEnabled
                ? "text-[#7A8599] hover:bg-[#101621] hover:text-white"
                : "bg-[#101621] text-[#FBBF24]"
            }`}
          >
            <Image
              src={isSoundEnabled ? "/sound-on.svg" : "/sound-off.svg"}
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
            />
          </button>
        </div>
      </footer>

      <PlayersPanel
        isOpen={isPlayersPanelOpen}
        players={players}
        onClose={closePlayersPanel}
      />
    </>
  );
}
