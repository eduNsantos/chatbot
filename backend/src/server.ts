import Fastify from 'fastify';
import InitChatUseCase from './application/chat/use-cases/init-chat.use-case.js';
import BaileysRepository from './infrastructure/external/baileys/baileys.repository.js';
import { sessionRoutes } from './routes/sessions.routes.js';

const fastify = Fastify();

const PORT = 3000;

const socketRepository = new BaileysRepository();
const initChatUseCase = new InitChatUseCase(socketRepository);
await initChatUseCase.execute();

const server = async () => {
  await fastify.register(sessionRoutes, {
    prefix: '/sessions'
  });

  fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Server listening at ${address}`);
  });


};

export default server;
export { socketRepository };
