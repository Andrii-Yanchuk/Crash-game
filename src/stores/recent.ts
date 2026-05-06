import { create } from "zustand";

export type RecentRound = {
  roundId: string;
  crashPoint: number;
  crashedAt: string;
  tier: "low" | "mid" | "high";
};

type RecentState = {
  rounds: RecentRound[];
  setInitial: (rounds: RecentRound[]) => void;
  prepend: (round: RecentRound) => void;
};

export const useRecentStore = create<RecentState>((set) => ({
  rounds: [],
  setInitial: (rounds) => set({ rounds }),
  prepend: (round) =>
    set((state) => ({
      rounds: [round, ...state.rounds].slice(0, 20),
    })),
}));
