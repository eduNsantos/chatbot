import type { FastifyInstance } from 'fastify';
import SessionController from '../presenters/http/message/controllers/session.controller.js';
import SessionsListUseCase from '../application/session/use-cases/sessions-list.use-case.js';
import BaileysSessionRepository from '../infrastructure/external/baileys/baileys-session.repository.js';
import { messageRoutes } from './conversation.routes.js';

export async function sessionRoutes(fastify: FastifyInstance) {
  const sessionRepository = new BaileysSessionRepository();
  const useCase = new SessionsListUseCase(sessionRepository);
  const sessionController = new SessionController(useCase);

  // GET /sessions
  fastify.get('/', sessionController.listSessions.bind(sessionController));

  fastify.register(messageRoutes, {
    prefix: '/:session_id'
  });
}
