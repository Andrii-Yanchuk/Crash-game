import {
  Bet,
  BetCashedOutEvent,
  BetLostEvent,
  BetPlacedEvent,
  BetRejectedEvent,
  PlayerBetEvent,
  PlayerCashoutEvent,
  PlayerLostEvent,
  RoundCrashEvent,
  RoundStartEvent,
  RoundStateEvent,
  RoundTickEvent,
  RoundWaitingEvent,
} from "./type";

export type ServerToClientEvents = {
  "round:state": (event: RoundStateEvent) => void;
  "round:waiting": (event: RoundWaitingEvent) => void;
  "round:start": (event: RoundStartEvent) => void;
  "round:tick": (event: RoundTickEvent) => void;
  "round:crash": (event: RoundCrashEvent) => void;
  "bet:placed": (event: BetPlacedEvent) => void;
  "bet:cashout": (event: BetCashedOutEvent) => void;
  "bet:cashedOut": (event: BetCashedOutEvent) => void;
  "bet:lost": (event: BetLostEvent) => void;
  "bet:rejected": (event: BetRejectedEvent) => void;
  "players:bet": (event: PlayerBetEvent) => void;
  "players:cashout": (event: PlayerCashoutEvent) => void;
  "players:lost": (event: PlayerLostEvent) => void;
};

export type ClientToServerEvents = {
  "bet:place": (payload: Bet) => void;
  "bet:cashout": (payload: Record<string, never>) => void;
};
