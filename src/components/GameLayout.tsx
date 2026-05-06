"use client";

import { Controls } from "./Controls";
import { History } from "./History";
import { Game } from "./Game";
import { useRecentRounds } from "@/hooks/useRecentRounds";

interface GameLayoutProps {
  username: string;
  onLogout: () => void;
}

export function GameLayout({ username, onLogout }: GameLayoutProps) {
  useRecentRounds(username);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 p-3 text-white">
      <History />
      <Game />
      <Controls username={username} />

      <button
        type="button"
        onClick={onLogout}
        className="rounded-[10px] border border-[#1A1F2E] bg-[#111620] px-5 py-3 font-semibold text-white transition hover:bg-[#1A1F2E] cursor-pointer"
      >
        Logout
      </button>
    </main>
  );
}
