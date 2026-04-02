import { io } from "socket.io-client";

const URL = "http://localhost:3000"; // Need to change dynamically

export const socket = io(URL, {
    autoConnect: false, // we will decide when to connect
});
