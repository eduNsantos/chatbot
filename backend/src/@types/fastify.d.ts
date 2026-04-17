import SessionController from '../presenters/http/message/controllers/session.controller.js';
import MessageController from '../modules/message/controllers/message.controller.ts';

declare module 'fastify' {
  interface FastifyInstance {
    sessionController: SessionController;
    messageController: MessageController;
  }
}