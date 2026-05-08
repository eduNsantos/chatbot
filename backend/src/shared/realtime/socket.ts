import type { Server as HttpServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

type MessageNotificationPayload = {
    contactId: number;
    sessionId: string;
    message: string;
    fromMe: boolean;
    type: string;
    key: string;
    createdAt: string;
};

type ContactNotificationPayload = {
    id: number;
    sessionId: string;
    whatsappId: string;
    whatsappNumber: string | null;
    pictureUrl: string | null;
    name: string | null;
    isGroup: boolean;
    lastMessageAt: string | null;
    createdAt: string;
    updatedAt: string;
};

let io: SocketIOServer | null = null;

function getContactRoom(contactId: number): string {
    return `contact:${contactId}`;
}

function getSessionRoom(sessionId: string): string {
    return `session:${sessionId}`;
}

export function initRealtime(server: HttpServer): SocketIOServer {
    if (io) {
        return io;
    }

    io = new SocketIOServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", socket => {
        socket.on("session:join", (sessionId: string) => {
            if (!sessionId || typeof sessionId !== "string") {
                return;
            }

            socket.join(getSessionRoom(sessionId));
        });

        socket.on("session:leave", (sessionId: string) => {
            if (!sessionId || typeof sessionId !== "string") {
                return;
            }

            socket.leave(getSessionRoom(sessionId));
        });

        socket.on("contact:join", (contactId: number) => {
            if (!Number.isInteger(contactId)) {
                return;
            }

            socket.join(getContactRoom(contactId));
        });

        socket.on("contact:leave", (contactId: number) => {
            if (!Number.isInteger(contactId)) {
                return;
            }

            socket.leave(getContactRoom(contactId));
        });
    });

    return io;
}

export function notifyMessageByContact(payload: MessageNotificationPayload): void {
    if (!io) {
        return;
    }

    io.to(getContactRoom(payload.contactId)).emit("message:new", payload);
    io.to(getSessionRoom(payload.sessionId)).emit("session:message:new", payload);
}

export function notifyContactUpsert(payload: ContactNotificationPayload): void {
    if (!io) {
        return;
    }

    io.to(getSessionRoom(payload.sessionId)).emit("session:contact:upsert", payload);
}
