"use client";

import { useGameStore } from "@/stores/game";
import Image from "next/image";
import { useState } from "react";

interface FooterProps {
  username: string;
  onLogout: () => void;
}

export function Footer({ username, onLogout }: FooterProps) {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const roundId = useGameStore((state) => state.roundId);
  const playerCount = useGameStore((state) => state.playerCount);
  const displayedRoundId = roundId?.replace("round_", "R#") ?? "R#----";

  return (
    <footer className="flex h-18 items-center justify-between border-t border-[#1A1F2E] bg-[#0B0E16] px-4 text-[#7A8599]">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="size-2.5 shrink-0 rounded-full bg-[#22C55E]" />
          <span>{displayedRoundId}</span>
        </div>

        <div className="flex h-11 items-center gap-2 rounded-full bg-[#101621] px-4 text-white">
          <Image
            src="/players-icon.svg"
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
          />
          <span className="font-mono text-lg font-semibold">{playerCount}</span>
        </div>
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
          onClick={() => setIsSoundEnabled((value) => !value)}
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
  );
}
