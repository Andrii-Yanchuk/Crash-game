import { socket } from "@/lib/socket";
import { useGameStore } from "@/stores/game";
import { RoundStateEvent } from "@/types/type";
import { useEffect } from "react";

function handleRoundState(event: RoundStateEvent) {
  useGameStore.getState().applyRoundState(event);
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
    socket.connect();

    return () => {
      socket.off("round:state", handleRoundState);
      socket.disconnect();
    };
  }, [username]);
}
