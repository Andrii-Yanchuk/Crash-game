import { useGameStore } from "@/stores/game";
import { useEffect, useRef } from "react";
import useSound from "use-sound";

export function useSocketSounds() {
  const isSoundEnabled = useGameStore((state) => state.isSoundEnabled);
  const [playWinSound] = useSound("/sounds/win.mp3", {
    soundEnabled: isSoundEnabled,
    volume: 0.7,
  });
  const [playLoseSound] = useSound("/sounds/lose.mp3", {
    soundEnabled: isSoundEnabled,
    volume: 0.7,
  });
  const playWinSoundRef = useRef(playWinSound);
  const playLoseSoundRef = useRef(playLoseSound);

  useEffect(() => {
    playWinSoundRef.current = playWinSound;
  }, [playWinSound]);

  useEffect(() => {
    playLoseSoundRef.current = playLoseSound;
  }, [playLoseSound]);

  return {
    playWinSoundRef,
    playLoseSoundRef,
  };
}
