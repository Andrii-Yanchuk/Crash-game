import { create } from "zustand";

type GameState = {
  balance: number | null;
  setBalance: (balance: number) => void;
};

export const useGameStore = create<GameState>((set) => ({
  balance: null,
  setBalance: (balance) => set({ balance }),
}));
