import { io } from "socket.io-client";

const realtimeSocket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"]
});

export default realtimeSocket;
