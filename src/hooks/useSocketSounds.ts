import { getIsSoundEnabled } from "@/stores/sound";
import { useEffect, useRef } from "react";
import useSound from "use-sound";

export function useSocketSounds() {
  const [playWinSound] = useSound("/sounds/win.mp3", {
    volume: 0.7,
  });
  const [playLoseSound] = useSound("/sounds/lose.mp3", {
    volume: 0.7,
  });
  const playWinSoundRef = useRef(() => {});
  const playLoseSoundRef = useRef(() => {});

  useEffect(() => {
    playWinSoundRef.current = () => {
      if (getIsSoundEnabled()) {
        playWinSound();
      }
    };
  }, [playWinSound]);

  useEffect(() => {
    playLoseSoundRef.current = () => {
      if (getIsSoundEnabled()) {
        playLoseSound();
      }
    };
  }, [playLoseSound]);

  return {
    playWinSoundRef,
    playLoseSoundRef,
  };
}
