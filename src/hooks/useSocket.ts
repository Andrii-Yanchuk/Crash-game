import { socket } from "@/lib/socket";
import { useGameStore } from "@/stores/game";
import { RoundStateEvent, RoundWaitingEvent } from "@/types/type";
import { useEffect } from "react";

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
    socket.connect();

    return () => {
      socket.off("round:state", handleRoundState);
      socket.off("round:waiting", handleRoundWaiting);
      socket.disconnect();
    };
  }, [username]);
}
