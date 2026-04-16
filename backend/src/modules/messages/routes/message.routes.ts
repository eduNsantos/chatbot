import type { FastifyInstance } from 'fastify';
import makeMessageController from '../factories/make-message-controller.factory.js';

export async function messageRoutes(fastify: FastifyInstance) {
  const messageController = makeMessageController();

  // POST /message
  fastify.post('/message', messageController.sendMessage.bind(messageController));
}

