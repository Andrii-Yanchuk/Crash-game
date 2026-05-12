import { socket } from "@/lib/socket";
import { useGameStore } from "@/stores/game";
import { useEffect } from "react";

export function useSocketConnection(username: string | null) {
  const setIsConnected = useGameStore((state) => state.setIsConnected);
  const setIsReconnecting = useGameStore((state) => state.setIsReconnecting);
  const setConnectionError = useGameStore((state) => state.setConnectionError);

  useEffect(() => {
    function handleConnect() {
      setIsConnected(true);
      setIsReconnecting(false);
      setConnectionError(null);
    }

    function handleDisconnect() {
      setIsConnected(false);
    }

    function handleConnectError(error: Error) {
      setIsConnected(false);
      setIsReconnecting(true);
      setConnectionError(error.message || "Socket connection failed");
    }

    function handleReconnectAttempt() {
      setIsReconnecting(true);
      setConnectionError(null);
    }

    function handleReconnect() {
      setIsConnected(true);
      setIsReconnecting(false);
      setConnectionError(null);
    }

    function handleReconnectFailed() {
      setIsConnected(false);
      setIsReconnecting(false);
      setConnectionError("Socket reconnect failed");
    }

    setIsConnected(socket.connected);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);
    socket.io.on("reconnect", handleReconnect);
    socket.io.on("reconnect_failed", handleReconnectFailed);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
      socket.io.off("reconnect", handleReconnect);
      socket.io.off("reconnect_failed", handleReconnectFailed);
      setIsConnected(false);
      setIsReconnecting(false);
      setConnectionError(null);
    };
  }, [setConnectionError, setIsConnected, setIsReconnecting]);

  useEffect(() => {
    if (!username) {
      setIsConnected(false);
      setIsReconnecting(false);
      setConnectionError(null);
      socket.disconnect();
      return;
    }

    socket.auth = {
      apiKey: username,
    };
    socket.connect();

    return () => {
      setIsConnected(false);
      setIsReconnecting(false);
      setConnectionError(null);
      socket.disconnect();
    };
  }, [setConnectionError, setIsConnected, setIsReconnecting, username]);
}
