import { socket } from "@/lib/socket";
import { useEffect } from "react";

export function useSocket(username: string | null) {
  useEffect(() => {
    if (!username) {
      socket.disconnect();
      return;
    }

    socket.auth = {
      apiKey: username,
    };

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [username]);
}
