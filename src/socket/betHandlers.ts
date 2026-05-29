import { useGameStore } from "@/stores/game";
import { applyGameEvent } from "./gameReducer";
import {
  BetCashedOutEvent,
  BetLostEvent,
  BetPlacedEvent,
  BetRejectedEvent,
} from "@/types/type";

export function handleBetPlaced(event: BetPlacedEvent) {
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "bet:placed", payload: event }),
  );
}

export function handleBetCashedOut(event: BetCashedOutEvent) {
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "bet:cashedOut", payload: event }),
  );
}

export function handleBetLost(event: BetLostEvent) {
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "bet:lost", payload: event }),
  );
}

export function handleBetRejected(event: BetRejectedEvent) {
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "bet:rejected", payload: event }),
  );
}
