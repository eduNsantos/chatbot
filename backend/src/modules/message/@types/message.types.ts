import type { FastifyRequest } from "fastify";

export type SendMessageRequest = FastifyRequest<{
    Params: {
        sessionId: string;
    };
    Body: {
        to: string;
        type: 'person' | 'group';
        message: string;
    };
}>;

