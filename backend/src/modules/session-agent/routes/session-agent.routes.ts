import type { FastifyInstance } from 'fastify';
import type SessionAgentController from '../controllers/session-agent-controller.js';

export interface SessionAgentRoutesOptions {
    sessionAgentController: SessionAgentController;
}

export async function sessionAgentRoutes(fastify: FastifyInstance, options: SessionAgentRoutesOptions) {
    const { sessionAgentController } = options;

    fastify.get('/', sessionAgentController.listAgentBySession.bind(sessionAgentController));
    fastify.put('/', sessionAgentController.upsertSessionAgent.bind(sessionAgentController));
}

