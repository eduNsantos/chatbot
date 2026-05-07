export interface MessageEntity {
    id: number;
    contactId: number;
    sessionId: string;
    messageId: string;
    type: string;
    content: string;
    rawPayload: string | null;
    mediaUrl: string | null;
    timestamp: Date;
    key: string;
    isGroup: boolean;
    fromMe: boolean;
    createdAt: Date;
    updatedAt: Date;
}
