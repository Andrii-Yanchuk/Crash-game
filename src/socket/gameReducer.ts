import type { GameSnapshot } from "@/stores/game";
import type {
  BetCashedOutEvent,
  BetLostEvent,
  BetPlacedEvent,
  BetRejectedEvent,
  PlayerBetEvent,
  PlayerCashoutEvent,
  PlayerLostEvent,
  PublicPlayer,
  RoundCrashEvent,
  RoundStartEvent,
  RoundStateEvent,
  RoundTickEvent,
  RoundWaitingEvent,
} from "@/types/type";

/**
 * Discriminated union of every server event that mutates game state.
 * Lets `applyGameEvent` act as the single, pure domain reducer.
 */
export type GameEvent =
  | { type: "round:state"; payload: RoundStateEvent }
  | { type: "round:waiting"; payload: RoundWaitingEvent }
  | { type: "round:start"; payload: RoundStartEvent }
  | { type: "round:tick"; payload: RoundTickEvent }
  | { type: "round:crash"; payload: RoundCrashEvent }
  | { type: "bet:placed"; payload: BetPlacedEvent }
  | { type: "bet:cashedOut"; payload: BetCashedOutEvent }
  | { type: "bet:lost"; payload: BetLostEvent }
  | { type: "bet:rejected"; payload: BetRejectedEvent }
  | { type: "players:bet"; payload: PlayerBetEvent }
  | { type: "players:cashout"; payload: PlayerCashoutEvent }
  | { type: "players:lost"; payload: PlayerLostEvent };

function getPlayerCount(event: { playerCount?: number; players?: unknown[] }) {
  return event.players?.length ?? event.playerCount ?? 0;
}

function upsertPlayer(
  players: PublicPlayer[],
  player: PublicPlayer,
): PublicPlayer[] {
  const index = players.findIndex((item) => item.username === player.username);

  if (index === -1) {
    return [...players, player];
  }

  return players.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...player } : item,
  );
}

/**
 * Pure reducer: given the current game snapshot and a server event, returns the
 * next snapshot. No side effects — timers, sounds, and the multiplier/recent
 * stores are orchestrated by the socket handlers. Returns the same reference
 * when nothing changes so Zustand can skip notifying subscribers.
 */
export function applyGameEvent(
  state: GameSnapshot,
  event: GameEvent,
): GameSnapshot {
  switch (event.type) {
    case "round:state": {
      const { payload } = event;

      return {
        ...state,
        phase: payload.phase,
        roundId: payload.roundId,
        startedAt: payload.startedAt ? new Date(payload.startedAt) : null,
        endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
        multiplier: payload.currentMultiplier,
        crashPoint: payload.crashPoint,
        myBet: payload.yourBet,
        lastProfit: payload.yourBet ? null : state.lastProfit,
        players: payload.players ?? [],
        playerCount: getPlayerCount(payload),
        isBetPending: false,
        betError: null,
      };
    }

    case "round:waiting": {
      const { payload } = event;

      return {
        ...state,
        phase: "waiting",
        roundId: payload.roundId,
        startedAt: null,
        endsAt: new Date(payload.endsAt),
        multiplier: 1,
        crashPoint: null,
        crashFlash: false,
        myBet: null,
        lastProfit: null,
        players: payload.players ?? [],
        playerCount: getPlayerCount(payload),
      };
    }

    case "round:start": {
      const { payload } = event;

      return {
        ...state,
        phase: "starting",
        roundId: payload.roundId,
        startedAt: new Date(payload.startedAt),
        endsAt: null,
        multiplier: 1,
        crashPoint: null,
        crashFlash: false,
        lastProfit: null,
        players: payload.players ?? [],
        playerCount: getPlayerCount(payload),
      };
    }

    case "round:tick": {
      const { payload } = event;

      if (payload.roundId !== state.roundId) {
        return state;
      }

      const nextPhase = state.phase === "running" ? state.phase : "running";
      const nextPlayerCount =
        typeof payload.playerCount === "number"
          ? payload.playerCount
          : state.playerCount;

      if (state.phase === nextPhase && state.playerCount === nextPlayerCount) {
        return state;
      }

      return {
        ...state,
        phase: nextPhase,
        playerCount: nextPlayerCount,
      };
    }

    case "round:crash": {
      const { payload } = event;

      if (payload.roundId !== state.roundId) {
        return state;
      }

      return {
        ...state,
        phase: "crashed",
        roundId: payload.roundId,
        multiplier: payload.crashPoint,
        crashPoint: payload.crashPoint,
        crashFlash: true,
        players: payload.players ?? [],
        playerCount: getPlayerCount(payload),
      };
    }

    case "bet:placed": {
      const { payload } = event;

      return {
        ...state,
        balance: payload.balance,
        playerCount:
          typeof payload.playerCount === "number"
            ? payload.playerCount
            : state.playerCount,
        isBetPending: false,
        betError: null,
        lastProfit: null,
        myBet: {
          betId: payload.betId,
          amount: payload.amount,
          autoCashOutAt: payload.autoCashOutAt,
          status: "placed",
        },
      };
    }

    case "bet:cashedOut": {
      const { payload } = event;

      return {
        ...state,
        balance: payload.balance,
        isBetPending: false,
        betError: null,
        lastProfit: payload.profit,
        myBet: null,
      };
    }

    case "bet:lost": {
      const { payload } = event;

      return {
        ...state,
        balance: payload.balance,
        isBetPending: false,
        lastProfit: null,
        myBet: null,
      };
    }

    case "bet:rejected": {
      const { payload } = event;

      return {
        ...state,
        isBetPending: false,
        betError: payload.message,
      };
    }

    case "players:bet": {
      const { payload } = event;
      const players = upsertPlayer(state.players, {
        username: payload.username,
        amount: payload.amount,
        status: "placed",
        multiplier: null,
      });

      return { ...state, players, playerCount: players.length };
    }

    case "players:cashout": {
      const { payload } = event;
      const currentPlayer = state.players.find(
        (player) => player.username === payload.username,
      );
      const players = upsertPlayer(state.players, {
        username: payload.username,
        amount: currentPlayer?.amount ?? payload.winAmount,
        status: "cashed_out",
        multiplier: payload.multiplier,
      });

      return { ...state, players, playerCount: players.length };
    }

    case "players:lost": {
      const { payload } = event;
      const players = upsertPlayer(state.players, {
        username: payload.username,
        amount: payload.amount,
        status: "lost",
        multiplier: null,
      });

      return { ...state, players, playerCount: players.length };
    }

    default:
      return state;
  }
}
