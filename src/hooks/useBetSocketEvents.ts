import { getSocket } from "@/lib/socket";
import {
  handleBetCashedOut,
  handleBetLost,
  handleBetPlaced,
  handleBetRejected,
} from "@/socket/handlers";
import { BetCashedOutEvent } from "@/types/type";
import { useEffect } from "react";

type SoundRef = {
  current: () => void;
};

export function useBetSocketEvents(playWinSoundRef: SoundRef) {
  useEffect(() => {
    const socket = getSocket();

    function handleBetCashedOutWithSound(event: BetCashedOutEvent) {
      handleBetCashedOut(event);
      playWinSoundRef.current();
    }

    socket.on("bet:placed", handleBetPlaced);
    socket.on("bet:cashedOut", handleBetCashedOutWithSound);
    socket.on("bet:lost", handleBetLost);
    socket.on("bet:rejected", handleBetRejected);

    return () => {
      socket.off("bet:placed", handleBetPlaced);
      socket.off("bet:cashedOut", handleBetCashedOutWithSound);
      socket.off("bet:lost", handleBetLost);
      socket.off("bet:rejected", handleBetRejected);
    };
  }, [playWinSoundRef]);
}
