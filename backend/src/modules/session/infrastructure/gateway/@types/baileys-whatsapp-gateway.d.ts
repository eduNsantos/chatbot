import type { MessageUpsertType, WAMessage } from "@whiskeysockets/baileys";

export interface BaileysWhatsappGatewayUpsertMessage {
    messages: WAMessage[];
    type: MessageUpsertType;
    requestId?: string;
}

