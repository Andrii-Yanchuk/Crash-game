"use client";

import { PlayersList } from "./PlayersList";
import { useGameStore } from "@/stores/game";

type DesktopPlayersListProps = {
  className?: string;
};

export function DesktopPlayersList({ className }: DesktopPlayersListProps) {
  const players = useGameStore((state) => state.players);

  return <PlayersList players={players} className={className} />;
}
