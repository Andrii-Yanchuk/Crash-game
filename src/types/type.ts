export type RoundPhase = "waiting" | "start" | "tick" | "crash";
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

export interface RoundWaitingEvent {
  roundId: string;
  endsAt: string;
  playerCount: number;
}

export interface RoundStartEvent {
  roundId: string;
  startedAt: string;
  playerCount: number;
}

export interface RoundTickEvent {
  roundId: string;
  multiplier: number;
  elapsedMs: number;
}

export interface RoundCrashEvent {
  roundId: string;
  crashPoint: number;
  playerCount: number;
}
