import { getSocket } from "@/lib/socket";
import {
  handlePlayerBet,
  handlePlayerCashout,
  handlePlayerLost,
} from "@/socket/handlers";
import { useEffect } from "react";

export function usePlayerSocketEvents() {
  useEffect(() => {
    const socket = getSocket();

    socket.on("players:bet", handlePlayerBet);
    socket.on("players:cashout", handlePlayerCashout);
    socket.on("players:lost", handlePlayerLost);

    return () => {
      socket.off("players:bet", handlePlayerBet);
      socket.off("players:cashout", handlePlayerCashout);
      socket.off("players:lost", handlePlayerLost);
    };
  }, []);
}
