import type { Message } from "@prisma/client";
import type { CreateMessage } from "./message.contract.js";

export default interface MessageRepositoryContract {
    createMessage(props: CreateMessage): Promise<void>;
    findMessageByContactId(contactId: number): Promise<Message[]>;
}