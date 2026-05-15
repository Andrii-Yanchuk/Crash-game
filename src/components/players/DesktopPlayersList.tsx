"use client";

import { PlayersList } from "./PlayersList";

type DesktopPlayersListProps = {
  className?: string;
};

export function DesktopPlayersList({ className }: DesktopPlayersListProps) {
  return <PlayersList className={className} />;
}
