import type { FastifyInstance } from 'fastify';
import makeMessageController from '../factories/make-message-repository.factory.js';

export async function messageRoutes(fastify: FastifyInstance) {
  const messageController = makeMessageController();

  // POST /message
  fastify.post('/', messageController.sendMessage.bind(messageController));
  fastify.get('/:contactId', messageController.listMessageByContact.bind(messageController));
}

