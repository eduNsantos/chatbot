import Fastify from 'fastify';
import BaileysRepository from './modules/session/infrastructure/external/baileys/baileys.repository.js';

const fastify = Fastify();

const PORT = 3000;

// const socketRepository = new BaileysRepository();
// const initChatUseCase = new InitChatUseCase(socketRepository);
// await initChatUseCase.execute();

const server = async () => {

  fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`Server listening at ${address}`);
  });


};

export default server;
// export { socketRepository, fastify };
