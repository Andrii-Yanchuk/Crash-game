import { socket } from "@/lib/socket";
import { getTemporaryApiKey } from "@/lib/apiKey";
import { useEffect } from "react";

export function useSocket(username: string | null) {
  useEffect(() => {
    if (!username) {
      socket.disconnect();
      return;
    }

    socket.auth = {
      apiKey: getTemporaryApiKey(username),
    };

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [username]);
}
