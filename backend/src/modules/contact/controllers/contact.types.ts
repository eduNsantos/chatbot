import type { FastifyRequest } from "fastify";

export type FindAllContactsRequest = FastifyRequest<{
  Params: {
    sessionId: string;
  };
}>;
