import type { FastifyInstance } from 'fastify';
import MakeMessageControllerFactory from '../factories/make-message-controller.factory.js';

export async function messageRoutes(fastify: FastifyInstance) {
  const messageController = MakeMessageControllerFactory.create();

  // POST /message
  fastify.post('/message', messageController.sendMessage.bind(messageController));
}

