export interface ContactEntity {
    id: number;
    sessionId: string;
    whatsappId: string;
    whatsappNumber: string | null;
    pictureUrl: string | null;
    name: string | null;
    isGroup: boolean;
    lastMessageAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
