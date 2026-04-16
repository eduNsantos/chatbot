import type { WASocket } from "@whiskeysockets/baileys";

export default interface SocketContract {
    initSession(): Promise<void>;
    // getSocket(): Promise<WASocket | null>;
    sendMessage(to: string, message: string): Promise<void>;
    // onMessage(callback: (message: { from: string; body: string }) => void): void;
}

