import Fastify from 'fastify';
import { conversationRoutes } from './routes/conversation.routes.js';
import InitChatUseCase from './application/chat/use-cases/init-chat.use-case.js';
import BaileysRepository from './infrastructure/external/baileys/baileys.repository.js';

const fastify = Fastify();

const PORT = 3000;

const server = async () => {

  await fastify.register(conversationRoutes);

  fastify.listen({ port: PORT }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });

  const initChatUseCase = new InitChatUseCase(new BaileysRepository());
  await initChatUseCase.execute();

};

export default server;
