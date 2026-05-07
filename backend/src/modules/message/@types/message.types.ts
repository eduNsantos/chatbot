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


export type FindMessageByContactRequest = FastifyRequest<{
    Params: {
        sessionId: string;
        contactId: number;
    };
    Body: {
        to: string;
        type: 'person' | 'group';
        message: string;
    };
}>;

