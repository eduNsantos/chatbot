import type { FastifyInstance } from 'fastify';
import MessageController from '../presenters/http/message/controllers/message.controller.js';
import SendMessageUseCase from '../application/message/use-cases/send-message.use-case.js';
import { socketRepository } from '../server.js';

export async function messageRoutes(fastify: FastifyInstance) {
  const useCase = new SendMessageUseCase(socketRepository)
  const messageController = new MessageController(useCase);

  // POST /message
  fastify.post('/message', messageController.sendMessage.bind(messageController));
}

