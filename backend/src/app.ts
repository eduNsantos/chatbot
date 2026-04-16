import Fastify from 'fastify';
import { sessionRoutes } from './modules/session/routes/session.routes.js';
import { messageRoutes } from './modules/messages/routes/message.routes.js';
import makeDefaultSession from './modules/session/factories/make-default-session.js';

const app = Fastify();


makeDefaultSession();
await app.register(sessionRoutes, { prefix: '/sessions' });
await app.register(messageRoutes, { prefix: '/sessions/:session_id/messages' });

export default app;
