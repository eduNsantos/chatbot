import type { FastifyReply, FastifyRequest } from "fastify";
import type SendMessageUseCase from "../../../../application/message/use-cases/send-message.use-case.js";

export default class MessageController {
    public constructor(private sendMessageUseCase: SendMessageUseCase) {
        this.sendMessageUseCase = sendMessageUseCase;
    }

    async sendMessage(req: FastifyRequest, res: FastifyReply) {
        const { to, message } = req.body as { to: string, message: string };



        return res.send({
            to, message
        });
    }
}
