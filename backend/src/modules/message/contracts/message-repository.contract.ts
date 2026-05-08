import type { MessageEntity } from "../entities/message.entity.js";
import type { CreateMessage } from "./message.contract.js";

export default interface MessageRepositoryContract {
    createMessage(props: CreateMessage): Promise<boolean>;
    findMessageByContactId(contactId: number): Promise<MessageEntity[]>;
}