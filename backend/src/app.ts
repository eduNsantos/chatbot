import cors from '@fastify/cors';
import Fastify from 'fastify';
import { sessionRoutes } from './modules/session/routes/session.routes.js';
import loadSessions from './modules/session/factories/load-sessions.js';

const app = Fastify();

await app.register(cors, {
  origin: '*'
});

loadSessions();

await app.register(sessionRoutes, { prefix: '/sessions' });

export default app;
