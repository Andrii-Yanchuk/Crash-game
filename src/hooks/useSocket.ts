import { useSocketConnection } from "./useSocketConnection";
import { useSocketEvents } from "./useSocketEvents";
import { useSocketSounds } from "./useSocketSounds";

export function useSocket(username: string | null) {
  const soundRefs = useSocketSounds();

  useSocketEvents(soundRefs);
  useSocketConnection(username);
}
