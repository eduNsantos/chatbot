import type { MessageEntity } from "../entities/message.entity.js";
import type MessageRepository from "../infrastructure/repositories/message.repository.js";

export default class ListMessageByContactUseCase {

    constructor(
        private messageRepository: MessageRepository
    ) {}

    async execute(contactId: number): Promise<MessageEntity[]> {
        const messages = await this.messageRepository.findMessageByContactId(contactId);

        return messages;
    }
}