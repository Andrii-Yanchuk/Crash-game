import { useGameStore } from "@/stores/game";
import { useMultiplierStore } from "@/stores/multiplier";
import { useRecentStore } from "@/stores/recent";
import {
  RoundCrashEvent,
  RoundStartEvent,
  RoundStateEvent,
  RoundTickEvent,
  RoundWaitingEvent,
} from "@/types/type";

let crashFlashTimeout: ReturnType<typeof setTimeout> | null = null;

function getPlayerCount(event: { playerCount?: number; players?: unknown[] }) {
  return event.players?.length ?? event.playerCount ?? 0;
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

export function clearCrashFlashTimeout() {
  if (!crashFlashTimeout) {
    return;
  }

  clearTimeout(crashFlashTimeout);
  crashFlashTimeout = null;
}

export function handleRoundState(event: RoundStateEvent) {
  useMultiplierStore.getState().setMultiplier(event.currentMultiplier);
  useGameStore.getState().applyRoundState(event);
}

export function handleRoundWaiting(event: RoundWaitingEvent) {
  clearCrashFlashTimeout();

  useGameStore.setState({
    phase: "waiting",
    roundId: event.roundId,
    startedAt: null,
    endsAt: new Date(event.endsAt),
    multiplier: 1,
    crashPoint: null,
    crashFlash: false,
    myBet: null,
    lastProfit: null,
    players: event.players ?? [],
    playerCount: getPlayerCount(event),
  });
  useMultiplierStore.getState().setMultiplier(1);
}

export function handleRoundStart(event: RoundStartEvent) {
  useGameStore.setState({
    phase: "starting",
    roundId: event.roundId,
    startedAt: new Date(event.startedAt),
    endsAt: null,
    multiplier: 1,
    crashPoint: null,
    crashFlash: false,
    lastProfit: null,
    players: event.players ?? [],
    playerCount: getPlayerCount(event),
  });
  useMultiplierStore.getState().setMultiplier(1);
}

export function handleRoundTick(event: RoundTickEvent) {
  const currentRoundId = useGameStore.getState().roundId;

  if (event.roundId !== currentRoundId) {
    return;
  }

  useMultiplierStore.getState().setMultiplier(event.multiplier);

  useGameStore.setState((state) => {
    const nextPhase = state.phase === "running" ? state.phase : "running";
    const nextPlayerCount =
      typeof event.playerCount === "number"
        ? event.playerCount
        : state.playerCount;

    if (
      state.phase === nextPhase &&
      state.playerCount === nextPlayerCount
    ) {
      return state;
    }

    return {
      phase: nextPhase,
      playerCount: nextPlayerCount,
    };
  });
}

export function handleRoundCrash(event: RoundCrashEvent) {
  const currentRoundId = useGameStore.getState().roundId;

  if (event.roundId !== currentRoundId) {
    return;
  }

  useMultiplierStore.getState().setMultiplier(event.crashPoint);

  useGameStore.setState({
    phase: "crashed",
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

  clearCrashFlashTimeout();

  crashFlashTimeout = setTimeout(() => {
    useGameStore.setState({ crashFlash: false });
    crashFlashTimeout = null;
  }, 1500);
}
