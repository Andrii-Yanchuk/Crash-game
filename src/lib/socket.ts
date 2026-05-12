import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket";

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_WS_URL!,
  {
    autoConnect: false,
  },
);
