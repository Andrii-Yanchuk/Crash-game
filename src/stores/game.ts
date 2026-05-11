import { create } from "zustand";
import { RoundPhase, MyBet, PublicPlayer, RoundStateEvent } from "../types/type";

function normalizeRoundPhase(phase: RoundStateEvent["phase"]): RoundPhase {
  if (phase === "running") {
    return "tick";
  }

  if (phase === "crashed") {
    return "crash";
  }

  return phase;
}

function getPlayerCount(event: { playerCount?: number; players?: unknown[] }) {
  return event.players?.length ?? event.playerCount ?? 0;
}

type GameState = {
  balance: number | null;

  phase: RoundPhase;
  roundId: string | null;
  startedAt: Date | null;
  endsAt: Date | null;
  multiplier: number;
  crashPoint: number | null;
  crashFlash: boolean;
  myBet: MyBet | null;
  players: PublicPlayer[];
  playerCount: number;
  isBetPending: boolean;
  betError: string | null;

  setBalance: (balance: number) => void;
  setIsBetPending: (isBetPending: boolean) => void;
  setBetError: (betError: string | null) => void;
  clearBetError: () => void;
  applyRoundState: (event: RoundStateEvent) => void;
};

export const useGameStore = create<GameState>((set) => ({
  balance: null,
  phase: "waiting",
  roundId: null,
  startedAt: null,
  endsAt: null,
  multiplier: 1,
  crashPoint: null,
  crashFlash: false,
  myBet: null,
  players: [],
  playerCount: 0,
  isBetPending: false,
  betError: null,

  setBalance: (balance) => set({ balance }),
  setIsBetPending: (isBetPending) => set({ isBetPending }),
  setBetError: (betError) => set({ betError }),
  clearBetError: () => set({ betError: null }),

  applyRoundState: (event) =>
    set({
      phase: normalizeRoundPhase(event.phase),
      roundId: event.roundId,
      startedAt: event.startedAt ? new Date(event.startedAt) : null,
      endsAt: event.endsAt ? new Date(event.endsAt) : null,
      multiplier: event.currentMultiplier,
      crashPoint: event.crashPoint,
      myBet: event.yourBet,
      players: event.players ?? [],
      playerCount: getPlayerCount(event),
      isBetPending: false,
      betError: null,
    }),
}));
