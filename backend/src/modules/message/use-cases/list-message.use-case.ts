import type { Message } from "@prisma/client";
import type MessageRepository from "../infrastructure/repositories/message.repository.js";

export default class ListMessageByContactUseCase {

    constructor(
        private messageRepository: MessageRepository
    ) {}

    async execute(contactId: number): Promise<Message[]> {
        const messages = await this.messageRepository.findMessageByContactId(contactId);

        return messages;
    }
}