import type { FastifyInstance } from "fastify";
import makeContactController from "../factories/make-contact-controller.factory.js";

export async function contactRoutes(fastify: FastifyInstance) {
  const contactController = makeContactController();

  fastify.get("/", contactController.findAll.bind(contactController));
}
