import { useGameStore } from "@/stores/game";
import { useMultiplierStore } from "@/stores/multiplier";
import { useRecentStore } from "@/stores/recent";
import { applyGameEvent } from "./gameReducer";
import {
  RoundCrashEvent,
  RoundStartEvent,
  RoundStateEvent,
  RoundTickEvent,
  RoundWaitingEvent,
} from "@/types/type";

let crashFlashTimeout: ReturnType<typeof setTimeout> | null = null;

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
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "round:state", payload: event }),
  );
}

export function handleRoundWaiting(event: RoundWaitingEvent) {
  clearCrashFlashTimeout();

  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "round:waiting", payload: event }),
  );
  useMultiplierStore.getState().setMultiplier(1);
}

export function handleRoundStart(event: RoundStartEvent) {
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "round:start", payload: event }),
  );
  useMultiplierStore.getState().setMultiplier(1);
}

export function handleRoundTick(event: RoundTickEvent) {
  const currentRoundId = useGameStore.getState().roundId;

  if (event.roundId !== currentRoundId) {
    return;
  }

  useMultiplierStore.getState().setMultiplier(event.multiplier);
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "round:tick", payload: event }),
  );
}

export function handleRoundCrash(event: RoundCrashEvent) {
  const currentRoundId = useGameStore.getState().roundId;

  if (event.roundId !== currentRoundId) {
    return;
  }

  useMultiplierStore.getState().setMultiplier(event.crashPoint);
  useGameStore.setState((state) =>
    applyGameEvent(state, { type: "round:crash", payload: event }),
  );

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
