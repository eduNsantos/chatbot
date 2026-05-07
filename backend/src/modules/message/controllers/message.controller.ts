import type { FastifyReply, FastifyRequest } from "fastify";
import type SendMessageUseCase from "../use-cases/send-message.use-case.js";
import type { FindMessageByContactRequest, SendMessageRequest } from "./message.types.js";
import SendMessageDto from "../dtos/send-message.dto.js";
import type ListMessageUseCase from "../use-cases/list-message.use-case.js";
import type ListMessageByContactUseCase from "../use-cases/list-message.use-case.js";

export default class MessageController {
    public constructor(
        private sendMessageUseCase: SendMessageUseCase,
        private listMessageByContactUseCase: ListMessageByContactUseCase
    ) {}

    async listMessageByContact(req: FindMessageByContactRequest, res: FastifyReply) {
        const messages = await this.listMessageByContactUseCase.execute(req.params.contactId);

        return res.send(messages);
    }

    async sendMessage(req: SendMessageRequest, res: FastifyReply) {
        try {
            const { to, type, message } = req.body;
            const { sessionId } = req.params;

            if (!sessionId) {
                return res.status(400).send({ error: 'Missing session ID' });
            }

            if (!to || !type || !message) {
                return res.status(400).send({ error: 'Missing required fields: to, type, message' });
            }

            const sendMessageDto = new SendMessageDto(sessionId, to, type, message);

            const result = await this.sendMessageUseCase.execute(sendMessageDto);

            return res.send(result);
        } catch (error: Error | any) {
            if (error?.message === 'SOCKET_NOT_CONNECTED') {
                return res.status(404).send({ error: 'Session not found' });
            }

            return res.status(500).send({ error: 'Failed to send message' });
        }
    }
}
