import { socket } from "@/lib/socket";
import { useGameStore } from "@/stores/game";
import { useRecentStore } from "@/stores/recent";
import {
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
} from "@/types/type";
import { useEffect } from "react";
import useSound from "use-sound";

let crashFlashTimeout: ReturnType<typeof setTimeout> | null = null;

function handleRoundState(event: RoundStateEvent) {
  useGameStore.getState().applyRoundState(event);
}

function getPlayerCount(event: { playerCount?: number; players?: unknown[] }) {
  return event.players?.length ?? event.playerCount ?? 0;
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
    players: event.players ?? [],
    playerCount: getPlayerCount(event),
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
    players: event.players ?? [],
    playerCount: getPlayerCount(event),
  });
}

function handleRoundTick(event: RoundTickEvent) {
  const currentRoundId = useGameStore.getState().roundId;

  if (event.roundId !== currentRoundId) {
    return false;
  }

  useGameStore.setState({
    phase: "tick",
    multiplier: event.multiplier,
    ...(typeof event.playerCount === "number"
      ? { playerCount: event.playerCount }
      : null),
  });

  return true;
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
    players: event.players ?? [],
    playerCount: getPlayerCount(event),
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
  useGameStore.setState({
    balance: event.balance,
    ...(typeof event.playerCount === "number"
      ? { playerCount: event.playerCount }
      : null),
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
  useGameStore.setState({
    balance: event.balance,
    isBetPending: false,
    betError: null,
    myBet: null,
  });
}

function handleBetLost(event: BetLostEvent) {
  useGameStore.setState({
    balance: event.balance,
    isBetPending: false,
    myBet: null,
  });
}

function handleBetRejected(event: BetRejectedEvent) {
  useGameStore.setState({
    isBetPending: false,
    betError: event.message,
  });
}

function handlePlayerBet(event: PlayerBetEvent) {
  useGameStore.getState().upsertPlayer({
    username: event.username,
    amount: event.amount,
    status: "placed",
    multiplier: null,
  });
}

function handlePlayerCashout(event: PlayerCashoutEvent) {
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

function handlePlayerLost(event: PlayerLostEvent) {
  useGameStore.getState().upsertPlayer({
    username: event.username,
    amount: event.amount,
    status: "lost",
    multiplier: null,
  });
}

export function useSocket(username: string | null) {
  const isSoundEnabled = useGameStore((state) => state.isSoundEnabled);
  const setIsConnected = useGameStore((state) => state.setIsConnected);
  const [playWinSound] = useSound("/sounds/win.mp3", {
    soundEnabled: isSoundEnabled,
    volume: 0.7,
  });
  const [playLoseSound] = useSound("/sounds/lose.mp3", {
    soundEnabled: isSoundEnabled,
    volume: 0.7,
  });

  useEffect(() => {
    if (!username) {
      setIsConnected(false);
      socket.disconnect();
      return;
    }

    socket.auth = {
      apiKey: username,
    };

    function handleConnect() {
      setIsConnected(true);
    }

    function handleDisconnect() {
      setIsConnected(false);
    }

    setIsConnected(socket.connected);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    function handleRoundCrashWithSound(event: RoundCrashEvent) {
      handleRoundCrash(event);
      playLoseSound();
    }

    function handleBetCashedOutWithSound(event: BetCashedOutEvent) {
      handleBetCashedOut(event);
      playWinSound();
    }

    socket.on("round:state", handleRoundState);
    socket.on("round:waiting", handleRoundWaiting);
    socket.on("round:start", handleRoundStart);
    socket.on("round:tick", handleRoundTick);
    socket.on("round:crash", handleRoundCrashWithSound);
    socket.on("bet:placed", handleBetPlaced);
    socket.on("bet:cashout", handleBetCashedOutWithSound);
    socket.on("bet:cashedOut", handleBetCashedOutWithSound);
    socket.on("bet:lost", handleBetLost);
    socket.on("bet:rejected", handleBetRejected);
    socket.on("players:bet", handlePlayerBet);
    socket.on("players:cashout", handlePlayerCashout);
    socket.on("players:lost", handlePlayerLost);
    socket.connect();

    return () => {
      socket.off("round:state", handleRoundState);
      socket.off("round:waiting", handleRoundWaiting);
      socket.off("round:start", handleRoundStart);
      socket.off("round:tick", handleRoundTick);
      socket.off("round:crash", handleRoundCrashWithSound);
      socket.off("bet:placed", handleBetPlaced);
      socket.off("bet:cashout", handleBetCashedOutWithSound);
      socket.off("bet:cashedOut", handleBetCashedOutWithSound);
      socket.off("bet:lost", handleBetLost);
      socket.off("bet:rejected", handleBetRejected);
      socket.off("players:bet", handlePlayerBet);
      socket.off("players:cashout", handlePlayerCashout);
      socket.off("players:lost", handlePlayerLost);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      if (crashFlashTimeout) {
        clearTimeout(crashFlashTimeout);
        crashFlashTimeout = null;
      }
      setIsConnected(false);
      socket.disconnect();
    };
  }, [playLoseSound, playWinSound, setIsConnected, username]);
}
