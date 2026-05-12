import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL;

if (!SOCKET_URL) {
  throw new Error("NEXT_PUBLIC_WS_URL is not configured");
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  SOCKET_URL,
  {
    autoConnect: false,
  },
);
