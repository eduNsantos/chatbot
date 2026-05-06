export default interface MessageContract {
    sendMessage(to: string, message: string): Promise<{ success: boolean, to: string, message: string }>;
}


type CreateMessage = {
    contactId: number;
    sessionId: string;
    type: string;
    message: string;
    rawPayloadJson?: string;
    mediaUrl?: string;
    isGroup: boolean;
    key: string;
    fromMe: boolean;
}

export type {
    CreateMessage
}