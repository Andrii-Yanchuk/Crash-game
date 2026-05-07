import { create } from "zustand";
import { RoundPhase, MyBet, RoundStateEvent } from "../types/type";

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
  playerCount: number;
  isBetPending: boolean;
  betError: string | null;

  setBalance: (balance: number) => void;
  setIsBetPending: (isBetPending: boolean) => void;
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
  playerCount: 0,
  isBetPending: false,
  betError: null,

  setBalance: (balance) => set({ balance }),
  setIsBetPending: (isBetPending) => set({ isBetPending }),
  clearBetError: () => set({ betError: null }),

  applyRoundState: (event) =>
    set({
      phase: event.phase,
      roundId: event.roundId,
      startedAt: event.startedAt ? new Date(event.startedAt) : null,
      endsAt: event.endsAt ? new Date(event.endsAt) : null,
      multiplier: event.currentMultiplier,
      crashPoint: event.crashPoint,
      myBet: event.yourBet,
      playerCount: event.playerCount,
      betError: null,
    }),
}));
