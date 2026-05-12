"use client";

import { Controls } from "./controls/Controls";
import { History } from "./History";
import { Footer } from "./footer/Footer";
import { useBalance } from "@/hooks/useBalance";
import { useRecentRounds } from "@/hooks/useRecentRounds";
import { CurveDisplay } from "./CurveDisplay";
import { PlayersList } from "./players/PlayersList";
import { useGameStore } from "@/stores/game";

interface GameLayoutProps {
  username: string;
  onLogout: () => void;
}

export function GameLayout({ username, onLogout }: GameLayoutProps) {
  useRecentRounds(username);
  const {
    error: balanceError,
    isLoading: isBalanceLoading,
    isError: isBalanceError,
  } = useBalance(username);
  const players = useGameStore((state) => state.players);

  return (
    <div className="flex min-h-screen w-full flex-col text-white">
      <main className="grid flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[340px_minmax(0,1fr)_340px] lg:grid-rows-[auto_minmax(0,1fr)]">
        <div className="flex min-w-0 justify-center lg:col-start-2 lg:row-start-1">
          <History />
        </div>
        <div className="flex min-h-0 min-w-0 justify-center lg:col-start-2 lg:row-start-2">
          <CurveDisplay />
        </div>
        <div className="grid min-w-0 gap-3 md:grid-cols-2 lg:contents">
          <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <Controls
              balanceErrorMessage={balanceError?.message}
              isBalanceError={isBalanceError}
              isBalanceLoading={isBalanceLoading}
            />
          </div>
          <div className="hidden min-h-80 md:block lg:col-start-3 lg:row-span-2 lg:row-start-1">
            <PlayersList players={players} className="h-full" />
          </div>
        </div>
      </main>
      <Footer username={username} onLogout={onLogout} />
    </div>
  );
}
