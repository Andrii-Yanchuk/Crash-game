"use client";

import { Controls } from "./Controls";
import { History } from "./History";
import { Footer } from "./Footer";
import { useRecentRounds } from "@/hooks/useRecentRounds";
import { CurveDisplay } from "./CurveDisplay";

interface GameLayoutProps {
  username: string;
  onLogout: () => void;
}

export function GameLayout({ username, onLogout }: GameLayoutProps) {
  useRecentRounds(username);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col text-white">
      <main className="flex flex-1 flex-col gap-3 p-3">
        <History />
        <CurveDisplay />
        <Controls username={username} />
      </main>
      <Footer username={username} onLogout={onLogout} />
    </div>
  );
}
