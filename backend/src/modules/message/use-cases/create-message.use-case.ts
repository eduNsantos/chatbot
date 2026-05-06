import type MessageRepositoryContract from "../contracts/message-repository.contract.js";
import type { CreateMessage } from "../contracts/message.contract.js";

export default class CreateMessageUseCase {
    constructor(
        private messageRepository: MessageRepositoryContract
    ) {}

    async execute(dto: CreateMessage): Promise<void> {
        await this.messageRepository.createMessage(dto);
    }
}