import { create } from "zustand";
import { RoundPhase, MyBet, PublicPlayer } from "../types/type";

export type GameSnapshot = {
  balance: number | null;
  phase: RoundPhase;
  roundId: string | null;
  startedAt: Date | null;
  endsAt: Date | null;
  multiplier: number;
  crashPoint: number | null;
  crashFlash: boolean;
  myBet: MyBet | null;
  lastProfit: number | null;
  players: PublicPlayer[];
  playerCount: number;
  isBetPending: boolean;
  betError: string | null;
  isConnected: boolean;
  isReconnecting: boolean;
  connectionError: string | null;
};

type GameState = GameSnapshot & {
  setBalance: (balance: number) => void;
  setIsBetPending: (isBetPending: boolean) => void;
  setBetError: (betError: string | null) => void;
  clearBetError: () => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsReconnecting: (isReconnecting: boolean) => void;
  setConnectionError: (connectionError: string | null) => void;
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
  lastProfit: null,
  players: [],
  playerCount: 0,
  isBetPending: false,
  betError: null,
  isConnected: false,
  isReconnecting: false,
  connectionError: null,

  setBalance: (balance) => set({ balance }),
  setIsBetPending: (isBetPending) => set({ isBetPending }),
  setBetError: (betError) => set({ betError }),
  clearBetError: () => set({ betError: null }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setIsReconnecting: (isReconnecting) => set({ isReconnecting }),
  setConnectionError: (connectionError) => set({ connectionError }),
}));
