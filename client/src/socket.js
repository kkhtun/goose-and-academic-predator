import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_HOST; // Need to change dynamically

export const socket = io(API_BASE, {
    autoConnect: false, // we will decide when to connect
});
