import type WhatsappGatewayContract from "../../session/contracts/whatsapp-gateway.contract.js";
import type SendMessageDto from "../dtos/send-message.dto.js";

export default class SendMessageUseCase {
    constructor(private whatsappGateway: WhatsappGatewayContract) {}

    async execute(dto: SendMessageDto) {
        const { sessionId, to, type, message } = dto;

        let formattedTo = to.replace(/\D/g, '');

        if (type === 'person') {
            formattedTo = `${formattedTo}@s.whatsapp.net`
        } else if (type === 'group') {
            formattedTo = `${formattedTo}@g.us`
        } else {
            throw new Error('Invalid message type');
        }

        await this.whatsappGateway.sendMessage(sessionId, formattedTo, type, message);

        return { success: true, to: formattedTo, type, message };
    }
}