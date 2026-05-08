import type { FastifyInstance } from "fastify";
import type ContactController from "../controllers/contact.controller.js";

export interface ContactRoutesOptions {
    contactController: ContactController;
}

export async function contactRoutes(fastify: FastifyInstance, options: ContactRoutesOptions) {
    const { contactController } = options;

    fastify.get("/", contactController.findAll.bind(contactController));
}
