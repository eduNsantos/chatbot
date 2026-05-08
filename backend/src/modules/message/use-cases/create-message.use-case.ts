import type MessageRepositoryContract from "../contracts/message-repository.contract.js";
import type { CreateMessage } from "../contracts/message.contract.js";
import type ContactUpdateUseCase from "../../contact/use-cases/contact-update.use-case.js";
import { notifyMessageByContact } from "../../../shared/realtime/socket.js";

export default class CreateMessageUseCase {
    constructor(
        private messageRepository: MessageRepositoryContract,
        private updateContactUseCase: ContactUpdateUseCase
    ) {}

    async execute(dto: CreateMessage): Promise<void> {
        const occurredAt = dto.occurredAt ?? new Date();
        const wasCreated = await this.messageRepository.createMessage(dto);

        if (!wasCreated) {
            return;
        }

        await this.updateContactUseCase.execute({
            id: dto.contactId,
            lastMessageAt: occurredAt
        });

        notifyMessageByContact({
            contactId: dto.contactId,
            sessionId: dto.sessionId,
            message: dto.message,
            fromMe: dto.fromMe,
            type: dto.type,
            key: dto.key,
            createdAt: occurredAt.toISOString()
        });
    }
}