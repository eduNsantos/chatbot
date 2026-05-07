import type { FastifyReply, FastifyRequest } from "fastify";
import type SessionsListUseCase from "../use-cases/sessions-list.use-case.js";
import SessionUpdateDto from "../dtos/session-update.dto.js";
import type SessionUpdateUseCase from "../use-cases/session-update.use-case.js";
import type { UpdateSessionRequest } from "./session.types.js";


export default class SessionController {
    public constructor(
        private sessionsListUseCase: SessionsListUseCase,
        private sessionUpdateUseCase: SessionUpdateUseCase
    ) {}

    async listSessions(req: FastifyRequest, reply: FastifyReply) {
        const sessions = await this.sessionsListUseCase.execute();

        return reply.send(sessions);
    }

    async updateSession(req: UpdateSessionRequest, reply: FastifyReply) {
        if (!req?.params?.sessionId) {
            return reply.status(400).send({ error: "Missing session ID" });
        }

        if (req.body?.sessionName === undefined) {
            return reply.status(400).send({ error: "Missing session sessionName" });
        }

        const sessionUpdateDto = new SessionUpdateDto(
            req.params.sessionId,
            req.body.sessionName
        );

        const sessions = await this.sessionUpdateUseCase.execute(sessionUpdateDto);

        return reply.send(sessions);
    }
}
