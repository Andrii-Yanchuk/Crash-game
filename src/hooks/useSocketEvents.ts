import { useBetSocketEvents } from "./useBetSocketEvents";
import { usePlayerSocketEvents } from "./usePlayerSocketEvents";
import { useRoundSocketEvents } from "./useRoundSocketEvents";

type SoundRef = {
  current: () => void;
};

type SocketSoundRefs = {
  playWinSoundRef: SoundRef;
  playLoseSoundRef: SoundRef;
};

export function useSocketEvents({
  playWinSoundRef,
  playLoseSoundRef,
}: SocketSoundRefs) {
  useRoundSocketEvents(playLoseSoundRef);
  useBetSocketEvents(playWinSoundRef);
  usePlayerSocketEvents();
}
