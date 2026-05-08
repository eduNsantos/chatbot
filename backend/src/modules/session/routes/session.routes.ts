import type { FastifyInstance } from 'fastify';
import { contactRoutes } from '../../contact/routes/contact.routes.js';
import { messageRoutes } from '../../message/routes/message.routes.js';
import type SessionController from '../controlllers/session.controller.js';
import type ContactController from '../../contact/controllers/contact.controller.js';
import type MessageController from '../../message/controllers/message.controller.js';

export interface SessionRoutesOptions {
    sessionController: SessionController;
    contactController: ContactController;
    messageController: MessageController;
}

export async function sessionRoutes(fastify: FastifyInstance, options: SessionRoutesOptions) {
    const { sessionController, contactController, messageController } = options;

    fastify.get('/', sessionController.listSessions.bind(sessionController));
    fastify.put('/:sessionId', sessionController.updateSession.bind(sessionController));

    fastify.register(contactRoutes, { prefix: '/:sessionId/contacts', contactController });
    fastify.register(messageRoutes, { prefix: '/:sessionId/message', messageController });
}

