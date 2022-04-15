import { io, Socket } from "socket.io-client";
import { ClientEvents, ServerEvents } from "./events";

export const socket: Socket<ServerEvents, ClientEvents> = io();
