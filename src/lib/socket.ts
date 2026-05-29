import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket";

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socketInstance: GameSocket | null = null;

export function getSocket(): GameSocket {
  if (typeof window === "undefined") {
    throw new Error("getSocket() must be called on the client");
  }

  if (!socketInstance) {
    const url = process.env.NEXT_PUBLIC_WS_URL;

    if (!url) {
      throw new Error("NEXT_PUBLIC_WS_URL is not configured");
    }

    socketInstance = io(url, {
      autoConnect: false,
    });
  }

  return socketInstance;
}
