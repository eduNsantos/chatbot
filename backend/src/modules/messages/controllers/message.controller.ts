import type { FastifyReply, FastifyRequest } from "fastify";
import type SendMessageUseCase from "../use-cases/send-message.use-case.js";

export default class MessageController {
    public constructor(private sendMessageUseCase: SendMessageUseCase) {}

    async sendMessage(req: FastifyRequest, res: FastifyReply) {
        const { to, message } = req.body as { to: string, message: string };

        try {
            const result = await this.sendMessageUseCase.execute(to, message);

            return res.send(result);
        } catch (error: Error | any) {
            if (error?.message === 'SOCKET_NOT_CONNECTED') {
                return res.status(404).send({ error: 'Session not found' });
            }

            return res.status(500).send({ error: 'Failed to send message' });
        }
    }
}
