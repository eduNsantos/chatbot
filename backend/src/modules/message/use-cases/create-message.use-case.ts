import type MessageRepositoryContract from "../contracts/message-repository.contract.js";
import type { CreateMessage } from "../contracts/message.contract.js";
import type ContactUpdateUseCase from "../../contact/use-cases/contact-update.use-case.js";

export default class CreateMessageUseCase {
    constructor(
        private messageRepository: MessageRepositoryContract,
        private updateContactUseCase: ContactUpdateUseCase
    ) {}

    async execute(dto: CreateMessage): Promise<void> {
        await this.messageRepository.createMessage(dto);

        await this.updateContactUseCase.execute({
            id: dto.contactId,
            lastMessageAt: new Date()
        });
    }
}