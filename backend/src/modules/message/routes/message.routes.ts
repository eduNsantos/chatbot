import type { FastifyInstance } from 'fastify';
import type MessageController from '../controllers/message.controller.js';

export interface MessageRoutesOptions {
    messageController: MessageController;
}

export async function messageRoutes(fastify: FastifyInstance, options: MessageRoutesOptions) {
    const { messageController } = options;

    fastify.post('/', messageController.sendMessage.bind(messageController));
    fastify.get('/:contactId', messageController.listMessageByContact.bind(messageController));
}

