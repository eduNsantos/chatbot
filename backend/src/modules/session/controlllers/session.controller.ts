import type { FastifyReply, FastifyRequest } from "fastify";
import type SessionsListUseCase from "../use-cases/sessions-list.use-case.js";

export default class SessionController {
    public constructor(private sessionsListUseCase: SessionsListUseCase) {
        this.sessionsListUseCase = sessionsListUseCase;
    }

    async listSessions(req: FastifyRequest, res: FastifyReply) {
        const sessions = await this.sessionsListUseCase.execute();

        return res.send(sessions);
    }
}
