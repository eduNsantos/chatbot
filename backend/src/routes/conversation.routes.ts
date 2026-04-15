import type { FastifyInstance } from 'fastify';

export async function conversationRoutes(fastify: FastifyInstance) {

  // GET /conversations
  fastify.get('/conversations', async (request, reply) => {
    return { conversations: [] };
  });

  // GET /conversations/:id
  fastify.get('/conversations/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    return { id, messages: [] };
  });

  // POST /conversations
  fastify.post('/conversations', async (request, reply) => {
    const body = request.body as { name: string };

    return {
      message: 'Conversation criada',
      data: body
    };
  });

}
