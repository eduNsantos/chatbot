import { prisma } from "../../../../database/prisma.js";
import { Prisma } from "@prisma/client";
import type MessageRepositoryContract from "../../contracts/message-repository.contract.js";
import type { CreateMessage } from "../../contracts/message.contract.js";

export default class MessageRepository implements MessageRepositoryContract {
    constructor() {}

    async createMessage(props: CreateMessage): Promise<boolean> {
        try {
            await prisma.message.create({
                data: {
                    messageId: props.key,
                    sessionId: props.sessionId,
                    type: props.type,
                    content: props.message,
                    timestamp: props.occurredAt ?? new Date(),
                    rawPayload: props.rawPayloadJson ?? null,
                    mediaUrl: props.mediaUrl ?? null,
                    isGroup: props.isGroup,
                    key: props.key,
                    fromMe: props.fromMe,
                    contactId: props.contactId
                }
            });

            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                return false;
            }

            throw error;
        }
    }

    public findMessageByContactId(contactId: number) {

        return prisma.message.findMany({
            where: {
                contactId: Number(contactId)
            }
        });
    }
}