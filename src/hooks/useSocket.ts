import { socket } from "@/lib/socket";
import { useGameStore } from "@/stores/game";
import { useRecentStore } from "@/stores/recent";
import {
  BetCashedOutEvent,
  BetLostEvent,
  BetPlacedEvent,
  BetRejectedEvent,
  RoundCrashEvent,
  RoundStartEvent,
  RoundStateEvent,
  RoundTickEvent,
  RoundWaitingEvent,
} from "@/types/type";
import { useEffect } from "react";

let crashFlashTimeout: ReturnType<typeof setTimeout> | null = null;

function handleRoundState(event: RoundStateEvent) {
  useGameStore.getState().applyRoundState(event);
}

function handleRoundWaiting(event: RoundWaitingEvent) {
  useGameStore.setState({
    phase: "waiting",
    roundId: event.roundId,
    startedAt: null,
    endsAt: new Date(event.endsAt),
    multiplier: 1,
    crashPoint: null,
    myBet: null,
    playerCount: event.playerCount,
  });
}

function handleRoundStart(event: RoundStartEvent) {
  useGameStore.setState({
    phase: "start",
    roundId: event.roundId,
    startedAt: new Date(event.startedAt),
    endsAt: null,
    multiplier: 1,
    crashPoint: null,
    playerCount: event.playerCount,
  });
}

function handleRoundTick(event: RoundTickEvent) {
  const currentRoundId = useGameStore.getState().roundId;

  if (event.roundId !== currentRoundId) {
    return;
  }

  useGameStore.setState({
    phase: "tick",
    multiplier: event.multiplier,
  });
}

function getCrashTier(crashPoint: number) {
  if (crashPoint >= 10) {
    return "high";
  }

  if (crashPoint >= 2) {
    return "mid";
  }

  return "low";
}

function handleRoundCrash(event: RoundCrashEvent) {
  useGameStore.setState({
    phase: "crash",
    roundId: event.roundId,
    multiplier: event.crashPoint,
    crashPoint: event.crashPoint,
    crashFlash: true,
    playerCount: event.playerCount,
  });

  useRecentStore.getState().prepend({
    roundId: event.roundId,
    crashPoint: event.crashPoint,
    crashedAt: new Date().toISOString(),
    tier: getCrashTier(event.crashPoint),
  });

  if (crashFlashTimeout) {
    clearTimeout(crashFlashTimeout);
  }

  crashFlashTimeout = setTimeout(() => {
    useGameStore.setState({ crashFlash: false });
    crashFlashTimeout = null;
  }, 1500);
}

function handleBetPlaced(event: BetPlacedEvent) {
  console.log("bet:placed", event);

  useGameStore.setState({
    balance: event.balance,
    isBetPending: false,
    betError: null,
    myBet: {
      betId: event.betId,
      amount: event.amount,
      autoCashOutAt: event.autoCashOutAt,
      status: "placed",
    },
  });
}

function handleBetCashedOut(event: BetCashedOutEvent) {
  console.log("bet:cashedOut", event);

  useGameStore.setState({
    balance: event.balance,
    isBetPending: false,
    betError: null,
    myBet: null,
  });
}

function handleBetLost(event: BetLostEvent) {
  console.log("bet:lost", event);

  useGameStore.setState({
    balance: event.balance,
    isBetPending: false,
    myBet: null,
  });
}

function handleBetRejected(event: BetRejectedEvent) {
  console.log("bet:rejected", event);

  useGameStore.setState({
    isBetPending: false,
    betError: event.message,
  });
}

export function useSocket(username: string | null) {
  useEffect(() => {
    if (!username) {
      socket.disconnect();
      return;
    }

    socket.auth = {
      apiKey: username,
    };

    socket.on("round:state", handleRoundState);
    socket.on("round:waiting", handleRoundWaiting);
    socket.on("round:start", handleRoundStart);
    socket.on("round:tick", handleRoundTick);
    socket.on("round:crash", handleRoundCrash);
    socket.on("bet:placed", handleBetPlaced);
    socket.on("bet:cashedOut", handleBetCashedOut);
    socket.on("bet:lost", handleBetLost);
    socket.on("bet:rejected", handleBetRejected);
    socket.connect();

    return () => {
      socket.off("round:state", handleRoundState);
      socket.off("round:waiting", handleRoundWaiting);
      socket.off("round:start", handleRoundStart);
      socket.off("round:tick", handleRoundTick);
      socket.off("round:crash", handleRoundCrash);
      socket.off("bet:placed", handleBetPlaced);
      socket.off("bet:cashedOut", handleBetCashedOut);
      socket.off("bet:lost", handleBetLost);
      socket.off("bet:rejected", handleBetRejected);
      if (crashFlashTimeout) {
        clearTimeout(crashFlashTimeout);
        crashFlashTimeout = null;
      }
      socket.disconnect();
    };
  }, [username]);
}
