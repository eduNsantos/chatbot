import type { FastifyInstance } from 'fastify';
import { messageRoutes } from '../../messages/routes/message.routes.js';
import MakeSessionControllerFactory from '../factories/make-session-controller.js';


export async function sessionRoutes(fastify: FastifyInstance) {
  const sessionController = MakeSessionControllerFactory.create();

  // GET /sessions
  fastify.get('/', sessionController.listSessions.bind(sessionController));

  fastify.register(messageRoutes, {
    prefix: '/:session_id'
  });
}

