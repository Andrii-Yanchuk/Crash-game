import { create } from "zustand";

type MultiplierState = {
  multiplier: number;
  setMultiplier: (multiplier: number) => void;
};

export const useMultiplierStore = create<MultiplierState>((set) => ({
  multiplier: 1,
  setMultiplier: (multiplier) =>
    set((state) => {
      if (state.multiplier === multiplier) {
        return state;
      }

      return { multiplier };
    }),
}));
