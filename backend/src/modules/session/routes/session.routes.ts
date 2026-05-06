import type { FastifyInstance } from 'fastify';
import { contactRoutes } from '../../contact/routes/contact.routes.js';
import { messageRoutes } from '../../message/routes/message.routes.js';
import { makeSessionController } from '../factories/make-session-controller.factory.js';


export async function sessionRoutes(fastify: FastifyInstance) {
  const sessionController = makeSessionController();

  fastify.get('/', sessionController.listSessions.bind(sessionController));
  fastify.put('/:sessionId', sessionController.updateSession.bind(sessionController));

  fastify.register(contactRoutes, { prefix: '/:sessionId/contacts' });
  fastify.register(messageRoutes, { prefix: '/:sessionId/message' });
}

