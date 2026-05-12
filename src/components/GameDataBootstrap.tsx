"use client";

import { useRecentRounds } from "@/hooks/useRecentRounds";

type GameDataBootstrapProps = {
  username: string;
};

export function GameDataBootstrap({ username }: GameDataBootstrapProps) {
  useRecentRounds(username);

  return null;
}
