export type RoundPhase = "waiting" | "starting" | "running" | "crashed";
// What the backend actually sends in the round:state payload. "starting" is a
// frontend-only transient derived from the round:start event, so it is not here.
export type RoundStatePhase = "waiting" | "running" | "crashed";
export type PlayerStatus = "watching" | "placed" | "cashed_out" | "lost";

export type PublicPlayer = {
  username: string;
  amount: number;
  status?: PlayerStatus;
  multiplier?: number | null;
};

export type MyBet = {
  betId?: string;
  amount: number;
  autoCashOutAt: number | null;
  status: PlayerStatus;
};

export type Bet = {
  amount: number;
  autoCashOutAt?: number | null;
};

export interface RoundStateEvent {
  phase: RoundStatePhase;
  roundId: string;
  startedAt: string | null;
  endsAt: string | null;
  currentMultiplier: number;
  crashPoint: number | null;
  yourBet: {
    betId?: string;
    amount: number;
    autoCashOutAt: number | null;
    status: PlayerStatus;
  } | null;
  playerCount?: number;
  players?: PublicPlayer[];
}

export interface RoundWaitingEvent {
  roundId: string;
  endsAt: string;
  playerCount?: number;
  players?: PublicPlayer[];
}

export interface RoundStartEvent {
  roundId: string;
  startedAt: string;
  playerCount?: number;
  players?: PublicPlayer[];
}

export interface RoundTickEvent {
  roundId: string;
  multiplier: number;
  elapsedMs: number;
  playerCount?: number;
}

export interface RoundCrashEvent {
  roundId: string;
  crashPoint: number;
  playerCount?: number;
  players?: PublicPlayer[];
}

export interface BetPlacedEvent {
  betId: string;
  roundId: string;
  amount: number;
  autoCashOutAt: number | null;
  balance: number;
  playerCount?: number;
}

export interface BetCashedOutEvent {
  betId: string;
  multiplier: number;
  winAmount: number;
  profit: number;
  balance: number;
}

export interface BetLostEvent {
  betId: string;
  crashPoint: number;
  balance: number;
}

export interface PlayerBetEvent {
  username: string;
  amount: number;
}

export interface PlayerCashoutEvent {
  username: string;
  multiplier: number;
  winAmount: number;
}

export interface PlayerLostEvent {
  username: string;
  amount: number;
}

export type BetRejectedReason =
  | "betting_closed"
  | "already_has_bet"
  | "no_active_bet"
  | "not_running"
  | "insufficient_balance"
  | "invalid_auto_cashout"
  | "invalid_payload";

export interface BetRejectedEvent {
  reason: BetRejectedReason;
  message: string;
}
