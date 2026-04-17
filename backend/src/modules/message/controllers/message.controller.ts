import type { FastifyReply, FastifyRequest } from "fastify";
import type SendMessageUseCase from "../use-cases/send-message.use-case.js";
import type { SendMessageRequest } from "../@types/message.types.js";
import SendMessageDto from "../dtos/send-message.dto.js";

export default class MessageController {
    public constructor(private sendMessageUseCase: SendMessageUseCase) {}

    async sendMessage(req: SendMessageRequest, res: FastifyReply) {
        try {
            const { to, type, message } = req.body;
            const { sessionId } = req.params;


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
