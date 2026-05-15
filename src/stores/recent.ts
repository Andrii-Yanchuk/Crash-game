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

function areSameRounds(left: RecentRound[], right: RecentRound[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((round, index) => {
    const otherRound = right[index];

    return (
      round.roundId === otherRound.roundId &&
      round.crashPoint === otherRound.crashPoint &&
      round.crashedAt === otherRound.crashedAt &&
      round.tier === otherRound.tier
    );
  });
}

export const useRecentStore = create<RecentState>((set) => ({
  rounds: [],
  setInitial: (rounds) =>
    set((state) => {
      if (areSameRounds(state.rounds, rounds)) {
        return state;
      }

      return { rounds };
    }),
  prepend: (round) =>
    set((state) => {
      if (state.rounds[0]?.roundId === round.roundId) {
        return state;
      }

      return {
        rounds: [round, ...state.rounds].slice(0, 20),
      };
    }),
}));
