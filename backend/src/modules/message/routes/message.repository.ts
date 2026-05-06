import { prisma } from "../../../database/prisma.js";
import type MessageRepositoryContract from "../contracts/message-repository.contract.js";
import type { CreateMessage } from "../contracts/message.contract.js";

export default class MessageRepository implements MessageRepositoryContract {
    constructor() {}

    async createMessage(props: CreateMessage) {
        await prisma.message.create({
            data: {
                messageId: props.key,
                sessionId: props.sessionId,
                type: props.type,
                content: props.message,
                rawPayload: props.rawPayloadJson ?? null,
                mediaUrl: props.mediaUrl ?? null,
                isGroup: props.isGroup,
                key: props.key,
                fromMe: props.fromMe,
                contactId: props.contactId
            }
        });
    }
}