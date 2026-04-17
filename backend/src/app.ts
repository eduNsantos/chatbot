import Fastify from 'fastify';
import { sessionRoutes } from './modules/session/routes/session.routes.js';
import { messageRoutes } from './modules/message/routes/message.routes.js';
import loadSessions from './modules/session/factories/load-sessions.js';

const app = Fastify();

loadSessions();

await app.register(sessionRoutes, { prefix: '/sessions' });

export default app;
