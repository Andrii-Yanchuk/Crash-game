import { useGameStore } from "@/stores/game";
import { applyGameEvent } from "./gameReducer";
import {
  PlayerBetEvent,
  PlayerCashoutEvent,
  PlayerLostEvent,
} from "@/types/type";

export function handlePlayerBet(event: PlayerBetEvent) {
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "players:bet", payload: event }),
  );
}

export function handlePlayerCashout(event: PlayerCashoutEvent) {
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "players:cashout", payload: event }),
  );
}

export function handlePlayerLost(event: PlayerLostEvent) {
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "players:lost", payload: event }),
  );
}
