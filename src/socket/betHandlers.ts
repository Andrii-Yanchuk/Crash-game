import { useGameStore } from "@/stores/game";
import {
  BetCashedOutEvent,
  BetLostEvent,
  BetPlacedEvent,
  BetRejectedEvent,
} from "@/types/type";

export function handleBetPlaced(event: BetPlacedEvent) {
  useGameStore.setState({
    balance: event.balance,
    ...(typeof event.playerCount === "number"
      ? { playerCount: event.playerCount }
      : null),
    isBetPending: false,
    betError: null,
    lastProfit: null,
    myBet: {
      betId: event.betId,
      amount: event.amount,
      autoCashOutAt: event.autoCashOutAt,
      status: "placed",
    },
  });
}

export function handleBetCashedOut(event: BetCashedOutEvent) {
  useGameStore.setState({
    balance: event.balance,
    isBetPending: false,
    betError: null,
    lastProfit: event.profit,
    myBet: null,
  });
}

export function handleBetLost(event: BetLostEvent) {
  useGameStore.setState({
    balance: event.balance,
    isBetPending: false,
    lastProfit: null,
    myBet: null,
  });
}

export function handleBetRejected(event: BetRejectedEvent) {
  useGameStore.setState({
    isBetPending: false,
    betError: event.message,
  });
}
