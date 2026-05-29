import { getSocket } from "@/lib/socket";
import {
  clearCrashFlashTimeout,
  handleRoundCrash,
  handleRoundStart,
  handleRoundState,
  handleRoundTick,
  handleRoundWaiting,
} from "@/socket/handlers";
import { RoundCrashEvent } from "@/types/type";
import { useEffect } from "react";

type SoundRef = {
  current: () => void;
};

export function useRoundSocketEvents(playLoseSoundRef: SoundRef) {
  useEffect(() => {
    const socket = getSocket();

    function handleRoundCrashWithSound(event: RoundCrashEvent) {
      handleRoundCrash(event);
      playLoseSoundRef.current();
    }

    socket.on("round:state", handleRoundState);
    socket.on("round:waiting", handleRoundWaiting);
    socket.on("round:start", handleRoundStart);
    socket.on("round:tick", handleRoundTick);
    socket.on("round:crash", handleRoundCrashWithSound);

    return () => {
      socket.off("round:state", handleRoundState);
      socket.off("round:waiting", handleRoundWaiting);
      socket.off("round:start", handleRoundStart);
      socket.off("round:tick", handleRoundTick);
      socket.off("round:crash", handleRoundCrashWithSound);
      clearCrashFlashTimeout();
    };
  }, [playLoseSoundRef]);
}
