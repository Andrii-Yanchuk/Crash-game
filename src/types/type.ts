export type RoundPhase = "waiting" | "running" | "crashed";
export type PlayerStatus = "placed" | "cashed_out" | "lost";

export type PublicPlayer = {
  username: string;
  amount: number;
  status?: PlayerStatus;
  multiplier?: number;
};

export type MyBet = {
  amount: number;
  autoCashOutAt: number | null;
  status: PlayerStatus;
};

export type Bet = {
  amount: number;
  autoCashOutAt?: number | null;
};

export interface RoundStateEvent {
  phase: RoundPhase;
  roundId: string;
  startedAt: string | null;
  endsAt: string | null;
  currentMultiplier: number;
  crashPoint: number | null;
  yourBet: {
    amount: number;
    autoCashOutAt: number | null;
    status: PlayerStatus;
  } | null;
  playerCount: number;
}
