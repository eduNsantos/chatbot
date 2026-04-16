import type { FastifyInstance } from 'fastify';
import { messageRoutes } from '../../messages/routes/message.routes.js';
import { makeSessionController } from '../factories/make-session-controller.factory.js';


export async function sessionRoutes(fastify: FastifyInstance) {
  const sessionController = makeSessionController();

  fastify.get('/', sessionController.listSessions.bind(sessionController));
  fastify.put('/:session_id', sessionController.updateSession.bind(sessionController));

  fastify.register(messageRoutes, { prefix: '/:session_id/message' });
}

