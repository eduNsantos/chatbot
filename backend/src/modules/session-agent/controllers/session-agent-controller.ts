import type { FastifyReply, FastifyRequest } from "fastify";
import FindSessionAgentUseCase from "../use-cases/find-session-agent.use-case.js";
import type UpsertSessionAgentUseCase from "../use-cases/upsert-session-agent.use-case.js";

export default class SessionAgentController {
    constructor(
        private findSessionAgentUseCase: FindSessionAgentUseCase,
        private upsertSessionAgentUseCase: UpsertSessionAgentUseCase
    ) {

    }

    public async listAgentBySession(req: FastifyRequest<{ Params: { sessionId: string } }>, res: FastifyReply) {

        try {
            const { sessionId } = req.params;

            if (!sessionId) {
                return res.status(400).send({ error: 'Missing session ID' });
            }

            const sessionAgent = await this.findSessionAgentUseCase.execute({ sessionId });

            res.send(sessionAgent);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }

    public async upsertSessionAgent(req: FastifyRequest<{ Body: { prompt: string }, Params: { sessionId: string } }>, res: FastifyReply) {
        try {
            if (!req.body?.prompt || !req.params?.sessionId) {
                return res.status(400).send({ error: 'Missing required fields: sessionId, prompt' });
            }

            const { sessionId } = req.params;
            const { prompt } = req.body;

            await this.upsertSessionAgentUseCase.execute({
                sessionId,
                name: `default`, // TODO: allow custom name in the future
                config: {
                    prompt: prompt
                }
            });

            res.send({ message: 'Session agent upserted successfully' });
        } catch (error) {
            console.log('Error upserting session agent:', error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
}
