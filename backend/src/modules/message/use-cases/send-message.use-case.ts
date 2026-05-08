import type WhatsappGatewayContract from "../../session/contracts/whatsapp-gateway.contract.js";
import type FindOrCreateContactUseCase from "../../contact/use-cases/find-or-create-contact.use-case.js";
import type CreateMessageUseCase from "./create-message.use-case.js";
import type SendMessageDto from "../dtos/send-message.dto.js";
import { safeJSONStringify } from "../../../shared/utils/safe-json-stringify.js";

export default class SendMessageUseCase {
    constructor(
        private whatsappGateway: WhatsappGatewayContract,
        private findOrCreateContactUseCase: FindOrCreateContactUseCase,
        private createMessageUseCase: CreateMessageUseCase
    ) {}

    async execute(dto: SendMessageDto) {
        const { sessionId, to, type, message } = dto;

        const rawNumber = to.replace(/\D/g, '');

        let formattedTo: string;
        if (type === 'person') {
            formattedTo = `${rawNumber}@s.whatsapp.net`;
        } else if (type === 'group') {
            formattedTo = `${rawNumber}@g.us`;
        } else {
            throw new Error('Invalid message type');
        }

        const { messageKey } = await this.whatsappGateway.sendMessage(sessionId, formattedTo, type, message);

        const contact = await this.findOrCreateContactUseCase.execute({
            whatsappId: formattedTo,
            whatsappNumber: rawNumber,
            name: dto.name ?? formattedTo,
            sessionId
        });

        await this.createMessageUseCase.execute({
            contactId: contact.id,
            sessionId,
            type: 'conversation',
            message,
            rawPayloadJson: safeJSONStringify({
                to: formattedTo,
                type,
                message,
                messageKey
            }),
            isGroup: type === 'group',
            key: messageKey,
            fromMe: true
        });

        return { success: true, to: formattedTo, type, message };
    }
}