import { useGameStore } from "@/stores/game";
import {
  PlayerBetEvent,
  PlayerCashoutEvent,
  PlayerLostEvent,
} from "@/types/type";

export function handlePlayerBet(event: PlayerBetEvent) {
  useGameStore.getState().upsertPlayer({
    username: event.username,
    amount: event.amount,
    status: "placed",
    multiplier: null,
  });
}

export function handlePlayerCashout(event: PlayerCashoutEvent) {
  const currentPlayer = useGameStore
    .getState()
    .players.find((player) => player.username === event.username);

  useGameStore.getState().upsertPlayer({
    username: event.username,
    amount: currentPlayer?.amount ?? event.winAmount,
    status: "cashed_out",
    multiplier: event.multiplier,
  });
}

export function handlePlayerLost(event: PlayerLostEvent) {
  useGameStore.getState().upsertPlayer({
    username: event.username,
    amount: event.amount,
    status: "lost",
    multiplier: null,
  });
}
