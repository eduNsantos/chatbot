import type { FastifyRequest } from "fastify";

export type UpdateSessionRequest = FastifyRequest<{
    Params: {
        sessionId: string;
    };
    Body: {
        sessionName?: string;
    };
}>;