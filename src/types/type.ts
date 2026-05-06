export type RoundPhase = "waiting" | "running" | "crashed";

export type PublicPlayer = {
  username: string;
  amount: number;
  status?: "placed" | "cashed_out" | "lost";
  multiplier?: number;
};

export type Bet = {
  betId: string;
  amount: number;
  autoCashOutAt?: number | null;
};
