import cors from '@fastify/cors';
import Fastify from 'fastify';
import { sessionRoutes } from './modules/session/routes/session.routes.js';
import { bootstrap } from './bootstrap.js';
import { initRealtime } from './shared/realtime/socket.js';

const app = Fastify();

await app.register(cors, {
  origin: '*'
});

initRealtime(app.server);

const { controllers, whatsappGateway, sessionRepository, createSessionUseCase } = bootstrap();

// Carrega sessões existentes do banco ao iniciar
const sessions = await sessionRepository.findAll();
if (sessions.length === 0) {
    console.log('No sessions found. Creating default session "default".');
    createSessionUseCase.execute({ sessionName: 'default' }).catch(err => {
        console.error('Failed to create default session:', err);
    });
} else {
    sessions.forEach(session => {
        whatsappGateway.createSession(session.id).catch(err => {
            console.error(`Failed to restore session ${session.id}:`, err);
        });
    });
}

await app.register(sessionRoutes, {
    prefix: '/sessions',
    ...controllers,
});

export default app;
