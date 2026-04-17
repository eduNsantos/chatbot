import type WhatsappGatewayContract from "../../session/contracts/whatsapp-gateway.contract.js";
import type SendMessageDto from "../dtos/send-message.dto.js";

export default class SendMessageUseCase {
    constructor(private whatsappGateway: WhatsappGatewayContract) {}

    async execute(dto: SendMessageDto) {
        const { sessionId, to, type, message } = dto;

        await this.whatsappGateway.sendMessage(sessionId, to, type, message);

        return { success: true, to, type, message };
    }
}