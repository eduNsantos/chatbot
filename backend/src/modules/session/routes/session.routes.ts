import type { FastifyInstance } from 'fastify';
import { contactRoutes } from '../../contact/routes/contact.routes.js';
import { messageRoutes } from '../../message/routes/message.routes.js';
import type SessionController from '../controlllers/session.controller.js';
import type ContactController from '../../contact/controllers/contact.controller.js';
import type MessageController from '../../message/controllers/message.controller.js';
import { sessionAgentRoutes } from '../../session-agent/routes/session-agent.routes.js';
import type SessionAgentController from '../../session-agent/controllers/session-agent-controller.js';

export interface SessionRoutesOptions {
    sessionController: SessionController;
    contactController: ContactController;
    messageController: MessageController;
    sessionAgentController: SessionAgentController;
}

export async function sessionRoutes(fastify: FastifyInstance, options: SessionRoutesOptions) {
    const { sessionController, contactController, messageController, sessionAgentController } = options;

    fastify.get('/', sessionController.listSessions.bind(sessionController));
    fastify.put('/:sessionId', sessionController.updateSession.bind(sessionController));

    fastify.register(contactRoutes, { prefix: '/:sessionId/contacts', contactController });
    fastify.register(messageRoutes, { prefix: '/:sessionId/message', messageController });
    fastify.register(sessionAgentRoutes, { prefix: '/:sessionId/agent', sessionAgentController  });
}

